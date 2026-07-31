import { Pool } from 'pg';

import { ExternalIdentity } from '@src/lib/bounded-contexts/iam/authentication/domain/authenticated-principal';
import { IAM_POSTGRES_SCHEMA } from '../iam-postgres.schema';
import { IamOutboxRelay } from '../iam-outbox.relay';
import { UserIdentityPostgresRepository } from '../user-identity.pg.repository';

const describeWithDatabase =
  process.env.RUN_DATABASE_TESTS === 'true' ? describe : describe.skip;

describeWithDatabase('IAM external identity reconciliation', () => {
  const pool = new Pool({
    host: process.env.PG_HOST ?? 'localhost',
    port: Number(process.env.PG_PORT ?? 5432),
    database: process.env.PG_DATABASE ?? 'bitloops_test',
    user: process.env.PG_USER ?? 'user',
    password: process.env.PG_PASSWORD ?? 'postgres',
  });
  const relay = { requestFlush: jest.fn() } as unknown as IamOutboxRelay;
  const repository = new UserIdentityPostgresRepository(pool, relay);

  beforeAll(async () => {
    await pool.query('DROP TABLE IF EXISTS iam_outbox, users CASCADE');
    await pool.query(IAM_POSTGRES_SCHEMA);
  });

  beforeEach(async () => {
    await pool.query('TRUNCATE iam_outbox, users');
    jest.mocked(relay.requestFlush).mockClear();
  });

  afterAll(async () => {
    await pool.end();
  });

  it('provisions a subject once and enqueues one registration event', async () => {
    const first = await repository.reconcile(identity());
    const repeated = await repository.reconcile(identity());

    expect(repeated.userId).toBe(first.userId);
    const counts = await pool.query(
      `SELECT
         (SELECT COUNT(*)::int FROM users) AS users,
         (SELECT COUNT(*)::int FROM iam_outbox) AS outbox`,
    );
    expect(counts.rows[0]).toEqual({ users: 1, outbox: 1 });
    expect(relay.requestFlush).toHaveBeenCalledTimes(2);
  });

  it('updates email idempotently and enqueues an application-owned change event', async () => {
    const principal = await repository.reconcile(identity());
    const changed = await repository.reconcile(
      identity({ email: 'updated@example.com' }),
    );

    expect(changed.userId).toBe(principal.userId);
    expect(changed.email).toBe('updated@example.com');
    const events = await pool.query(
      'SELECT event_type, payload FROM iam_outbox ORDER BY created_at, id',
    );
    expect(events.rows.map((row) => row.event_type).sort()).toEqual([
      'user.email_changed',
      'user.registered',
    ]);
    expect(events.rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          event_type: 'user.email_changed',
          payload: { userId: principal.userId, email: 'updated@example.com' },
        }),
      ]),
    );
  });

  it('treats the issuer as part of the immutable external identity key', async () => {
    const first = await repository.reconcile(identity());
    const otherIssuer = await repository.reconcile(
      identity({ issuer: 'https://identity.example.test/realms/another' }),
    );

    expect(otherIssuer.userId).not.toBe(first.userId);
  });

  function identity(overrides: Partial<ExternalIdentity> = {}): ExternalIdentity {
    return {
      issuer: 'https://identity.example.test/realms/bitloops',
      subject: 'keycloak-subject-1',
      email: 'user@example.com',
      emailVerified: true,
      roles: ['todo-user'],
      ...overrides,
    };
  }
});
