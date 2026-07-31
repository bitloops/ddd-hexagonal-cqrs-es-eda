import { Application, Either, ok } from '@bitloops/bl-boilerplate-core';
import { Inject, Injectable } from '@nestjs/common';
import { Pool, QueryResultRow } from 'pg';

import { constants } from '@lib/infra/postgres';
import {
  NotificationTemplateReadModel,
  TNotificationTemplateSnapshot,
} from '@src/lib/bounded-contexts/marketing/marketing/domain/notification-template.read-model';
import { NotificationTemplateReadRepoPort } from '@src/lib/bounded-contexts/marketing/marketing/ports/notification-template-read.repo-port';

type NotificationTemplateRow = QueryResultRow & TNotificationTemplateSnapshot;

@Injectable()
export class NotificationTemplateReadRepository
  implements NotificationTemplateReadRepoPort
{
  constructor(@Inject(constants.pg_connection) private readonly pool: Pool) {}

  @Application.Repo.Decorators.ReturnUnexpectedError()
  async getByType(
    type: string,
  ): Promise<
    Either<NotificationTemplateReadModel | null, Application.Repo.Errors.Unexpected>
  > {
    const result = await this.pool.query<NotificationTemplateRow>(
      'SELECT id::text, type, template FROM notification_templates WHERE type = $1',
      [type],
    );
    return ok(this.toReadModel(result.rows[0]));
  }

  @Application.Repo.Decorators.ReturnUnexpectedError()
  async getAll(): Promise<
    Either<NotificationTemplateReadModel[] | null, Application.Repo.Errors.Unexpected>
  > {
    const result = await this.pool.query<NotificationTemplateRow>(
      'SELECT id::text, type, template FROM notification_templates ORDER BY type',
    );
    return ok(result.rows.map((row) => NotificationTemplateReadModel.fromPrimitives(row)));
  }

  @Application.Repo.Decorators.ReturnUnexpectedError()
  async getById(
    id: string,
  ): Promise<
    Either<NotificationTemplateReadModel | null, Application.Repo.Errors.Unexpected>
  > {
    const result = await this.pool.query<NotificationTemplateRow>(
      'SELECT id::text, type, template FROM notification_templates WHERE id = $1',
      [id],
    );
    return ok(this.toReadModel(result.rows[0]));
  }

  private toReadModel(
    row: NotificationTemplateRow | undefined,
  ): NotificationTemplateReadModel | null {
    return row ? NotificationTemplateReadModel.fromPrimitives(row) : null;
  }
}
