import { Controller, Get, Post, Inject, Sse, UseGuards, Request, Body } from '@nestjs/common';
import { Observable, interval, fromEvent, merge, of } from 'rxjs';
import { map, switchMap, takeWhile, tap, finalize } from 'rxjs/operators';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '@lib/infra/nest-auth-passport';
import { Infra, asyncLocalStorage } from '@bitloops/bl-boilerplate-core';
import { AuthEnvironmentVariables } from '@src/config/auth.configuration';
import {
  BUSES_TOKENS,
  NatsPubSubIntegrationEventsBus,
} from '@src/lib/infra/nest-jetstream';
import {
  AsyncLocalStorageInterceptor,
  JwtGrpcAuthGuard,
} from '@src/lib/infra/nest-auth-passport';
import { todo } from '../proto/generated/todo';
import { TodoAddedPubSubIntegrationEventHandler } from './pub-sub-handlers/todo-added.integration-handler';
import { TodoDeletedPubSubIntegrationEventHandler } from './pub-sub-handlers/todo-deleted.integration-handler';
import { TodoCompletedPubSubIntegrationEventHandler } from './pub-sub-handlers/todo-completed.integration-handler';
import { TodoUncompletedPubSubIntegrationEventHandler } from './pub-sub-handlers/todo-uncompleted.integration-handler';
import { TodoModifiedTitlePubSubIntegrationEventHandler } from './pub-sub-handlers/todo-modified-title.integration-handler';
import { Traceable } from '@src/lib/infra/telemetry';

type SSEClient = {
  id: string;
  userId: string;
  lastActivity: number;
  response: any;
};

export type Subscribers = {
  [subscriberId: string]: {
    timestamp: number;
    call?: any;
    authToken: string;
    userId: string;
  };
};
const subscribers: Subscribers = {};

export type Subscriptions = {
  [integrationEvent: string]: {
    subscribers: string[];
  };
};
const subscriptions: Subscriptions = {};

async function subscribe(
  subscriberId: string,
  topics: string[],
  call: any,
  resolveSubscription: (value: unknown) => void,
) {
  const ctx = asyncLocalStorage.getStore()?.get('context');
  await new Promise((resolve) => {
    // call.on('end', () => {
    //   resolveSubscription(true);
    //   resolve(true);
    // });

    // call.on('error', () => {
    //   resolveSubscription(true);
    //   resolve(true);
    // });

    // call.on('close', () => {
    //   resolveSubscription(true);
    //   resolve(true);
    // });

    // call.on('finish', () => {
    //   resolveSubscription(true);
    //   resolve(true);
    // });
    subscribers[subscriberId] = {
      timestamp: Date.now(),
      call,
      authToken: ctx.jwt,
      userId: ctx.userId,
    };
    topics.forEach((topic) => {
      if (!subscriptions[topic]) {
        subscriptions[topic] = {
          subscribers: [subscriberId],
        };
      } else {
        subscriptions[topic].subscribers.push(subscriberId);
      }
    });
  });
}

@Controller('sse/todos')
@UseGuards(JwtAuthGuard)
export class TodoSSEController {
  private readonly JWT_SECRET: string;
  private readonly JWT_LIFETIME_SECONDS: string;
  private readonly clients: Map<string, SSEClient> = new Map();
  private readonly HEARTBEAT_INTERVAL = 10000; // 10 seconds
  private readonly INACTIVITY_TIMEOUT = 600000; // 10 minutes

  constructor(
    @Inject(BUSES_TOKENS.PUBSUB_COMMAND_BUS)
    private readonly commandBus: Infra.CommandBus.IPubSubCommandBus,
    @Inject(BUSES_TOKENS.PUBSUB_QUERY_BYS)
    private readonly queryBus: Infra.QueryBus.IQueryBus,
    @Inject(BUSES_TOKENS.PUBSUB_INTEGRATION_EVENT_BUS)
    private readonly pubSubIntegrationEventBus: Infra.EventBus.IEventBus,
    private configService: ConfigService<AuthEnvironmentVariables, true>,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.JWT_SECRET = this.configService.get('jwtSecret', { infer: true });
    this.JWT_LIFETIME_SECONDS = this.configService.get('JWT_LIFETIME_SECONDS', {
      infer: true,
    });
    if (this.JWT_SECRET === '') {
      throw new Error('JWT_SECRET is not defined in env!');
    }
    this.setupCleanupInterval();
    // this.setupEventHandlers();
    this.subscribeToPubSubIntegrationEvents();
  }

  @Get('stream')
  @Sse()
  async stream(@Request() req): Promise<Observable<any>> {
    const headerValue = req.headers['x-request-id'];
    const clientId = (Array.isArray(headerValue) ? headerValue[0] : headerValue);
    const userId = req.user.id;

    const client: SSEClient = {
      id: clientId,
      userId,
      lastActivity: Date.now(),
      response: null,
    };

    if (!this.clients.has(clientId)) {
      this.clients.set(clientId, client);
    }

    // Send initial connection event
    this.sendToClient(clientId, { event: 'connected', data: { clientId } });

    // Return an observable that will be used to send events to the client
    return new Observable((subscriber) => {
      client.response = subscriber;

      // Send heartbeat every 30 seconds
      const heartbeatInterval = setInterval(() => {
        this.sendToClient(clientId, { event: 'heartbeat', data: { timestamp: new Date().toISOString() } });
      }, this.HEARTBEAT_INTERVAL);

      // Cleanup on client disconnect
      return () => {
        clearInterval(heartbeatInterval);
        this.clients.delete(clientId);
      };
    });
  }

