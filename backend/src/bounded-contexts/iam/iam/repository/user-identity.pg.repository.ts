import { randomUUID } from 'node:crypto';

import { Inject, Injectable } from '@nestjs/common';
import { Pool, PoolClient, QueryResultRow } from 'pg';

import { constants } from '@lib/infra/postgres';
import {
  AuthenticatedPrincipal,
  ExternalIdentity,
} from '@src/lib/bounded-contexts/iam/authentication/domain/authenticated-principal';
import { UserIdentityRepoPort } from '@src/lib/bounded-contexts/iam/authentication/ports/user-identity.repo-port';
import { IamOutboxRelay } from './iam-outbox.relay';

type UserIdentityRow = QueryResultRow & {
  id: string;
  email: string;
};

@Injectable()
export class UserIdentityPostgresRepository implements UserIdentityRepoPort {
  constructor(
    @Inject(constants.pg_connection) private readonly pool: Pool,
    private readonly outboxRelay: IamOutboxRelay,
  ) {}

  async reconcile(identity: ExternalIdentity): Promise<AuthenticatedPrincipal> {
    const client = await this.pool.connect();
    let user: UserIdentityRow;

    try {
      await client.query('BEGIN');
      const inserted = await client.query<UserIdentityRow>(
        `INSERT INTO users (id, issuer, subject, email, last_login)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (issuer, subject) DO NOTHING
         RETURNING id::text, email`,
        [randomUUID(), identity.issuer, identity.subject, identity.email],
      );

      if (inserted.rows[0]) {
        user = inserted.rows[0];
        await this.enqueue(client, 'user.registered', user);
      } else {
        const existing = await client.query<UserIdentityRow>(
          `SELECT id::text, email
           FROM users
           WHERE issuer = $1 AND subject = $2
           FOR UPDATE`,
          [identity.issuer, identity.subject],
        );
        if (!existing.rows[0]) throw new Error('External identity reconciliation failed');

        user = existing.rows[0];
        if (user.email !== identity.email) {
          user = {
            ...user,
            email: identity.email,
          };
          await client.query(
            `UPDATE users
             SET email = $2, last_login = NOW()
             WHERE id = $1`,
            [user.id, user.email],
          );
          await this.enqueue(client, 'user.email_changed', user);
        } else {
          await client.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);
        }
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    this.outboxRelay.requestFlush();
    return {
      ...identity,
      userId: user.id,
      email: user.email,
    };
  }

  private async enqueue(
    client: PoolClient,
    eventType: 'user.registered' | 'user.email_changed',
    user: UserIdentityRow,
  ): Promise<void> {
    await client.query(
      `INSERT INTO iam_outbox (id, event_type, payload)
       VALUES ($1, $2, $3)`,
      [randomUUID(), eventType, { userId: user.id, email: user.email }],
    );
  }
}
