import { Application, ok, Either } from '@bitloops/bl-boilerplate-core';
import { TodoAddedIntegrationEvent } from '@src/lib/bounded-contexts/todo/todo/contracts/integration-events/todo-added.integration-event';
import { todo } from '../../proto/generated/todo';
import { Subscriptions, Subscribers } from '../todo.sse.controller';

export class TodoAddedPubSubIntegrationEventHandler
  implements Application.IHandleIntegrationEvent
{
  constructor(
    private readonly subscriptions: Subscriptions,
    private readonly subscribers: Subscribers,
  ) {}
  get event() {
    return TodoAddedIntegrationEvent;
  }

  get boundedContext() {
    return TodoAddedIntegrationEvent.boundedContextId;
  }

  get version() {
    return TodoAddedIntegrationEvent.versions[0]; // here output will be 'v1'
  }

  public async handle(
    event: TodoAddedIntegrationEvent,
  ): Promise<Either<void, never>> {
    console.log(
      `[TodoAddedIntegrationEvent]: Successfully received TodoAdded PubSub IntegrationEvent`,
    );
    const { payload } = event;

    const { userId } = payload;

    const subscription =
      this.subscriptions[TodoAddedPubSubIntegrationEventHandler.name];
    const subscriptionsSubscribers = subscription?.subscribers;
    if (subscriptionsSubscribers) {
      for (const subscriber of subscriptionsSubscribers) {
        const call = this.subscribers[subscriber]?.call;
        if (call) {
          call('todo.added', {
            id: payload.todoId,
            title: payload.title,
            completed: false,
          }, userId);
        }
      }
    }

    return ok();
  }
}
