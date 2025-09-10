import { Module } from '@nestjs/common';

import { MarketingModule as LibMarketingModule } from 'src/lib/bounded-contexts/marketing/marketing/marketing.module';
import { MockUserWriteRepository } from './repository/mock-user-write.repository';
import { MockNotificationTemplateReadRepository } from './repository/mock-notification-template.repository';
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
// import { MongoModule } from '@lib/infra/mongo';
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

const RepoProviders = [
  {
    provide: UserWriteRepoPortToken,
    useClass: MockUserWriteRepository,
  },
  {
    provide: NotificationTemplateReadRepoPortToken,
    useClass: MockNotificationTemplateReadRepository,
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
      imports: [/* MongoModule */],
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
