import { Domain } from '@bitloops/bl-boilerplate-core';
import {
  UserEntity,
  UserProps,
} from '@src/lib/bounded-contexts/marketing/marketing/domain/user.entity';
import { CompletedTodosVO } from '@src/lib/bounded-contexts/marketing/marketing/domain/completed-todos.value-object';
import { EmailVO } from '../../domain/email.value-object';

export class UserEntityBuilder {
  private completedTodos: number;
  private id?: string;
  private email: string;

  withCompletedTodos(completedTodos: number): UserEntityBuilder {
    this.completedTodos = completedTodos;
    return this;
  }

  withId(id: string): UserEntityBuilder {
    this.id = id;
    return this;
  }

  withEmail(email: string): UserEntityBuilder {
    this.email = email;
    return this;
  }

  build(): UserEntity {
    const userProps: UserProps = {
      completedTodos: CompletedTodosVO.create({ counter: this.completedTodos })
        .value as CompletedTodosVO,
      email: EmailVO.create({ email: this.email }).value as EmailVO,
    };
    if (this.id) {
      userProps.id = new Domain.UUIDv4(this.id);
    }
    const userEntity = UserEntity.create(userProps).value as UserEntity;
    return userEntity;
  }
}
