import {
  Application,
  Domain,
  Either,
  asyncLocalStorage,
  ok,
} from 'ddd-tactical-core-boilerplate';
import { Inject, Injectable } from '@nestjs/common';
import { Pool, PoolClient, QueryResultRow } from 'pg';

import { constants } from '@lib/infra/postgres';
import {
  TodoEntity,
  TodoEventPayload,
  TodoEventType,
  TodoHistoryEvent,
} from '@src/lib/bounded-contexts/todo/todo/domain/todo.entity';
import { TodoWriteRepoPort } from '@src/lib/bounded-contexts/todo/todo/ports/todo-write.repo-port';
import { serialiseTodoEvent, StoredTodoEvent } from './todo-event-store';
import { TodoOutboxRelay } from './todo-outbox.relay';

type TodoEventRow = QueryResultRow & {
  eventType: TodoEventType;
  payload: TodoEventPayload;
  version: number;
};

type PersistOperation = 'create' | 'update' | 'delete';

@Injectable()
export class TodoWriteRepository implements TodoWriteRepoPort {
  constructor(
    @Inject(constants.pg_connection) private readonly pool: Pool,
    private readonly outboxRelay: TodoOutboxRelay,
  ) {}

  @Application.Repo.Decorators.ReturnUnexpectedError()
  async getById(
    id: Domain.UUIDv4,
  ): Promise<Either<TodoEntity | null, Application.Repo.Errors.Unexpected>> {
    const authenticatedUserId = this.authenticatedUserId();
    const result = await this.pool.query<TodoEventRow>(
      `SELECT
         event_type AS "eventType",
         payload,
         version
       FROM todo_events
       WHERE aggregate_id = $1
       ORDER BY version`,
      [id.toString()],
    );

    if (result.rows.length === 0) return ok(null);

    const history: TodoHistoryEvent[] = result.rows.map((row) => ({
      eventType: row.eventType,
      payload: row.payload,
      version: row.version,
    }));
    const todo = TodoEntity.fromHistory(history);

    if (todo.userId.id.toString() !== authenticatedUserId) {
      throw new Error('Todo does not belong to the authenticated user');
    }

    return ok(todo.isDeleted ? null : todo);
  }

  @Application.Repo.Decorators.ReturnUnexpectedError()
  async create(
    todo: TodoEntity,
  ): Promise<Either<void, Application.Repo.Errors.Unexpected>> {
    await this.persist(todo, 'create');
    return ok();
  }

  @Application.Repo.Decorators.ReturnUnexpectedError()
  async update(
    todo: TodoEntity,
  ): Promise<Either<void, Application.Repo.Errors.Unexpected>> {
    await this.persist(todo, 'update');
    return ok();
  }

  @Application.Repo.Decorators.ReturnUnexpectedError()
  async delete(
    todo: TodoEntity,
  ): Promise<Either<void, Application.Repo.Errors.Unexpected>> {
    await this.persist(todo, 'delete');
    return ok();
  }

  private async persist(todo: TodoEntity, operation: PersistOperation): Promise<void> {
    const authenticatedUserId = this.authenticatedUserId();
    const snapshot = todo.toPrimitives();
    if (snapshot.userId.id !== authenticatedUserId) {
      throw new Error('Todo does not belong to the authenticated user');
    }

    const pendingEvents = todo.domainEvents as Domain.DomainEvent<TodoEventPayload>[];
    if (pendingEvents.length === 0) return;

    this.attachRequestMetadata(pendingEvents);

    const client = await this.pool.connect();
    let committedVersion: number;

    try {
      await client.query('BEGIN');
      const currentVersion = await this.currentVersion(client, todo.id.toString());
      if (currentVersion !== todo.version) {
        throw new Error(
          `Concurrent Todo update detected for ${todo.id.toString()}: expected version ${todo.version}, found ${currentVersion}`,
        );
      }

      const storedEvents = pendingEvents.map((event, index) =>
        serialiseTodoEvent(event, currentVersion + index + 1),
      );

      for (const event of storedEvents) {
        await this.appendEventAndOutbox(client, event);
      }

      committedVersion = storedEvents.at(-1)?.version ?? currentVersion;
      await this.updateProjection(client, todo, operation, currentVersion, committedVersion);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    todo.commit(committedVersion);
    this.outboxRelay.requestFlush();
  }

  private async currentVersion(client: PoolClient, aggregateId: string): Promise<number> {
    const result = await client.query<{ version: number } & QueryResultRow>(
      `SELECT version
       FROM todo_events
       WHERE aggregate_id = $1
       ORDER BY version DESC
       LIMIT 1
       FOR UPDATE`,
      [aggregateId],
    );
    return result.rows[0]?.version ?? 0;
  }

  private async appendEventAndOutbox(
    client: PoolClient,
    event: StoredTodoEvent,
  ): Promise<void> {
    await client.query(
      `INSERT INTO todo_events (
         event_id, aggregate_id, version, event_type, payload, metadata
       ) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        event.eventId,
        event.aggregateId,
        event.version,
        event.eventType,
        event.payload,
        event.metadata,
      ],
    );
    await client.query(
      `INSERT INTO todo_outbox (
         id, aggregate_id, event_type, payload, metadata
       ) VALUES ($1, $2, $3, $4, $5)`,
      [
        event.eventId,
        event.aggregateId,
        event.eventType,
        event.payload,
        event.metadata,
      ],
    );
  }

  private async updateProjection(
    client: PoolClient,
    todo: TodoEntity,
    operation: PersistOperation,
    expectedVersion: number,
    committedVersion: number,
  ): Promise<void> {
    const snapshot = todo.toPrimitives();

    if (operation === 'create') {
      await client.query(
        `INSERT INTO todo_projection (
           id, user_id, title, completed, version
         ) VALUES ($1, $2, $3, $4, $5)`,
        [
          snapshot.id,
          snapshot.userId.id,
          snapshot.title.title,
          snapshot.completed,
          committedVersion,
        ],
      );
      return;
    }

    if (operation === 'delete') {
      const result = await client.query(
        `DELETE FROM todo_projection
         WHERE id = $1 AND user_id = $2 AND version = $3`,
        [snapshot.id, snapshot.userId.id, expectedVersion],
      );
      this.assertProjectionChanged(result.rowCount, todo.id.toString());
      return;
    }

    const result = await client.query(
      `UPDATE todo_projection
       SET title = $3,
           completed = $4,
           version = $5,
           updated_at = NOW()
       WHERE id = $1 AND user_id = $2 AND version = $6`,
      [
        snapshot.id,
        snapshot.userId.id,
        snapshot.title.title,
        snapshot.completed,
        committedVersion,
        expectedVersion,
      ],
    );
    this.assertProjectionChanged(result.rowCount, todo.id.toString());
  }

  private assertProjectionChanged(rowCount: number | null, aggregateId: string): void {
    if (rowCount !== 1) {
      throw new Error(`Todo projection version conflict for ${aggregateId}`);
    }
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

  private attachRequestMetadata(events: Domain.DomainEvent<TodoEventPayload>[]): void {
    const store = asyncLocalStorage.getStore();
    const correlationId = store?.get('correlationId');

    for (const event of events) {
      if (typeof correlationId === 'string') event.metadata.correlationId = correlationId;
      event.metadata.context = {};
    }
  }
}
