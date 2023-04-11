import {
  Application,
  Domain,
  Either,
  Infra,
  ok,
  // fail,
  asyncLocalStorage,
} from '@bitloops/bl-boilerplate-core';
import { Injectable, Inject } from '@nestjs/common';
import {
  Collection,
  MongoClient,
  // TransactionOptions,
  ClientSession,
} from 'mongodb';
import * as jwtwebtoken from 'jsonwebtoken';
import { UserWriteRepoPort } from '@src/lib/bounded-contexts/iam/authentication/ports/user-write.repo-port';
import { UserEntity } from '@src/lib/bounded-contexts/iam/authentication/domain/user.entity';
import { EmailVO } from '@src/lib/bounded-contexts/iam/authentication/domain/email.value-object';
import { ConfigService } from '@nestjs/config';
import { AuthEnvironmentVariables } from '@src/config/auth.configuration';
import { StreamingDomainEventBusToken } from '@src/lib/bounded-contexts/iam/authentication/constants';
import { AppConfig } from '@src/config/configuration';

@Injectable()
export class UserWriteRepository implements UserWriteRepoPort {
  private collection: Collection;
  private JWT_SECRET: string;
  constructor(
    @Inject('MONGO_DB_CONNECTION') private client: MongoClient,
    @Inject(StreamingDomainEventBusToken)
    private readonly domainEventBus: Infra.EventBus.IEventBus,
    private readonly configService: ConfigService<
      AuthEnvironmentVariables & AppConfig,
      true
    >,
  ) {
    const dbName = this.configService.get('database.iam_mongo.database', {
      infer: true,
    });

    const collectionName = this.configService.get(
      'database.iam_mongo.users_collection',
      {
        infer: true,
      },
    );
    this.collection = this.client.db(dbName).collection(collectionName);
    this.JWT_SECRET = this.configService.get('jwtSecret', { infer: true });
  }

  @Application.Repo.Decorators.ReturnUnexpectedError()
  update(
    aggregate: UserEntity,
  ): Promise<Either<void, Application.Repo.Errors.Unexpected>> {
    throw new Error('Method not implemented.');
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

    if (result.userId !== jwtPayload.sub) {
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
  async getByEmail(
    email: EmailVO,
    session?: ClientSession,
  ): Promise<Either<UserEntity | null, Application.Repo.Errors.Unexpected>> {
    const result = await this.collection.findOne(
      {
        email: email.email,
      },
      {
        session,
      },
    );

    if (!result) {
      return ok(null);
    }

    const { _id, ...user } = result as any;
    return ok(
      UserEntity.fromPrimitives({
        ...user,
        id: _id.toString(),
      }),
    );
  }

  @Application.Repo.Decorators.ReturnUnexpectedError()
  async save(
    user: UserEntity,
    session?: ClientSession,
  ): Promise<Either<void, Application.Repo.Errors.Unexpected>> {
    const createdUser = user.toPrimitives();
    await this.collection.insertOne(
      {
        _id: createdUser.id as any,
        ...createdUser,
      },
      {
        session,
      },
    );
    return ok();
  }
}
