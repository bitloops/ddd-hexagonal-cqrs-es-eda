import {
  CREATE_USER_REPO_ERROR_CASE,
  CREATE_USER_SUCCESS_CASE,
} from './create-user.mock';
import { CreateUserCommand } from '@src/lib/bounded-contexts/marketing/marketing/commands/create-user.command';
import { MockCreateUserWriteRepo } from './create-user-write-repo.mock';
import { CreateUserCommandHandler } from '@src/lib/bounded-contexts/marketing/marketing/application/command-handlers/create-user.command-handler';
import { Application } from '@bitloops/bl-boilerplate-core';
import { mockAsyncLocalStorageGet } from '../../mocks/mockAsynLocalStorageGet.mock';
import { UserEntityBuilder } from '../../builders/user-entity.builder';

describe('Create user feature test', () => {
  it('Created user successfully,', async () => {
    const { email, userId, completedTodos } = CREATE_USER_SUCCESS_CASE;
    mockAsyncLocalStorageGet(userId);
    // given
    const mockCreateUserWriteRepo = new MockCreateUserWriteRepo();
    const createUserCommand = new CreateUserCommand({ email, userId });

    // when
    const createUserHandler = new CreateUserCommandHandler(
      mockCreateUserWriteRepo.getMockUserWriteRepo(),
    );
    const result = await createUserHandler.execute(createUserCommand);

    //then
    const user = new UserEntityBuilder()
      .withId(userId)
      .withEmail(email)
      .withCompletedTodos(completedTodos)
      .build();

    expect(mockCreateUserWriteRepo.mockSaveMethod).toHaveBeenCalledWith(user);

    expect(typeof result.value).toBe('undefined');
  });

  it('Created user failed, repo error', async () => {
    const { email, userId, completedTodos } = CREATE_USER_REPO_ERROR_CASE;
    mockAsyncLocalStorageGet(userId);
    // given
    const mockCreateUserWriteRepo = new MockCreateUserWriteRepo();
    const createUserCommand = new CreateUserCommand({ email, userId });

    // when
    const createUserHandler = new CreateUserCommandHandler(
      mockCreateUserWriteRepo.getMockUserWriteRepo(),
    );
    const result = await createUserHandler.execute(createUserCommand);

    //then
    const user = new UserEntityBuilder()
      .withId(userId)
      .withEmail(email)
      .withCompletedTodos(completedTodos)
      .build();

    expect(mockCreateUserWriteRepo.mockSaveMethod).toHaveBeenCalledWith(user);
    expect(result.value).toBeInstanceOf(Application.Repo.Errors.Unexpected);
  });
});
