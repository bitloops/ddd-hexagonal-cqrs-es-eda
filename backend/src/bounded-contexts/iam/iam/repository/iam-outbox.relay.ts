import { Infra } from 'ddd-tactical-core-boilerplate';
import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Pool, QueryResultRow } from 'pg';

import { constants } from '@lib/infra/postgres';
import { BUSES_TOKENS } from '@lib/infra/nest-jetstream/buses/constants';
import { UserEmailChangedIntegrationEvent } from '@src/lib/bounded-contexts/iam/authentication/contracts/integration-events/user-email-changed.integration-event';
import { UserRegisteredIntegrationEvent } from '@src/lib/bounded-contexts/iam/authentication/contracts/integration-events/user-registered.integration-event';

type IamOutboxRow = QueryResultRow & {
  id: string;
  eventType: 'user.registered' | 'user.email_changed';
  payload: { userId: string; email: string };
  attempts: number;
};

const LOCK_DURATION_MS = 30_000;

@Injectable()
export class IamOutboxRelay implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(IamOutboxRelay.name);
  private timer: NodeJS.Timeout | undefined;
  private flushing = false;

  constructor(
    @Inject(constants.pg_connection) private readonly pool: Pool,
    @Inject(BUSES_TOKENS.STREAMING_INTEGRATION_EVENT_BUS)
    private readonly integrationEventBus: Infra.EventBus.IEventBus,
  ) {}

  onModuleInit(): void {
    this.timer = setInterval(() => this.requestFlush(), 500);
    this.timer.unref();
    this.requestFlush();
  }

  onModuleDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  requestFlush(): void {
    void this.flush().catch((error: unknown) => {
      this.logger.error('IAM outbox flush failed', error);
    });
  }

  async flush(): Promise<void> {
    if (this.flushing) return;
    this.flushing = true;

    try {
      for (let processed = 0; processed < 100; processed += 1) {
        const message = await this.claimNext();
        if (!message) break;

        try {
          await this.integrationEventBus.publish(this.toIntegrationEvent(message));
          await this.pool.query(
            `UPDATE iam_outbox
             SET published_at = NOW(), locked_until = NULL, last_error = NULL
             WHERE id = $1`,
            [message.id],
          );
        } catch (error) {
          const reason = error instanceof Error ? error.message : String(error);
          const retryAt = new Date(Date.now() + this.retryDelay(message.attempts));
          await this.pool.query(
            `UPDATE iam_outbox
             SET available_at = $2, locked_until = NULL, last_error = $3
             WHERE id = $1 AND published_at IS NULL`,
            [message.id, retryAt, reason],
          );
          this.logger.warn(`IAM outbox message ${message.id} will be retried: ${reason}`);
        }
      }
    } finally {
      this.flushing = false;
    }
  }

  private async claimNext(): Promise<IamOutboxRow | null> {
    const lockedUntil = new Date(Date.now() + LOCK_DURATION_MS);
    const result = await this.pool.query<IamOutboxRow>(
      `WITH candidate AS (
         SELECT id
         FROM iam_outbox
         WHERE published_at IS NULL
           AND available_at <= NOW()
           AND (locked_until IS NULL OR locked_until < NOW())
         ORDER BY created_at, id
         LIMIT 1
         FOR UPDATE SKIP LOCKED
       )
       UPDATE iam_outbox AS outbox
       SET locked_until = $1, attempts = outbox.attempts + 1
       FROM candidate
       WHERE outbox.id = candidate.id
       RETURNING
         outbox.id::text AS id,
         outbox.event_type AS "eventType",
         outbox.payload,
         outbox.attempts`,
      [lockedUntil],
    );
    return result.rows[0] ?? null;
  }

  private toIntegrationEvent(
    message: IamOutboxRow,
  ): UserRegisteredIntegrationEvent | UserEmailChangedIntegrationEvent {
    if (message.eventType === 'user.registered') {
      return new UserRegisteredIntegrationEvent(message.payload);
    }
    if (message.eventType === 'user.email_changed') {
      return new UserEmailChangedIntegrationEvent(message.payload);
    }
    throw new Error(`Unsupported IAM outbox event type: ${message.eventType}`);
  }

  private retryDelay(attempts: number): number {
    return Math.min(60_000, 1_000 * 2 ** Math.min(attempts - 1, 6));
  }
}
