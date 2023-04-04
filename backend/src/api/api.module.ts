import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './authentication.controller';
import { TodoController } from './todo.rest.controller';
import { TodoGrpcController } from './todo.grpc.controller';
import {
  JetstreamModule,
  NatsStreamingIntegrationEventBus,
  NatsStreamingMessageBus,
} from '@bitloops/bl-boilerplate-infra-nest-jetstream';
import configuration from '@src/config/configuration';
import authConfiguration, {
  AuthEnvironmentVariables,
} from '@src/config/auth.configuration';
import { AuthModule } from '@bitloops/bl-boilerplate-infra-nest-auth-passport';
import {
  // CorrelationIdMiddleware,
  TracingModule,
} from '@bitloops/bl-boilerplate-infra-telemetry';

@Module({
  imports: [
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

    TracingModule.register({
      messageBus: NatsStreamingMessageBus,
    }),
  ],
  controllers: [AuthController, TodoController, TodoGrpcController],
})
// implements NestModule
export class ApiModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  // }
}
