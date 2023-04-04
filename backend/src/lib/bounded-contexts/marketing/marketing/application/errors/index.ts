import { UserEmailNotFoundError as EmailNotFound } from './email-not-found.error';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ApplicationErrors {
  export class UserEmailNotFoundError extends EmailNotFound {}
}
