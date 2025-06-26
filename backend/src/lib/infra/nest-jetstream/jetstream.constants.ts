export const ProvidersConstants = {
  JETSTREAM_PROVIDER: 'JETSTREAM_PROVIDER',
};
export const HANDLERS_TOKENS = {
  STREAMING_COMMAND_HANDLERS: 'StreamingCommandHandlers',
  STREAMING_DOMAIN_EVENT_HANDLERS: 'StreamingDomainEventHandlers',
  STREAMING_INTEGRATION_EVENT_HANDLERS: 'StreamingIntegrationEventHandlers',
  PUBSUB_COMMAND_HANDLERS: 'PubSubCommandHandlers',
  PUBSUB_QUERY_HANDLERS: 'PubSubQueryHandlers',
  PUBSUB_INTEGRATION_EVENT_HANDLERS: 'PubSubIntegrationEventHandlers',
};

export const ASYNC_LOCAL_STORAGE = Symbol('ASYNC_LOCAL_STORAGE');
export const TIMEOUT_MILLIS = Symbol('TIMEOUT_MILLIS');

export const METADATA_HEADERS = {
  CORRELATION_ID: 'correlationId',
  CONTEXT: 'context',
};
