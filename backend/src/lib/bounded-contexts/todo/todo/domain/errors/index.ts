import { TitleOutOfBoundsError as TitleOutOfBounds } from './title-out-of-bounds.error';
import { TodoAlreadyCompletedError as TodoAlreadyCompleted } from './todo-already-completed.error';
import { TodoAlreadyUncompletedError as TodoAlreadyUncompleted } from './todo-already-uncompleted.error';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace DomainErrors {
  export class TitleOutOfBoundsError extends TitleOutOfBounds {}
  export class TodoAlreadyCompletedError extends TodoAlreadyCompleted {}
  export class TodoAlreadyUncompletedError extends TodoAlreadyUncompleted {}
}
