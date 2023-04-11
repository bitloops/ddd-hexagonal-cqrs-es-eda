import {
  Application,
  Domain,
  Either,
  Infra,
  asyncLocalStorage,
  ok,
} from '@bitloops/bl-boilerplate-core';
import { Injectable, Inject } from '@nestjs/common';
import * as jwtwebtoken from 'jsonwebtoken';
import { UserWriteRepoPort } from '@src/lib/bounded-contexts/iam/authentication/ports/user-write.repo-port';
import { UserEntity } from '@src/lib/bounded-contexts/iam/authentication/domain/user.entity';
import { constants } from '@bitloops/bl-boilerplate-infra-postgres';
import { EmailVO } from '@src/lib/bounded-contexts/iam/authentication/domain/email.value-object';
import { ConfigService } from '@nestjs/config';
import { AuthEnvironmentVariables } from '@src/config/auth.configuration';
import { StreamingDomainEventBusToken } from '@src/lib/bounded-contexts/iam/authentication/constants';

@Injectable()
export class UserWritePostgresRepository implements UserWriteRepoPort {
  private readonly tableName = 'users';
  private readonly JWT_SECRET: string;
  constructor(
    @Inject(constants.pg_connection) private readonly connection: any,
    @Inject(StreamingDomainEventBusToken)
    private readonly domainEventBus: Infra.EventBus.IEventBus,
    private configService: ConfigService<AuthEnvironmentVariables, true>,
  ) {
    this.JWT_SECRET = this.configService.get('jwtSecret', { infer: true });
  }

  @Application.Repo.Decorators.ReturnUnexpectedError()
  async update(
    aggregate: UserEntity,
  ): Promise<Either<void, Application.Repo.Errors.Unexpected>> {
    const userPrimitives = aggregate.toPrimitives();
    const { id, email, password, lastLogin } = userPrimitives;
    const sqlStatement = `UPDATE ${this.tableName}
    SET email = $2, password = $3, last_login = $4
    WHERE id = $1`;
    await this.connection.query(sqlStatement, [id, email, password, lastLogin]);
    this.domainEventBus.publish(aggregate.domainEvents);
    return ok();
  }

  @Application.Repo.Decorators.ReturnUnexpectedError()
  async delete(
    aggregate: UserEntity,
  ): Promise<Either<void, Application.Repo.Errors.Unexpected>> {
    const aggregateRootId = aggregate.id;
    const sqlStatement = `DELETE FROM ${this.tableName} WHERE id = $1`;
    await this.connection.query(sqlStatement, [aggregateRootId.toString()]);
    this.domainEventBus.publish(aggregate.domainEvents);
    return ok();
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
    const result = await this.connection.query(
      `SELECT * FROM ${this.tableName} WHERE id = $1`,
      [id.toString()],
    );

    if (!result.rows.length) {
      return ok(null);
    }

    const userPrimitives = result.rows[0];
    if (userPrimitives.id !== jwtPayload.sub) {
      throw new Error('Invalid userId');
    }
    const { last_login, ...user } = userPrimitives;

    return ok(
      UserEntity.fromPrimitives({
        ...user,
        lastLogin: new Date(last_login),
      }),
    );
  }

  @Application.Repo.Decorators.ReturnUnexpectedError()
  async getByEmail(
    email: EmailVO,
  ): Promise<Either<UserEntity | null, Application.Repo.Errors.Unexpected>> {
    const result = await this.connection.query(
      `SELECT * FROM ${this.tableName} WHERE email = $1`,
      [email.email],
    );

    if (!result.rows.length) {
      return ok(null);
    }

    const userPrimitives = result.rows[0];
    const { last_login, ...user } = userPrimitives;

    return ok(
      UserEntity.fromPrimitives({
        ...user,
        lastLogin: new Date(last_login),
      }),
    );
  }

  @Application.Repo.Decorators.ReturnUnexpectedError()
  async save(
    user: UserEntity,
  ): Promise<Either<void, Application.Repo.Errors.Unexpected>> {
    const sqlStatement = `INSERT INTO ${this.tableName} (id, email, password, last_login) VALUES ($1, $2, $3, $4);`;
    const userPrimitives = user.toPrimitives();
    const { id, email, password, lastLogin } = userPrimitives;
    await this.connection.query(sqlStatement, [id, email, password, lastLogin]);
    this.domainEventBus.publish(user.domainEvents);
    return ok();
  }
}