  @Post('On')
  // @UseGuards(JwtAuthGuard)
  async on(
    @Request() req,
    @Body() body: { subscriberId: string; events: string[] },
  ) {
    console.log('on***', body);
    const { subscriberId, events } = body;
    const topics = [];
    for (const event of events) {
        switch (event) {
          case 'todo.added':
            topics.push(TodoAddedPubSubIntegrationEventHandler.name);
          case 'todo.deleted':
            topics.push(TodoDeletedPubSubIntegrationEventHandler.name);
          case 'todo.modified_title':
            topics.push(TodoModifiedTitlePubSubIntegrationEventHandler.name);
          case 'todo.completed':
            topics.push(TodoCompletedPubSubIntegrationEventHandler.name);
          case 'todo.uncompleted':
            topics.push(TodoUncompletedPubSubIntegrationEventHandler.name);
        }
      }
    subscribe(subscriberId, topics, (event: string, data: any) => this.broadcast(event, data), () => {});
  }

  async subscribeToPubSubIntegrationEvents() {
      // Added
      const addedHandler = new TodoAddedPubSubIntegrationEventHandler(
        subscriptions,
        subscribers,
      );
      const adddedTopic =
        NatsPubSubIntegrationEventsBus.getTopicFromHandler(addedHandler);
      console.log(`Subscribing to PubSub integration event ${adddedTopic}`);
      await this.pubSubIntegrationEventBus.subscribe(adddedTopic, addedHandler);
  
      // Deleted
      const deletedHandler = new TodoDeletedPubSubIntegrationEventHandler(
        subscriptions,
        subscribers,
      );
      const deletedTopic =
        NatsPubSubIntegrationEventsBus.getTopicFromHandler(deletedHandler);
      console.log(`Subscribing to PubSub integration event ${deletedTopic}`);
      await this.pubSubIntegrationEventBus.subscribe(
        deletedTopic,
        deletedHandler,
      );
  
      // Completed
      const completedHandler = new TodoCompletedPubSubIntegrationEventHandler(
        subscriptions,
        subscribers,
      );
      const completedTopic =
        NatsPubSubIntegrationEventsBus.getTopicFromHandler(completedHandler);
      console.log(`Subscribing to PubSub integration event ${completedTopic}`);
      await this.pubSubIntegrationEventBus.subscribe(
        completedTopic,
        completedHandler,
      );
  
      // Uncompleted
      const uncompletedHandler = new TodoUncompletedPubSubIntegrationEventHandler(
        subscriptions,
        subscribers,
      );
      const uncompletedTopic =
        NatsPubSubIntegrationEventsBus.getTopicFromHandler(uncompletedHandler);
      console.log(`Subscribing to PubSub integration event ${uncompletedTopic}`);
      await this.pubSubIntegrationEventBus.subscribe(
        uncompletedTopic,
        uncompletedHandler,
      );
  
      // ModifiedTitle
      const modifiedTitleHandler =
        new TodoModifiedTitlePubSubIntegrationEventHandler(
          subscriptions,
          subscribers,
        );
      const modifiedTitleTopic =
        NatsPubSubIntegrationEventsBus.getTopicFromHandler(modifiedTitleHandler);
      console.log(
        `Subscribing to PubSub integration event ${modifiedTitleTopic}`,
      );
      await this.pubSubIntegrationEventBus.subscribe(
        modifiedTitleTopic,
        modifiedTitleHandler,
      );
    }

  private sendToClient(clientId: string, payload: { event: string; data: any }) {
    const client = this.clients.get(clientId);
    if (client) {
      client.lastActivity = Date.now();
      client.response?.next({data: payload});
    }
  }

  private broadcast(event: string, data: any, userId?: string) {
    this.clients.forEach((client) => {
      if (!userId || client.userId === userId) {
        this.sendToClient(client.id, { event, data });
      }
    });
  }

  private setupCleanupInterval() {
    setInterval(() => {
      const now = Date.now();
      this.clients.forEach((client, clientId) => {
        if (now - client.lastActivity > this.INACTIVITY_TIMEOUT) {
          this.clients.delete(clientId);
        }
      });
    }, 60000); // Check every minute
  }

  private setupEventHandlers() {
    // Example event handlers - you'll need to adjust these based on your actual events
    this.eventEmitter.on('todo.added', (data: any) => {
      console.log('todo.added event received:', data);
      this.broadcast('todo.added', data, data.userId);
    });

    this.eventEmitter.on('todo.updated', (data: any) => {
      console.log('todo.updated event received:', data);
      this.broadcast('todo.updated', data, data.userId);
    });

    this.eventEmitter.on('todo.deleted', (data: any) => {
      console.log('todo.deleted event received:', data);
      this.broadcast('todo.deleted', data, data.userId);
    });

    this.eventEmitter.on('todo.completed', (data: any) => {
      console.log('todo.completed event received:', data);
      this.broadcast('todo.completed', data, data.userId);
    });

    this.eventEmitter.on('todo.uncompleted', (data: any) => {
      console.log('todo.uncompleted event received:', data);
      this.broadcast('todo.uncompleted', data, data.userId);
    });
  }
}
