import {
  Application,
  Either,
  asyncLocalStorage,
  ok,
} from '@bitloops/bl-boilerplate-core';
import { Inject, Injectable } from '@nestjs/common';
import { Pool, QueryResultRow } from 'pg';

import { constants } from '@lib/infra/postgres';
import {
  TodoReadModel,
  TTodoReadModelSnapshot,
} from '@src/lib/bounded-contexts/todo/todo/domain/todo.read-model';
import { TodoReadRepoPort } from '@src/lib/bounded-contexts/todo/todo/ports/todo-read.repo-port';

type TodoProjectionRow = QueryResultRow & {
  id: string;
  userId: string;
  title: string;
  completed: boolean;
};

@Injectable()
export class TodoReadRepository implements TodoReadRepoPort {
  constructor(@Inject(constants.pg_connection) private readonly pool: Pool) {}

  @Application.Repo.Decorators.ReturnUnexpectedError()
  async getById(
    id: string,
  ): Promise<Either<TodoReadModel | null, Application.Repo.Errors.Unexpected>> {
    const userId = this.authenticatedUserId();
    const result = await this.pool.query<TodoProjectionRow>(
      `SELECT
         id::text,
         user_id::text AS "userId",
         title,
         completed
       FROM todo_projection
       WHERE id = $1 AND user_id = $2`,
      [id, userId],
    );
    const row = result.rows[0];
    return ok(row ? TodoReadModel.fromPrimitives(row) : null);
  }

  @Application.Repo.Decorators.ReturnUnexpectedError()
  async getAll(params?: {
    limit?: number;
    offset?: number;
  }): Promise<Either<TTodoReadModelSnapshot[], Application.Repo.Errors.Unexpected>> {
    const userId = this.authenticatedUserId();
    const limit = this.normaliseInteger(params?.limit, 50, 1, 100);
    const offset = this.normaliseInteger(params?.offset, 0, 0, Number.MAX_SAFE_INTEGER);
    const result = await this.pool.query<TodoProjectionRow>(
      `SELECT
         id::text,
         user_id::text AS "userId",
         title,
         completed
       FROM todo_projection
       WHERE user_id = $1
       ORDER BY updated_at DESC, id
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset],
    );

    return ok(result.rows);
  }

  private authenticatedUserId(): string {
    const context = asyncLocalStorage.getStore()?.get('context') as
      | { userId?: unknown }
      | undefined;
    if (typeof context?.userId !== 'string') {
      throw new Error('Missing authenticated request context');
    }
    return context.userId;
  }

  private normaliseInteger(
    value: number | undefined,
    fallback: number,
    minimum: number,
    maximum: number,
  ): number {
    const parsed = Number(value);
    if (!Number.isInteger(parsed)) return fallback;
    return Math.min(maximum, Math.max(minimum, parsed));
  }
}
