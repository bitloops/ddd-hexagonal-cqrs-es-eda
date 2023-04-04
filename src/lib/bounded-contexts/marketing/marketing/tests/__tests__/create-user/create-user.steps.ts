import {
  CREATE_USER_REPO_ERROR_CASE,
  CREATE_USER_SUCCESS_CASE,
} from './create-user.mock';
import { CreateUserCommand } from '@src/lib/bounded-contexts/marketing/marketing/commands/create-user.command';
import { MockCreateUserReadRepo } from './create-user-read-repo.mock';
import { CreateUserCommandHandler } from '@src/lib/bounded-contexts/marketing/marketing/application/command-handlers/create-user.command-handler';
import { UserEmailReadModelBuilder } from '../../builders/user-read-model.builder';
import { Application } from '@bitloops/bl-boilerplate-core';
import { mockAsyncLocalStorageGet } from '../../mocks/mockAsynLocalStorageGet.mock';

describe('Create user feature test', () => {
  it('Created user successfully,', async () => {
    const { email, userId } = CREATE_USER_SUCCESS_CASE;
    mockAsyncLocalStorageGet(userId);
    // given
    const mockCreateUserReadRepo = new MockCreateUserReadRepo();
    const createUserCommand = new CreateUserCommand({ email, userId });

    // when
    const createUserHandler = new CreateUserCommandHandler(
      mockCreateUserReadRepo.getMockMarketingReadRepo(),
    );
    const result = await createUserHandler.execute(createUserCommand);

    //then
    const userIdEmail = new UserEmailReadModelBuilder()
      .withUserId(userId)
      .withEmail(email)
      .build();

    expect(mockCreateUserReadRepo.mockCreateMethod).toHaveBeenCalledWith({
      userId,
      email,
    });
    const userAggregate =
      mockCreateUserReadRepo.mockCreateMethod.mock.calls[0][0];
    expect(userAggregate).toEqual(userIdEmail);
    expect(typeof result.value).toBe('undefined');
  });
  it('Created user failed, repo error', async () => {
    const { email, userId } = CREATE_USER_REPO_ERROR_CASE;
    mockAsyncLocalStorageGet(userId);
    // given
    const mockCreateUserReadRepo = new MockCreateUserReadRepo();
    const createUserCommand = new CreateUserCommand({ email, userId });

    // when
    const createUserHandler = new CreateUserCommandHandler(
      mockCreateUserReadRepo.getMockMarketingReadRepo(),
    );
    const result = await createUserHandler.execute(createUserCommand);

    //then
    const userIdEmail = new UserEmailReadModelBuilder()
      .withUserId(userId)
      .withEmail(email)
      .build();

    expect(mockCreateUserReadRepo.mockCreateMethod).toHaveBeenCalledWith(
      userIdEmail,
    );
    expect(result.value).toBeInstanceOf(Application.Repo.Errors.Unexpected);
  });
});
