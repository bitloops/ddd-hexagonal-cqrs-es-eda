/* eslint-disable @typescript-eslint/no-namespace */
import { UserNotFoundApplicationError as UserNotFoundError } from './UserNotFoundApplicationError';

export namespace ApplicationErrors {
  export class UserNotFoundApplicationError extends UserNotFoundError {}
}
