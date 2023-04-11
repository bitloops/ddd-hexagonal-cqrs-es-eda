import { Application, Domain, Either } from '@bitloops/bl-boilerplate-core';
import { EmailVO } from '../domain/email.value-object.js';
import { UserEntity } from '../domain/user.entity.js';

export interface UserWriteRepoPort
  extends Application.Repo.ICRUDWritePort<UserEntity, Domain.UUIDv4> {
  getByEmail(
    email: EmailVO,
  ): Promise<Either<UserEntity | null, Application.Repo.Errors.Unexpected>>;
}
