import { UncompleteTodoHandler } from '@src/lib/bounded-contexts/todo/todo/application/command-handlers/uncomplete-todo.handler';
import { TodoEntity } from '@src/lib/bounded-contexts/todo/todo/domain/todo.entity';
import { ApplicationErrors } from '@src/lib/bounded-contexts/todo/todo/application/errors';
import { MockUncompleteTodoWriteRepo } from './uncomplete-todo-write-repo.mock';
import {
  UNCOMPLETE_TODO_ALREADY_UNCOMPLETED_CASE,
  UNCOMPLETE_TODO_NOT_FOUND_CASE,
  UNCOMPLETE_TODO_REPO_ERROR_GETBYID_CASE,
  UNCOMPLETE_TODO_REPO_ERROR_SAVE_CASE,
  UNCOMPLETE_TODO_SUCCESS_CASE,
} from './uncomplete-todo.mock';
import { Application, Domain } from 'ddd-tactical-core-boilerplate';
import { TodoUncompletedDomainEvent } from '../../../domain/events/todo-uncompleted.event';
import { DomainErrors } from '@src/lib/bounded-contexts/todo/todo/domain/errors';
import { UncompleteTodoCommand } from '../../../commands/uncomplete-todo.command';
import { mockAsyncLocalStorageGet } from '../../mocks/mockAsynLocalStorageGet.mock';

