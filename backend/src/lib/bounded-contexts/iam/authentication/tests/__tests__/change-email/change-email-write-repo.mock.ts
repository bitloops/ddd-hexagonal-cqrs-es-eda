import {
  Application,
  Either,
  ok,
  fail,
  Domain,
} from '@bitloops/bl-boilerplate-core';
import { UserEntity } from '../../../domain/user.entity';
import { UserWriteRepoPort } from '../../../ports/user-write.repo-port';
import {
  CHANGE_EMAIL_SUCCESS_CASE,
  USER_REPO_ERROR_GETBYID_CASE,
  USER_REPO_ERROR_UPDATE_CASE,
} from './change-email.mock';

export class MockUserWriteRepo {
  public readonly mockUpdateMethod: jest.Mock;
  public readonly mockGetByIdMethod: jest.Mock;
  private mockUserWriteRepo: UserWriteRepoPort;

  constructor() {
    this.mockUpdateMethod = this.getMockUpdateMethod();
    this.mockGetByIdMethod = this.getMockGetByIdMethod();
    this.mockUserWriteRepo = {
      getById: this.mockGetByIdMethod,
      getByEmail: jest.fn(),
      update: this.mockUpdateMethod,
      delete: jest.fn(),
      save: jest.fn(),
    };
  }

  getMockUserWriteRepo(): UserWriteRepoPort {
    return this.mockUserWriteRepo;
  }

  private getMockUpdateMethod(): jest.Mock {
    return jest.fn(
      (
        user: UserEntity,
      ): Promise<Either<void, Application.Repo.Errors.Unexpected>> => {
        if (user.id.equals(new Domain.UUIDv4(CHANGE_EMAIL_SUCCESS_CASE.id))) {
          return Promise.resolve(ok());
        }
        if (user.id.equals(new Domain.UUIDv4(USER_REPO_ERROR_UPDATE_CASE.id))) {
          return Promise.resolve(
            fail(new Application.Repo.Errors.Unexpected()),
          );
        }
        return Promise.resolve(ok());
      },
    );
  }

  private getMockGetByIdMethod(): jest.Mock {
    return jest.fn(
      (
        id: Domain.UUIDv4,
      ): Promise<
        Either<UserEntity | null, Application.Repo.Errors.Unexpected>
      > => {
        if (id.equals(new Domain.UUIDv4(CHANGE_EMAIL_SUCCESS_CASE.id))) {
          const user = UserEntity.fromPrimitives(CHANGE_EMAIL_SUCCESS_CASE);
          return Promise.resolve(ok(user));
        }
        if (id.equals(new Domain.UUIDv4(USER_REPO_ERROR_UPDATE_CASE.id))) {
          const user = UserEntity.fromPrimitives(USER_REPO_ERROR_UPDATE_CASE);
          return Promise.resolve(ok(user));
        }
        if (id.equals(new Domain.UUIDv4(USER_REPO_ERROR_GETBYID_CASE.id))) {
          return Promise.resolve(
            fail(new Application.Repo.Errors.Unexpected()),
          );
        }
        return Promise.resolve(ok(null));
      },
    );
  }
}
