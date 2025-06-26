import { Module, DynamicModule, Provider, Inject, Global } from '@nestjs/common';
import { Pool, PoolConfig } from 'pg';
import { constants } from './postgres.constants';
import { PostgresModuleAsyncOptions } from './postgres.module';

const POSTGRES_DB_CONNECTION = constants.pg_connection;
@Global()
@Module({})
export class PostgresCoreModule {
  constructor(@Inject(POSTGRES_DB_CONNECTION) private pool: Pool) {}
  static forRoot(options: PoolConfig): DynamicModule {
    const poolProvider: Provider<any> = {
      provide: POSTGRES_DB_CONNECTION,
      useFactory: () => new Pool(options),
    };
    return {
      module: PostgresCoreModule,
      providers: [poolProvider],
      exports: [poolProvider],
    };
  }

  static forRootAsync(options: PostgresModuleAsyncOptions): DynamicModule {
    const poolProvider: Provider<any> = {
      provide: POSTGRES_DB_CONNECTION,
      useFactory: async (...args: any[]) => {
        const poolConfig = await options.useFactory(...args);
        return new Pool(poolConfig);
      },
      inject: options.inject || [],
    };
    return {
      module: PostgresCoreModule,
      providers: [poolProvider],
      exports: [poolProvider],
    };
  }

  static forFeature(sqlStatement: string): DynamicModule {
    const createTableIfNotExists: Provider<any> = {
      provide: 'CREATE_TABLE_IF_NOT_EXISTS',
      useFactory: async (pool: Pool) => {
        const client = await pool.connect();
        try {
          const res = await client.query(sqlStatement);
          // console.log('queryResult: ', res);
        } catch (error) {
          console.log('postgres statement error:', error);
        } finally {
          client.release();
        }
      },
      inject: [{ token: POSTGRES_DB_CONNECTION, optional: false }],
    };
    return {
      module: PostgresCoreModule,
      providers: [createTableIfNotExists],
    };

    // Get pg connection and run sql statement on it
  }
}
