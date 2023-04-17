import { Application, Either } from '@bitloops/bl-boilerplate-core';
import { NotificationTemplateReadModel } from '../domain/notification-template.read-model';

export interface NotificationTemplateReadRepoPort
  extends Application.Repo.ICRUDReadPort<NotificationTemplateReadModel> {
  getByType(
    type: string,
  ): Promise<
    Either<
      NotificationTemplateReadModel | null,
      Application.Repo.Errors.Unexpected
    >
  >;
}
