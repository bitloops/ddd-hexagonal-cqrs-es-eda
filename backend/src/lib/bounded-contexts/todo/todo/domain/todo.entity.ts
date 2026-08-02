import { Domain, Either, ok, fail } from 'ddd-tactical-core-boilerplate';
import { TitleVO } from './title.value-object';
import { UserIdVO } from './user-id.value-object';
import { DomainErrors } from './errors';
import { TodoAddedDomainEvent } from './events/todo-added.event';
import { TodoModifiedTitleDomainEvent } from './events/todo-modified-title.event';
import { TodoCompletedDomainEvent } from './events/todo-completed.event';
import { TodoUncompletedDomainEvent } from './events/todo-uncompleted.event';
import { Rules } from './rules';
import { TodoDeletedDomainEvent } from './events/todo-deleted.event';

export interface TodoProps {
  userId: UserIdVO;
  id?: Domain.UUIDv4;
  title: TitleVO;
  completed: boolean;
}

export type TodoEventType =
  | 'TodoAddedDomainEvent'
  | 'TodoModifiedTitleDomainEvent'
  | 'TodoCompletedDomainEvent'
  | 'TodoUncompletedDomainEvent'
  | 'TodoDeletedDomainEvent';

export type TodoEventPayload = {
  aggregateId: string;
  userId: string;
  title: string;
  completed: boolean;
};

export type TodoHistoryEvent = {
  eventType: TodoEventType;
  payload: TodoEventPayload;
  version: number;
};

type TTodoEntityPrimitives = {
  id: string;
  userId: {
    id: string;
  };
  title: {
    title: string;
  };
  completed: boolean;
};

export class TodoEntity extends Domain.Aggregate<TodoProps, Domain.UUIDv4> {
  private eventStreamVersion = 0;
  private deleted = false;

  private constructor(props: TodoProps, id: Domain.UUIDv4) {
    super(props, id);
  }

  public static create(props: TodoProps): Either<TodoEntity, never> {
    const isNew = !props.id;
    const id = props.id ?? Domain.UUIDv4.generate();
    const todo = new TodoEntity({ ...props, id }, id);

    if (isNew) {
      const todoAddedDomainEvent = new TodoAddedDomainEvent({
        title: todo.title.title,
        userId: todo.userId.id.toString(),
        completed: todo.completed,
        aggregateId: todo.id.toString(),
      });
      todo.addDomainEvent(todoAddedDomainEvent);
    }
    // add domain event todo created
    return ok(todo);
  }

  get completed(): boolean {
    return this.props.completed;
  }

  get title(): TitleVO {
    return this.props.title;
  }

  get userId(): UserIdVO {
    return this.props.userId;
  }

  get version(): number {
    return this.eventStreamVersion;
  }

  get isDeleted(): boolean {
    return this.deleted;
  }

  public complete(): Either<void, DomainErrors.TodoAlreadyCompletedError> {
    const res = Domain.applyRules([
      new Rules.TodoAlreadyCompleted(this.props.completed, this.id.toString()),
    ]);
    if (res) return fail(res);

    this.props.completed = true;
    const todoCompletedDomainEvent = new TodoCompletedDomainEvent({
      title: this.title.title,
      userId: this.userId.id.toString(),
      completed: this.completed,
      aggregateId: this.id.toString(),
    });
    this.addDomainEvent(todoCompletedDomainEvent);
    return ok();
  }

  public uncomplete(): Either<void, DomainErrors.TodoAlreadyUncompletedError> {
    const res = Domain.applyRules([
      new Rules.TodoAlreadyUncompleted(
        this.props.completed,
        this.id.toString(),
      ),
    ]);
    if (res) return fail(res);
    this.props.completed = false;
    const todoUncompletedDomainEvent = new TodoUncompletedDomainEvent({
      title: this.title.title,
      userId: this.userId.id.toString(),
      completed: this.completed,
      aggregateId: this.id.toString(),
    });
    this.addDomainEvent(todoUncompletedDomainEvent);
    return ok();
  }

  public delete(): Either<void, void> {
    this.deleted = true;
    this.addDomainEvent(
      new TodoDeletedDomainEvent({
        title: this.title.title,
        userId: this.userId.id.toString(),
        completed: this.completed,
        aggregateId: this.id.toString(),
      }),
    );
    return ok();
  }

  public modifyTitle(title: TitleVO): Either<void, never> {
    this.props.title = title;

    const titleModifiedDomainEvent = new TodoModifiedTitleDomainEvent({
      title: this.title.title,
      userId: this.userId.id.toString(),
      completed: this.completed,
      aggregateId: this.id.toString(),
    });
    this.addDomainEvent(titleModifiedDomainEvent);
    return ok();
  }

  public static fromPrimitives(data: TTodoEntityPrimitives): TodoEntity {
    const id = Domain.UUIDv4.fromString(data.id);
    const TodoEntityProps: TodoProps = {
      id,
      userId: UserIdVO.create({ id: Domain.UUIDv4.fromString(data.userId.id) })
        .value as UserIdVO,
      title: TitleVO.create({
        title: data.title.title,
      }).value as TitleVO,
      completed: data.completed,
    };
    return new TodoEntity(TodoEntityProps, id);
  }

  public static fromHistory(history: readonly TodoHistoryEvent[]): TodoEntity {
    if (history.length === 0) {
      throw new Error('Cannot rehydrate a Todo aggregate from an empty history');
    }

    let todo: TodoEntity | undefined;

    for (const event of history) {
      const { payload } = event;

      switch (event.eventType) {
        case 'TodoAddedDomainEvent': {
          if (todo) {
            throw new Error(`Todo ${payload.aggregateId} has more than one creation event`);
          }
          todo = TodoEntity.fromPrimitives({
            id: payload.aggregateId,
            userId: { id: payload.userId },
            title: { title: payload.title },
            completed: payload.completed,
          });
          break;
        }
        case 'TodoModifiedTitleDomainEvent': {
          const title = TitleVO.create({ title: payload.title });
          if (!todo || title.isFail()) {
            throw new Error(`Invalid title history for Todo ${payload.aggregateId}`);
          }
          todo.props.title = title.value;
          break;
        }
        case 'TodoCompletedDomainEvent':
          if (!todo) throw new Error(`Todo ${payload.aggregateId} is missing its creation event`);
          todo.props.completed = true;
          break;
        case 'TodoUncompletedDomainEvent':
          if (!todo) throw new Error(`Todo ${payload.aggregateId} is missing its creation event`);
          todo.props.completed = false;
          break;
        case 'TodoDeletedDomainEvent':
          if (!todo) throw new Error(`Todo ${payload.aggregateId} is missing its creation event`);
          todo.deleted = true;
          break;
      }

      if (todo) todo.eventStreamVersion = event.version;
    }

    if (!todo) {
      throw new Error('Todo history does not contain a creation event');
    }

    todo.clearDomainEvents();
    return todo;
  }

  public commit(version: number): void {
    this.eventStreamVersion = version;
    this.clearDomainEvents();
  }

  public toPrimitives(): TTodoEntityPrimitives {
    return {
      id: this.id.toString(),
      userId: {
        id: this.props.userId.id.toString(),
      },
      title: { title: this.props.title.title },
      completed: this.props.completed,
    };
  }
}
