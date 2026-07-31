import { Domain } from '@bitloops/bl-boilerplate-core';

import { serialiseTodoEvent } from '@src/bounded-contexts/todo/todo/repository/todo-event-store';
import { TodoEntity } from '../../../domain/todo.entity';
import { TitleVO } from '../../../domain/title.value-object';
import { UserIdVO } from '../../../domain/user-id.value-object';

describe('Todo event sourcing', () => {
  it('rehydrates the aggregate state and version from its domain-event history', () => {
    const userId = new Domain.UUIDv4();
    const title = TitleVO.create({ title: 'Event-sourced todo' }).value as TitleVO;
    const todo = TodoEntity.create({
      userId: UserIdVO.create({ id: userId }).value as UserIdVO,
      title,
      completed: false,
    }).value as TodoEntity;

    const added = serialiseTodoEvent(
      todo.domainEvents[0] as Domain.DomainEvent<{
        aggregateId: string;
        userId: string;
        title: string;
        completed: boolean;
      }>,
      1,
    );
    todo.commit(1);
    todo.complete();
    const completed = serialiseTodoEvent(
      todo.domainEvents[0] as Domain.DomainEvent<{
        aggregateId: string;
        userId: string;
        title: string;
        completed: boolean;
      }>,
      2,
    );

    const rehydrated = TodoEntity.fromHistory([added, completed]);

    expect(rehydrated.id.toString()).toBe(todo.id.toString());
    expect(rehydrated.userId.id.toString()).toBe(userId.toString());
    expect(rehydrated.title.title).toBe('Event-sourced todo');
    expect(rehydrated.completed).toBe(true);
    expect(rehydrated.version).toBe(2);
    expect(rehydrated.domainEvents).toHaveLength(0);
  });
});
