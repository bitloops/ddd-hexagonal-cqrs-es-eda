import { Application } from '@bitloops/bl-boilerplate-core';

export class EmptyNotificationTemplateError extends Application.Error {
  static readonly errorId = '';

  constructor(userId: string) {
    super(
      `Notification template for user ${userId} not found`,
      EmptyNotificationTemplateError.errorId,
    );
  }
}
