import { Application, Either, ok, fail } from '@bitloops/bl-boilerplate-core';
import { UserEmailReadRepoPort } from '@src/lib/bounded-contexts/marketing/marketing/ports/user-email-read.repo-port';
import { UserReadModel } from '@src/lib/bounded-contexts/marketing/marketing/domain/read-models/user-email.read-model';
import {
  CREATE_USER_REPO_ERROR_CASE,
  CREATE_USER_SUCCESS_CASE,
} from './create-user.mock';

export class MockCreateUserReadRepo {
  public readonly mockCreateMethod: jest.Mock;
  private mockUserReadRepo: UserEmailReadRepoPort;

  constructor() {
    this.mockCreateMethod = this.getMockCreateMethod();
    this.mockUserReadRepo = {
      getAll: jest.fn(),
      getById: jest.fn(),
      getUserEmail: jest.fn(),
      create: this.mockCreateMethod,
      update: jest.fn(),
    };
  }

  getMockMarketingReadRepo(): UserEmailReadRepoPort {
    return this.mockUserReadRepo;
  }

  private getMockCreateMethod(): jest.Mock {
    return jest.fn(
      (
        userIdEmail: UserReadModel,
      ): Promise<Either<void, Application.Repo.Errors.Unexpected>> => {
        if (userIdEmail.userId === CREATE_USER_SUCCESS_CASE.userId) {
          return Promise.resolve(ok());
        }
        if (userIdEmail.userId === CREATE_USER_REPO_ERROR_CASE.userId) {
          return Promise.resolve(
            fail(new Application.Repo.Errors.Unexpected('Unexpected error')),
          );
        }
        return Promise.resolve(ok());
      },
    );
  }
}
