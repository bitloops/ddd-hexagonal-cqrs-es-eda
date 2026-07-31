import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  MessageEvent,
  OnModuleDestroy,
  OnModuleInit,
  Post,
  Request,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { Observable, Subscriber } from 'rxjs';

import { Infra } from '@bitloops/bl-boilerplate-core';
import { JwtAuthGuard } from '@lib/infra/nest-auth-passport';
import {
  BUSES_TOKENS,
  NatsPubSubIntegrationEventsBus,
} from '@src/lib/infra/nest-jetstream';
import { TodoAddedPubSubIntegrationEventHandler } from './pub-sub-handlers/todo-added.integration-handler';
import { TodoCompletedPubSubIntegrationEventHandler } from './pub-sub-handlers/todo-completed.integration-handler';
import { TodoDeletedPubSubIntegrationEventHandler } from './pub-sub-handlers/todo-deleted.integration-handler';
import { TodoModifiedTitlePubSubIntegrationEventHandler } from './pub-sub-handlers/todo-modified-title.integration-handler';
import { TodoUncompletedPubSubIntegrationEventHandler } from './pub-sub-handlers/todo-uncompleted.integration-handler';

type SSEPayload = { event: string; data: unknown };
type SSEDelivery = (event: string, data: unknown, userId: string) => void;

type SSEClient = {
  id: string;
  userId: string;
  lastActivity: number;
  response: Subscriber<MessageEvent> | null;
};

export type Subscribers = Record<
  string,
  {
    userId: string;
    send: SSEDelivery;
  }
>;

export type Subscriptions = Record<
  string,
  {
    subscribers: string[];
  }
>;

const subscribers: Subscribers = {};
const subscriptions: Subscriptions = {};

const subscriptionHandlers = {
  'todo.added': TodoAddedPubSubIntegrationEventHandler,
  'todo.deleted': TodoDeletedPubSubIntegrationEventHandler,
  'todo.modified_title': TodoModifiedTitlePubSubIntegrationEventHandler,
  'todo.completed': TodoCompletedPubSubIntegrationEventHandler,
  'todo.uncompleted': TodoUncompletedPubSubIntegrationEventHandler,
} as const;

type TodoSubscriptionName = keyof typeof subscriptionHandlers;

@Controller('sse/todos')
@UseGuards(JwtAuthGuard)
export class TodoSSEController implements OnModuleInit, OnModuleDestroy {
  private readonly clients = new Map<string, SSEClient>();
  private readonly heartbeatIntervalMs = 10_000;
  private readonly inactivityTimeoutMs = 600_000;
  private cleanupTimer: NodeJS.Timeout | undefined;

  constructor(
    @Inject(BUSES_TOKENS.PUBSUB_INTEGRATION_EVENT_BUS)
    private readonly pubSubIntegrationEventBus: Infra.EventBus.IEventBus,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.subscribeToPubSubIntegrationEvents();
    this.cleanupTimer = setInterval(() => this.removeInactiveClients(), 60_000);
    this.cleanupTimer.unref();
  }

  onModuleDestroy(): void {
    if (this.cleanupTimer) clearInterval(this.cleanupTimer);
  }

  @Get('stream')
  @Sse()
  stream(@Request() request: { headers: Record<string, string | string[]>; user: { id: string } }) {
    const headerValue = request.headers['x-request-id'];
    const clientId = Array.isArray(headerValue) ? headerValue[0] : headerValue;
    if (!clientId) throw new BadRequestException('x-request-id is required');

    const client: SSEClient = {
      id: clientId,
      userId: request.user.id,
      lastActivity: Date.now(),
      response: null,
    };
    this.clients.set(clientId, client);

    return new Observable<MessageEvent>((response) => {
      client.response = response;
      this.sendToClient(clientId, { event: 'connected', data: { clientId } });

      const heartbeatTimer = setInterval(() => {
        this.sendToClient(clientId, {
          event: 'heartbeat',
          data: { timestamp: new Date().toISOString() },
        });
      }, this.heartbeatIntervalMs);

      return () => {
        clearInterval(heartbeatTimer);
        this.removeClient(clientId);
      };
    });
  }

  @Post(['subscriptions', 'On'])
  subscribe(
    @Request() request: { user: { id: string } },
    @Body() body: { subscriberId: string; events: string[] },
  ): void {
    const client = this.clients.get(body.subscriberId);
    if (!client || client.userId !== request.user.id) {
      throw new BadRequestException('Unknown SSE subscriber');
    }

    this.removeSubscriptions(body.subscriberId);
    subscribers[body.subscriberId] = {
      userId: request.user.id,
      send: (event, data, userId) => this.broadcast(event, data, userId),
    };

    for (const event of new Set(body.events)) {
      if (!(event in subscriptionHandlers)) continue;
      const handler = subscriptionHandlers[event as TodoSubscriptionName];
      const subscription = (subscriptions[handler.name] ??= { subscribers: [] });
      subscription.subscribers.push(body.subscriberId);
    }
  }

  private async subscribeToPubSubIntegrationEvents(): Promise<void> {
    const handlers = [
      new TodoAddedPubSubIntegrationEventHandler(subscriptions, subscribers),
      new TodoDeletedPubSubIntegrationEventHandler(subscriptions, subscribers),
      new TodoCompletedPubSubIntegrationEventHandler(subscriptions, subscribers),
      new TodoUncompletedPubSubIntegrationEventHandler(subscriptions, subscribers),
      new TodoModifiedTitlePubSubIntegrationEventHandler(subscriptions, subscribers),
    ];

    await Promise.all(
      handlers.map((handler) =>
        this.pubSubIntegrationEventBus.subscribe(
          NatsPubSubIntegrationEventsBus.getTopicFromHandler(handler),
          handler,
        ),
      ),
    );
  }

  private sendToClient(clientId: string, payload: SSEPayload): void {
    const client = this.clients.get(clientId);
    if (!client) return;
    client.lastActivity = Date.now();
    client.response?.next({ data: payload });
  }

  private broadcast(event: string, data: unknown, userId: string): void {
    for (const client of this.clients.values()) {
      if (client.userId === userId) this.sendToClient(client.id, { event, data });
    }
  }

  private removeInactiveClients(): void {
    const now = Date.now();
    for (const client of this.clients.values()) {
      if (now - client.lastActivity > this.inactivityTimeoutMs) this.removeClient(client.id);
    }
  }

  private removeClient(clientId: string): void {
    this.clients.delete(clientId);
    delete subscribers[clientId];
    this.removeSubscriptions(clientId);
  }

  private removeSubscriptions(clientId: string): void {
    for (const subscription of Object.values(subscriptions)) {
      subscription.subscribers = subscription.subscribers.filter((id) => id !== clientId);
    }
  }
}
