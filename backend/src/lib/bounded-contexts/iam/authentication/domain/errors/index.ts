/* eslint-disable @typescript-eslint/no-namespace */
import { InvalidEmailDomainError as InvalidEmailError } from './InvalidEmailDomainError';

export namespace DomainErrors {
  export class InvalidEmailDomainError extends InvalidEmailError {}
}
