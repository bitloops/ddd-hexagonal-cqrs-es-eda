import {
  Application,
  Domain,
  Either,
  fail,
  ok,
} from '@bitloops/bl-boilerplate-core';
import { TodoEntity } from '@src/lib/bounded-contexts/todo/todo/domain/todo.entity';
import { TodoWriteRepoPort } from '@src/lib/bounded-contexts/todo/todo/ports/todo-write.repo-port';
import { ADD_TODO_REPO_ERROR_CASE } from './add-todo.mock';

export class MockAddTodoWriteRepo {
  private mockTodoWriteRepo: TodoWriteRepoPort;
  public readonly mockSaveMethod: jest.Mock;

  constructor() {
    this.mockSaveMethod = this.getMockSaveMethod();
    this.mockTodoWriteRepo = {
      save: this.mockSaveMethod,
      getById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
  }

  public getMockTodoWriteRepo(): TodoWriteRepoPort {
    return this.mockTodoWriteRepo;
  }

  private getMockSaveMethod(): jest.Mock {
    return jest.fn(
      (
        todo: TodoEntity,
      ): Promise<Either<void, Application.Repo.Errors.Unexpected>> => {
        if (
          todo.userId.id.equals(
            new Domain.UUIDv4(ADD_TODO_REPO_ERROR_CASE.userId),
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
}
