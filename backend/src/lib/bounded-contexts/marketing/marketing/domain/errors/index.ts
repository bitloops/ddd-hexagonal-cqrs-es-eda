import { InvalidTodosCounterError as InvalidTodosCounter } from './invalid-todos-counter.error';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace DomainErrors {
  export class InvalidTodosCounterError extends InvalidTodosCounter {}
}
