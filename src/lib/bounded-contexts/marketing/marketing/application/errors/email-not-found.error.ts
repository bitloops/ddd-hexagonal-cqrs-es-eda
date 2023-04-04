import { Application } from '@bitloops/bl-boilerplate-core';

export class UserEmailNotFoundError extends Application.Error {
  static readonly errorId = '';

  constructor(userId: string) {
    super(`Email for user ${userId} not found`, UserEmailNotFoundError.errorId);
  }
}
