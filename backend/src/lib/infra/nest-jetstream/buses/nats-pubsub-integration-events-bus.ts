import { Inject, Injectable, Logger } from '@nestjs/common';
import { NatsConnection, JSONCodec, headers, Msg, MsgHdrs } from 'nats';
import { Application, Infra } from '@bitloops/bl-boilerplate-core';
import { ASYNC_LOCAL_STORAGE, ProvidersConstants } from '../jetstream.constants';
import { ContextPropagation } from './utils/context-propagation';

const jsonCodec = JSONCodec<Infra.EventBus.IntegrationEvent<any>>();

@Injectable()
export class NatsPubSubIntegrationEventsBus implements Infra.EventBus.IEventBus {
  private readonly logger = new Logger(NatsPubSubIntegrationEventsBus.name);
  private nc: NatsConnection;
  private static topicPrefix = 'IntegrationEvents_';

  constructor(
    @Inject(ProvidersConstants.JETSTREAM_PROVIDER) private readonly nats: any,
    @Inject(ASYNC_LOCAL_STORAGE)
    private readonly asyncLocalStorage: any,
  ) {
    this.nc = this.nats.getConnection();
  }

  async publish(
    eventsInput: Infra.EventBus.IntegrationEvent<any> | Infra.EventBus.IntegrationEvent<any>[],
  ): Promise<void> {
    const integrationEvents: Infra.EventBus.IntegrationEvent<any>[] = Array.isArray(eventsInput)
      ? eventsInput
      : [eventsInput];
    await Promise.all(
      integrationEvents.map(async (integrationEvent) => {
        const topic = NatsPubSubIntegrationEventsBus.getTopicFromEventInstance(integrationEvent);
        this.logger.log('Publishing in pubsub-integration-event-bus :' + topic);
        integrationEvent.correlationId = this.getCorelationId();
        integrationEvent.context = this.getContext();
        const headers = this.generateHeaders(integrationEvent);

        return this.nc.publish(topic, jsonCodec.encode(integrationEvent), {
          headers,
        });
      }),
    );
  }

  async subscribe(subject: string, handler: Application.IHandleIntegrationEvent) {
    try {
      this.logger.log('Subscribing to pubsub-integration-event:' + subject);
      const sub = this.nc.subscribe(subject);
      (async () => {
        for await (const m of sub) {
          const integrationEvent = jsonCodec.decode(m.data);

          const contextData = ContextPropagation.createStoreFromMessageHeaders(m.headers);

          await this.asyncLocalStorage.run(contextData, async () => {
            return this.handleReceivedIntegrationEvent(handler, integrationEvent, m);
          });
        }
      })();
    } catch (err) {
      this.logger.error('Error in pub-sub-integration-event-bus subscribe::', err);
    }
  }

  unsubscribe(topic: string, eventHandler: Application.IHandleIntegrationEvent): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private getCorelationId() {
    return this.asyncLocalStorage.getStore()?.get('correlationId');
  }

  private getContext() {
    return this.asyncLocalStorage.getStore()?.get('context') || {};
  }

  private generateHeaders(integrationEvents: Infra.EventBus.IntegrationEvent<any>): MsgHdrs {
    const h = headers();
    for (const [key, value] of Object.entries(integrationEvents.metadata)) {
      if (key === 'context' && value) {
        h.append(key, JSON.stringify(value));
        continue;
      }
      const header = value?.toString();
      if (header) {
        h.append(key, header);
      }
    }
    return h;
  }

  static getTopicFromHandler(handler: Application.IHandleIntegrationEvent): string {
    const event = handler.event;
    const boundedContext = handler.boundedContext;

    return `${this.topicPrefix}${boundedContext}.${event.name}`;
  }

  static getTopicFromEventInstance(integrationEvent: Infra.EventBus.IntegrationEvent<any>): string {
    const boundedContext = integrationEvent.metadata.boundedContextId;
    const topic = `${this.topicPrefix}${boundedContext}.${integrationEvent.constructor.name}`;
    return topic;
  }

  private async handleReceivedIntegrationEvent(
    handler: Application.IHandleIntegrationEvent,
    event: Infra.EventBus.IntegrationEvent<any>,
    m: Msg,
  ) {
    const reply = await handler.handle(event);
    // if (reply.isOk && reply.isOk() && m.reply) {
    //   return this.nc.publish(
    //     m.reply,
    //     jsonCodec.encode({
    //       isOk: true,
    //       data: reply.value,
    //     }),
    //   );
    // } else if (reply.isFail && reply.isFail() && m.reply) {
    //   return this.nc.publish(
    //     m.reply,
    //     jsonCodec.encode({
    //       isOk: false,
    //       error: reply.value,
    //     }),
    //   );
    // }
    if (!reply) return;
    // else console.error('Reply is neither ok nor error:', reply);
  }
}
