import { UserNotFoundError as UserNotFound } from './user-not-found.error';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ApplicationErrors {
  export class UserNotFoundError extends UserNotFound {}
}
