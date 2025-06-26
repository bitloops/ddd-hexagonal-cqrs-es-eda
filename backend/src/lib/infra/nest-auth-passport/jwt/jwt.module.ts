import { Module, DynamicModule } from '@nestjs/common';
import {
  JwtModuleOptions,
  JwtModule,
  JwtModuleAsyncOptions,
} from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { JWT_SECRET } from './constants';

@Module({})
export class JwtAuthModule {
  static register(options: JwtModuleOptions): DynamicModule {
    return {
      module: JwtAuthModule,
      imports: [JwtModule.register(options)],
      providers: [
        JwtStrategy,
        {
          provide: JWT_SECRET,
          useValue: options.secret,
        },
      ],
      exports: [JwtModule],
    };
  }

  static registerAsync(options: JwtModuleAsyncOptions): DynamicModule {
    return {
      module: JwtAuthModule,
      imports: [JwtModule.registerAsync(options)],
      providers: [
        JwtStrategy,
        {
          provide: JWT_SECRET,
          useFactory: async (...args: any[]) => {
            if (!options.useFactory) {
              throw new Error('No useFactory function provided');
            }
            return ((await options.useFactory(...args)) as any).secret;
          },
          inject: options.inject,
        },
      ],
      exports: [JwtModule],
    };
  }
}
