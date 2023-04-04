import {
  Domain,
  Infra,
  asyncLocalStorage,
} from '@bitloops/bl-boilerplate-core';
import { TodoUncompletedDomainEvent } from '../../domain/events/todo-uncompleted.event';

export type IntegrationSchemaV1 = {
  todoId: string;
  userId: string;
};

type IntegrationSchemas = IntegrationSchemaV1;
type ToIntegrationDataMapper = (
  data: TodoUncompletedDomainEvent,
) => IntegrationSchemas;

export class TodoUncompletedIntegrationEvent
  implements Infra.EventBus.IntegrationEvent<IntegrationSchemas>
{
  static versions = ['v1'];
  public static readonly boundedContextId = 'Todo';
  static versionMappers: Record<string, ToIntegrationDataMapper> = {
    v1: TodoUncompletedIntegrationEvent.toIntegrationDataV1,
  };
  public metadata: Infra.EventBus.TIntegrationEventMetadata;

  constructor(public payload: IntegrationSchemas, version: string) {
    this.metadata = {
      createdTimestamp: Date.now(),
      boundedContextId: TodoUncompletedIntegrationEvent.boundedContextId,
      context: asyncLocalStorage.getStore()?.get('context'),
      messageId: new Domain.UUIDv4().toString(),
      correlationId: asyncLocalStorage.getStore()?.get('correlationId'),
      version,
    };
  }

  static create(
    event: TodoUncompletedDomainEvent,
  ): TodoUncompletedIntegrationEvent[] {
    return TodoUncompletedIntegrationEvent.versions.map((version) => {
      const mapper = TodoUncompletedIntegrationEvent.versionMappers[version];
      const data = mapper(event);
      return new TodoUncompletedIntegrationEvent(data, version);
    });
  }

  static toIntegrationDataV1(
    event: TodoUncompletedDomainEvent,
  ): IntegrationSchemaV1 {
    return {
      todoId: event.payload.aggregateId,
      userId: event.payload.userId,
    };
  }
}
