import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  NatsConnection,
  JSONCodec,
  JetStreamClient,
  JetStreamPublishOptions,
  consumerOpts,
  createInbox,
  MsgHdrs,
  headers,
} from 'nats';
import { Application, Domain, Infra } from '@bitloops/bl-boilerplate-core';
import { NestjsJetstream } from '../nestjs-jetstream.class';
import { ASYNC_LOCAL_STORAGE, METADATA_HEADERS, ProvidersConstants } from '../jetstream.constants';
import { ContextPropagation } from './utils/context-propagation';

const jsonCodec = JSONCodec();

@Injectable()
export class NatsStreamingIntegrationEventBus implements Infra.EventBus.IEventBus {
  private readonly logger = new Logger(NatsStreamingIntegrationEventBus.name);
  private nc: NatsConnection;
  private js: JetStreamClient;
  constructor(
    @Inject(ProvidersConstants.JETSTREAM_PROVIDER)
    private readonly jetStreamProvider: NestjsJetstream,
    @Inject(ASYNC_LOCAL_STORAGE)
    private readonly asyncLocalStorage: any,
  ) {
    this.nc = this.jetStreamProvider.getConnection();
    this.js = this.nc.jetstream();
  }

  async publish(
    eventsInput: Infra.EventBus.IntegrationEvent<any> | Infra.EventBus.IntegrationEvent<any>[],
  ): Promise<void> {
    let integrationEvents: Infra.EventBus.IntegrationEvent<any>[];
    Array.isArray(eventsInput)
      ? (integrationEvents = eventsInput)
      : (integrationEvents = [eventsInput]);
    integrationEvents.forEach(async (integrationEvent) => {
      integrationEvent.correlationId = this.getCorelationId();
      integrationEvent.context = this.getContext();
      const headers = this.generateHeaders(integrationEvent);
      const options: Partial<JetStreamPublishOptions> = {
        msgID: integrationEvent.metadata.messageId,
        headers,
      };

      const message = jsonCodec.encode(integrationEvent);
      const subject =
        NatsStreamingIntegrationEventBus.getSubjectFromEventInstance(integrationEvent);
      this.logger.log('publishing integration event to:', subject);

      try {
        await this.js.publish(subject, message, options);
      } catch (err) {
        // NatsError: 503
        this.logger.error('Error publishing integration event to:' + subject, err);
      }

      // the jetstream returns an acknowledgement with the
      // stream that captured the message, it's assigned sequence
      // and whether the message is a duplicate.
      // const stream = pubAck.stream;
      // const seq = pubAck.seq;
      // const duplicate = pubAck.duplicate;
    });
  }

  async subscribe(subject: string, handler: Application.IHandleIntegrationEvent) {
    const durableName = NatsStreamingIntegrationEventBus.getDurableName(subject, handler);

    const stream = subject.split('.')[0];
    await this.jetStreamProvider.createStreamIfNotExists(stream, subject);
    const opts = consumerOpts();
    opts.durable(durableName);
    opts.manualAck();
    opts.ackExplicit();
    opts.deliverTo(createInbox());

    try {
      this.logger.log('Subscribing integration event to: ', subject);
      // this.logger.log(`
      //   Subscribing ${subject}!
      // `);
      const sub = await this.js.subscribe(subject, opts);
      (async () => {
        for await (const m of sub) {
          try {
            const integrationEvent = jsonCodec.decode(m.data) as any;

            const contextData = ContextPropagation.createStoreFromMessageHeaders(m.headers);
            const reply = await this.asyncLocalStorage.run(contextData, async () => {
              return handler.handle(integrationEvent);
            });

            if (reply.isFail && reply.isFail() && reply.value.nakable) {
              m.nak();
            } else m.ack();

            this.logger.log(`[${sub.getProcessed()}]: ${JSON.stringify(jsonCodec.decode(m.data))}`);
          } catch (err) {
            // Depending on your use case, you might want to rethrow the error,
            // nack the message, or handle the error in another way.
            this.logger.error(
              `[${subject}]: Error handling integration event:, ${JSON.stringify(err)}`,
            );
            m.ack();
          }
        }
      })();
    } catch (err) {
      this.logger.error('Error subscribing to integration event:', err);
    }
  }

  unsubscribe<T extends Domain.IDomainEvent<any>>(
    topic: string,
    eventHandler: Application.IHandleIntegrationEvent,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private getCorelationId() {
    return this.asyncLocalStorage.getStore()?.get('correlationId');
  }

  private getContext() {
    return this.asyncLocalStorage.getStore()?.get('context') || {};
  }

  private generateHeaders(domainEvent: Infra.EventBus.IntegrationEvent<any>): MsgHdrs {
    const h = headers();
    for (const [key, value] of Object.entries(domainEvent.metadata)) {
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

  static getSubjectFromHandler(handler: Application.IHandleIntegrationEvent): string {
    const event = handler.event;
    const boundedContext = handler.boundedContext;
    const stream = NatsStreamingIntegrationEventBus.getStreamName(boundedContext);
    const version = handler.version;
    const subject = `${stream}.${event.name}.${version}`;
    return subject;
  }

  static getSubjectFromEventInstance(
    integrationEvent: Infra.EventBus.IntegrationEvent<any>,
  ): string {
    const boundedContext = integrationEvent.metadata.boundedContextId;
    const stream = NatsStreamingIntegrationEventBus.getStreamName(boundedContext);
    const version = integrationEvent.metadata.version;
    const subject = `${stream}.${integrationEvent.constructor.name}.${version}`;
    return subject;
  }

  static getStreamName(boundedContext: string) {
    return `Streams_IntegrationEvents_${boundedContext}`;
  }

  static getDurableName(subject: string, handler: Application.IHandleIntegrationEvent) {
    // Durable name cannot contain a dot
    const subjectWithoutDots = subject.replace(/\./g, '-');
    return `${subjectWithoutDots}-${handler.constructor.name}`;
  }
}
