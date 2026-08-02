import { Application, Either } from 'ddd-tactical-core-boilerplate';
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
