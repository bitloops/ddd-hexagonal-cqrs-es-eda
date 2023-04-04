import {
  UPDATE_USER_REPO_ERROR_CASE,
  UPDATE_USER_SUCCESS_CASE,
} from './change-user-email.mock';
import { UserEmailReadModelBuilder } from '../../builders/user-read-model.builder';
import { Application } from '@bitloops/bl-boilerplate-core';
import { ChangeUserEmailCommand } from '@src/lib/bounded-contexts/marketing/marketing/commands/change-user-email.command';
import { ChangeUserEmailCommandHandler } from '@src/lib/bounded-contexts/marketing/marketing/application/command-handlers/change-user-email.command-handler';
import { MockUpdateUserReadRepo } from './change-user-email-read-repo.mock';
import { mockAsyncLocalStorageGet } from '../../mocks/mockAsynLocalStorageGet.mock';

describe('Change user email feature test', () => {
  it('Changed user email successfully,', async () => {
    const { email, userId } = UPDATE_USER_SUCCESS_CASE;
    mockAsyncLocalStorageGet(userId);
    // given
    const mockUpdateUserReadRepo = new MockUpdateUserReadRepo();
    const updateUserEmailCommand = new ChangeUserEmailCommand({
      email,
      userId,
    });

    // when
    const updateUserEmailHandler = new ChangeUserEmailCommandHandler(
      mockUpdateUserReadRepo.getMockMarketingReadRepo(),
    );
    const result = await updateUserEmailHandler.execute(updateUserEmailCommand);

    //then
    const userIdEmail = new UserEmailReadModelBuilder()
      .withUserId(userId)
      .withEmail(email)
      .build();

    expect(mockUpdateUserReadRepo.mockUpdateMethod).toHaveBeenCalledWith({
      userId,
      email,
    });
    const userAggregate =
      mockUpdateUserReadRepo.mockUpdateMethod.mock.calls[0][0];
    expect(userAggregate).toEqual(userIdEmail);
    expect(typeof result.value).toBe('undefined');
  });
  it('Changed user email failed, repo error', async () => {
    const { email, userId } = UPDATE_USER_REPO_ERROR_CASE;
    // given
    const mockUpdateUserReadRepo = new MockUpdateUserReadRepo();
    mockAsyncLocalStorageGet(userId);
    const updateUserEmailCommand = new ChangeUserEmailCommand({
      email,
      userId,
    });

    // when
    const updateUserEmailHandler = new ChangeUserEmailCommandHandler(
      mockUpdateUserReadRepo.getMockMarketingReadRepo(),
    );
    const result = await updateUserEmailHandler.execute(updateUserEmailCommand);

    //then
    const userIdEmail = new UserEmailReadModelBuilder()
      .withUserId(userId)
      .withEmail(email)
      .build();

    expect(mockUpdateUserReadRepo.mockUpdateMethod).toHaveBeenCalledWith(
      userIdEmail,
    );
    expect(result.value).toBeInstanceOf(Application.Repo.Errors.Unexpected);
  });
});
