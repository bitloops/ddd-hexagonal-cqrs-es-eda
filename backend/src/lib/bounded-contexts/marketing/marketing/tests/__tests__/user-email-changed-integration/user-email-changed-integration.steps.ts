import { UserEmailChangedIntegrationEvent } from '@src/lib/bounded-contexts/iam/authentication/contracts/integration-events/user-email-changed.integration-event';
import { UserEmailChangedIntegrationEventHandler } from '../../../application/event-handlers/integration/user-email-changed.integration-handler';
import { mockAsyncLocalStorageGet } from '../../mocks/mockAsynLocalStorageGet.mock';
import { MockStreamCommandBus } from '../../mocks/stream-command-bus.mock';
import { SUCCESS_CASE } from './user-email-changed.mock';

describe('UserEmailChangedIntegrationEvent feature test', () => {
  it('Sent UserEmailChangedCommand successfully', async () => {
    const { userId, email } = SUCCESS_CASE;
    mockAsyncLocalStorageGet(userId);

    //given
    const mockStreamCommandBus = new MockStreamCommandBus();

    //when
    const userEmailChangedIntegrationEventHandler =
      new UserEmailChangedIntegrationEventHandler(
        mockStreamCommandBus.getMockStreamCommandBus(),
      );
    const userEmailChangedIntegrationEvent =
      new UserEmailChangedIntegrationEvent({ userId, email }, 'v1');
    const result = await userEmailChangedIntegrationEventHandler.handle(
      userEmailChangedIntegrationEvent,
    );

    //then
    expect(mockStreamCommandBus.mockPublish).toHaveBeenCalled();
    const publishedCommand = mockStreamCommandBus.mockPublish.mock.calls[0][0];
    expect(publishedCommand.userId).toEqual(userId);
    expect(publishedCommand.email).toEqual(email);
    expect(result.value).toBe(undefined);
  });
});
