import { CompleteTodoHandler } from '@src/lib/bounded-contexts/todo/todo/application/command-handlers/complete-todo.handler';
import { CompleteTodoCommand } from '@src/lib/bounded-contexts/todo/todo/commands/complete-todo.command';
import { TodoCompletedDomainEvent } from '@src/lib/bounded-contexts/todo/todo/domain/events/todo-completed.event';
import { TodoEntity } from '@src/lib/bounded-contexts/todo/todo/domain/todo.entity';
import { ApplicationErrors } from '@src/lib/bounded-contexts/todo/todo/application/errors';
import { TodoPropsBuilder } from '../../builders/todo-props.builder';
import { MockCompleteTodoWriteRepo } from './complete-todo-write-repo.mock';
import {
  COMPLETE_TODO_ALREADY_COMPLETED_CASE,
  COMPLETE_TODO_NOT_FOUND_CASE,
  COMPLETE_TODO_REPO_ERROR_GETBYID_CASE,
  COMPLETE_TODO_REPO_ERROR_SAVE_CASE,
  COMPLETE_TODO_SUCCESS_CASE,
} from './complete-todo.mock';
import { Application } from '@bitloops/bl-boilerplate-core';
import { DomainErrors } from '@src/lib/bounded-contexts/todo/todo/domain/errors';
import { mockAsyncLocalStorageGet } from '../../mocks/mockAsynLocalStorageGet.mock';
import { ContextBuilder } from '../../builders/context.builder';

