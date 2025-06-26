import { Application, Either, ok, fail, Infra } from '@bitloops/bl-boilerplate-core';
import { Injectable, Inject } from '@nestjs/common';
import { constants } from '../../postgres';
import { UserRepoPort } from './user-repo.port';
import { UserRegisteredIntegrationEvent } from './user-registered.integration-event';
import { User } from './user.model';
import { IntegrationEventBusToken } from '../constants';

@Injectable()
export class UserPostgresRepository implements UserRepoPort {
  private readonly tableName = 'users';
  constructor(
    @Inject(constants.pg_connection) private readonly connection: any,
    @Inject(IntegrationEventBusToken)
    private readonly integrationEventBus: Infra.EventBus.IEventBus,
  ) {}

  async getByEmail(email: string): Promise<User | null> {
    const result = await this.connection.query(`SELECT * FROM ${this.tableName} WHERE email = $1`, [
      email,
    ]);

    if (!result.rows.length) {
      return null;
    }

    const user = result.rows[0];

    return user;
  }

  async checkDoesNotExistAndCreate(
    user: User,
  ): Promise<Either<void, Application.Repo.Errors.Conflict | Application.Repo.Errors.Unexpected>> {
    // note: we don't try/catch this because if connecting throws an exception
    // we don't need to dispose of the client (it will be undefined)
    const client = await this.connection.connect();

    try {
      await client.query('BEGIN');

      const userExistsQuery = `SELECT * FROM ${this.tableName} WHERE email = $1`;
      const res = await client.query(userExistsQuery, [user.email]);
      if (res.rows.length > 0) {
        throw new Application.Repo.Errors.Conflict(user.email);
      }

      const insertUserText = `INSERT INTO ${this.tableName} (id, email, password) VALUES ($1, $2, $3);`;

      const { id, email, password } = user;
      const insertUserValues = [id, email, password];
      await this.connection.query(insertUserText, insertUserValues);
      await client.query('COMMIT');

      const event = new UserRegisteredIntegrationEvent({ userId: id!, email });
      this.integrationEventBus.publish(event);
      return ok();
    } catch (e: any) {
      await client.query('ROLLBACK');
      if (e instanceof Application.Repo.Errors.Conflict) {
        return fail(e);
      }
      console.log('Error in transaction:', e);
      return fail(new Application.Repo.Errors.Unexpected(e.message));
    } finally {
      client.release();
    }
  }
}
