import { Module } from '@nestjs/common';
import { TodoWriteRepository } from './repository/todo-write.repository';
import { TodoReadRepository } from './repository/todo-read.repository';
import { TodoModule as LibTodoModule } from 'src/lib/bounded-contexts/todo/todo/todo.module';
import { MongoModule } from '@bitloops/bl-boilerplate-infra-mongo';
import { PubSubCommandHandlers } from '@src/lib/bounded-contexts/todo/todo/application/command-handlers';
import { QueryHandlers } from '@src/lib/bounded-contexts/todo/todo/application/query-handlers';
import { StreamingIntegrationEventHandlers } from '@src/lib/bounded-contexts/todo/todo/application/event-handlers/integration';
import { StreamingDomainEventHandlers } from '@src/lib/bounded-contexts/todo/todo/application/event-handlers/domain';
import {
  StreamingCommandBusToken,
  StreamingDomainEventBusToken,
  StreamingIntegrationEventBusToken,
  PubSubIntegrationEventBusToken,
  TodoWriteRepoPortToken,
  TodoReadRepoPortToken,
} from '@src/lib/bounded-contexts/todo/todo/constants';
import {
  JetstreamModule,
  NatsStreamingCommandBus,
  NatsStreamingDomainEventBus,
  NatsStreamingIntegrationEventBus,
  NatsPubSubIntegrationEventsBus,
} from '@bitloops/bl-boilerplate-infra-nest-jetstream';

const providers = [
  {
    provide: TodoWriteRepoPortToken,
    useClass: TodoWriteRepository,
  },
  {
    provide: TodoReadRepoPortToken,
    useClass: TodoReadRepository,
  },
  {
    provide: StreamingIntegrationEventBusToken,
    useClass: NatsStreamingIntegrationEventBus,
  },
  {
    provide: StreamingDomainEventBusToken,
    useClass: NatsStreamingDomainEventBus,
  },
  {
    provide: PubSubIntegrationEventBusToken,
    useClass: NatsPubSubIntegrationEventsBus,
  },
  {
    provide: StreamingCommandBusToken,
    useClass: NatsStreamingCommandBus,
  },
];
@Module({
  imports: [
    LibTodoModule.register({
      imports: [
        MongoModule,
        JetstreamModule.forFeature({
          moduleOfHandlers: TodoModule,
          pubSubCommandHandlers: [...PubSubCommandHandlers],
          pubSubQueryHandlers: [...QueryHandlers],
          streamingDomainEventHandlers: [...StreamingDomainEventHandlers],
          streamingIntegrationEventHandlers: [
            ...StreamingIntegrationEventHandlers,
          ],
        }),
      ],
      inject: [...providers],
    }),
  ],
  exports: [LibTodoModule],
})
export class TodoModule {}
