import { Domain } from '@bitloops/bl-boilerplate-core';

type TodoDeletedDomainEventProps = {
  userId: string;
  title: string;
  completed: boolean;
} & { aggregateId: string };

export class TodoDeletedDomainEvent extends Domain.DomainEvent<TodoDeletedDomainEventProps> {
  public aggregateId: any;

  constructor(payload: TodoDeletedDomainEventProps) {
    super('Todo', payload);
    this.aggregateId = payload.aggregateId;
  }
}
