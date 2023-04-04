import { TodoCompletedIntegrationEventHandler } from './integration/todo-completed.integration-handler';
import { TodoCompletionsIncrementedHandler } from './domain/todo-completions-incremented.handler';
import { UserRegisteredIntegrationEventHandler } from './integration/user-registered.integration-handler';

export const StreamingDomainEventHandlers = [TodoCompletionsIncrementedHandler];

export const StreamingIntegrationEventHandlers = [
  UserRegisteredIntegrationEventHandler,
  TodoCompletedIntegrationEventHandler,
];

export const StreamingErrorEventHandlers = [];

export const EventHandlers = [
  ...StreamingIntegrationEventHandlers,
  ...StreamingDomainEventHandlers,
];
