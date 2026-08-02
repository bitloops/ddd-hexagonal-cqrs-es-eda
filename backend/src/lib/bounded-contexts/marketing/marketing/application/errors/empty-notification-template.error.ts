import { Application } from 'ddd-tactical-core-boilerplate';

export class EmptyNotificationTemplateError extends Application.Error {
  static readonly errorId = '';

  constructor(userId: string) {
    super(
      `Notification template for user ${userId} not found`,
      EmptyNotificationTemplateError.errorId,
    );
  }
}
