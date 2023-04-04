import {
  Application,
  Domain,
  Either,
  ok,
  fail,
} from '@bitloops/bl-boilerplate-core';
import { UserReadModel } from '../../../domain/read-models/user-email.read-model';
import { UserEmailReadRepoPort } from '../../../ports/user-email-read.repo-port';
import {
  SUCCESS_CASE,
  UNSUCCESS_USER_REPO_ERROR_CASE,
} from './todo-completions-incremented.mock';

export class MockUserEmailReadRepo {
  public readonly mockGetUserEmailMethod: jest.Mock;
  private mockUserEmailReadRepo: UserEmailReadRepoPort;

  constructor() {
    this.mockGetUserEmailMethod = this.getMockGetUserEmailMethod();
    this.mockUserEmailReadRepo = {
      getUserEmail: this.mockGetUserEmailMethod,
      update: jest.fn(),
      create: jest.fn(),
      getAll: jest.fn(),
      getById: jest.fn(),
    };
  }

  getMockUserEmailReadRepo(): UserEmailReadRepoPort {
    return this.mockUserEmailReadRepo;
  }

  private getMockGetUserEmailMethod(): jest.Mock {
    return jest.fn(
      (
        userid: Domain.UUIDv4,
      ): Promise<
        Either<UserReadModel | null, Application.Repo.Errors.Unexpected>
      > => {
        if (userid.equals(new Domain.UUIDv4(SUCCESS_CASE.userId))) {
          const userResponse = UserReadModel.fromPrimitives({
            email: SUCCESS_CASE.userEmail,
            userId: SUCCESS_CASE.userId,
          });
          return Promise.resolve(ok(userResponse));
        }
        if (
          userid.equals(
            new Domain.UUIDv4(UNSUCCESS_USER_REPO_ERROR_CASE.userId),
          )
        ) {
          return Promise.resolve(
            fail(new Application.Repo.Errors.Unexpected()),
          );
        }
        return Promise.resolve(ok(null));
      },
    );
  }
}
