import { DynamicModule, Global, Inject, Logger, Module } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { constants } from './mongo.constants';
import { MongoModuleAsyncOptions, MongoModuleOptions } from './interfaces';

@Global()
@Module({})
export class MongoModule {
  constructor(
    @Inject(constants.MONGO_DB_CLIENT) private mongoDbClient: MongoClient,
  ) {}
  static forRoot(options: MongoModuleOptions): DynamicModule {
    return {
      module: MongoModule,
      providers: [
        Logger,
        {
          provide: constants.MONGO_DB_CLIENT,
          useFactory: (): MongoClient =>
            new MongoClient(options.url, options.options),
        },
        {
          provide: constants.MONGO_DB_CONNECTION,
          useFactory: async (client: MongoClient) => {
            try {
              // mongodb://localhost:27017
              const connection = await client.connect();
              console.log('*** After connect');
              return connection;
            } catch (error) {
              console.log('*** In error');
              throw error;
            }
          },
          inject: [constants.MONGO_DB_CLIENT],
        },
      ],
      exports: [constants.MONGO_DB_CLIENT, constants.MONGO_DB_CONNECTION],
    };
  }
  // static forRootAsync(options: PostgresModuleAsyncOptions): DynamicModule {
  //   const poolProvider: Provider<any> = {
  //     provide: POSTGRES_DB_CONNECTION,
  //     useFactory: async (...args: any[]) => {
  //       const poolConfig = await options.useFactory(...args);
  //       return new Pool(poolConfig);
  //     },
  //     inject: options.inject || [],
  //   };
  //   return {
  //     module: PostgresCoreModule,
  //     providers: [poolProvider],
  //     exports: [poolProvider],
  //   };
  // }

  static forRootAsync(
    options: MongoModuleAsyncOptions,
    // options: MongoModuleOptions,
  ): DynamicModule {
    return {
      module: MongoModule,
      imports: options.imports || [],
      providers: [
        {
          provide: constants.MONGO_DB_CLIENT,
          useFactory: async (...args: any[]) => {
            const mongoModuleOptions = await options.useFactory(...args);
            return new MongoClient(mongoModuleOptions.url, {
              ...mongoModuleOptions.options,
            });
          },
          inject: options.inject || [],
        },
        {
          provide: constants.MONGO_DB_CONNECTION,
          useFactory: async (client: MongoClient) => {
            try {
              // mongodb://localhost:27017
              const connection = await client.connect();
              console.log('*** After connect');
              return connection;
            } catch (error) {
              console.log('*** In error');
              throw error;
            }
          },
          inject: [constants.MONGO_DB_CLIENT],
        },
      ],
      exports: [constants.MONGO_DB_CLIENT, constants.MONGO_DB_CONNECTION],
    };
  }

  async onModuleDestroy() {
    await this.mongoDbClient.close();
  }
}
