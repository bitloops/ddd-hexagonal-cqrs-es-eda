import {
  asyncLocalStorage,
  Domain,
  Infra,
} from '@bitloops/bl-boilerplate-core';
import { TodoAddedDomainEvent } from '../../domain/events/todo-added.event';

export type IntegrationSchemaV1 = {
  todoId: string;
  title: string;
  userId: string;
};

type IntegrationSchemas = IntegrationSchemaV1;
type ToIntegrationDataMapper = (
  data: TodoAddedDomainEvent,
) => IntegrationSchemas;

export class TodoAddedIntegrationEvent
  implements Infra.EventBus.IntegrationEvent<IntegrationSchemas>
{
  static versions = ['v1'];
  public static readonly boundedContextId = 'Todo';
  static versionMappers: Record<string, ToIntegrationDataMapper> = {
    v1: TodoAddedIntegrationEvent.toIntegrationDataV1,
  };
  public metadata: Infra.EventBus.TIntegrationEventMetadata;

  constructor(public payload: IntegrationSchemas, version: string) {
    this.metadata = {
      boundedContextId: TodoAddedIntegrationEvent.boundedContextId,
      version,
      context: asyncLocalStorage.getStore()?.get('context'),
      messageId: new Domain.UUIDv4().toString(),
      correlationId: asyncLocalStorage.getStore()?.get('correlationId'),
      createdTimestamp: Date.now(),
    };
  }

  static create(event: TodoAddedDomainEvent): TodoAddedIntegrationEvent[] {
    return TodoAddedIntegrationEvent.versions.map((version) => {
      const mapper = TodoAddedIntegrationEvent.versionMappers[version];
      const data = mapper(event);
      return new TodoAddedIntegrationEvent(data, version);
    });
  }

  static toIntegrationDataV1(event: TodoAddedDomainEvent): IntegrationSchemaV1 {
    return {
      todoId: event.payload.aggregateId,
      title: event.payload.title,
      userId: event.payload.userId,
    };
  }

  static getEventTopic(version?: string) {
    const topic = `integration.${TodoAddedIntegrationEvent.name}`;

    const eventTopic = version === undefined ? topic : `${topic}.${version}`;
    return eventTopic;
  }
}
