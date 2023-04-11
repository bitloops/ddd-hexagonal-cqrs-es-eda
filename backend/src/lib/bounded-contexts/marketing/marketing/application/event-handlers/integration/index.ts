import { TodoCompletedIntegrationEventHandler } from './todo-completed.integration-handler';
import { UserEmailChangedIntegrationEventHandler } from './user-email-changed.integration-handler';
import { UserRegisteredIntegrationEventHandler } from './user-registered.integration-handler';

export const StreamingIntegrationEventHandlers = [
  UserRegisteredIntegrationEventHandler,
  TodoCompletedIntegrationEventHandler,
  UserEmailChangedIntegrationEventHandler,
];
