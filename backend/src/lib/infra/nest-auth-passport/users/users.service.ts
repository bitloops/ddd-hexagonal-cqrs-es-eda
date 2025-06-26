import { Inject, Injectable } from '@nestjs/common';
import { Application, Either } from '@bitloops/bl-boilerplate-core';
import { UserRepoPort, UserRepoPortToken } from './user-repo.port';
import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(
    @Inject(UserRepoPortToken)
    private readonly userRepo: UserRepoPort,
  ) {}

  async findOne(email: string): Promise<User | null> {
    const user = await this.userRepo.getByEmail(email);
    return user;
  }

  async create(
    user: User,
  ): Promise<Either<void, Application.Repo.Errors.Conflict | Application.Repo.Errors.Unexpected>> {
    return this.userRepo.checkDoesNotExistAndCreate(user);
  }
}
