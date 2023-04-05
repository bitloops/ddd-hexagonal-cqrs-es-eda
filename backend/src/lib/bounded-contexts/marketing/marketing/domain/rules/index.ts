import { CompletedTodosIsPositiveNumber as CompletedTodosIsPositiveNumberRule } from './completed-todos-is-poisitve-number.rule';
import { ValidEmailRule as ValidEmail } from './valid-email.rule';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Rules {
  export class CompletedTodosIsPositiveNumber extends CompletedTodosIsPositiveNumberRule {}
  export class ValidEmailRule extends ValidEmail {}
}
