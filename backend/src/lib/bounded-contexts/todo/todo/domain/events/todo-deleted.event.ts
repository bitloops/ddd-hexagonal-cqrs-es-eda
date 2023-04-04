import { Domain } from '@bitloops/bl-boilerplate-core';
import { asyncLocalStorage } from '@bitloops/bl-boilerplate-core';

type TodoDeletedDomainEventProps = {
  userId: string;
  title: string;
  completed: boolean;
} & { aggregateId: string };

export class TodoDeletedDomainEvent
  implements Domain.IDomainEvent<TodoDeletedDomainEventProps>
{
  public aggregateId: any;
  public metadata: Domain.TDomainEventMetadata;

  constructor(public readonly payload: TodoDeletedDomainEventProps) {
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
