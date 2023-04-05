import { InvalidTodosCounterError as InvalidTodosCounter } from './invalid-todos-counter.error';
import { InvalidEmailDomainError as InvalidEmail } from './invalid-email.error';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace DomainErrors {
  export class InvalidTodosCounterError extends InvalidTodosCounter {}
  export class InvalidEmailDomainError extends InvalidEmail {}
}
