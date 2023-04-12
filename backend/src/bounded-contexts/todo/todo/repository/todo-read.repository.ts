// import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { Collection, MongoClient } from 'mongodb';
import * as jwtwebtoken from 'jsonwebtoken';
// import { InjectModel } from '@nestjs/mongoose';
// import { Todo, TodoDocument } from './schema/todo.schema';
import { TodoReadRepoPort } from '@src/lib/bounded-contexts/todo/todo/ports/todo-read.repo-port';
import {
  TodoReadModel,
  TTodoReadModelSnapshot,
} from '@src/lib/bounded-contexts/todo/todo/domain/todo.read-model';
import { ConfigService } from '@nestjs/config';
import { AuthEnvironmentVariables } from '@src/config/auth.configuration';
import {
  Application,
  asyncLocalStorage,
  Either,
  ok,
} from '@bitloops/bl-boilerplate-core';

const MONGO_DB_DATABASE = process.env.MONGO_DB_DATABASE || 'todo';
const MONGO_DB_TODO_COLLECTION =
  process.env.MONGO_DB_TODO_COLLECTION || 'todos';

@Injectable()
export class TodoReadRepository implements TodoReadRepoPort {
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
  async getById(
    id: string,
  ): Promise<Either<TodoReadModel | null, Application.Repo.Errors.Unexpected>> {
    throw new Error('Method not implemented.');
  }

  @Application.Repo.Decorators.ReturnUnexpectedError()
  async getAll(): Promise<
    Either<TTodoReadModelSnapshot[], Application.Repo.Errors.Unexpected>
  > {
    const ctx = asyncLocalStorage.getStore()?.get('context');
    const { jwt } = ctx;
    let jwtPayload: null | any = null;
    try {
      jwtPayload = jwtwebtoken.verify(jwt, this.JWT_SECRET);
    } catch (err) {
      throw new Error('Invalid JWT!');
    }
    const userId = jwtPayload.sub;
    if (!userId) {
      throw new Error('Invalid userId');
    }
    const todos = await this.collection
      .find({ userId: { id: userId } })
      .toArray();
    return ok(
      todos.map((todo) => {
        const res = {
          id: todo._id.toString(),
          userId: todo.userId.id,
          title: todo.title.title,
          completed: todo.completed,
        };
        return res;
      }),
    );
  }
}
