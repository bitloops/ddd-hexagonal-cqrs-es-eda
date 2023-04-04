import { TodoAddedDomainToPubSubIntegrationEventHandler } from './domain/todo-added-publish-pubsub.handler';
import { TodoDeletedDomainToPubSubIntegrationEventHandler } from './domain/todo-deleted-publish-pubsub.handler';
import { TodoCompletedDomainToPubSubIntegrationEventHandler } from './domain/todo-completed-publish-pubsub.handler';
import { TodoUncompletedDomainToPubSubIntegrationEventHandler } from './domain/todo-uncompleted-publish-pubsub.handler';
import { TodoModifiedTitleDomainToPubSubIntegrationEventHandler } from './domain/todo-modified-title-publish-pubsub.handler';
import { TodoAddedDomainToIntegrationEventHandler } from './domain/todo-added.handler';
import { TodoCompletedDomainToIntegrationEventHandler } from './domain/todo-completed.handler';

export const StreamingDomainEventHandlers = [
  TodoAddedDomainToIntegrationEventHandler,
  TodoCompletedDomainToIntegrationEventHandler,
  TodoAddedDomainToPubSubIntegrationEventHandler,
  TodoDeletedDomainToPubSubIntegrationEventHandler,
  TodoCompletedDomainToPubSubIntegrationEventHandler,
  TodoUncompletedDomainToPubSubIntegrationEventHandler,
  TodoModifiedTitleDomainToPubSubIntegrationEventHandler,
];

export const StreamingIntegrationEventHandlers = [];

export const StreamingErrorEventHandlers = [];
export const EventHandlers = [...StreamingDomainEventHandlers];
