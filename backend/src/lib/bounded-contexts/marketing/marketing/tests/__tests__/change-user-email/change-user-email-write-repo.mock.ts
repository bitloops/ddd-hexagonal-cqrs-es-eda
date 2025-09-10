import {
  Application,
  Either,
  ok,
  fail,
  Domain,
} from '@bitloops/bl-boilerplate-core';
import { vi } from 'vitest';
import {
  UPDATE_USER_REPO_ERROR_CASE,
  UPDATE_USER_SUCCESS_CASE,
} from './change-user-email.mock';
import { UserWriteRepoPort } from '../../../ports/user-write.repo-port';
import { UserEntity } from '../../../domain/user.entity';
import { UserEntityBuilder } from '../../builders/user-entity.builder';

export class MockUserWriteRepo {
  public readonly mockUpdateMethod: any;
  public readonly mockGetByIdMethod: any;
  private mockUserWriteRepo: UserWriteRepoPort;

  constructor() {
    this.mockUpdateMethod = this.getMockUpdateMethod();
    this.mockGetByIdMethod = this.getMockByIdMethod();
    this.mockUserWriteRepo = {
      getById: this.mockGetByIdMethod,
      save: vi.fn(),
      delete: vi.fn(),
      update: this.mockUpdateMethod,
    };
  }

  getMockUserWriteRepo(): UserWriteRepoPort {
    return this.mockUserWriteRepo;
  }

  private getMockByIdMethod(): any {
    return vi.fn(
      (
        userId: Domain.UUIDv4,
      ): Promise<
        Either<UserEntity | null, Application.Repo.Errors.Unexpected>
      > => {
        if (userId.equals(new Domain.UUIDv4(UPDATE_USER_SUCCESS_CASE.userId))) {
          const user = new UserEntityBuilder()
            .withEmail(UPDATE_USER_SUCCESS_CASE.email)
            .withId(UPDATE_USER_SUCCESS_CASE.userId)
            .withCompletedTodos(UPDATE_USER_SUCCESS_CASE.completedTodos)
            .build();
          return Promise.resolve(ok(user));
        } else if (
          userId.equals(new Domain.UUIDv4(UPDATE_USER_REPO_ERROR_CASE.userId))
        ) {
          const user = new UserEntityBuilder()
            .withEmail(UPDATE_USER_REPO_ERROR_CASE.email)
            .withId(UPDATE_USER_REPO_ERROR_CASE.userId)
            .withCompletedTodos(UPDATE_USER_REPO_ERROR_CASE.completedTodos)
            .build();
          return Promise.resolve(ok(user));
        }
        return Promise.resolve(ok(null));
      },
    );
  }

  private getMockUpdateMethod(): any {
    return vi.fn(
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