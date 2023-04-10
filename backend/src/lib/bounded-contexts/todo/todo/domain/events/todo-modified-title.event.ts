import { Domain } from '@bitloops/bl-boilerplate-core';

type TodoModifiedTitleDomainEventProps = Domain.TDomainEventProps<{
  userId: string;
  title: string;
  completed: boolean;
}>;

export class TodoModifiedTitleDomainEvent extends Domain.DomainEvent<TodoModifiedTitleDomainEventProps> {
  public aggregateId: any;
  public metadata: Domain.TDomainEventMetadata;

  constructor(payload: TodoModifiedTitleDomainEventProps) {
    super('Todo', payload);
    this.aggregateId = payload.aggregateId;
  }
}
