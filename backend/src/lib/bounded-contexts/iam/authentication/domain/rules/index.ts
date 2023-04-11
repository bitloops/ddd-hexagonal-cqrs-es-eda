/* eslint-disable @typescript-eslint/no-namespace */
import { ValidEmailRule as ValidEmail } from './valid-email.rule';

export namespace Rules {
  export class ValidEmailRule extends ValidEmail {}
}
