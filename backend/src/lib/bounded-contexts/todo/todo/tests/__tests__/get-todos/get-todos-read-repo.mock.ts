import {
  Application,
  Either,
  ok,
  fail,
  asyncLocalStorage,
} from '@bitloops/bl-boilerplate-core';
import { TodoReadModel } from '../../../domain/todo.read-model';
import { TodoReadRepoPort } from '../../../ports/todo-read.repo-port';
import {
  GET_TODOS_REPO_ERROR_CASE,
  GET_TODOS_SUCCESS_CASE,
} from './get-todos.mock';

export class MockGetTodosReadRepo {
  private mockTodoReadRepo: TodoReadRepoPort;
  public readonly mockGetAllMethod: jest.Mock;

  constructor() {
    this.mockGetAllMethod = this.getMockGetAllMethod();
    this.mockTodoReadRepo = {
      getAll: this.mockGetAllMethod,
      getById: jest.fn(),
    };
  }

  public getMockTodoReadRepo(): TodoReadRepoPort {
    return this.mockTodoReadRepo;
  }

  private getMockGetAllMethod(): jest.Mock {
    return jest.fn(
      (): Promise<
        Either<TodoReadModel[] | null, Application.Repo.Errors.Unexpected>
      > => {
        const ctx = asyncLocalStorage.getStore()?.get('context');
        if (ctx.userId === GET_TODOS_SUCCESS_CASE.userId) {
          const { userId, title, titleId, completed } = GET_TODOS_SUCCESS_CASE;
          const todo = TodoReadModel.fromPrimitives({
            userId,
            title,
            id: titleId,
            completed,
          });
          return Promise.resolve(ok([todo]));
        } else if (ctx.userId === GET_TODOS_REPO_ERROR_CASE.userId) {
          return Promise.resolve(
            fail(new Application.Repo.Errors.Unexpected('Unexpected error')),
          );
        }
        return Promise.resolve(ok(null));
      },
    );
  }
}
