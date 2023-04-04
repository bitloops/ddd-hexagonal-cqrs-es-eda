import {
  Application,
  Domain,
  Either,
  asyncLocalStorage,
  ok,
} from '@bitloops/bl-boilerplate-core';
import { Injectable, Inject } from '@nestjs/common';
import { Collection, MongoClient } from 'mongodb';
import * as jwtwebtoken from 'jsonwebtoken';
import { UserEmailReadRepoPort } from '@src/lib/bounded-contexts/marketing/marketing/ports/user-email-read.repo-port';
import { UserReadModel } from '@src/lib/bounded-contexts/marketing/marketing/domain/read-models/user-email.read-model';
import { ConfigService } from '@nestjs/config';
import { AuthEnvironmentVariables } from '@src/config/auth.configuration';

const MONGO_DB_DATABASE = process.env.MONGO_DB_DATABASE || 'marketing';
const MONGO_DB_TODO_COLLECTION =
  process.env.MONGO_DB_TODO_COLLECTION || 'userEmail';

@Injectable()
export class UserEmailReadRepository implements UserEmailReadRepoPort {
  private collectionName = MONGO_DB_TODO_COLLECTION;
  private dbName = MONGO_DB_DATABASE;
  private collection: Collection;
  private JWT_SECRET: string;
  constructor(
    @Inject('MONGO_DB_CONNECTION') private client: MongoClient,
    private configService: ConfigService<AuthEnvironmentVariables, true>,
  ) {
    this.collection = this.client
      .db(this.dbName)
      .collection(this.collectionName);
    this.JWT_SECRET = this.configService.get('jwtSecret', { infer: true });
  }

  @Application.Repo.Decorators.ReturnUnexpectedError()
  async getUserEmail(
    userid: Domain.UUIDv4,
  ): Promise<Either<UserReadModel | null, Application.Repo.Errors.Unexpected>> {
    const ctx = asyncLocalStorage.getStore()?.get('context');
    const { jwt } = ctx;
    let jwtPayload: null | any = null;
    try {
      jwtPayload = jwtwebtoken.verify(jwt, this.JWT_SECRET);
    } catch (err) {
      throw new Error('Invalid JWT!');
    }
    const result = await this.collection.findOne({
      _id: userid.toString() as any,
    });

    if (!result) {
      return ok(null);
    }

    if (result.userId !== jwtPayload.sub) {
      throw new Error('Invalid userId');
    }

    const { _id, ...todo } = result as any;
    return ok(
      UserReadModel.fromPrimitives({
        ...todo,
        id: _id.toString(),
      }),
    );
  }

  @Application.Repo.Decorators.ReturnUnexpectedError()
  async getById(
    id: string,
  ): Promise<Either<UserReadModel | null, Application.Repo.Errors.Unexpected>> {
    throw new Error('Method not implemented.');
  }

  async getAll(): Promise<
    Either<UserReadModel[], Application.Repo.Errors.Unexpected>
  > {
    throw new Error('Method not implemented.');
  }

  @Application.Repo.Decorators.ReturnUnexpectedError()
  async update(
    userEmailReadModel: UserReadModel,
  ): Promise<Either<void, Application.Repo.Errors.Unexpected>> {
    const ctx = asyncLocalStorage.getStore()?.get('context');
    const { jwt } = ctx;

    let jwtPayload: null | any = null;
    try {
      jwtPayload = jwtwebtoken.verify(jwt, this.JWT_SECRET);
    } catch (err) {
      throw new Error('Invalid JWT!');
    }
    const userEmail = userEmailReadModel.toPrimitives();
    if (userEmail.userId !== jwtPayload.sub) {
      throw new Error('Invalid userId');
    }
    await this.collection.insertOne({
      _id: userEmail.userId as any,
      ...userEmail,
    });
    return ok();
  }

  @Application.Repo.Decorators.ReturnUnexpectedError()
  async create(
    userReadModel: UserReadModel,
  ): Promise<Either<void, Application.Repo.Errors.Unexpected>> {
    const userEmail = userReadModel.toPrimitives();
    await this.collection.insertOne({
      _id: userEmail.userId as any,
      ...userEmail,
    });
    return ok();
  }
}
