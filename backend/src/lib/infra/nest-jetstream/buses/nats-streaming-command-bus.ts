import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  NatsConnection,
  JSONCodec,
  JetStreamClient,
  JetStreamPublishOptions,
  consumerOpts,
  createInbox,
  headers,
  MsgHdrs,
} from 'nats';
import { Application, Infra } from '@bitloops/bl-boilerplate-core';
import { NestjsJetstream } from '../nestjs-jetstream.class';
import { ASYNC_LOCAL_STORAGE, ProvidersConstants } from '../jetstream.constants';
import { ContextPropagation } from './utils/context-propagation';

const jsonCodec = JSONCodec();

@Injectable()
export class NatsStreamingCommandBus implements Infra.CommandBus.IStreamCommandBus {
  private readonly logger = new Logger(NatsStreamingCommandBus.name);
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

  private getCorelationId() {
    return this.asyncLocalStorage.getStore()?.get('correlationId');
  }

  private getContext() {
    return this.asyncLocalStorage.getStore()?.get('context') || {};
  }

  async publish(command: Application.Command): Promise<void> {
    const boundedContext = command.metadata.boundedContextId;
    const stream = NatsStreamingCommandBus.getStreamName(boundedContext);
    const subject = `${stream}.${command.constructor.name}`;
    command.correlationId = this.getCorelationId();
    command.context = this.getContext();
    const headers = this.generateHeaders(command);
    const options: Partial<JetStreamPublishOptions> = { msgID: '', headers };
    const message = jsonCodec.encode(command);
    this.logger.log('publishing command to:' + subject);

    await this.js.publish(subject, message, options);
  }

  async subscribe(subject: string, handler: Application.ICommandHandler<any, any>) {
    const durableName = NatsStreamingCommandBus.getDurableName(subject, handler);
    const opts = consumerOpts();
    opts.durable(durableName);
    opts.manualAck();
    opts.ackExplicit();
    opts.deliverTo(createInbox());

    const stream = subject.split('.')[0];
    await this.jetStreamProvider.createStreamIfNotExists(stream, subject);

    try {
      this.logger.log('Subscribing to command: ' + subject);
      // this.logger.log(`
      //   Subscribing ${subject}!
      // `);
      const sub = await this.js.subscribe(subject, opts);
      (async () => {
        for await (const m of sub) {
          try {
            const command = jsonCodec.decode(m.data) as any;

            const contextData = ContextPropagation.createStoreFromMessageHeaders(m.headers);

            const reply = await this.asyncLocalStorage.run(contextData, async () => {
              return handler.execute(command);
            });
            if (reply.isFail && reply.isFail() && reply.value.nakable) {
              m.nak();
            } else m.ack();

            this.logger.log(
              `[Command ${sub.getProcessed()}]: ${JSON.stringify(jsonCodec.decode(m.data))}`,
            );
          } catch (err) {
            // Depending on your use case, you might want to rethrow the error,
            // nack the message, or handle the error in another way.
            this.logger.log(
              `[Command ${subject}]: Error executing command: ${JSON.stringify(err)}`,
            );
            m.ack();
          }
        }
        this.logger.log('Exiting command loop...');
      })();
      this.logger.log('Subscribed to:' + subject);
    } catch (err) {
      this.logger.log(JSON.stringify({ subject, durableName }));
      this.logger.error('Error subscribing to streaming command:', err);
    }
  }

  unsubscribe(topic: string, commandHandler: Application.ICommandHandler<any, any>): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private generateHeaders(command: Application.Command): MsgHdrs {
    const h = headers();
    for (const [key, value] of Object.entries(command.metadata)) {
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

  static getSubjectFromHandler(handler: Application.ICommandHandler<any, any>): string {
    const command = handler.command;
    const boundedContext = handler.boundedContext;

    const stream = NatsStreamingCommandBus.getStreamName(boundedContext);
    return `${stream}.${command?.name}`;
  }

  static getSubjectFromCommandInstance(
    integrationEvent: Infra.EventBus.IntegrationEvent<any>,
  ): string {
    const boundedContext = integrationEvent.metadata.boundedContextId;
    const stream = NatsStreamingCommandBus.getStreamName(boundedContext);
    const subject = `${stream}.${integrationEvent.constructor.name}`;
    return subject;
  }

  static getStreamName(boundedContext: string) {
    return `Streams_Commands_${boundedContext}`;
  }

  static getDurableName(
    subject: string,

    handler: Application.ICommandHandler<any, any>,
  ) {
    // Durable name cannot contain a dot
    const subjectWithoutDots = subject.replace(/\./g, '-');
    return `${subjectWithoutDots}-${handler.constructor.name}`;
  }
}
