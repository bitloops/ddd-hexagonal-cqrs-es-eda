import {
  Application,
  Domain,
  Either,
  ok,
  fail,
} from '@bitloops/bl-boilerplate-core';
import { UserEntity } from '../../../domain/user.entity';
import { UserWriteRepoPort } from '../../../ports/user-write.repo-port';
import { UserEntityBuilder } from '../../builders/user-entity.builder';
import {
  SUCCESS_CASE,
  UNSUCCESS_NOT_FIRST_TODO_CASE,
  UNSUCCESS_REPO_ERROR_CASE,
  UNSUCCESS_USER_REPO_ERROR_CASE,
} from './todo-completions-incremented.mock';

export class MockUserWriteRepo {
  public readonly mockGetByIdMethod: jest.Mock;
  private mockUserWriteRepo: UserWriteRepoPort;

  constructor() {
    this.mockGetByIdMethod = this.getMockGetByIdMethod();
    this.mockUserWriteRepo = {
      update: jest.fn(),
      save: jest.fn(),
      getById: this.mockGetByIdMethod,
      delete: jest.fn(),
    };
  }

  getMockUserWriteRepo(): UserWriteRepoPort {
    return this.mockUserWriteRepo;
  }

  private getMockGetByIdMethod(): jest.Mock {
    return jest.fn(
      (
        userid: Domain.UUIDv4,
      ): Promise<
        Either<UserEntity | null, Application.Repo.Errors.Unexpected>
      > => {
        if (userid.equals(new Domain.UUIDv4(SUCCESS_CASE.userId))) {
          const userResponse = new UserEntityBuilder()
            .withEmail(SUCCESS_CASE.userEmail)
            .withId(SUCCESS_CASE.userId)
            .withCompletedTodos(SUCCESS_CASE.completedTodos)
            .build();
          return Promise.resolve(ok(userResponse));
        }
        if (
          userid.equals(new Domain.UUIDv4(UNSUCCESS_REPO_ERROR_CASE.userId))
        ) {
          const userResponse = new UserEntityBuilder()
            .withEmail(UNSUCCESS_REPO_ERROR_CASE.userEmail)
            .withId(UNSUCCESS_REPO_ERROR_CASE.userId)
            .withCompletedTodos(UNSUCCESS_REPO_ERROR_CASE.completedTodos)
            .build();
          return Promise.resolve(ok(userResponse));
        }
        if (
          userid.equals(new Domain.UUIDv4(UNSUCCESS_NOT_FIRST_TODO_CASE.userId))
        ) {
          const userResponse = new UserEntityBuilder()
            .withEmail(UNSUCCESS_NOT_FIRST_TODO_CASE.userEmail)
            .withId(UNSUCCESS_NOT_FIRST_TODO_CASE.userId)
            .withCompletedTodos(UNSUCCESS_NOT_FIRST_TODO_CASE.completedTodos)
            .build();
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
