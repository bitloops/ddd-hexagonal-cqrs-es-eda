import {
  Application,
  Domain,
  Either,
  Infra,
  ok,
} from '@bitloops/bl-boilerplate-core';
import { Inject, Injectable } from '@nestjs/common';
import { Pool, QueryResultRow } from 'pg';

import { constants } from '@lib/infra/postgres';
import { StreamingDomainEventBusToken } from '@src/lib/bounded-contexts/marketing/marketing/constants';
import { UserEntity } from '@src/lib/bounded-contexts/marketing/marketing/domain/user.entity';
import { UserWriteRepoPort } from '@src/lib/bounded-contexts/marketing/marketing/ports/user-write.repo-port';

type MarketingUserRow = QueryResultRow & {
  id: string;
  completedTodos: number;
  email: string;
};

@Injectable()
export class UserWriteRepository implements UserWriteRepoPort {
  constructor(
    @Inject(constants.pg_connection) private readonly pool: Pool,
    @Inject(StreamingDomainEventBusToken)
    private readonly domainEventBus: Infra.EventBus.IEventBus,
  ) {}

  @Application.Repo.Decorators.ReturnUnexpectedError()
  async update(
    user: UserEntity,
  ): Promise<Either<void, Application.Repo.Errors.Unexpected>> {
    const snapshot = user.toPrimitives();
    const result = await this.pool.query(
      `UPDATE marketing_users
       SET completed_todos = $2, email = $3, updated_at = NOW()
       WHERE id = $1`,
      [snapshot.id, snapshot.completedTodos, snapshot.email],
    );
    if (result.rowCount !== 1) throw new Error(`Marketing user ${snapshot.id} was not found`);
    await this.domainEventBus.publish(user.domainEvents);
    user.clearEvents();
    return ok();
  }

  @Application.Repo.Decorators.ReturnUnexpectedError()
  async delete(
    user: UserEntity,
  ): Promise<Either<void, Application.Repo.Errors.Unexpected>> {
    await this.pool.query('DELETE FROM marketing_users WHERE id = $1', [user.id.toString()]);
    await this.domainEventBus.publish(user.domainEvents);
    user.clearEvents();
    return ok();
  }

  @Application.Repo.Decorators.ReturnUnexpectedError()
  async getById(
    id: Domain.UUIDv4,
  ): Promise<Either<UserEntity | null, Application.Repo.Errors.Unexpected>> {
    const result = await this.pool.query<MarketingUserRow>(
      `SELECT
         id::text,
         completed_todos AS "completedTodos",
         email
       FROM marketing_users
       WHERE id = $1`,
      [id.toString()],
    );
    const row = result.rows[0];
    return ok(row ? UserEntity.fromPrimitives(row) : null);
  }

  @Application.Repo.Decorators.ReturnUnexpectedError()
  async save(
    user: UserEntity,
  ): Promise<Either<void, Application.Repo.Errors.Unexpected>> {
    const snapshot = user.toPrimitives();
    await this.pool.query(
      `INSERT INTO marketing_users (id, completed_todos, email)
       VALUES ($1, $2, $3)
       ON CONFLICT (id) DO UPDATE
       SET email = EXCLUDED.email, updated_at = NOW()`,
      [snapshot.id, snapshot.completedTodos, snapshot.email],
    );
    await this.domainEventBus.publish(user.domainEvents);
    user.clearEvents();
    return ok();
  }
}
