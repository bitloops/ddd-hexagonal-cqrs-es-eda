import { Module } from '@nestjs/common';
import { TodoWriteRepository } from './repository/todo-write.repository';
import { TodoReadRepository } from './repository/todo-read.repository';
import { TodoModule as LibTodoModule } from 'src/lib/bounded-contexts/todo/todo/todo.module';
import { PostgresModule } from '@lib/infra/postgres';
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
} from '@lib/infra/nest-jetstream';
import { TodoOutboxRelay } from './repository/todo-outbox.relay';
import { TODO_POSTGRES_SCHEMA } from './repository/todo-postgres.schema';

const providers = [
  TodoOutboxRelay,
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
        PostgresModule,
        PostgresModule.forFeature(TODO_POSTGRES_SCHEMA),
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
