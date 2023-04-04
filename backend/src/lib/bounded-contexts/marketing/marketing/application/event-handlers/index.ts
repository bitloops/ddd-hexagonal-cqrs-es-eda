import { TodoCompletedIntegrationEventHandler } from './integration/todo-completed.integration-handler';
import { TodoCompletionsIncrementedHandler } from './domain/todo-completions-incremented.handler';
import { UserRegisteredIntegrationEventHandler } from './integration/user-registered.integration-handler';
import { UserEmailChangedIntegrationEventHandler } from './integration/user-email-changed.integration-handler';

export const StreamingDomainEventHandlers = [TodoCompletionsIncrementedHandler];

export const StreamingIntegrationEventHandlers = [
  UserRegisteredIntegrationEventHandler,
  TodoCompletedIntegrationEventHandler,
  UserEmailChangedIntegrationEventHandler,
];

export const StreamingErrorEventHandlers = [];

export const EventHandlers = [
  ...StreamingIntegrationEventHandlers,
  ...StreamingDomainEventHandlers,
];
