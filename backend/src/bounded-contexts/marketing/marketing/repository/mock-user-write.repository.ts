import { Injectable } from '@nestjs/common';
import {
  Application,
  Either,
  ok,
} from '@bitloops/bl-boilerplate-core';
import { UserWriteRepoPort } from '@src/lib/bounded-contexts/marketing/marketing/ports/user-write.repo-port';
import { UserEntity } from '@src/lib/bounded-contexts/marketing/marketing/domain/user.entity';

@Injectable()
export class MockUserWriteRepository implements UserWriteRepoPort {
  private users: Map<string, any> = new Map();

  async save(user: UserEntity): Promise<Either<void, Application.Repo.Errors.Unexpected>> {
    const primitives = user.toPrimitives();
    this.users.set(primitives.id, primitives);
    return ok();
  }

  async delete(user: UserEntity): Promise<Either<void, Application.Repo.Errors.Unexpected>> {
    const primitives = user.toPrimitives();
    this.users.delete(primitives.id);
    return ok();
  }

  async update(user: UserEntity): Promise<Either<void, Application.Repo.Errors.Unexpected>> {
    const primitives = user.toPrimitives();
    this.users.set(primitives.id, primitives);
    return ok();
  }

  async getByEmail(email: string): Promise<Either<UserEntity | null, Application.Repo.Errors.Unexpected>> {
    const user = Array.from(this.users.values()).find(u => u.email === email);
    if (!user) {
      return ok(null);
    }
    return ok(UserEntity.fromPrimitives(user));
  }

  async getById(id: any): Promise<Either<UserEntity | null, Application.Repo.Errors.Unexpected>> {
    const user = this.users.get(id.toString());
    if (!user) {
      return ok(null);
    }
    return ok(UserEntity.fromPrimitives(user));
  }
}