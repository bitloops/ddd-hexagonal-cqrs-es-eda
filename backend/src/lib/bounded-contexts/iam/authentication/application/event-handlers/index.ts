import { UserUpdatedEmailPublishIntegrationEventHandler } from './updated-email-publish.event-handler';

export const StreamingDomainEventHandlers = [
  UserUpdatedEmailPublishIntegrationEventHandler,
];

export const EventHandlers = [...StreamingDomainEventHandlers];
