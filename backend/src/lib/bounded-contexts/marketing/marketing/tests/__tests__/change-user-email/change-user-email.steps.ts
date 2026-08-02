import {
  UPDATE_USER_REPO_ERROR_CASE,
  UPDATE_USER_SUCCESS_CASE,
} from './change-user-email.mock';
import { Application, Domain } from 'ddd-tactical-core-boilerplate';
import { ChangeUserEmailCommand } from '@src/lib/bounded-contexts/marketing/marketing/commands/change-user-email.command';
import { ChangeUserEmailCommandHandler } from '@src/lib/bounded-contexts/marketing/marketing/application/command-handlers/change-user-email.command-handler';
import { MockUserWriteRepo } from './change-user-email-write-repo.mock';
import { mockAsyncLocalStorageGet } from '../../mocks/mockAsynLocalStorageGet.mock';
import { UserEntity } from '../../../domain/user.entity';

describe('Change user email feature test', () => {
  it('Changed user email successfully,', async () => {
    const { email, userId, completedTodos } = UPDATE_USER_SUCCESS_CASE;
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
    expect(mockUpdateUserWriteRepo.mockGetByIdMethod).toHaveBeenCalledWith(
      new Domain.UUIDv4(userId),
    );
    expect(mockUpdateUserWriteRepo.mockUpdateMethod).toHaveBeenCalledWith(
      expect.any(UserEntity),
    );

    const userAggregate =
      mockUpdateUserWriteRepo.mockUpdateMethod.mock.calls[0][0];
    expect(userAggregate.toPrimitives()).toEqual({
      id: userId,
      email,
      completedTodos,
    });
    expect(result.value).toBe(undefined);
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
    expect(mockUpdateUserWriteRepo.mockGetByIdMethod).toHaveBeenCalledWith(
      new Domain.UUIDv4(userId),
    );
    expect(mockUpdateUserWriteRepo.mockUpdateMethod).toHaveBeenCalledWith(
      expect.any(UserEntity),
    );

    expect(result.value).toBeInstanceOf(Application.Repo.Errors.Unexpected);
  });
});
