import { StreamingDomainEventHandlers } from './domain';
import { StreamingIntegrationEventHandlers } from './integration';

export const StreamingErrorEventHandlers = [];

export const EventHandlers = [
  ...StreamingIntegrationEventHandlers,
  ...StreamingDomainEventHandlers,
];
