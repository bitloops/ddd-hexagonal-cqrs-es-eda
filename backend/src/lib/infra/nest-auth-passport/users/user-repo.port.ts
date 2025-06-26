import { Application, Either } from '@bitloops/bl-boilerplate-core';
import { User } from './user.model';

export interface UserRepoPort {
  getByEmail(email: string): Promise<User | null>;
  checkDoesNotExistAndCreate(
    user: User,
  ): Promise<Either<void, Application.Repo.Errors.Conflict | Application.Repo.Errors.Unexpected>>;
}

export const UserRepoPortToken = Symbol('UserRepoPortToken');
