import { Application, Domain } from 'ddd-tactical-core-boilerplate';
import { UserEntity } from '../domain/user.entity';

export type UserWriteRepoPort = Application.Repo.ICRUDWritePort<
  UserEntity,
  Domain.UUIDv4
>;
