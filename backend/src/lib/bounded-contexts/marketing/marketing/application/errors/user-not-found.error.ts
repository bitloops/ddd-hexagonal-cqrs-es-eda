import { Application } from 'ddd-tactical-core-boilerplate';

export class UserNotFoundError extends Application.Error {
  static readonly errorId = '';

  constructor(userId: string) {
    super(`User ${userId} not found`, UserNotFoundError.errorId);
  }
}
