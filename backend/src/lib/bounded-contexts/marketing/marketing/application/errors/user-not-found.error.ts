import { Application } from '@bitloops/bl-boilerplate-core';

export class UserNotFoundError extends Application.Error {
  static readonly errorId = '';

  constructor(userId: string) {
    super(`User ${userId} not found`, UserNotFoundError.errorId);
  }
}
