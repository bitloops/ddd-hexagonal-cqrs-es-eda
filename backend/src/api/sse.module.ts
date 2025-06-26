import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TodoSSEController } from './todo.sse.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@lib/infra/nest-auth-passport';
import configuration from '@src/config/configuration';
import authConfiguration, {
  AuthEnvironmentVariables,
} from '@src/config/auth.configuration';
import { ConfigService } from '@nestjs/config';
import {
  JetstreamModule,
  NatsStreamingIntegrationEventBus,
} from '@lib/infra/nest-jetstream';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      // Set this to true to use wildcards
      wildcard: false,
      // The delimiter used to segment namespaces
      delimiter: '.',
      // Set this to `true` if you want to emit the newListener event
      newListener: false,
      // Set this to `true` if you want to emit the removeListener event
      removeListener: false,
      // The maximum amount of listeners that can be assigned to an event
      maxListeners: 10,
      // Show event name in memory leak message when more than maximum amount of listeners is assigned
      verboseMemoryLeak: false,
      // Disable throwing uncaughtException if an error event is emitted and it has no listeners
      ignoreErrors: false,
    }),
    ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.development.env', // TODO make dynamic
          load: [configuration, authConfiguration],
        }),
        AuthModule.forRootAsync({
          jwtOptions: {
            useFactory: (
              configService: ConfigService<AuthEnvironmentVariables, true>,
            ) => ({
              secret: configService.get('jwtSecret'),
              signOptions: {
                expiresIn: `${configService.get('JWT_LIFETIME_SECONDS')}s`,
              },
            }),
            inject: [ConfigService],
          },
          postgresOptions: {
            useFactory: (
              configService: ConfigService<AuthEnvironmentVariables, true>,
            ) => ({
              database: configService.get('database.database', { infer: true }),
              host: configService.get('database.host', { infer: true }),
              port: configService.get('database.port', { infer: true }),
              user: configService.get('database.user', { infer: true }),
              password: configService.get('database.password', { infer: true }),
              max: 20,
            }),
            inject: [ConfigService],
          },
          // TODO fix this
          integrationEventBus: NatsStreamingIntegrationEventBus as any,
        }),
        JetstreamModule.forRoot({
          servers: [
            `nats://${process.env.NATS_HOST ?? 'localhost'}:${
              process.env.NATS_PORT ?? 4222
            }`,
          ],
        }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class SSEModule {}
