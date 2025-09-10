import { Module } from '@nestjs/common';

import { AuthenticationModule as LibIamModule } from '@src/lib/bounded-contexts/iam/authentication/authentication.module';
// import { MongoModule } from '@lib/infra/mongo';
import { PostgresModule } from '@lib/infra/postgres';
import { PrismaModule } from '@lib/infra/prisma';
import { PubSubCommandHandlers } from '@src/lib/bounded-contexts/iam/authentication/application/command-handlers';
import {
  JetstreamModule,
  NatsStreamingDomainEventBus,
  NatsStreamingIntegrationEventBus,
} from '@lib/infra/nest-jetstream';
import { StreamingDomainEventHandlers } from '@src/lib/bounded-contexts/iam/authentication/application/event-handlers/domain';
import {
  StreamingDomainEventBusToken,
  StreamingIntegrationEventBusToken,
  UserWriteRepoPortToken,
} from '@src/lib/bounded-contexts/iam/authentication/constants';
import { UserWritePostgresRepository } from './repository/user-write.pg.repository';
import { UserWritePrismaRepository } from './repository/user-write.prisma.repository';
import { UserWriteRepositoryFactory, USER_WRITE_REPOSITORY_TOKEN } from './repository/user-write.repository.factory';

const providers = [
  // Repository implementations
  UserWritePostgresRepository,
  UserWritePrismaRepository,
  
  // Factory for choosing implementation
  UserWriteRepositoryFactory,
  {
    provide: UserWriteRepoPortToken,
    useFactory: (factory) => factory,
    inject: [USER_WRITE_REPOSITORY_TOKEN],
  },
  
  // Event bus implementations
  {
    provide: StreamingIntegrationEventBusToken,
    useClass: NatsStreamingIntegrationEventBus,
  },
  {
    provide: StreamingDomainEventBusToken,
    useClass: NatsStreamingDomainEventBus,
  },
];
@Module({
  imports: [
    LibIamModule.register({
      inject: [...providers],
      imports: [/* MongoModule, */ PostgresModule, PrismaModule],
    }),
    JetstreamModule.forFeature({
      moduleOfHandlers: IamModule,
      pubSubCommandHandlers: [...PubSubCommandHandlers],
      streamingDomainEventHandlers: [...StreamingDomainEventHandlers],
    }),
  ],
  exports: [LibIamModule],
})
export class IamModule {}
