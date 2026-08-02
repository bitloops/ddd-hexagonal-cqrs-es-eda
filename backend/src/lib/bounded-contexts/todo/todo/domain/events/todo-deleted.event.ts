import { Domain } from 'ddd-tactical-core-boilerplate';

type TodoDeletedDomainEventProps = Domain.TDomainEventProps<{
  userId: string;
  title: string;
  completed: boolean;
}>;

export class TodoDeletedDomainEvent extends Domain.DomainEvent<TodoDeletedDomainEventProps> {
  public aggregateId: any;

  constructor(payload: TodoDeletedDomainEventProps) {
    super('Todo', payload);
    this.aggregateId = payload.aggregateId;
  }
}
