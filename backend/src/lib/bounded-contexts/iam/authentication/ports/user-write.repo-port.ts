import { Application, Domain, Either } from '@bitloops/bl-boilerplate-core';
import { EmailVO } from '../domain/EmailVO.js';
import { UserEntity } from '../domain/UserEntity.js';

export interface UserWriteRepoPort
  extends Application.Repo.ICRUDWritePort<UserEntity, Domain.UUIDv4> {
  getByEmail(
    email: EmailVO,
  ): Promise<Either<UserEntity | null, Application.Repo.Errors.Unexpected>>;
}

export const UserWriteRepoPortToken = Symbol('UserWriteRepoPort');
