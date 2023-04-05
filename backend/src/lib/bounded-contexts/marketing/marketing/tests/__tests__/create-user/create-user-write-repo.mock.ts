import {
  Application,
  Either,
  ok,
  fail,
  Domain,
} from '@bitloops/bl-boilerplate-core';
import {
  CREATE_USER_REPO_ERROR_CASE,
  CREATE_USER_SUCCESS_CASE,
} from './create-user.mock';
import { UserWriteRepoPort } from '../../../ports/user-write.repo-port';
import { UserEntity } from '../../../domain/user.entity';

export class MockCreateUserWriteRepo {
  public readonly mockSaveMethod: jest.Mock;
  private mockUserWriteRepo: UserWriteRepoPort;

  constructor() {
    this.mockSaveMethod = this.getMockSaveMethod();
    this.mockUserWriteRepo = {
      update: jest.fn(),
      getById: jest.fn(),
      save: this.mockSaveMethod,
      delete: jest.fn(),
    };
  }

  getMockUserWriteRepo(): UserWriteRepoPort {
    return this.mockUserWriteRepo;
  }

  private getMockSaveMethod(): jest.Mock {
    return jest.fn(
      (
        user: UserEntity,
      ): Promise<Either<void, Application.Repo.Errors.Unexpected>> => {
        if (
          user.id.equals(new Domain.UUIDv4(CREATE_USER_SUCCESS_CASE.userId))
        ) {
          return Promise.resolve(ok());
        }
        if (
          user.id.equals(new Domain.UUIDv4(CREATE_USER_REPO_ERROR_CASE.userId))
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
