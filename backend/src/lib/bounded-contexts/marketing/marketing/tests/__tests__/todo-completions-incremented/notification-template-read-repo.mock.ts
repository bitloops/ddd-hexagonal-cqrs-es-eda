import {
  Application,
  Either,
  ok,
  fail,
  asyncLocalStorage,
} from '@bitloops/bl-boilerplate-core';
import { NotificationTemplateReadModel } from '../../../domain/notification-template.read-model';
import { NotificationTemplateReadRepoPort } from '../../../ports/notification-template-read.repo-port';
import {
  SUCCESS_CASE,
  UNSUCCESS_REPO_ERROR_CASE,
} from './todo-completions-incremented.mock';

export class MockNotificationTemplateReadRepo {
  public readonly mockGetByTypeMethod: jest.Mock;
  private mockNotificationTemplateReadRepo: NotificationTemplateReadRepoPort;

  constructor() {
    this.mockGetByTypeMethod = this.getMockGetByTypeMethod();
    this.mockNotificationTemplateReadRepo = {
      getByType: this.mockGetByTypeMethod,
      getAll: jest.fn(),
      getById: jest.fn(),
    };
  }

  getMockNotificationTemplateReadRepo(): NotificationTemplateReadRepoPort {
    return this.mockNotificationTemplateReadRepo;
  }

  private getMockGetByTypeMethod(): jest.Mock {
    return jest.fn(
      (
        type: string,
      ): Promise<
        Either<
          NotificationTemplateReadModel | null,
          Application.Repo.Errors.Unexpected
        >
      > => {
        if (type === SUCCESS_CASE.notificationTemplate.type) {
          const ctx = asyncLocalStorage.getStore()?.get('context');
          if (ctx.userId === UNSUCCESS_REPO_ERROR_CASE.userId) {
            return Promise.resolve(
              fail(new Application.Repo.Errors.Unexpected()),
            );
          }
          const notificationResponse =
            NotificationTemplateReadModel.fromPrimitives(
              SUCCESS_CASE.notificationTemplate,
            );
          return Promise.resolve(ok(notificationResponse));
        }

        return Promise.resolve(ok(null));
      },
    );
  }
}
