import { Infra } from '@bitloops/bl-boilerplate-core';
import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Pool } from 'pg';

import { constants } from '@lib/infra/postgres';
import { StreamingDomainEventBusToken } from '@src/lib/bounded-contexts/todo/todo/constants';
import {
  rehydrateTodoDomainEvent,
  TodoOutboxMessage,
} from './todo-event-store';

const DEFAULT_POLL_INTERVAL_MS = 500;
const DEFAULT_BATCH_SIZE = 100;
const LOCK_DURATION_MS = 30_000;

@Injectable()
export class TodoOutboxRelay implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TodoOutboxRelay.name);
  private readonly pollIntervalMs = this.positiveInteger(
    process.env.TODO_OUTBOX_POLL_INTERVAL_MS,
    DEFAULT_POLL_INTERVAL_MS,
  );
  private readonly batchSize = this.positiveInteger(
    process.env.TODO_OUTBOX_BATCH_SIZE,
    DEFAULT_BATCH_SIZE,
  );
  private timer: NodeJS.Timeout | undefined;
  private flushing = false;

  constructor(
    @Inject(constants.pg_connection) private readonly pool: Pool,
    @Inject(StreamingDomainEventBusToken)
    private readonly domainEventBus: Infra.EventBus.IEventBus,
  ) {}

  onModuleInit(): void {
    this.timer = setInterval(() => this.requestFlush(), this.pollIntervalMs);
    this.timer.unref();
    this.requestFlush();
  }

  onModuleDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  requestFlush(): void {
    void this.flush().catch((error: unknown) => {
      this.logger.error('Todo outbox flush failed', error);
    });
  }

  async flush(): Promise<void> {
    if (this.flushing) return;
    this.flushing = true;

    try {
      for (let processed = 0; processed < this.batchSize; processed += 1) {
        const message = await this.claimNext();
        if (!message) break;

        try {
          await this.domainEventBus.publish(rehydrateTodoDomainEvent(message));
          await this.pool.query(
            `UPDATE todo_outbox
             SET published_at = NOW(), locked_until = NULL, last_error = NULL
             WHERE id = $1`,
            [message.id],
          );
        } catch (error) {
          const reason = error instanceof Error ? error.message : String(error);
          const retryAt = new Date(Date.now() + this.retryDelay(message.attempts));
          await this.pool.query(
            `UPDATE todo_outbox
             SET available_at = $2, locked_until = NULL, last_error = $3
             WHERE id = $1 AND published_at IS NULL`,
            [message.id, retryAt, reason],
          );
          this.logger.warn(`Todo outbox message ${message.id} will be retried: ${reason}`);
        }
      }
    } finally {
      this.flushing = false;
    }
  }

  private async claimNext(): Promise<TodoOutboxMessage | null> {
    const lockedUntil = new Date(Date.now() + LOCK_DURATION_MS);
    const result = await this.pool.query<TodoOutboxMessage>(
      `WITH candidate AS (
         SELECT id
         FROM todo_outbox
         WHERE published_at IS NULL
           AND available_at <= NOW()
           AND (locked_until IS NULL OR locked_until < NOW())
         ORDER BY created_at, id
         LIMIT 1
         FOR UPDATE SKIP LOCKED
       )
       UPDATE todo_outbox AS outbox
       SET locked_until = $1, attempts = outbox.attempts + 1
       FROM candidate
       WHERE outbox.id = candidate.id
       RETURNING
         outbox.id::text AS id,
         outbox.aggregate_id::text AS "aggregateId",
         outbox.event_type AS "eventType",
         outbox.payload,
         outbox.metadata,
         outbox.attempts`,
      [lockedUntil],
    );

    return result.rows[0] ?? null;
  }

  private retryDelay(attempts: number): number {
    return Math.min(60_000, 1_000 * 2 ** Math.min(attempts - 1, 6));
  }

  private positiveInteger(value: string | undefined, fallback: number): number {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
  }
}
