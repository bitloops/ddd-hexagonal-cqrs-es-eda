import { Module } from '@nestjs/common';
import { TodoModule } from './bounded-contexts/todo/todo/todo.module';
import { MarketingModule } from './bounded-contexts/marketing/marketing/marketing.module';
import {
  JetstreamModule,
  NatsStreamingMessageBus,
} from '@lib/infra/nest-jetstream';
import { PostgresModule } from '@lib/infra/postgres';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import authConfiguration from './config/auth.configuration';
import { TracingModule } from '@lib/infra/telemetry';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.ENV_FILE || '.development.env',
      load: [configuration, authConfiguration],
    }),
    JetstreamModule.forRoot({
      servers: [
        `nats://${process.env.NATS_HOST ?? 'localhost'}:${
          process.env.NATS_PORT ?? 4222
        }`,
      ],
    }),
    PostgresModule.forRoot({
      database: process.env.PG_DATABASE ?? 'bitloops',
      host: process.env.PG_HOST ?? 'localhost',
      port: process.env.PG_PORT ? +process.env.PG_PORT : 5432,
      user: process.env.PG_USER ?? 'user',
      password: process.env.PG_PASSWORD ?? 'postgres',
      max: 20,
    }),
    TodoModule,
    MarketingModule,
    TracingModule.register({
      messageBus: NatsStreamingMessageBus,
    }),
  ],
})
export class AppModule {}
