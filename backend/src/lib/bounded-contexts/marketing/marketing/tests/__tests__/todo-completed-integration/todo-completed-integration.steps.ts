import { TodoCompletedIntegrationEvent } from '@src/lib/bounded-contexts/todo/todo/contracts/integration-events/todo-completed.integration-event';
import { TodoCompletedIntegrationEventHandler } from '../../../application/event-handlers/integration/todo-completed.integration-handler';
import { mockAsyncLocalStorageGet } from '../../mocks/mockAsynLocalStorageGet.mock';
import { MockStreamCommandBus } from '../../mocks/stream-command-bus.mock';
import { SUCCESS_CASE } from './todo-completed-integration.mock';

describe('TodoCompletedIntegrationEvent feature test', () => {
  it('Sent IncrementTodosCommand successfully', async () => {
    const { userId, todoId } = SUCCESS_CASE;
    mockAsyncLocalStorageGet(userId);

    //given
    const mockStreamCommandBus = new MockStreamCommandBus();

    //when
    const todoCompletedIntegrationEventHandler =
      new TodoCompletedIntegrationEventHandler(
        mockStreamCommandBus.getMockStreamCommandBus(),
      );
    const todoCompletedIntegrationEvent = new TodoCompletedIntegrationEvent(
      { userId, todoId },
      'v1',
    );
    const result = await todoCompletedIntegrationEventHandler.handle(
      todoCompletedIntegrationEvent,
    );

    //then
    expect(mockStreamCommandBus.mockPublish).toHaveBeenCalled();
    const publishedCommand = mockStreamCommandBus.mockPublish.mock.calls[0][0];
    expect(publishedCommand.id).toEqual(userId);
    expect(result.value).toBe(undefined);
  });
});
