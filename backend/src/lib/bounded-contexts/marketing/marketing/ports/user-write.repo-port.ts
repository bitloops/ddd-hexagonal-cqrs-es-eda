import { Application, Domain } from '@bitloops/bl-boilerplate-core';
import { UserEntity } from '../domain/user.entity';

export type UserWriteRepoPort = Application.Repo.ICRUDWritePort<
  UserEntity,
  Domain.UUIDv4
>;
