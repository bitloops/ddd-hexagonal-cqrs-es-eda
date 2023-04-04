import {
  Application,
  Domain,
  Either,
  ok,
  fail,
} from '@bitloops/bl-boilerplate-core';
import { UserEntity } from '@src/lib/bounded-contexts/marketing/marketing/domain/user.entity';
import { UserWriteRepoPort } from '@src/lib/bounded-contexts/marketing/marketing/ports/user-write.repo-port';
import {
  INCREMENT_TODOS_INVALID_COUNTER_CASE,
  INCREMENT_TODOS_REPO_ERROR_GETBYID_CASE,
  INCREMENT_TODOS_REPO_ERROR_SAVE_CASE,
  INCREMENT_TODOS_SUCCESS_USER_DOESNT_EXIST_CASE,
  INCREMENT_TODOS_SUCCESS_USER_EXISTS_CASE,
} from './increment-todos.mock';
import { DomainErrors } from '@src/lib/bounded-contexts/marketing/marketing/domain/errors';

export class MockIncrementCompletedTodosWriteRepo {
  public readonly mockUpdateMethod: jest.Mock;
  public readonly mockGetByIdMethod: jest.Mock;
  public readonly mockSaveMethod: jest.Mock;
  private mockUserWriteRepo: UserWriteRepoPort;

  constructor() {
    this.mockUpdateMethod = this.getMockUpdateMethod();
    this.mockSaveMethod = this.getMockSaveMethod();
    this.mockGetByIdMethod = this.getMockGetByIdMethod();
    this.mockUserWriteRepo = {
      save: this.mockSaveMethod,
      getById: this.mockGetByIdMethod,
      update: this.mockUpdateMethod,
      delete: jest.fn(),
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
          user.id.equals(
            new Domain.UUIDv4(INCREMENT_TODOS_REPO_ERROR_SAVE_CASE.id),
          )
        ) {
          return Promise.resolve(
            fail(new Application.Repo.Errors.Unexpected('Unexpected error')),
          );
        }
        return Promise.resolve(ok());
      },
    );
  }

  private getMockSaveMethod(): jest.Mock {
    return jest.fn(
      (
        user: UserEntity,
      ): Promise<Either<void, Application.Repo.Errors.Unexpected>> => {
        return Promise.resolve(ok());
      },
    );
  }

  private getMockGetByIdMethod() {
    return jest.fn(
      (
        id: Domain.UUIDv4,
      ): Promise<
        Either<
          UserEntity | null,
          | DomainErrors.InvalidTodosCounterError
          | Application.Repo.Errors.Unexpected
        >
      > => {
        if (
          id.equals(
            new Domain.UUIDv4(INCREMENT_TODOS_SUCCESS_USER_EXISTS_CASE.id),
          )
        ) {
          const todo = UserEntity.fromPrimitives(
            INCREMENT_TODOS_SUCCESS_USER_EXISTS_CASE,
          );
          return Promise.resolve(ok(todo));
        }
        if (
          id.equals(
            new Domain.UUIDv4(
              INCREMENT_TODOS_SUCCESS_USER_DOESNT_EXIST_CASE.id,
            ),
          )
        ) {
          return Promise.resolve(ok(null));
        }
        if (
          id.equals(new Domain.UUIDv4(INCREMENT_TODOS_INVALID_COUNTER_CASE.id))
        ) {
          return Promise.resolve(
            fail(new DomainErrors.InvalidTodosCounterError()),
          );
        }
        if (
          id.equals(
            new Domain.UUIDv4(INCREMENT_TODOS_REPO_ERROR_GETBYID_CASE.id),
          )
        ) {
          return Promise.resolve(
            fail(new Application.Repo.Errors.Unexpected('Unexpected error')),
          );
        }
        if (
          id.equals(new Domain.UUIDv4(INCREMENT_TODOS_REPO_ERROR_SAVE_CASE.id))
        ) {
          const todo = UserEntity.fromPrimitives(
            INCREMENT_TODOS_REPO_ERROR_SAVE_CASE,
          );
          return Promise.resolve(ok(todo));
        }
        return Promise.resolve(ok(null));
      },
    );
  }
}
