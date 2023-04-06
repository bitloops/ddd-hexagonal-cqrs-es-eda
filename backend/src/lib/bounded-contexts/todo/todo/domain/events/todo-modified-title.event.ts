import { Domain } from '@bitloops/bl-boilerplate-core';

type TodoModifiedTitleDomainEventProps = {
  userId: string;
  title: string;
  completed: boolean;
} & { aggregateId: string };

export class TodoModifiedTitleDomainEvent extends Domain.DomainEvent<TodoModifiedTitleDomainEventProps> {
  public aggregateId: any;
  public metadata: Domain.TDomainEventMetadata;

  constructor(payload: TodoModifiedTitleDomainEventProps) {
    super('Todo', payload);
    this.aggregateId = payload.aggregateId;
  }
}
