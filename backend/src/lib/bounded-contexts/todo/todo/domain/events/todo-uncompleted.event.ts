import { Domain } from '@bitloops/bl-boilerplate-core';

type TodoUncompletedDomainEventProps = {
  userId: string;
  title: string;
  completed: boolean;
} & { aggregateId: string };

export class TodoUncompletedDomainEvent extends Domain.DomainEvent<TodoUncompletedDomainEventProps> {
  public aggregateId: any;

  constructor(payload: TodoUncompletedDomainEventProps) {
    super('Todo', payload);
    this.aggregateId = payload.aggregateId;
  }
}
