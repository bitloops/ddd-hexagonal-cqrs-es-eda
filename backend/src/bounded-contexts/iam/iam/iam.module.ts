import { Module } from '@nestjs/common';

import { IamModule as LibIamModule } from 'src/lib/bounded-contexts/iam/authentication/iam.module';
import { MongoModule } from '@bitloops/bl-boilerplate-infra-mongo';
import { PostgresModule } from '@bitloops/bl-boilerplate-infra-postgres';
import { UserWriteRepoPortToken } from '@src/lib/bounded-contexts/iam/authentication/ports/UserWriteRepoPort';
import { PubSubCommandHandlers } from '@src/lib/bounded-contexts/iam/authentication/application/command-handlers';
import {
  JetstreamModule,
  NatsStreamingDomainEventBus,
  NatsStreamingIntegrationEventBus,
} from '@bitloops/bl-boilerplate-infra-nest-jetstream';
import { StreamingDomainEventHandlers } from '@src/lib/bounded-contexts/iam/authentication/application/event-handlers';
import {
  StreamingDomainEventBusToken,
  StreamingIntegrationEventBusToken,
} from '@src/lib/bounded-contexts/iam/authentication/constants';
import { UserWritePostgresRepository } from './repository/user-write.pg.repository';

const providers = [
  {
    provide: UserWriteRepoPortToken,
    useClass: UserWritePostgresRepository,
  },
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
      imports: [MongoModule, PostgresModule],
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
