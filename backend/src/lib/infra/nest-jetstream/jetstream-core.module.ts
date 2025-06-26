import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { ConnectionOptions } from 'nats';
import { Application, asyncLocalStorage } from '@bitloops/bl-boilerplate-core';
import { NestjsJetstream } from './nestjs-jetstream.class';
import { NatsPubSubCommandBus } from './buses/nats-pubsub-command-bus';
import { NatsPubSubQueryBus } from './buses/nats-pubsub-query-bus';
import { NatsStreamingDomainEventBus } from './buses/nats-streaming-domain-event-bus';
import { JetstreamModuleFeatureConfig } from './interfaces/module-feature-input.interface';
import { BUSES_TOKENS } from './buses/constants';
import { NatsStreamingIntegrationEventBus, NatsStreamingCommandBus } from './buses';
import { SubscriptionsService } from './jetstream.subscriptions.service';
import {
  ASYNC_LOCAL_STORAGE,
  HANDLERS_TOKENS,
  ProvidersConstants,
  TIMEOUT_MILLIS,
} from './jetstream.constants';
import { NatsPubSubIntegrationEventsBus } from './buses/nats-pubsub-integration-events-bus';

const pubSubCommandBus = {
  provide: BUSES_TOKENS.PUBSUB_COMMAND_BUS,
  useClass: NatsPubSubCommandBus,
};
const pubSubQueryBus = {
  provide: BUSES_TOKENS.PUBSUB_QUERY_BYS,
  useClass: NatsPubSubQueryBus,
};

const streamingDomainEventBus = {
  provide: BUSES_TOKENS.STREAMING_DOMAIN_EVENT_BUS,
  useClass: NatsStreamingDomainEventBus,
};

const streamingIntegrationEventBus = {
  provide: BUSES_TOKENS.STREAMING_INTEGRATION_EVENT_BUS,
  useClass: NatsStreamingIntegrationEventBus,
};

const streamingCommandBus = {
  provide: BUSES_TOKENS.STREAMING_COMMAND_BUS,
  useClass: NatsStreamingCommandBus,
};

const streamingMessageBus = {
  provide: BUSES_TOKENS.STREAMING_MESSAGE_BUS,
  useClass: NatsStreamingCommandBus,
};
const pubSubIntegrationEventBus = {
  provide: BUSES_TOKENS.PUBSUB_INTEGRATION_EVENT_BUS,
  useClass: NatsPubSubIntegrationEventsBus,
};

@Global()
@Module({})
export class JetstreamCoreModule {
  static forRoot(connectionOptions: ConnectionOptions, timeoutMillis?: number): DynamicModule {
    const jetstreamProviders = {
      provide: ProvidersConstants.JETSTREAM_PROVIDER,
      useFactory: (): any => {
        return new NestjsJetstream().connect(connectionOptions);
      },
    };

    const asyncLocalStorageProvider = {
      provide: ASYNC_LOCAL_STORAGE,
      useValue: asyncLocalStorage,
    };

    const timeoutMillisProvider = {
      provide: TIMEOUT_MILLIS,
      useValue: timeoutMillis ?? 10000,
    };

    return {
      module: JetstreamCoreModule,
      providers: [
        jetstreamProviders,
        pubSubCommandBus,
        pubSubQueryBus,
        streamingDomainEventBus,
        streamingIntegrationEventBus,
        streamingCommandBus,
        streamingMessageBus,
        pubSubIntegrationEventBus,
        asyncLocalStorageProvider,
        timeoutMillisProvider,
      ],
      exports: [
        jetstreamProviders,
        pubSubCommandBus,
        pubSubQueryBus,
        streamingDomainEventBus,
        streamingIntegrationEventBus,
        streamingCommandBus,
        streamingMessageBus,
        pubSubIntegrationEventBus,
        asyncLocalStorageProvider,
        timeoutMillisProvider,
      ],
    };
  }

  static forFeature(config: JetstreamModuleFeatureConfig): DynamicModule {
    if (config === undefined || config === null) {
      throw new Error('Config missing');
    }
    const { moduleOfHandlers } = config;
    let {
      pubSubCommandHandlers,
      pubSubQueryHandlers,
      streamingDomainEventHandlers,
      streamingIntegrationEventHandlers,
      streamingCommandHandlers,
      pubSubIntegrationEventHandlers,
    } = config;
    if (!pubSubCommandHandlers) pubSubCommandHandlers = [];
    if (!pubSubQueryHandlers) pubSubQueryHandlers = [];
    if (!streamingDomainEventHandlers) streamingDomainEventHandlers = [];
    if (!streamingIntegrationEventHandlers) streamingIntegrationEventHandlers = [];
    if (!streamingCommandHandlers) streamingCommandHandlers = [];
    if (!pubSubIntegrationEventHandlers) pubSubIntegrationEventHandlers = [];

    const handlers: Provider<any>[] = [
      {
        provide: HANDLERS_TOKENS.PUBSUB_COMMAND_HANDLERS,
        useFactory: (...commandHandlers) => {
          return commandHandlers;
        },
        inject: [...pubSubCommandHandlers],
      },
      {
        provide: HANDLERS_TOKENS.PUBSUB_QUERY_HANDLERS,
        useFactory: (...queryHandlers) => {
          return queryHandlers;
        },
        inject: [...pubSubQueryHandlers],
      },
      {
        provide: HANDLERS_TOKENS.STREAMING_DOMAIN_EVENT_HANDLERS,
        useFactory: (...domainEventHandlers: Application.IHandleDomainEvent[]) => {
          return domainEventHandlers;
        },
        inject: [...streamingDomainEventHandlers],
      },

      {
        provide: HANDLERS_TOKENS.STREAMING_INTEGRATION_EVENT_HANDLERS,
        useFactory: (...integrationEventHandlers: Application.IHandleIntegrationEvent[]) => {
          return integrationEventHandlers;
        },
        inject: [...streamingIntegrationEventHandlers],
      },

      {
        provide: HANDLERS_TOKENS.STREAMING_COMMAND_HANDLERS,
        useFactory: (...commandHandlers: Application.ICommandHandler<any, any>[]) => {
          return commandHandlers;
        },
        inject: [...streamingCommandHandlers],
      },
      {
        provide: HANDLERS_TOKENS.PUBSUB_INTEGRATION_EVENT_HANDLERS,
        useFactory: (...integrationEventHandlers: Application.IHandleIntegrationEvent[]) => {
          return integrationEventHandlers;
        },
        inject: [...pubSubIntegrationEventHandlers],
      },
    ];

    return {
      imports: [moduleOfHandlers],
      module: JetstreamCoreModule,
      providers: [...handlers, SubscriptionsService],
    };
  }
}
