import { TodoAddedDomainToPubSubIntegrationEventHandler } from './todo-added-publish-pubsub.handler';
import { TodoAddedDomainToIntegrationEventHandler } from './todo-added.handler';
import { TodoCompletedDomainToPubSubIntegrationEventHandler } from './todo-completed-publish-pubsub.handler';
import { TodoCompletedDomainToIntegrationEventHandler } from './todo-completed.handler';
import { TodoDeletedDomainToPubSubIntegrationEventHandler } from './todo-deleted-publish-pubsub.handler';
import { TodoModifiedTitleDomainToPubSubIntegrationEventHandler } from './todo-modified-title-publish-pubsub.handler';
import { TodoUncompletedDomainToPubSubIntegrationEventHandler } from './todo-uncompleted-publish-pubsub.handler';

export const StreamingDomainEventHandlers = [
  TodoAddedDomainToIntegrationEventHandler,
  TodoCompletedDomainToIntegrationEventHandler,
  TodoAddedDomainToPubSubIntegrationEventHandler,
  TodoDeletedDomainToPubSubIntegrationEventHandler,
  TodoCompletedDomainToPubSubIntegrationEventHandler,
  TodoUncompletedDomainToPubSubIntegrationEventHandler,
  TodoModifiedTitleDomainToPubSubIntegrationEventHandler,
];
