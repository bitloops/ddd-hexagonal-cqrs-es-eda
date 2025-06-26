import { Injectable, Inject } from '@nestjs/common';
import {
  BUSES_TOKENS,
  NatsPubSubCommandBus,
  NatsPubSubQueryBus,
  NatsStreamingCommandBus,
  NatsStreamingDomainEventBus,
  NatsStreamingIntegrationEventBus,
} from './buses';
import { HANDLERS_TOKENS } from './jetstream.constants';
import { Application, Infra } from '@bitloops/bl-boilerplate-core';
import { NatsPubSubIntegrationEventsBus } from './buses/nats-pubsub-integration-events-bus';

@Injectable()
export class SubscriptionsService {
  constructor(
    @Inject(HANDLERS_TOKENS.STREAMING_DOMAIN_EVENT_HANDLERS)
    private domainEventHandlers: any[],
    @Inject(HANDLERS_TOKENS.PUBSUB_COMMAND_HANDLERS)
    private commandHandlers: any[],
    @Inject(HANDLERS_TOKENS.PUBSUB_QUERY_HANDLERS) private queryHandlers: any[],
    @Inject(HANDLERS_TOKENS.STREAMING_INTEGRATION_EVENT_HANDLERS)
    private integrationEventHandlers: any[],
    @Inject(HANDLERS_TOKENS.STREAMING_COMMAND_HANDLERS)
    private streamingCommandHandlers: any[],
    @Inject(HANDLERS_TOKENS.PUBSUB_INTEGRATION_EVENT_HANDLERS)
    private pubSubIntegrationEventHandlers: any[],
    @Inject(BUSES_TOKENS.PUBSUB_COMMAND_BUS)
    private commandBus: Infra.CommandBus.IPubSubCommandBus,
    @Inject(BUSES_TOKENS.PUBSUB_QUERY_BYS)
    private queryBus: Infra.QueryBus.IQueryBus,
    @Inject(BUSES_TOKENS.STREAMING_DOMAIN_EVENT_BUS)
    private eventBus: NatsStreamingDomainEventBus,
    @Inject(BUSES_TOKENS.STREAMING_INTEGRATION_EVENT_BUS)
    private integrationEventBus: NatsStreamingIntegrationEventBus,
    @Inject(BUSES_TOKENS.STREAMING_COMMAND_BUS)
    private streamingCommandBus: NatsStreamingCommandBus,
    @Inject(BUSES_TOKENS.PUBSUB_INTEGRATION_EVENT_BUS)
    private pubSubIntegrationEventBus: NatsPubSubIntegrationEventsBus,
  ) {
    this.subscribePubSubCommandHandlers(commandHandlers);
    this.subscribePubSubQueryHandlers(queryHandlers);
    this.subscribeStreamingDomainEventHandlers(domainEventHandlers);
    this.subscribeStreamingIntegrationEventHandlers(integrationEventHandlers);
    this.subscribeStreamingCommandHandlers(streamingCommandHandlers);
    this.subscribePubSubIntegrationEventHandlers(pubSubIntegrationEventHandlers);
  }

  private subscribePubSubCommandHandlers(commandHandlers: any[]) {
    commandHandlers.forEach((handler) => {
      this.commandBus.pubSubSubscribe(NatsPubSubCommandBus.getTopicFromHandler(handler), handler);
    });
  }

  private subscribePubSubQueryHandlers(queryHandlers: any[]) {
    queryHandlers.forEach((handler) => {
      this.queryBus.pubSubSubscribe(NatsPubSubQueryBus.getTopicFromHandler(handler), handler);
    });
  }

  private subscribePubSubIntegrationEventHandlers(
    integrationEventHandlers: Application.IHandleIntegrationEvent[],
  ) {
    integrationEventHandlers.forEach((handler) => {
      this.pubSubIntegrationEventBus.subscribe(
        NatsPubSubIntegrationEventsBus.getTopicFromHandler(handler),
        handler,
      );
    });
  }

  private subscribeStreamingDomainEventHandlers(domainEventHandlers: any[]) {
    return Promise.all(
      domainEventHandlers.map((handler) => {
        const subject = NatsStreamingDomainEventBus.getSubjectFromHandler(handler);
        return this.eventBus.subscribe(subject, handler);
      }),
    );
  }

  private subscribeStreamingIntegrationEventHandlers(integrationEventHandlers: any[]) {
    integrationEventHandlers.forEach((handler) => {
      const subject = NatsStreamingIntegrationEventBus.getSubjectFromHandler(handler);
      this.integrationEventBus.subscribe(subject, handler);
    });
  }

  private subscribeStreamingCommandHandlers(streamingCommandHandlers: any[]) {
    streamingCommandHandlers.forEach((handler) => {
      const subject = NatsStreamingCommandBus.getSubjectFromHandler(handler);
      this.streamingCommandBus.subscribe(subject, handler);
    });
  }
}
