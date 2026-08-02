import { Domain } from 'ddd-tactical-core-boilerplate';

type TodoCompletedDomainEventProps = Domain.TDomainEventProps<{
  userId: string;
  title: string;
  completed: boolean;
}>;

export class TodoCompletedDomainEvent extends Domain.DomainEvent<TodoCompletedDomainEventProps> {
  public aggregateId: string;

  constructor(payload: TodoCompletedDomainEventProps) {
    super('Todo', payload);
    this.aggregateId = payload.aggregateId;
  }
}
