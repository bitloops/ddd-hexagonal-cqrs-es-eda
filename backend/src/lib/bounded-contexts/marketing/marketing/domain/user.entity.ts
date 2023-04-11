import { Either, Domain, ok, fail } from '@bitloops/bl-boilerplate-core';
import { CompletedTodosVO } from './completed-todos.value-object';
import { TodoCompletionsIncrementedDomainEvent } from './events/todo-completions-incremented.event';
import { DomainErrors } from '@src/lib/bounded-contexts/marketing/marketing/domain/errors';
import { EmailVO } from './email.value-object';

export interface UserProps {
  id?: Domain.UUIDv4;
  completedTodos: CompletedTodosVO;
  email: EmailVO;
}

type TUserEntityPrimitives = {
  id: string;
  completedTodos: number;
  email: string;
};

export class UserEntity extends Domain.Aggregate<UserProps> {
  private constructor(props: UserProps) {
    super(props, props.id);
  }

  public static create(props: UserProps): Either<UserEntity, never> {
    const user = new UserEntity(props);
    return ok(user);
  }

  get completedTodos(): CompletedTodosVO {
    return this.props.completedTodos;
  }

  get email(): EmailVO {
    return this.props.email;
  }

  get id() {
    return this._id;
  }

  changeEmail(
    email: string,
  ): Either<void, DomainErrors.InvalidEmailDomainError> {
    const newEmail = EmailVO.create({ email });
    if (newEmail.isFail()) {
      return fail(newEmail.value);
    }
    this.props.email = newEmail.value;
    return ok();
  }

  incrementCompletedTodos(): Either<
    void,
    DomainErrors.InvalidTodosCounterError
  > {
    const incrementedCompletedTodos = this.props.completedTodos.counter + 1;
    const completedTodos = CompletedTodosVO.create({
      counter: incrementedCompletedTodos,
    });
    if (completedTodos.isFail()) {
      return fail(completedTodos.value);
    }

    this.props.completedTodos = completedTodos.value;
    this.addDomainEvent(
      new TodoCompletionsIncrementedDomainEvent({
        aggregateId: this.id.toString(),
        completedTodos: this.props.completedTodos.counter,
      }),
    );
    return ok();
  }

  isFirstTodo(): boolean {
    return this.props.completedTodos.counter === 1;
  }

  public static fromPrimitives(data: TUserEntityPrimitives): UserEntity {
    const userEntityProps = {
      id: new Domain.UUIDv4(data.id),
      completedTodos: CompletedTodosVO.create({
        counter: data.completedTodos,
      }).value as CompletedTodosVO,
      email: EmailVO.create({
        email: data.email,
      }).value as EmailVO,
    };
    return new UserEntity(userEntityProps);
  }

  public toPrimitives(): TUserEntityPrimitives {
    return {
      id: this.id.toString(),
      completedTodos: this.props.completedTodos.counter,
      email: this.props.email.email,
    };
  }
}
