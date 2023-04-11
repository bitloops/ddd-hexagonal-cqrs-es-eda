import { TodoCompletionsIncrementedDomainEvent } from '@src/lib/bounded-contexts/marketing/marketing/domain/events/todo-completions-incremented.event';
import { MockUserWriteRepo } from './user-write-repo.mock';
import { TodoCompletionsIncrementedHandler } from '../../../application/event-handlers/domain/todo-completions-incremented.handler';
import { MockNotificationTemplateReadRepo } from './notification-template-read-repo.mock';
import { UserEntityBuilder } from '../../builders/user-entity.builder';
import { Application, Domain } from '@bitloops/bl-boilerplate-core';
import {
  SUCCESS_CASE,
  UNSUCCESS_USER_NOT_FOUND_CASE,
  UNSUCCESS_NOT_FIRST_TODO_CASE,
  UNSUCCESS_REPO_ERROR_CASE,
  UNSUCCESS_USER_REPO_ERROR_CASE,
} from './todo-completions-incremented.mock';
import { NotificationTemplateReadModel } from '../../../domain/notification-template.read-model';
import { ApplicationErrors } from '../../../application/errors';
import { MockStreamCommandBus } from '../../mocks/stream-command-bus.mock';
import { mockAsyncLocalStorageGet } from '../../mocks/mockAsynLocalStorageGet.mock';

