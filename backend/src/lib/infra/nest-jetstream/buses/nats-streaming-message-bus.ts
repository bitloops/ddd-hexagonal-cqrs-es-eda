import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  NatsConnection,
  JSONCodec,
  JetStreamClient,
  JetStreamPublishOptions,
  consumerOpts,
  createInbox,
} from 'nats';
import { randomUUID } from 'crypto';
import { Infra, Domain } from '@bitloops/bl-boilerplate-core';
import { NestjsJetstream } from '../nestjs-jetstream.class';
import { ProvidersConstants } from '../jetstream.constants';

const jsonCodec = JSONCodec();

@Injectable()
export class NatsStreamingMessageBus implements Infra.MessageBus.ISystemMessageBus {
  private readonly logger = new Logger(NatsStreamingMessageBus.name);
  private nc: NatsConnection;
  private js: JetStreamClient;
  constructor(
    @Inject(ProvidersConstants.JETSTREAM_PROVIDER)
    private readonly jetStreamProvider: NestjsJetstream,
  ) {
    this.nc = this.jetStreamProvider.getConnection();
    this.js = this.nc.jetstream();
  }

  async publish(topic: string, message: Infra.MessageBus.IMessage): Promise<void> {
    const options: Partial<JetStreamPublishOptions> = { msgID: randomUUID() };

    const messageEncoded = jsonCodec.encode(message);

    try {
      await this.js.publish(topic, messageEncoded, options);
    } catch (err) {
      // NatsError: 503
      this.logger.error('Error publishing message to topic: ' + topic, err);
    }
  }

  async subscribe(subject: string, handler: Infra.MessageBus.SubscriberHandler<any>) {
    // TODO: Fix durable name
    const durableName = 'test';

    const stream = subject.split('.')[0];
    await this.jetStreamProvider.createStreamIfNotExists(stream, subject);
    const opts = consumerOpts();
    opts.durable(durableName);
    opts.manualAck();
    opts.ackExplicit();
    opts.deliverTo(createInbox());

    try {
      // this.logger.log(`
      //   Subscribing ${subject}!
      // `);
      const sub = await this.js.subscribe(subject, opts);
      (async () => {
        for await (const m of sub) {
          const message = jsonCodec.decode(m.data) as any;

          await handler(message);
          m.ack();
        }
      })();
    } catch (err) {
      this.logger.error('Error subscribing to topic:', subject, err);
    }
  }
  unsubscribe<T extends Infra.MessageBus.IMessage>(
    topic: string,
    subscriberHandler: Infra.MessageBus.SubscriberHandler<T>,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getSubscriberHandlers<T extends Infra.MessageBus.IMessage>(
    topic: string,
  ): Infra.MessageBus.SubscriberHandler<T>[] {
    throw new Error('Method not implemented.');
  }
}
