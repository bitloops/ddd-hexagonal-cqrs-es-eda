import { Domain } from '@bitloops/bl-boilerplate-core';
import { asyncLocalStorage } from '@bitloops/bl-boilerplate-core';

type TodoAddedDomainEventProps = {
  userId: string;
  title: string;
  completed: boolean;
} & { aggregateId: string };

export class TodoAddedDomainEvent
  implements Domain.IDomainEvent<TodoAddedDomainEventProps>
{
  public aggregateId: string;
  public readonly metadata: Domain.TDomainEventMetadata = {
    boundedContextId: 'Todo',
    createdTimestamp: Date.now(),
    messageId: new Domain.UUIDv4().toString(),
    correlationId: asyncLocalStorage.getStore()?.get('correlationId'),
    context: asyncLocalStorage.getStore()?.get('context'),
  };

  constructor(public readonly payload: TodoAddedDomainEventProps) {
    this.aggregateId = payload.aggregateId;
  }
}
