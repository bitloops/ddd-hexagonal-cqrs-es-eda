import { Either, Domain, ok, fail } from '@bitloops/bl-boilerplate-core';
import { CompletedTodosVO } from './completed-todos.vo';
import { TodoCompletionsIncrementedDomainEvent } from './events/todo-completions-incremented.event';
import { DomainErrors } from '@src/lib/bounded-contexts/marketing/marketing/domain/errors';

export interface UserProps {
  id?: Domain.UUIDv4;
  completedTodos: CompletedTodosVO;
}

type TUserEntityPrimitives = {
  id: string;
  completedTodos: number;
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

  get id() {
    return this._id;
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
    };
    return new UserEntity(userEntityProps);
  }

  public toPrimitives(): TUserEntityPrimitives {
    return {
      id: this.id.toString(),
      completedTodos: this.props.completedTodos.counter,
    };
  }
}
