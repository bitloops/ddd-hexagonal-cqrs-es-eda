import { DynamicModule, Module, Type } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { UsersService } from './users/users.service';
import { UserRepoPortToken } from './users/user-repo.port';
import { JwtAuthModule } from './jwt/jwt.module';
import { UserPostgresRepository } from './users/user-repo';
import {
  PostgresModule,
  PostgresModuleAsyncOptions,
} from '@lib/infra/postgres';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import { JWTSecret, IntegrationEventBusToken } from './constants';
import { Infra } from '@bitloops/bl-boilerplate-core';

@Module({
  imports: [PassportModule],
  providers: [
    AuthService,
    LocalStrategy,
    UsersService,
    { provide: UserRepoPortToken, useClass: UserPostgresRepository },
  ],
  exports: [AuthService],
})
export class AuthModule {
  static forRootAsync({
    jwtOptions,
    postgresOptions,
    integrationEventBus,
  }: {
    jwtOptions: JwtModuleAsyncOptions;
    postgresOptions: PostgresModuleAsyncOptions;
    integrationEventBus: Type<Infra.EventBus.IEventBus>;
  }): DynamicModule {
    const jwtSecretProvider = {
      provide: JWTSecret,
      useFactory: async (...args: any[]) => {
        if (!jwtOptions.useFactory) {
          throw new Error('No useFactory function provided');
        }
        return ((await jwtOptions.useFactory(...args)) as any).secret;
      },
      inject: jwtOptions.inject,
    };
    const integrationEventBusProvider = {
      provide: IntegrationEventBusToken,
      useClass: integrationEventBus,
    };

    return {
      module: AuthModule,
      imports: [
        JwtAuthModule.registerAsync(jwtOptions),
        PostgresModule.forRootAsync(postgresOptions),
        PostgresModule.forFeature(
          `-- DROP TABLE users;
          CREATE TABLE IF NOT EXISTS users (
            "id" UUID,
            "email" VARCHAR(100) NOT NULL,
            "password" VARCHAR(100) NOT NULL,
            "last_login" TIMESTAMP,
            PRIMARY KEY ("id")
          );`,
        ),
      ],
      providers: [jwtSecretProvider, integrationEventBusProvider],
      exports: [jwtSecretProvider],
    };
  }
}
