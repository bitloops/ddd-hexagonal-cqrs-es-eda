import { Domain } from '@bitloops/bl-boilerplate-core';
import { UserProps } from '@src/lib/bounded-contexts/marketing/marketing/domain/user.entity';
import { CompletedTodosVO } from '@src/lib/bounded-contexts/marketing/marketing/domain/completed-todos.vo';

export class UserPropsBuilder {
  private completedTodos: number;
  private id?: string;

  withCompletedTodos(completedTodos: number): UserPropsBuilder {
    this.completedTodos = completedTodos;
    return this;
  }

  withId(id: string): UserPropsBuilder {
    this.id = id;
    return this;
  }

  build(): UserProps {
    const todoProps: UserProps = {
      completedTodos: CompletedTodosVO.create({ counter: this.completedTodos })
        .value as CompletedTodosVO,
    };
    if (this.id) {
      todoProps.id = new Domain.UUIDv4(this.id);
    }
    return todoProps;
  }
}
