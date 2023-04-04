import {
  Application,
  Either,
  ok,
  fail,
  Domain,
} from '@bitloops/bl-boilerplate-core';
import {
  UPDATE_USER_REPO_ERROR_CASE,
  UPDATE_USER_SUCCESS_CASE,
} from './change-user-email.mock';
import { UserWriteRepoPort } from '../../../ports/user-write.repo-port';
import { UserEntity } from '../../../domain/user.entity';

export class MockUpdateUserWriteRepo {
  public readonly mockUpdateMethod: jest.Mock;
  private mockUserWriteRepo: UserWriteRepoPort;

  constructor() {
    this.mockUpdateMethod = this.getMockUpdateMethod();
    this.mockUserWriteRepo = {
      getById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      update: this.mockUpdateMethod,
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
        if (
          user.id.equals(new Domain.UUIDv4(UPDATE_USER_SUCCESS_CASE.userId))
        ) {
          return Promise.resolve(ok());
        }
        if (
          user.id.equals(new Domain.UUIDv4(UPDATE_USER_REPO_ERROR_CASE.userId))
        ) {
          return Promise.resolve(
            fail(new Application.Repo.Errors.Unexpected('Unexpected error')),
          );
        }
        return Promise.resolve(ok());
      },
    );
  }
}
