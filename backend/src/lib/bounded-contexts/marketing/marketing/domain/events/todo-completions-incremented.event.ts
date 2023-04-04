import { Domain, asyncLocalStorage } from '@bitloops/bl-boilerplate-core';

export type TodoCompletionsIncrementedDomainEventProps = {
  completedTodos: number;
} & {
  aggregateId: string;
};

export class TodoCompletionsIncrementedDomainEvent
  implements Domain.IDomainEvent<TodoCompletionsIncrementedDomainEventProps>
{
  public metadata: Domain.TDomainEventMetadata;
  public aggregateId: string;

  constructor(
    public readonly payload: TodoCompletionsIncrementedDomainEventProps,
  ) {
    const uuid = new Domain.UUIDv4();
    this.metadata = {
      boundedContextId: 'Marketing',
      createdTimestamp: Date.now(),
      context: asyncLocalStorage.getStore()?.get('context'),
      messageId: uuid.toString(),
      correlationId: asyncLocalStorage.getStore()?.get('correlationId'),
    };
    this.aggregateId = payload.aggregateId;
  }
}
