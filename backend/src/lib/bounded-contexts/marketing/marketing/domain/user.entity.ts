import { Either, Domain, ok, fail } from 'ddd-tactical-core-boilerplate';
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

export class UserEntity extends Domain.Aggregate<UserProps, Domain.UUIDv4> {
  private constructor(props: UserProps, id: Domain.UUIDv4) {
    super(props, id);
  }

  public static create(props: UserProps): Either<UserEntity, never> {
    const id = props.id ?? Domain.UUIDv4.generate();
    const user = new UserEntity({ ...props, id }, id);
    return ok(user);
  }

  get completedTodos(): CompletedTodosVO {
    return this.props.completedTodos;
  }

  get email(): EmailVO {
    return this.props.email;
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
    const id = Domain.UUIDv4.fromString(data.id);
    const userEntityProps = {
      id,
      completedTodos: CompletedTodosVO.create({
        counter: data.completedTodos,
      }).value as CompletedTodosVO,
      email: EmailVO.create({
        email: data.email,
      }).value as EmailVO,
    };
    return new UserEntity(userEntityProps, id);
  }

  public toPrimitives(): TUserEntityPrimitives {
    return {
      id: this.id.toString(),
      completedTodos: this.props.completedTodos.counter,
      email: this.props.email.email,
    };
  }
}
