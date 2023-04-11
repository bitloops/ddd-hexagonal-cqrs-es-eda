import {
  Application,
  Domain,
  Either,
  Infra,
  asyncLocalStorage,
  ok,
} from '@bitloops/bl-boilerplate-core';
import { Injectable, Inject } from '@nestjs/common';
import { Collection, MongoClient } from 'mongodb';
import * as jwtwebtoken from 'jsonwebtoken';
import { UserEntity } from '@src/lib/bounded-contexts/marketing/marketing/domain/user.entity';
import { UserWriteRepoPort } from '@src/lib/bounded-contexts/marketing/marketing/ports/user-write.repo-port';
import { ConfigService } from '@nestjs/config';
import { AuthEnvironmentVariables } from '@src/config/auth.configuration';
import { StreamingDomainEventBusToken } from '@src/lib/bounded-contexts/marketing/marketing/constants';

const MONGO_DB_DATABASE = process.env.MONGO_DB_DATABASE || 'marketing';
const MONGO_DB_TODO_COLLECTION =
  process.env.MONGO_DB_TODO_COLLECTION || 'users';

@Injectable()
export class UserWriteRepository implements UserWriteRepoPort {
  private collectionName = MONGO_DB_TODO_COLLECTION;
  private dbName = MONGO_DB_DATABASE;
  private collection: Collection;
  private JWT_SECRET: string;

  constructor(
    @Inject('MONGO_DB_CONNECTION') private client: MongoClient,
    @Inject(StreamingDomainEventBusToken)
    private readonly domainEventBus: Infra.EventBus.IEventBus,
    private configService: ConfigService<AuthEnvironmentVariables, true>,
  ) {
    this.collection = this.client
      .db(this.dbName)
      .collection(this.collectionName);
    this.JWT_SECRET = this.configService.get('jwtSecret', { infer: true });
  }

  @Application.Repo.Decorators.ReturnUnexpectedError()
  async update(
    user: UserEntity,
  ): Promise<Either<void, Application.Repo.Errors.Unexpected>> {
    const ctx = asyncLocalStorage.getStore()?.get('context');
    const { jwt } = ctx;
    let jwtPayload: null | any = null;
    try {
      jwtPayload = jwtwebtoken.verify(jwt, this.JWT_SECRET);
    } catch (err) {
      throw new Error('Invalid JWT!');
    }
    const userPrimitives = user.toPrimitives();
    if (userPrimitives.id !== jwtPayload.sub) {
      throw new Error('Unauthorized userId');
    }
    const { id, ...userInfo } = userPrimitives;
    await this.collection.updateOne(
      {
        _id: id as any,
      },
      {
        $set: userInfo,
      },
    );

    this.domainEventBus.publish(user.domainEvents);
    return ok();
  }

  @Application.Repo.Decorators.ReturnUnexpectedError()
  delete(
    aggregate: UserEntity,
  ): Promise<Either<void, Application.Repo.Errors.Unexpected>> {
    throw new Error('Method not implemented.');
  }

  @Application.Repo.Decorators.ReturnUnexpectedError()
  async getById(
    id: Domain.UUIDv4,
  ): Promise<Either<UserEntity | null, Application.Repo.Errors.Unexpected>> {
    const ctx = asyncLocalStorage.getStore()?.get('context');
    const { jwt } = ctx;
    let jwtPayload: null | any = null;
    try {
      jwtPayload = jwtwebtoken.verify(jwt, this.JWT_SECRET);
    } catch (err) {
      throw new Error('Invalid JWT!');
    }
    const result = await this.collection.findOne({
      _id: id.toString() as any,
    });

    if (!result) {
      return ok(null);
    }

    if (result.id !== jwtPayload.sub) {
      throw new Error('Invalid userId');
    }

    const { _id, ...todo } = result as any;
    return ok(
      UserEntity.fromPrimitives({
        ...todo,
        id: _id.toString(),
      }),
    );
  }

  @Application.Repo.Decorators.ReturnUnexpectedError()
  async save(
    user: UserEntity,
  ): Promise<Either<void, Application.Repo.Errors.Unexpected>> {
    const createdUser = user.toPrimitives();

    await this.collection.insertOne({
      _id: createdUser.id as any,
      ...createdUser,
    });

    this.domainEventBus.publish(user.domainEvents);
    return ok();
  }
}
