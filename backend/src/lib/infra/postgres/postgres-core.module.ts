import { Module, DynamicModule, Global, Provider } from '@nestjs/common';
import { Pool, PoolConfig } from 'pg';
import { constants } from './postgres.constants';
import { PostgresModuleAsyncOptions } from './postgres.module';

const POSTGRES_DB_CONNECTION = constants.pg_connection;
@Global()
@Module({})
export class PostgresCoreModule {
  static forRoot(options: PoolConfig): DynamicModule {
    const poolProvider: Provider<Pool> = {
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
    const poolProvider: Provider<Pool> = {
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
    const createTableIfNotExists: Provider = {
      provide: Symbol('POSTGRES_SCHEMA_INITIALISER'),
      useFactory: async (pool: Pool) => {
        await pool.query(sqlStatement);
      },
      inject: [{ token: POSTGRES_DB_CONNECTION, optional: false }],
    };
    return {
      module: PostgresCoreModule,
      providers: [createTableIfNotExists],
    };
  }
}
