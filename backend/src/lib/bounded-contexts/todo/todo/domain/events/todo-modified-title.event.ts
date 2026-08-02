import { Domain } from 'ddd-tactical-core-boilerplate';

type TodoModifiedTitleDomainEventProps = Domain.TDomainEventProps<{
  userId: string;
  title: string;
  completed: boolean;
}>;

export class TodoModifiedTitleDomainEvent extends Domain.DomainEvent<TodoModifiedTitleDomainEventProps> {
  public aggregateId: any;

  constructor(payload: TodoModifiedTitleDomainEventProps) {
    super('Todo', payload);
    this.aggregateId = payload.aggregateId;
  }
}
