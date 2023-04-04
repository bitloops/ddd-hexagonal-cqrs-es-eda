import {
  Domain,
  Infra,
  asyncLocalStorage,
} from '@bitloops/bl-boilerplate-core';
import { TodoModifiedTitleDomainEvent } from '../../domain/events/todo-modified-title.event';
import { TodoEntity } from '../../domain/TodoEntity';

export type IntegrationSchemaV1 = {
  todoId: string;
  userId: string;
  title: string;
};

type IntegrationSchemas = IntegrationSchemaV1;
type ToIntegrationDataMapper = (
  data: TodoModifiedTitleDomainEvent,
) => IntegrationSchemas;

export class TodoModifiedTitleIntegrationEvent
  implements Infra.EventBus.IntegrationEvent<IntegrationSchemas>
{
  static versions = ['v1'];
  public static readonly boundedContextId = 'Todo';
  static versionMappers: Record<string, ToIntegrationDataMapper> = {
    v1: TodoModifiedTitleIntegrationEvent.toIntegrationDataV1,
  };
  public metadata: Infra.EventBus.TIntegrationEventMetadata;

  constructor(public payload: IntegrationSchemas, version: string) {
    this.metadata = {
      createdTimestamp: Date.now(),
      boundedContextId: TodoModifiedTitleIntegrationEvent.boundedContextId,
      context: asyncLocalStorage.getStore()?.get('context'),
      messageId: new Domain.UUIDv4().toString(),
      correlationId: asyncLocalStorage.getStore()?.get('correlationId'),
      version,
    };
  }

  static create(
    event: TodoModifiedTitleDomainEvent,
  ): TodoModifiedTitleIntegrationEvent[] {
    return TodoModifiedTitleIntegrationEvent.versions.map((version) => {
      const mapper = TodoModifiedTitleIntegrationEvent.versionMappers[version];
      const data = mapper(event);
      return new TodoModifiedTitleIntegrationEvent(data, version);
    });
  }

  static toIntegrationDataV1(
    event: TodoModifiedTitleDomainEvent,
  ): IntegrationSchemaV1 {
    return {
      todoId: event.payload.aggregateId,
      title: event.payload.title,
      userId: event.payload.userId,
    };
  }
}
