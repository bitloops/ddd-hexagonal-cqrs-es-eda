import { Infra } from '@bitloops/bl-boilerplate-core';
import { TodoDeletedDomainEvent } from '../../domain/events/todo-deleted.event';

export type IntegrationSchemaV1 = {
  todoId: string;
  userId: string;
};

type IntegrationSchemas = IntegrationSchemaV1;
type ToIntegrationDataMapper = (
  data: TodoDeletedDomainEvent,
) => IntegrationSchemas;

export class TodoDeletedIntegrationEvent extends Infra.EventBus
  .IntegrationEvent<IntegrationSchemas> {
  static versions = ['v1'];
  public static readonly boundedContextId = 'Todo';
  static versionMappers: Record<string, ToIntegrationDataMapper> = {
    v1: TodoDeletedIntegrationEvent.toIntegrationDataV1,
  };
  public metadata: Infra.EventBus.TIntegrationEventMetadata;

  constructor(payload: IntegrationSchemas, version: string) {
    super('Todo', payload, version);
  }

  static create(event: TodoDeletedDomainEvent): TodoDeletedIntegrationEvent[] {
    return TodoDeletedIntegrationEvent.versions.map((version) => {
      const mapper = TodoDeletedIntegrationEvent.versionMappers[version];
      const data = mapper(event);
      return new TodoDeletedIntegrationEvent(data, version);
    });
  }

  static toIntegrationDataV1(
    event: TodoDeletedDomainEvent,
  ): IntegrationSchemaV1 {
    return {
      todoId: event.payload.aggregateId,
      userId: event.payload.userId,
    };
  }
}
