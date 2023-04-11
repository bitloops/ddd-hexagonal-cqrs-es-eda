import { AddTodoCommandHandler } from '@src/lib/bounded-contexts/todo/todo/application/command-handlers/add-todo.handler';
import { AddTodoCommand } from '@src/lib/bounded-contexts/todo/todo/commands/add-todo.command';
import { DomainErrors } from '@src/lib/bounded-contexts/todo/todo/domain/errors';
import { TodoAddedDomainEvent } from '@src/lib/bounded-contexts/todo/todo/domain/events/todo-added.event';
import { TodoEntity } from '@src/lib/bounded-contexts/todo/todo/domain/todo.entity';
import { TodoPropsBuilder } from '../../builders/todo-props.builder';
import { mockAsyncLocalStorageGet } from '../../mocks/mockAsynLocalStorageGet.mock';
import { MockAddTodoWriteRepo } from './add-todo-write-repo.mock';
import {
  ADD_TODO_INVALID_TITLE_CASE,
  ADD_TODO_SUCCESS_CASE,
} from './add-todo.mock';

describe('Add todo feature test', () => {
  it('Todo created successfully', async () => {
    const { userId, title, completed } = ADD_TODO_SUCCESS_CASE;
    mockAsyncLocalStorageGet(userId);
    // given
    const mockTodoWriteRepo = new MockAddTodoWriteRepo();
    const addTodoCommand = new AddTodoCommand({ title });

    // when
    const addTodoHandler = new AddTodoCommandHandler(
      mockTodoWriteRepo.getMockTodoWriteRepo(),
    );
    const result = await addTodoHandler.execute(addTodoCommand);

    //then
    const todoProps = new TodoPropsBuilder()
      .withTitle(title)
      .withCompleted(completed)
      .withUserId(userId)
      .build();

    expect(mockTodoWriteRepo.mockSaveMethod).toHaveBeenCalledWith(
      expect.any(TodoEntity),
    );
    const todoAggregate = mockTodoWriteRepo.mockSaveMethod.mock.calls[0][0];
    expect(todoAggregate.props.title).toEqual(todoProps.title);
    expect(todoAggregate.props.completed).toEqual(todoProps.completed);
    expect(todoAggregate.domainEvents[0]).toBeInstanceOf(TodoAddedDomainEvent);
    expect(typeof result.value).toBe('string');
  });

  it('Todo failed to be created, invalid title', async () => {
    const { userId, title } = ADD_TODO_INVALID_TITLE_CASE;
    mockAsyncLocalStorageGet(userId);

    // given
    const mockTodoWriteRepo = new MockAddTodoWriteRepo();
    const addTodoCommand = new AddTodoCommand({ title });

    // when
    const addTodoHandler = new AddTodoCommandHandler(
      mockTodoWriteRepo.getMockTodoWriteRepo(),
    );
    const result = await addTodoHandler.execute(addTodoCommand);

    //then
    expect(mockTodoWriteRepo.mockSaveMethod).not.toHaveBeenCalled();
    expect(result.value).toBeInstanceOf(DomainErrors.TitleOutOfBoundsError);
  });
});
