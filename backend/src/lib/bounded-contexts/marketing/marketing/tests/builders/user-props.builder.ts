import { Domain } from '@bitloops/bl-boilerplate-core';
import { UserProps } from '@src/lib/bounded-contexts/marketing/marketing/domain/user.entity';
import { CompletedTodosVO } from '@src/lib/bounded-contexts/marketing/marketing/domain/completed-todos.value-object';
import { EmailVO } from '../../domain/email.value-object';

export class UserPropsBuilder {
  private completedTodos: number;
  private email: string;
  private id?: string;

  withCompletedTodos(completedTodos: number): UserPropsBuilder {
    this.completedTodos = completedTodos;
    return this;
  }

  withId(id: string): UserPropsBuilder {
    this.id = id;
    return this;
  }

  withEmail(email: string): UserPropsBuilder {
    this.email = email;
    return this;
  }

  build(): UserProps {
    const userProps: UserProps = {
      completedTodos: CompletedTodosVO.create({ counter: this.completedTodos })
        .value as CompletedTodosVO,
      email: EmailVO.create({ email: this.email }).value as EmailVO,
    };
    if (this.id) {
      userProps.id = new Domain.UUIDv4(this.id);
    }
    return userProps;
  }
}
