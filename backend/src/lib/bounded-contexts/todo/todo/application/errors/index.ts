import { TodoNotFoundError as TodoNotFound } from './todo-not-found.error';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ApplicationErrors {
  export class TodoNotFoundError extends TodoNotFound {}
}