describe('Todo completions incremented feature test', () => {
  it('Todo completions incremented successfully, email sent', async () => {
    const { userId, completedTodos } = SUCCESS_CASE;
    const userEmail = SUCCESS_CASE.userEmail;
    const template = SUCCESS_CASE.notificationTemplate.template;
    mockAsyncLocalStorageGet(userId);

    // given
    const mockNotificationTemplateReadRepo =
      new MockNotificationTemplateReadRepo();
    const mockUserWriteRepo = new MockUserWriteRepo();
    const mockStreamCommandBus = new MockStreamCommandBus();
    const user = new UserEntityBuilder()
      .withId(userId)
      .withCompletedTodos(completedTodos)
      .build();
    const todoCompletionsDomainEvent =
      new TodoCompletionsIncrementedDomainEvent({
        completedTodos,
        aggregateId: userId,
      });

    // when
    const todoCompletionsIncrementedEventHandler =
      new TodoCompletionsIncrementedHandler(
        mockStreamCommandBus.getMockStreamCommandBus(),
        mockUserWriteRepo.getMockUserWriteRepo(),
        mockNotificationTemplateReadRepo.getMockNotificationTemplateReadRepo(),
      );
    const result = await todoCompletionsIncrementedEventHandler.handle(
      todoCompletionsDomainEvent,
    );

    //then
    expect(
      mockNotificationTemplateReadRepo.mockGetByTypeMethod,
    ).toHaveBeenCalledWith(NotificationTemplateReadModel.firstTodo);

    expect(mockUserWriteRepo.mockGetByIdMethod).toHaveBeenCalledWith(
      new Domain.UUIDv4(userId),
    );

    expect(mockStreamCommandBus.mockPublish).toHaveBeenCalled();
    const publishedCommand = mockStreamCommandBus.mockPublish.mock.calls[0][0];
    expect(publishedCommand.destination).toEqual(userEmail);
    expect(publishedCommand.content).toEqual(template);
    expect(publishedCommand.origin).toEqual('marketing@bitloops.com');
    expect(result.value).toBe(undefined);
  });

  it('Todo completions incremented successfully, email not sent, repo error', async () => {
    const { userId, completedTodos } = UNSUCCESS_REPO_ERROR_CASE;
    mockAsyncLocalStorageGet(userId);

    // given
    const mockNotificationTemplateReadRepo =
      new MockNotificationTemplateReadRepo();
    const mockUserWriteRepo = new MockUserWriteRepo();
    const mockStreamCommandBus = new MockStreamCommandBus();
    const user = new UserEntityBuilder()
      .withId(userId)
      .withCompletedTodos(completedTodos)
      .build();
    const todoCompletionsDomainEvent =
      new TodoCompletionsIncrementedDomainEvent({
        completedTodos,
        aggregateId: userId,
      });

    // when
    const todoCompletionsIncrementedEventHandler =
      new TodoCompletionsIncrementedHandler(
        mockStreamCommandBus.getMockStreamCommandBus(),
        mockUserWriteRepo.getMockUserWriteRepo(),
        mockNotificationTemplateReadRepo.getMockNotificationTemplateReadRepo(),
      );
    const result = await todoCompletionsIncrementedEventHandler.handle(
      todoCompletionsDomainEvent,
    );

    //then
    expect(
      mockNotificationTemplateReadRepo.mockGetByTypeMethod,
    ).toHaveBeenCalledWith(NotificationTemplateReadModel.firstTodo);
    expect(result.value).toBeInstanceOf(Application.Repo.Errors.Unexpected);
  });

  it('Todo completions incremented successfully, email not sent, not first todo', async () => {
    const { userId, completedTodos } = UNSUCCESS_NOT_FIRST_TODO_CASE;
    mockAsyncLocalStorageGet(userId);

    // given
    const mockNotificationTemplateReadRepo =
      new MockNotificationTemplateReadRepo();
    const mockUserWriteRepo = new MockUserWriteRepo();
    const mockStreamCommandBus = new MockStreamCommandBus();
    const user = new UserEntityBuilder()
      .withId(userId)
      .withCompletedTodos(completedTodos)
      .build();
    const todoCompletionsDomainEvent =
      new TodoCompletionsIncrementedDomainEvent({
        completedTodos,
        aggregateId: userId,
      });

    // when
    const todoCompletionsIncrementedEventHandler =
      new TodoCompletionsIncrementedHandler(
        mockStreamCommandBus.getMockStreamCommandBus(),
        mockUserWriteRepo.getMockUserWriteRepo(),
        mockNotificationTemplateReadRepo.getMockNotificationTemplateReadRepo(),
      );
    const result = await todoCompletionsIncrementedEventHandler.handle(
      todoCompletionsDomainEvent,
    );

    //then

    expect(result.value).toBe(undefined);
  });

  it('Todo completions incremented successfully, email not sent, user repo error', async () => {
    const { userId, completedTodos } = UNSUCCESS_USER_REPO_ERROR_CASE;
    mockAsyncLocalStorageGet(userId);

    // given
    const mockNotificationTemplateReadRepo =
      new MockNotificationTemplateReadRepo();
    const mockUserWriteRepo = new MockUserWriteRepo();
    const mockStreamCommandBus = new MockStreamCommandBus();
    const user = new UserEntityBuilder()
      .withId(userId)
      .withCompletedTodos(completedTodos)
      .build();
    const todoCompletionsDomainEvent =
      new TodoCompletionsIncrementedDomainEvent({
        completedTodos,
        aggregateId: userId,
      });

    // when
    const todoCompletionsIncrementedEventHandler =
      new TodoCompletionsIncrementedHandler(
        mockStreamCommandBus.getMockStreamCommandBus(),
        mockUserWriteRepo.getMockUserWriteRepo(),
        mockNotificationTemplateReadRepo.getMockNotificationTemplateReadRepo(),
      );
    const result = await todoCompletionsIncrementedEventHandler.handle(
      todoCompletionsDomainEvent,
    );

    //then

    expect(
      mockNotificationTemplateReadRepo.mockGetByTypeMethod,
    ).not.toHaveBeenCalled();

    expect(mockUserWriteRepo.mockGetByIdMethod).toHaveBeenCalledWith(
      new Domain.UUIDv4(userId),
    );
    expect(result.value).toBeInstanceOf(Application.Repo.Errors.Unexpected);
  });

  it('Todo completions incremented successfully, email not sent, user email not found', async () => {
    const { userId, completedTodos } = UNSUCCESS_USER_NOT_FOUND_CASE;
    mockAsyncLocalStorageGet(userId);

    // given
    const mockNotificationTemplateReadRepo =
      new MockNotificationTemplateReadRepo();
    const mockUserWriteRepo = new MockUserWriteRepo();
    const mockStreamCommandBus = new MockStreamCommandBus();
    const user = new UserEntityBuilder()
      .withId(userId)
      .withCompletedTodos(completedTodos)
      .build();
    const todoCompletionsDomainEvent =
      new TodoCompletionsIncrementedDomainEvent({
        completedTodos,
        aggregateId: userId,
      });

    // when
    const todoCompletionsIncrementedEventHandler =
      new TodoCompletionsIncrementedHandler(
        mockStreamCommandBus.getMockStreamCommandBus(),
        mockUserWriteRepo.getMockUserWriteRepo(),
        mockNotificationTemplateReadRepo.getMockNotificationTemplateReadRepo(),
      );
    const result = await todoCompletionsIncrementedEventHandler.handle(
      todoCompletionsDomainEvent,
    );

    //then

    expect(
      mockNotificationTemplateReadRepo.mockGetByTypeMethod,
    ).not.toHaveBeenCalled();

    expect(mockUserWriteRepo.mockGetByIdMethod).toHaveBeenCalledWith(
      new Domain.UUIDv4(userId),
    );
    expect(result.value).toBeInstanceOf(ApplicationErrors.UserNotFoundError);
  });
});
