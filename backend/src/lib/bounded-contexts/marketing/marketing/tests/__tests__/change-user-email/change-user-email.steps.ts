import {
  UPDATE_USER_REPO_ERROR_CASE,
  UPDATE_USER_SUCCESS_CASE,
} from './change-user-email.mock';
import { Application } from '@bitloops/bl-boilerplate-core';
import { ChangeUserEmailCommand } from '@src/lib/bounded-contexts/marketing/marketing/commands/change-user-email.command';
import { ChangeUserEmailCommandHandler } from '@src/lib/bounded-contexts/marketing/marketing/application/command-handlers/change-user-email.command-handler';
import { MockUserWriteRepo } from './change-user-email-write-repo.mock';
import { mockAsyncLocalStorageGet } from '../../mocks/mockAsynLocalStorageGet.mock';
import { UserEntityBuilder } from '../../builders/user-entity.builder';

describe('Change user email feature test', () => {
  it('Changed user email successfully,', async () => {
    const { email, userId } = UPDATE_USER_SUCCESS_CASE;
    mockAsyncLocalStorageGet(userId);
    // given
    const mockUpdateUserWriteRepo = new MockUserWriteRepo();
    const updateUserEmailCommand = new ChangeUserEmailCommand({
      email,
      userId,
    });

    // when
    const updateUserEmailHandler = new ChangeUserEmailCommandHandler(
      mockUpdateUserWriteRepo.getMockUserWriteRepo(),
    );
    const result = await updateUserEmailHandler.execute(updateUserEmailCommand);

    //then
    const userIdEmail = new UserEntityBuilder()
      .withId(userId)
      .withEmail(email)
      .build();

    expect(mockUpdateUserWriteRepo.mockUpdateMethod).toHaveBeenCalledWith({
      userId,
      email,
    });
    const userAggregate =
      mockUpdateUserWriteRepo.mockUpdateMethod.mock.calls[0][0];
    expect(userAggregate).toEqual(userIdEmail);
    expect(typeof result.value).toBe('undefined');
  });

  it('Changed user email failed, repo error', async () => {
    const { email, userId } = UPDATE_USER_REPO_ERROR_CASE;
    // given
    const mockUpdateUserWriteRepo = new MockUserWriteRepo();
    mockAsyncLocalStorageGet(userId);
    const updateUserEmailCommand = new ChangeUserEmailCommand({
      email,
      userId,
    });

    // when
    const updateUserEmailHandler = new ChangeUserEmailCommandHandler(
      mockUpdateUserWriteRepo.getMockUserWriteRepo(),
    );
    const result = await updateUserEmailHandler.execute(updateUserEmailCommand);

    //then
    const userIdEmail = new UserEntityBuilder()
      .withId(userId)
      .withEmail(email)
      .build();

    expect(mockUpdateUserWriteRepo.mockUpdateMethod).toHaveBeenCalledWith(
      userIdEmail,
    );
    expect(result.value).toBeInstanceOf(Application.Repo.Errors.Unexpected);
  });
});