describe('Complete todo feature test', () => {
  it('Todo completed successfully', async () => {
    const todoTitle = COMPLETE_TODO_SUCCESS_CASE.title;
    const userId = COMPLETE_TODO_SUCCESS_CASE.userId;
    const todoId = COMPLETE_TODO_SUCCESS_CASE.id;
    mockAsyncLocalStorageGet(userId.id);

    // given
    const mockCompleteTodoWriteRepo = new MockCompleteTodoWriteRepo();
    const completeTodoCommand = new CompleteTodoCommand(
      { todoId },
      {
        context: new ContextBuilder()
          .withJWT('jwt')
          .withUserId(userId.id)
          .build(),
      },
    );

    // when
    const completeTodoHandler = new CompleteTodoHandler(
      mockCompleteTodoWriteRepo.getMockTodoWriteRepo(),
    );
    const result = await completeTodoHandler.execute(completeTodoCommand);

    //then
    const todoProps = new TodoPropsBuilder()
      .withTitle(todoTitle.title)
      .withCompleted(true)
      .withUserId(userId.id)
      .withId(todoId)
      .build();

    expect(mockCompleteTodoWriteRepo.mockGetByIdMethod).toHaveBeenCalledWith({
      value: todoId,
    });
    expect(mockCompleteTodoWriteRepo.mockUpdateMethod).toHaveBeenCalledWith(
      expect.any(TodoEntity),
    );

    const todoAggregate =
      mockCompleteTodoWriteRepo.mockUpdateMethod.mock.calls[0][0];
    expect(todoAggregate.props).toEqual(todoProps);
    expect(todoAggregate.domainEvents[0]).toBeInstanceOf(
      TodoCompletedDomainEvent,
    );
    expect(typeof result.value).toBe('undefined');
  });

  it('Todo completed failed, todo not found', async () => {
    const userId = COMPLETE_TODO_NOT_FOUND_CASE.userId;
    const todoId = COMPLETE_TODO_NOT_FOUND_CASE.id;
    mockAsyncLocalStorageGet(userId.id);

    // given
    const mockCompleteTodoWriteRepo = new MockCompleteTodoWriteRepo();
    const completeTodoCommand = new CompleteTodoCommand({ todoId });

    // when
    const completeTodoHandler = new CompleteTodoHandler(
      mockCompleteTodoWriteRepo.getMockTodoWriteRepo(),
    );
    const result = await completeTodoHandler.execute(completeTodoCommand);

    //then
    expect(mockCompleteTodoWriteRepo.mockGetByIdMethod).toHaveBeenCalledWith({
      value: todoId,
    });
    expect(result.value).toBeInstanceOf(ApplicationErrors.TodoNotFoundError);
  });
  it('Todo completed failed, todo already completed', async () => {
    const userId = COMPLETE_TODO_ALREADY_COMPLETED_CASE.userId;
    const todoId = COMPLETE_TODO_ALREADY_COMPLETED_CASE.id;
    mockAsyncLocalStorageGet(userId.id);

    // given
    const mockCompleteTodoWriteRepo = new MockCompleteTodoWriteRepo();
    const completeTodoCommand = new CompleteTodoCommand({ todoId });

    // when
    const completeTodoHandler = new CompleteTodoHandler(
      mockCompleteTodoWriteRepo.getMockTodoWriteRepo(),
    );
    const result = await completeTodoHandler.execute(completeTodoCommand);

    //then
    expect(mockCompleteTodoWriteRepo.mockGetByIdMethod).toHaveBeenCalledWith({
      value: todoId,
    });
    expect(result.value).toBeInstanceOf(DomainErrors.TodoAlreadyCompletedError);
  });

  it('Todo failed to be completed, getById repo error', async () => {
    const userId = COMPLETE_TODO_REPO_ERROR_GETBYID_CASE.userId;
    const todoId = COMPLETE_TODO_REPO_ERROR_GETBYID_CASE.id;
    mockAsyncLocalStorageGet(userId.id);

    // given
    const mockCompleteTodoWriteRepo = new MockCompleteTodoWriteRepo();
    const completeTodoCommand = new CompleteTodoCommand({ todoId });

    // when
    const completeTodoHandler = new CompleteTodoHandler(
      mockCompleteTodoWriteRepo.getMockTodoWriteRepo(),
    );
    const result = await completeTodoHandler.execute(completeTodoCommand);

    //then
    expect(mockCompleteTodoWriteRepo.mockGetByIdMethod).toHaveBeenCalledWith({
      value: todoId,
    });
    expect(result.value).toBeInstanceOf(Application.Repo.Errors.Unexpected);
  });
  it('Todo failed to be completed, save repo error', async () => {
    const todoTitle = COMPLETE_TODO_REPO_ERROR_SAVE_CASE.title;
    const userId = COMPLETE_TODO_REPO_ERROR_SAVE_CASE.userId;
    const todoId = COMPLETE_TODO_REPO_ERROR_SAVE_CASE.id;
    mockAsyncLocalStorageGet(userId.id);

    // given
    const mockCompleteTodoWriteRepo = new MockCompleteTodoWriteRepo();
    const completeTodoCommand = new CompleteTodoCommand(
      { todoId },
      {
        context: new ContextBuilder()
          .withJWT('jwt')
          .withUserId(userId.id)
          .build(),
      },
    );

    // when
    const completeTodoHandler = new CompleteTodoHandler(
      mockCompleteTodoWriteRepo.getMockTodoWriteRepo(),
    );
    const result = await completeTodoHandler.execute(completeTodoCommand);

    //then
    const todoProps = new TodoPropsBuilder()
      .withTitle(todoTitle.title)
      .withCompleted(true)
      .withUserId(userId.id)
      .withId(todoId)
      .build();

    expect(mockCompleteTodoWriteRepo.mockGetByIdMethod).toHaveBeenCalledWith({
      value: todoId,
    });
    expect(mockCompleteTodoWriteRepo.mockUpdateMethod).toHaveBeenCalledWith(
      expect.any(TodoEntity),
    );
    const todoAggregate =
      mockCompleteTodoWriteRepo.mockUpdateMethod.mock.calls[0][0];
    expect(todoAggregate.props).toEqual(todoProps);
    expect(todoAggregate.domainEvents[0]).toBeInstanceOf(
      TodoCompletedDomainEvent,
    );
    expect(result.value).toBeInstanceOf(Application.Repo.Errors.Unexpected);
  });
});
