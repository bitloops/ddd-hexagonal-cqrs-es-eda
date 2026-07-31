import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './authentication.controller';
import { TodoController } from './todo.rest.controller';
import { TodoSSEController } from './todo.sse.controller';
import {
  JetstreamModule,
  NatsStreamingMessageBus,
} from '@lib/infra/nest-jetstream';
import configuration from '@src/config/configuration';
import authConfiguration, {
  AuthEnvironmentVariables,
} from '@src/config/auth.configuration';
import { IamModule } from '@src/bounded-contexts/iam/iam/iam.module';
import {
  // CorrelationIdMiddleware,
  TracingModule,
} from '@lib/infra/telemetry';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.development.env', // TODO make dynamic
      load: [configuration, authConfiguration],
    }),
    IamModule.forRootAsync({
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
    }),
    JetstreamModule.forRoot({
      servers: [
        `nats://${process.env.NATS_HOST ?? 'localhost'}:${
          process.env.NATS_PORT ?? 4222
        }`,
      ],
    }),
    TracingModule.register({
      messageBus: NatsStreamingMessageBus,
    }),
  ],
  controllers: [AuthController, TodoController, TodoSSEController],
})
// implements NestModule
export class ApiModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  // }
}
