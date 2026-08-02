import { Domain } from 'ddd-tactical-core-boilerplate';

type TodoUncompletedDomainEventProps = Domain.TDomainEventProps<{
  userId: string;
  title: string;
  completed: boolean;
}>;

export class TodoUncompletedDomainEvent extends Domain.DomainEvent<TodoUncompletedDomainEventProps> {
  public aggregateId: any;

  constructor(payload: TodoUncompletedDomainEventProps) {
    super('Todo', payload);
    this.aggregateId = payload.aggregateId;
  }
}
