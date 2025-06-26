import { Module, DynamicModule, Inject, ModuleMetadata } from '@nestjs/common';

import { Pool, PoolConfig } from 'pg';
import { PostgresCoreModule } from './postgres-core.module';
import { constants } from './postgres.constants';

export interface PostgresModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  // useExisting?: Type<JwtOptionsFactory>;
  // useClass?: Type<JwtOptionsFactory>;
  useFactory: (...args: any[]) => Promise<PoolConfig> | PoolConfig;
  inject?: any[];
}

@Module({})
export class PostgresModule {
  constructor(@Inject(constants.pg_connection) private pool: Pool) {}
  static forRoot(options: PoolConfig): DynamicModule {
    return {
      module: PostgresModule,
      imports: [PostgresCoreModule.forRoot(options)],
    };
  }

  static forRootAsync(options: PostgresModuleAsyncOptions): DynamicModule {
    return {
      module: PostgresModule,
      imports: [PostgresCoreModule.forRootAsync(options)],
    };
  }

  static forFeature(sqlStatement: string): DynamicModule {
    return {
      module: PostgresModule,
      imports: [PostgresCoreModule.forFeature(sqlStatement)],
    };
    // return {
    //   module: PostgresModule,
    // };
  }
}
