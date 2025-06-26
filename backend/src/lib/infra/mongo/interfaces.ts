import { ModuleMetadata } from '@nestjs/common';
import { MongoClientOptions } from 'mongodb';

export interface MongoModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (
    ...args: any[]
  ) => Promise<MongoModuleOptions> | MongoModuleOptions;
  inject?: any[];
}

export interface MongoModuleOptions {
  url: string;
  options?: MongoClientOptions;
}
