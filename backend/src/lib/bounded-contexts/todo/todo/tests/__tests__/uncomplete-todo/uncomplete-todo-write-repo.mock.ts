import {
  Application,
  Domain,
  Either,
  ok,
  fail,
} from '@bitloops/bl-boilerplate-core';
import { TodoEntity } from '@src/lib/bounded-contexts/todo/todo/domain/todo.entity';
import { TodoWriteRepoPort } from '@src/lib/bounded-contexts/todo/todo/ports/todo-write.repo-port';
import { DomainErrors } from '@src/lib/bounded-contexts/todo/todo/domain/errors';
import {
  UNCOMPLETE_TODO_ALREADY_UNCOMPLETED_CASE,
  UNCOMPLETE_TODO_NOT_FOUND_CASE,
  UNCOMPLETE_TODO_REPO_ERROR_GETBYID_CASE,
  UNCOMPLETE_TODO_REPO_ERROR_SAVE_CASE,
  UNCOMPLETE_TODO_SUCCESS_CASE,
} from './uncomplete-todo.mock';

export class MockUncompleteTodoWriteRepo {
  public readonly mockUpdateMethod: jest.Mock;
  public readonly mockGetByIdMethod: jest.Mock;
  private mockTodoWriteRepo: TodoWriteRepoPort;

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

  getMockTodoWriteRepo(): TodoWriteRepoPort {
    return this.mockTodoWriteRepo;
  }

  private getMockUpdateMethod(): jest.Mock {
    return jest.fn(
      (
        todo: TodoEntity,
      ): Promise<Either<void, Application.Repo.Errors.Unexpected>> => {
        if (
          todo.userId.id.equals(
            new Domain.UUIDv4(UNCOMPLETE_TODO_REPO_ERROR_SAVE_CASE.userId.id),
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

  private getMockGetByIdMethod() {
    return jest.fn(
      (
        id: Domain.UUIDv4,
      ): Promise<
        Either<
          TodoEntity | null,
          | DomainErrors.TodoAlreadyUncompletedError
          | Application.Repo.Errors.Unexpected
        >
      > => {
        if (id.equals(new Domain.UUIDv4(UNCOMPLETE_TODO_SUCCESS_CASE.id))) {
          const todo = TodoEntity.fromPrimitives(UNCOMPLETE_TODO_SUCCESS_CASE);
          return Promise.resolve(ok(todo));
        }
        if (id.equals(new Domain.UUIDv4(UNCOMPLETE_TODO_NOT_FOUND_CASE.id))) {
          return Promise.resolve(ok(null));
        }
        if (
          id.equals(
            new Domain.UUIDv4(UNCOMPLETE_TODO_ALREADY_UNCOMPLETED_CASE.id),
          )
        ) {
          return Promise.resolve(
            fail(new DomainErrors.TodoAlreadyUncompletedError(id.toString())),
          );
        }
        if (
          id.equals(
            new Domain.UUIDv4(UNCOMPLETE_TODO_REPO_ERROR_GETBYID_CASE.id),
          )
        ) {
          return Promise.resolve(
            fail(new Application.Repo.Errors.Unexpected('Unexpected error')),
          );
        }
        if (
          id.equals(new Domain.UUIDv4(UNCOMPLETE_TODO_REPO_ERROR_SAVE_CASE.id))
        ) {
          const todo = TodoEntity.fromPrimitives(
            UNCOMPLETE_TODO_REPO_ERROR_SAVE_CASE,
          );
          return Promise.resolve(ok(todo));
        }
        return Promise.resolve(ok(null));
      },
    );
  }
}
