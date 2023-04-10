import { Infra } from '@bitloops/bl-boilerplate-core';
import { TodoCompletedDomainEvent } from '../../domain/events/todo-completed.event';

export type IntegrationSchemaV1 = {
  todoId: string;
  userId: string;
};

type IntegrationSchemas = IntegrationSchemaV1;
type ToIntegrationDataMapper = (
  data: TodoCompletedDomainEvent,
) => IntegrationSchemas;

export class TodoCompletedIntegrationEvent extends Infra.EventBus
  .IntegrationEvent<IntegrationSchemas> {
  static versions = ['v1'];
  public static readonly boundedContextId = 'Todo';
  static versionMappers: Record<string, ToIntegrationDataMapper> = {
    v1: TodoCompletedIntegrationEvent.toIntegrationDataV1,
  };

  constructor(payload: IntegrationSchemas, version: string) {
    super('Todo', payload, version);
  }

  static create(
    event: TodoCompletedDomainEvent,
  ): TodoCompletedIntegrationEvent[] {
    return TodoCompletedIntegrationEvent.versions.map((version) => {
      const mapper = TodoCompletedIntegrationEvent.versionMappers[version];
      const data = mapper(event);
      return new TodoCompletedIntegrationEvent(data, version);
    });
  }

  static toIntegrationDataV1(
    event: TodoCompletedDomainEvent,
  ): IntegrationSchemaV1 {
    return {
      todoId: event.payload.aggregateId,
      userId: event.payload.userId,
    };
  }
}