describe('Uncomplete todo feature test', () => {
  it('Todo uncompleted successfully', async () => {
    const todoTitle = UNCOMPLETE_TODO_SUCCESS_CASE.title;
    const userId = UNCOMPLETE_TODO_SUCCESS_CASE.userId;
    const id = UNCOMPLETE_TODO_SUCCESS_CASE.id;
    mockAsyncLocalStorageGet(userId.id);

    // given
    const mockUncompleteTodoWriteRepo = new MockUncompleteTodoWriteRepo();
    const uncompleteTodoCommand = new UncompleteTodoCommand({ id });

    // when
    const uncompleteTodoHandler = new UncompleteTodoHandler(
      mockUncompleteTodoWriteRepo.getMockTodoWriteRepo(),
    );
    const result = await uncompleteTodoHandler.execute(uncompleteTodoCommand);

    //then
    expect(mockUncompleteTodoWriteRepo.mockGetByIdMethod).toHaveBeenCalledWith(
      Domain.UUIDv4.fromString(id),
    );
    expect(mockUncompleteTodoWriteRepo.mockUpdateMethod).toHaveBeenCalledWith(
      expect.any(TodoEntity),
    );

    const todoAggregate =
      mockUncompleteTodoWriteRepo.mockUpdateMethod.mock.calls[0][0];
    expect(todoAggregate.toPrimitives()).toEqual({
      id,
      userId,
      title: todoTitle,
      completed: false,
    });
    expect(todoAggregate.domainEvents[0]).toBeInstanceOf(
      TodoUncompletedDomainEvent,
    );
    expect(typeof result.value).toBe('undefined');
  });

  it('Todo uncompleted failed, todo not found', async () => {
    const userId = UNCOMPLETE_TODO_NOT_FOUND_CASE.userId;
    const id = UNCOMPLETE_TODO_NOT_FOUND_CASE.id;
    mockAsyncLocalStorageGet(userId.id);

    // given
    const mockUncompleteTodoWriteRepo = new MockUncompleteTodoWriteRepo();
    const uncompleteTodoCommand = new UncompleteTodoCommand({ id });

    // when
    const uncompleteTodoHandler = new UncompleteTodoHandler(
      mockUncompleteTodoWriteRepo.getMockTodoWriteRepo(),
    );
    const result = await uncompleteTodoHandler.execute(uncompleteTodoCommand);

    //then
    expect(mockUncompleteTodoWriteRepo.mockGetByIdMethod).toHaveBeenCalledWith(
      Domain.UUIDv4.fromString(id),
    );
    expect(result.value).toBeInstanceOf(ApplicationErrors.TodoNotFoundError);
  });
  it('Todo uncompleted failed, todo already uncompleted', async () => {
    const userId = UNCOMPLETE_TODO_ALREADY_UNCOMPLETED_CASE.userId;
    const id = UNCOMPLETE_TODO_ALREADY_UNCOMPLETED_CASE.id;
    mockAsyncLocalStorageGet(userId.id);

    // given
    const mockUncompleteTodoWriteRepo = new MockUncompleteTodoWriteRepo();
    const uncompleteTodoCommand = new UncompleteTodoCommand({ id });

    // when
    const uncompleteTodoHandler = new UncompleteTodoHandler(
      mockUncompleteTodoWriteRepo.getMockTodoWriteRepo(),
    );
    const result = await uncompleteTodoHandler.execute(uncompleteTodoCommand);

    //then
    expect(mockUncompleteTodoWriteRepo.mockGetByIdMethod).toHaveBeenCalledWith(
      Domain.UUIDv4.fromString(id),
    );
    expect(result.value).toBeInstanceOf(
      DomainErrors.TodoAlreadyUncompletedError,
    );
  });

  it('Todo failed to be uncompleted, getById repo error', async () => {
    const userId = UNCOMPLETE_TODO_REPO_ERROR_GETBYID_CASE.userId;
    const id = UNCOMPLETE_TODO_REPO_ERROR_GETBYID_CASE.id;
    mockAsyncLocalStorageGet(userId.id);

    // given
    const mockCompleteTodoWriteRepo = new MockUncompleteTodoWriteRepo();
    const uncompleteTodoCommand = new UncompleteTodoCommand({ id });

    // when
    const uncompleteTodoHandler = new UncompleteTodoHandler(
      mockCompleteTodoWriteRepo.getMockTodoWriteRepo(),
    );
    const result = await uncompleteTodoHandler.execute(uncompleteTodoCommand);

    //then
    expect(mockCompleteTodoWriteRepo.mockGetByIdMethod).toHaveBeenCalledWith(
      Domain.UUIDv4.fromString(id),
    );
    expect(result.value).toBeInstanceOf(Application.Repo.Errors.Unexpected);
  });
  it('Todo failed to be uncompleted, save repo error', async () => {
    const todoTitle = UNCOMPLETE_TODO_SUCCESS_CASE.title;
    const userId = UNCOMPLETE_TODO_REPO_ERROR_SAVE_CASE.userId;
    const id = UNCOMPLETE_TODO_REPO_ERROR_SAVE_CASE.id;
    mockAsyncLocalStorageGet(userId.id);

    // given
    const mockUncompleteTodoWriteRepo = new MockUncompleteTodoWriteRepo();
    const uncompleteTodoCommand = new UncompleteTodoCommand({ id });

    // when
    const uncompleteTodoHandler = new UncompleteTodoHandler(
      mockUncompleteTodoWriteRepo.getMockTodoWriteRepo(),
    );
    const result = await uncompleteTodoHandler.execute(uncompleteTodoCommand);

    //then
    expect(mockUncompleteTodoWriteRepo.mockGetByIdMethod).toHaveBeenCalledWith(
      Domain.UUIDv4.fromString(id),
    );
    expect(mockUncompleteTodoWriteRepo.mockUpdateMethod).toHaveBeenCalledWith(
      expect.any(TodoEntity),
    );
    const todoAggregate =
      mockUncompleteTodoWriteRepo.mockUpdateMethod.mock.calls[0][0];
    expect(todoAggregate.toPrimitives()).toEqual({
      id,
      userId,
      title: todoTitle,
      completed: false,
    });
    expect(todoAggregate.domainEvents[0]).toBeInstanceOf(
      TodoUncompletedDomainEvent,
    );
    expect(result.value).toBeInstanceOf(Application.Repo.Errors.Unexpected);
  });
});
