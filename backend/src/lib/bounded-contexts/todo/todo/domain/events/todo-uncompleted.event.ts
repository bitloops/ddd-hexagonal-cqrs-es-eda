import { Domain, asyncLocalStorage } from '@bitloops/bl-boilerplate-core';

type TodoUncompletedDomainEventProps = {
  userId: string;
  title: string;
  completed: boolean;
} & { aggregateId: string };

export class TodoUncompletedDomainEvent
  implements Domain.IDomainEvent<TodoUncompletedDomainEventProps>
{
  public aggregateId: any;
  public metadata: Domain.TDomainEventMetadata;

  constructor(public readonly payload: TodoUncompletedDomainEventProps) {
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
