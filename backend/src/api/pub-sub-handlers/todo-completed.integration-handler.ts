import { Application, ok, Either } from '@bitloops/bl-boilerplate-core';
import { TodoCompletedIntegrationEvent } from '@src/lib/bounded-contexts/todo/todo/contracts/integration-events/todo-completed.integration-event';
import { Subscriptions, Subscribers } from '../todo.sse.controller';

export class TodoCompletedPubSubIntegrationEventHandler
  implements Application.IHandleIntegrationEvent
{
  constructor(
    private readonly subscriptions: Subscriptions,
    private readonly subscribers: Subscribers,
  ) {}
  get event() {
    return TodoCompletedIntegrationEvent;
  }

  get boundedContext() {
    return TodoCompletedIntegrationEvent.boundedContextId;
  }

  get version() {
    return TodoCompletedIntegrationEvent.versions[0]; // here output will be 'v1'
  }

  public async handle(
    event: TodoCompletedIntegrationEvent,
  ): Promise<Either<void, never>> {
    console.log(
      `[TodoCompletedIntegrationEvent]: Successfully received TodoCompleted PubSub IntegrationEvent`,
    );
    const { payload } = event;

    const { userId } = payload;

    const subscription =
      this.subscriptions[TodoCompletedPubSubIntegrationEventHandler.name];
    const subscriptionsSubscribers = subscription?.subscribers;
    if (subscriptionsSubscribers) {
      for (const subscriber of subscriptionsSubscribers) {
        const send = this.subscribers[subscriber]?.send;
        if (send) {
          send('todo.completed', {
            id: payload.todoId,
            userId: userId,
          }, userId);
        }
      }
    }

    return ok();
  }
}
