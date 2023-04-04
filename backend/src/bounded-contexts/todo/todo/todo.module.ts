import { Module } from '@nestjs/common';
import { TodoWriteRepository } from './repository/todo-write.repository';
import { TodoReadRepository } from './repository/todo-read.repository';
import { TodoModule as LibTodoModule } from 'src/lib/bounded-contexts/todo/todo/todo.module';
import { TodoWriteRepoPortToken } from '@src/lib/bounded-contexts/todo/todo/ports/TodoWriteRepoPort';
import { TodoReadRepoPortToken } from '@src/lib/bounded-contexts/todo/todo/ports/TodoReadRepoPort';
import { MongoModule } from '@bitloops/bl-boilerplate-infra-mongo';
import { PubSubCommandHandlers } from '@src/lib/bounded-contexts/todo/todo/application/command-handlers';
import { PubSubQueryHandlers } from '@src/lib/bounded-contexts/todo/todo/application/query-handlers';
import {
  StreamingDomainEventHandlers,
  StreamingIntegrationEventHandlers,
} from '@src/lib/bounded-contexts/todo/todo/application/event-handlers';
import {
  StreamingDomainEventBusToken,
  StreamingIntegrationEventBusToken,
  PubSubIntegrationEventBusToken,
} from '@src/lib/bounded-contexts/todo/todo/constants';
import {
  JetstreamModule,
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
];
@Module({
  imports: [
    LibTodoModule.register({
      imports: [
        MongoModule,
        JetstreamModule.forFeature({
          moduleOfHandlers: TodoModule,
          pubSubCommandHandlers: [...PubSubCommandHandlers],
          pubSubQueryHandlers: [...PubSubQueryHandlers],
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
