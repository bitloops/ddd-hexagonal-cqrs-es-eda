import { Inject, Injectable, Logger } from '@nestjs/common';
import { NatsConnection, JSONCodec, headers, MsgHdrs } from 'nats';
import { Application, Infra } from '@bitloops/bl-boilerplate-core';
import { ASYNC_LOCAL_STORAGE, ProvidersConstants, TIMEOUT_MILLIS } from '../jetstream.constants';
import { AsyncLocalStorage } from 'node:async_hooks';
import { ContextPropagation } from './utils/context-propagation';

const jsonCodec = JSONCodec();

@Injectable()
export class NatsPubSubQueryBus implements Infra.QueryBus.IQueryBus {
  private readonly logger = new Logger(NatsPubSubQueryBus.name);
  private nc: NatsConnection;
  private static queryPrefix = 'Query_';
  constructor(
    @Inject(ProvidersConstants.JETSTREAM_PROVIDER) private readonly nats: any,
    // @Optional()
    @Inject(ASYNC_LOCAL_STORAGE)
    private readonly asyncLocalStorage: AsyncLocalStorage<any>,
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

  async request(query: Application.Query): Promise<any> {
    const topic = NatsPubSubQueryBus.getTopicFromQueryInstance(query);
    this.logger.log('Requesting query:' + topic);
    query.correlationId = this.getCorelationId();
    query.context = this.getContext();
    const headers = this.generateHeaders(query);

    try {
      const response = await this.nc.request(topic, jsonCodec.encode(query), {
        headers,
        timeout: this.timeoutMillis,
      });

      const data = jsonCodec.decode(response.data);
      this.logger.log('Response in query request:' + data);
      return data;
    } catch (err: any) {
      this.logger.error(
        `[${topic}]: Error in query request. Error message: ${err.message}`,
        err.stack,
      );
    }
  }

  async pubSubSubscribe(subject: string, handler: Application.IQueryHandler<any, any>) {
    try {
      this.logger.log('Subscribing query to: ' + subject);
      // this.logger.log(`
      //   Subscribing ${subject}!
      // `);
      const sub = this.nc.subscribe(subject);
      (async () => {
        for await (const m of sub) {
          try {
            const query = jsonCodec.decode(m.data);

            const contextData = ContextPropagation.createStoreFromMessageHeaders(m.headers);
            const reply = await this.asyncLocalStorage.run(contextData, () => {
              return handler.execute(query);
            });
            if (reply.isOk && reply.isOk() && m.reply) {
              this.nc.publish(
                m.reply,
                jsonCodec.encode({
                  isOk: true,
                  data: reply.value,
                }),
              );
            } else if (reply.isFail && reply.isFail() && m.reply) {
              this.nc.publish(
                m.reply,
                jsonCodec.encode({
                  isOk: false,
                  error: reply.value,
                }),
              );
            }

            this.logger.log(`[${sub.getProcessed()}]: ${JSON.stringify(jsonCodec.decode(m.data))}`);
          } catch (err: any) {
            this.logger.error(
              `[${subject}]: Error in query handling. Error message: ${err.message}`,
              err.stack,
            );
          }
        }
      })();
    } catch (err) {
      this.logger.error('Error in query subscription:', err);
    }
  }

  private generateHeaders(query: Application.Query): MsgHdrs {
    const h = headers();
    for (const [key, value] of Object.entries(query.metadata)) {
      if (key === 'context' && value) {
        h.append(key, JSON.stringify(value));
        continue;
      }
      if (value) {
        h.append(key, value.toString());
      }
    }
    return h;
  }

  static getTopicFromHandler(handler: Application.IQueryHandler<any, any>): string {
    const query = handler.query;
    const boundedContext = handler.boundedContext;

    return `${this.queryPrefix}${boundedContext}.${query.name}`;
  }

  static getTopicFromQueryInstance(query: Application.Query): string {
    const boundedContext = query.metadata.boundedContextId;
    const topic = `${this.queryPrefix}${boundedContext}.${query.constructor.name}`;
    return topic;
  }
}
