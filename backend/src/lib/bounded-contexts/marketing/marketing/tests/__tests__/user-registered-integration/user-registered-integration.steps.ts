import { UserRegisteredIntegrationEvent } from '@bitloops/bl-boilerplate-infra-nest-auth-passport';
import { UserRegisteredIntegrationEventHandler } from '../../../application/event-handlers/integration/user-registered.integration-handler';
import { mockAsyncLocalStorageGet } from '../../mocks/mockAsynLocalStorageGet.mock';
import { MockStreamCommandBus } from '../../mocks/stream-command-bus.mock';
import { SUCCESS_CASE } from './user-registered-integration.mock';

describe('UserRegisteredIntegrationEvent feature test', () => {
  it('Sent CreateUserCommand successfully', async () => {
    const { userId, email } = SUCCESS_CASE;
    mockAsyncLocalStorageGet(userId);

    //given
    const mockStreamCommandBus = new MockStreamCommandBus();

    //when
    const userRegisteredIntegrationEventHandler =
      new UserRegisteredIntegrationEventHandler(
        mockStreamCommandBus.getMockStreamCommandBus(),
      );
    const userRegisteredIntegrationEvent = new UserRegisteredIntegrationEvent({
      userId,
      email,
    });
    const result = await userRegisteredIntegrationEventHandler.handle(
      userRegisteredIntegrationEvent,
    );

    //then
    expect(mockStreamCommandBus.mockPublish).toHaveBeenCalled();
    const publishedCommand = mockStreamCommandBus.mockPublish.mock.calls[0][0];
    expect(publishedCommand.userId).toEqual(userId);
    expect(publishedCommand.email).toEqual(email);
    expect(result.value).toBe(undefined);
  });
});
