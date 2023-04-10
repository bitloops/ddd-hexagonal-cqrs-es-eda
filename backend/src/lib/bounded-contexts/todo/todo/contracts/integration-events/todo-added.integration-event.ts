import { Domain, Infra } from '@bitloops/bl-boilerplate-core';
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

export class TodoAddedIntegrationEvent extends Infra.EventBus
  .IntegrationEvent<IntegrationSchemas> {
  static versions = ['v1'];
  public static readonly boundedContextId = 'Todo';
  static versionMappers: Record<string, ToIntegrationDataMapper> = {
    v1: TodoAddedIntegrationEvent.toIntegrationDataV1,
  };

  constructor(payload: IntegrationSchemas, version: string) {
    super('Todo', payload, version);
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
