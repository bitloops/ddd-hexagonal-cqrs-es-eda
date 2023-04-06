import { Domain } from '@bitloops/bl-boilerplate-core';

export type TodoCompletionsIncrementedDomainEventProps = {
  completedTodos: number;
} & {
  aggregateId: string;
};

export class TodoCompletionsIncrementedDomainEvent extends Domain.DomainEvent<TodoCompletionsIncrementedDomainEventProps> {
  public metadata: Domain.TDomainEventMetadata;
  public aggregateId: string;

  constructor(payload: TodoCompletionsIncrementedDomainEventProps) {
    super('Marketing', payload);
    this.aggregateId = payload.aggregateId;
  }
}
