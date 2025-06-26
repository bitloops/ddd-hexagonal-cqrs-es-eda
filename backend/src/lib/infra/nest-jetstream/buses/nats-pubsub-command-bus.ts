import { Inject, Injectable, Logger } from '@nestjs/common';
import { NatsConnection, JSONCodec, headers, Msg, MsgHdrs } from 'nats';
import { Application, Infra } from '@bitloops/bl-boilerplate-core';
import { ASYNC_LOCAL_STORAGE, TIMEOUT_MILLIS, ProvidersConstants } from '../jetstream.constants';
import { ContextPropagation } from './utils/context-propagation';

const jsonCodec = JSONCodec();

@Injectable()
export class NatsPubSubCommandBus implements Infra.CommandBus.IPubSubCommandBus {
  private readonly logger = new Logger(NatsPubSubCommandBus.name);
  private nc: NatsConnection;
  private static commandPrefix = 'Commands_';

  constructor(
    @Inject(ProvidersConstants.JETSTREAM_PROVIDER) private readonly nats: any,
    @Inject(ASYNC_LOCAL_STORAGE)
    private readonly asyncLocalStorage: any,
    @Inject(TIMEOUT_MILLIS)
    private readonly timeoutMillis: number,
  ) {
    this.nc = this.nats.getConnection();
  }

  private getCorelationId() {
    return this.asyncLocalStorage.getStore()?.get('correlationId');
  }

  private getContext() {
    return this.asyncLocalStorage.getStore()?.get('context') || {};
  }

  async publish(command: Application.Command): Promise<void> {
    const topic = NatsPubSubCommandBus.getTopicFromCommandInstance(command);
    this.logger.log('Publishing in :' + topic);
    // TODO get from context and add both to headers and message metadata
    command.correlationId = this.getCorelationId();
    command.context = this.getContext();
    const headers = this.generateHeaders(command);

    this.nc.publish(topic, jsonCodec.encode(command), { headers });
  }

  async request(command: Application.Command): Promise<any> {
    const topic = NatsPubSubCommandBus.getTopicFromCommandInstance(command);

    this.logger.log('Requesting in topic:' + topic);
    // console.log('this.asyncLocalStorage.getStore()', this.asyncLocalStorage.getStore());
    command.correlationId = this.getCorelationId();
    command.context = this.getContext();
    // command
    const headers = this.generateHeaders(command);

    try {
      const response = await this.nc.request(topic, jsonCodec.encode(command), {
        headers,
        timeout: this.timeoutMillis,
      });
      return jsonCodec.decode(response.data);
    } catch (error: any) {
      this.logger.error(
        `Error in command request for: ${topic}. Error message: ${error.message}`,
        error.stack,
      );

      return { isOk: false, data: error.message };
    }
  }

  async pubSubSubscribe(subject: string, handler: Application.ICommandHandler<any, any>) {
    try {
      this.logger.log('Subscribing to:' + subject);
      const sub = this.nc.subscribe(subject);
      (async () => {
        for await (const m of sub) {
          try {
            const command = jsonCodec.decode(m.data);

            const contextData = ContextPropagation.createStoreFromMessageHeaders(m.headers);

            await this.asyncLocalStorage.run(contextData, async () => {
              return this.handleReceivedCommand(handler, command, m);
            });
          } catch (err: any) {
            this.logger.error(
              `[${subject}]: Error in command handling. Error message: ${err.message}`,
              err.stack,
            );
          }
        }
      })();
    } catch (err) {
      this.logger.error('Error in command-bus subscribe::', err);
    }
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

  static getTopicFromHandler(handler: Application.ICommandHandler<any, any>): string {
    const command = handler.command;
    const boundedContext = handler.boundedContext;

    return `${this.commandPrefix}${boundedContext}.${command.name}`;
  }

  static getTopicFromCommandInstance(command: Application.Command): string {
    const boundedContext = command.metadata.boundedContextId;
    const topic = `${this.commandPrefix}${boundedContext}.${command.constructor.name}`;
    return topic;
  }

  private async handleReceivedCommand(
    handler: Application.ICommandHandler<any, any>,
    command: any,
    m: Msg,
  ): Promise<void> {
    const reply = await handler.execute(command);
    if (reply.isOk && reply.isOk() && m.reply) {
      return this.nc.publish(
        m.reply,
        jsonCodec.encode({
          isOk: true,
          data: reply.value,
        }),
      );
    } else if (reply.isFail && reply.isFail() && m.reply) {
      return this.nc.publish(
        m.reply,
        jsonCodec.encode({
          isOk: false,
          error: reply.value,
        }),
      );
    }
    if (!reply) return;
    else this.logger.error('Reply is neither ok nor error:' + reply);
  }
}
