import {
  Application,
  Domain,
  Either,
  ok,
  fail,
} from '@bitloops/bl-boilerplate-core';
import { TodoEntity } from '@src/lib/bounded-contexts/todo/todo/domain/todo.entity';
import { TodoWriteRepoPort } from '@src/lib/bounded-contexts/todo/todo/ports/todo-write.repo-port';
import {
  MODIFY_INVALID_TITLE_CASE,
  MODIFY_TITLE_SUCCESS_CASE,
  MODIFY_TODO_GET_BY_ID_REPO_ERROR_CASE,
  MODIFY_TODO_NOT_FOUND_CASE,
  MODIFY_TODO_UPDATE_REPO_ERROR_CASE,
} from './modify-title-todo.mock';

export class ModifyTitleWriteRepo {
  private mockTodoWriteRepo: TodoWriteRepoPort;
  public readonly mockUpdateMethod: jest.Mock;
  public readonly mockGetByIdMethod: jest.Mock;

  constructor() {
    this.mockUpdateMethod = this.getMockUpdateMethod();
    this.mockGetByIdMethod = this.getMockGetByIdMethod();
    this.mockTodoWriteRepo = {
      save: jest.fn(),
      getById: this.mockGetByIdMethod,
      update: this.mockUpdateMethod,
      delete: jest.fn(),
    };
  }

  public getMockTodoWriteRepo(): TodoWriteRepoPort {
    return this.mockTodoWriteRepo;
  }

  private getMockUpdateMethod(): jest.Mock {
    return jest.fn(
      (
        todo: TodoEntity,
      ): Promise<Either<void, Application.Repo.Errors.Unexpected>> => {
        if (
          todo.id.equals(
            new Domain.UUIDv4(MODIFY_TODO_UPDATE_REPO_ERROR_CASE.titleId),
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

  private getMockGetByIdMethod(): jest.Mock {
    return jest.fn(
      (
        id: Domain.UUIDv4,
      ): Promise<
        Either<TodoEntity | null, Application.Repo.Errors.Unexpected>
      > => {
        if (id.equals(new Domain.UUIDv4(MODIFY_TITLE_SUCCESS_CASE.titleId))) {
          const { userId, completed, titleBeforeUpdate, titleId } =
            MODIFY_TITLE_SUCCESS_CASE;
          const todo = TodoEntity.fromPrimitives({
            id: titleId,
            title: titleBeforeUpdate,
            userId,
            completed,
          });
          return Promise.resolve(ok(todo));
        } else if (
          id.equals(new Domain.UUIDv4(MODIFY_INVALID_TITLE_CASE.titleId))
        ) {
          const { userId, completed, titleBeforeUpdate, titleId } =
            MODIFY_INVALID_TITLE_CASE;
          const todo = TodoEntity.fromPrimitives({
            id: titleId,
            title: titleBeforeUpdate,
            userId,
            completed,
          });
          return Promise.resolve(ok(todo));
        } else if (
          id.equals(
            new Domain.UUIDv4(MODIFY_TODO_UPDATE_REPO_ERROR_CASE.titleId),
          )
        ) {
          const { userId, completed, titleBeforeUpdate, titleId } =
            MODIFY_TODO_UPDATE_REPO_ERROR_CASE;
          const todo = TodoEntity.fromPrimitives({
            id: titleId,
            title: titleBeforeUpdate,
            userId,
            completed,
          });
          return Promise.resolve(ok(todo));
        } else if (
          id.equals(new Domain.UUIDv4(MODIFY_TODO_NOT_FOUND_CASE.titleId))
        ) {
          return Promise.resolve(ok(null));
        } else if (
          id.equals(
            new Domain.UUIDv4(MODIFY_TODO_GET_BY_ID_REPO_ERROR_CASE.titleId),
          )
        ) {
          return Promise.resolve(
            fail(new Application.Repo.Errors.Unexpected('Unexpected error')),
          );
        }
        return Promise.resolve(ok(null));
      },
    );
  }
}
