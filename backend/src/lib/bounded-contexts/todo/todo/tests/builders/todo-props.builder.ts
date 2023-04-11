import { Domain } from '@bitloops/bl-boilerplate-core';
import { TitleVO } from '@src/lib/bounded-contexts/todo/todo/domain/title.value-object';
import { TodoProps } from '@src/lib/bounded-contexts/todo/todo/domain/todo.entity';
import { UserIdVO } from '@src/lib/bounded-contexts/todo/todo/domain/user-id.value-object';

export class TodoPropsBuilder {
  private userId: string;
  private title: string;
  private completed: boolean;
  private id?: string;

  withUserId(userId: string): TodoPropsBuilder {
    this.userId = userId;
    return this;
  }

  withTitle(title: string): TodoPropsBuilder {
    this.title = title;
    return this;
  }

  withCompleted(completed: boolean): TodoPropsBuilder {
    this.completed = completed;
    return this;
  }

  withId(id: string): TodoPropsBuilder {
    this.id = id;
    return this;
  }

  build(): TodoProps {
    const todoProps: TodoProps = {
      userId: UserIdVO.create({ id: new Domain.UUIDv4(this.userId) })
        .value as UserIdVO,
      title: TitleVO.create({
        title: this.title,
      }).value as TitleVO,
      completed: this.completed,
    };
    if (this.id) {
      todoProps.id = new Domain.UUIDv4(this.id);
    }
    return todoProps;
  }
}
