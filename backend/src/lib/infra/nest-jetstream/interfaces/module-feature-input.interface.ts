export interface JetstreamModuleFeatureConfig {
  moduleOfHandlers: any;
  pubSubCommandHandlers?: any[];
  pubSubQueryHandlers?: any[];
  streamingDomainEventHandlers?: any[];
  streamingIntegrationEventHandlers?: any[];
  streamingCommandHandlers?: any[];
  pubSubIntegrationEventHandlers?: any[];
}
