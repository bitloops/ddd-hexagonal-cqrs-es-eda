import { Domain, asyncLocalStorage } from '@bitloops/bl-boilerplate-core';

type TodoCompletedDomainEventProps = {
  userId: string;
  title: string;
  completed: boolean;
} & { aggregateId: string };

export class TodoCompletedDomainEvent
  implements Domain.IDomainEvent<TodoCompletedDomainEventProps>
{
  public aggregateId: string;
  public metadata: Domain.TDomainEventMetadata;

  constructor(public readonly payload: TodoCompletedDomainEventProps) {
    const uuid = new Domain.UUIDv4();
    this.metadata = {
      boundedContextId: 'Todo',
      createdTimestamp: Date.now(),
      messageId: uuid.toString(),
      context: asyncLocalStorage.getStore()?.get('context'),
      correlationId: asyncLocalStorage.getStore()?.get('correlationId'),
    };
    this.aggregateId = payload.aggregateId;
  }
}
