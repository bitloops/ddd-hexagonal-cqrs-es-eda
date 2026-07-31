import { Module } from '@nestjs/common';

import { MarketingModule as LibMarketingModule } from 'src/lib/bounded-contexts/marketing/marketing/marketing.module';
import { UserWriteRepository } from './repository/user-write.repository';
import { NotificationTemplateReadRepository } from './repository/notification-template.repository';
import {
  EmailServicePortToken,
  NotificationTemplateReadRepoPortToken,
  PubSubIntegrationEventBusToken,
  StreamingCommandBusToken,
  StreamingDomainEventBusToken,
  StreamingIntegrationEventBusToken,
  UserWriteRepoPortToken,
} from '@src/lib/bounded-contexts/marketing/marketing/constants';
import { MockEmailService } from './service';
import { PostgresModule } from '@lib/infra/postgres';
import { StreamingIntegrationEventHandlers } from '@src/lib/bounded-contexts/marketing/marketing/application/event-handlers/integration';
import { StreamingCommandHandlers } from '@src/lib/bounded-contexts/marketing/marketing/application/command-handlers';
import {
  NatsStreamingCommandBus,
  JetstreamModule,
  NatsStreamingDomainEventBus,
  NatsStreamingIntegrationEventBus,
  NatsPubSubIntegrationEventsBus,
} from '@lib/infra/nest-jetstream';
import { StreamingDomainEventHandlers } from '@src/lib/bounded-contexts/marketing/marketing/application/event-handlers/domain';
import { MARKETING_POSTGRES_SCHEMA } from './repository/marketing-postgres.schema';

const RepoProviders = [
  {
    provide: UserWriteRepoPortToken,
    useClass: UserWriteRepository,
  },
  {
    provide: NotificationTemplateReadRepoPortToken,
    useClass: NotificationTemplateReadRepository,
  },
  {
    provide: EmailServicePortToken,
    useClass: MockEmailService,
  },
  {
    provide: StreamingCommandBusToken,
    useClass: NatsStreamingCommandBus,
  },
  {
    provide: StreamingDomainEventBusToken,
    useClass: NatsStreamingDomainEventBus,
  },
  {
    provide: StreamingIntegrationEventBusToken,
    useClass: NatsStreamingIntegrationEventBus,
  },
  {
    provide: PubSubIntegrationEventBusToken,
    useClass: NatsPubSubIntegrationEventsBus,
  },
];
@Module({
  imports: [
    LibMarketingModule.register({
      inject: [...RepoProviders],
      imports: [
        PostgresModule,
        PostgresModule.forFeature(MARKETING_POSTGRES_SCHEMA),
      ],
    }),
    JetstreamModule.forFeature({
      moduleOfHandlers: MarketingModule,
      streamingIntegrationEventHandlers: [...StreamingIntegrationEventHandlers],
      streamingDomainEventHandlers: [...StreamingDomainEventHandlers],
      streamingCommandHandlers: [...StreamingCommandHandlers],
    }),
  ],
  controllers: [],
  exports: [LibMarketingModule],
})
export class MarketingModule {}
