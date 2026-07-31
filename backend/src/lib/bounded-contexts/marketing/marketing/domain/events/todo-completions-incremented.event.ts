import { Domain } from '@bitloops/bl-boilerplate-core';

export type TodoCompletionsIncrementedDomainEventProps =
  Domain.TDomainEventProps<{
    completedTodos: number;
  }>;

export class TodoCompletionsIncrementedDomainEvent extends Domain.DomainEvent<TodoCompletionsIncrementedDomainEventProps> {
  public aggregateId: string;

  constructor(payload: TodoCompletionsIncrementedDomainEventProps) {
    super('Marketing', payload);
    this.aggregateId = payload.aggregateId;
  }
}
