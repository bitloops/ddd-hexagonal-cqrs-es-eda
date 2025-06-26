import { Application, ok, Either } from '@bitloops/bl-boilerplate-core';
import { TodoModifiedTitleIntegrationEvent } from '@src/lib/bounded-contexts/todo/todo/contracts/integration-events/todo-modified-title.integration-event';
import { todo } from '../../proto/generated/todo';
import { Subscriptions, Subscribers } from '../todo.sse.controller';

export class TodoModifiedTitlePubSubIntegrationEventHandler
  implements Application.IHandleIntegrationEvent
{
  constructor(
    private readonly subscriptions: Subscriptions,
    private readonly subscribers: Subscribers,
  ) {}
  get event() {
    return TodoModifiedTitleIntegrationEvent;
  }

  get boundedContext() {
    return TodoModifiedTitleIntegrationEvent.boundedContextId;
  }

  get version() {
    return TodoModifiedTitleIntegrationEvent.versions[0]; // here output will be 'v1'
  }

  public async handle(
    event: TodoModifiedTitleIntegrationEvent,
  ): Promise<Either<void, never>> {
    console.log(
      `[TodoModifiedTitleIntegrationEvent]: Successfully received TodoModifiedTitle PubSub IntegrationEvent`,
    );
    const { payload } = event;

    const { userId } = payload;
  
    const subscription =
      this.subscriptions[TodoModifiedTitlePubSubIntegrationEventHandler.name];
    const subscriptionsSubscribers = subscription?.subscribers;
    console.log('found subscribers', subscriptionsSubscribers);
    if (subscriptionsSubscribers) {
      for (const subscriber of subscriptionsSubscribers) {
        const call = this.subscribers[subscriber]?.call;
        console.log('subscriber call', !!call);
        if (call) {
          call('todo.modified_title', {
            id: payload.todoId,
            userId: userId,
            title: payload.title,
          }, userId);
        }
      }
    }

    return ok();
  }
}
