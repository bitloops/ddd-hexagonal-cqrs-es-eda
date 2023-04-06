import { Domain } from '@bitloops/bl-boilerplate-core';

type TodoAddedDomainEventProps = {
  userId: string;
  title: string;
  completed: boolean;
} & { aggregateId: string };

export class TodoAddedDomainEvent extends Domain.DomainEvent<TodoAddedDomainEventProps> {
  public aggregateId: string;

  constructor(payload: TodoAddedDomainEventProps) {
    super('Todo', payload);
    this.aggregateId = payload.aggregateId;
  }
}
