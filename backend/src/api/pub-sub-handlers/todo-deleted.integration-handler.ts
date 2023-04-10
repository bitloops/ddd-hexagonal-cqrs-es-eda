import { Application, ok, Either } from '@bitloops/bl-boilerplate-core';
import { TodoDeletedIntegrationEvent } from '@src/lib/bounded-contexts/todo/todo/contracts/integration-events/todo-deleted.integration-event';
import { todo } from '../../proto/generated/todo';
import { Subscriptions, Subscribers } from '../todo.grpc.controller';

export class TodoDeletedPubSubIntegrationEventHandler
  implements Application.IHandleIntegrationEvent
{
  constructor(
    private readonly subscriptions: Subscriptions,
    private readonly subscribers: Subscribers,
  ) {}
  get event() {
    return TodoDeletedIntegrationEvent;
  }

  get boundedContext() {
    return TodoDeletedIntegrationEvent.boundedContextId;
  }

  get version() {
    return TodoDeletedIntegrationEvent.versions[0]; // here output will be 'v1'
  }

  public async handle(
    event: TodoDeletedIntegrationEvent,
  ): Promise<Either<void, never>> {
    console.log(
      `[TodoDeletedIntegrationEvent]: Successfully received TodoDeleted PubSub IntegrationEvent`,
    );
    const { payload } = event;

    const { userId } = payload;
    // console.log('TodoIntegrationEvent', event);
    // console.log('subscriptions', this.subscriptions);
    // console.log('subscribers', this.subscribers);
    // const call = this.subscribers[userId]?.call;
    // console.log('call', call);
    const subscription =
      this.subscriptions[TodoDeletedPubSubIntegrationEventHandler.name];
    const subscriptionsSubscribers = subscription?.subscribers;
    console.log('found subscribers', subscriptionsSubscribers);
    if (subscriptionsSubscribers) {
      for (const subscriber of subscriptionsSubscribers) {
        const call = this.subscribers[subscriber]?.call;
        console.log('subscriber call', !!call);
        if (call) {
          const todoObject = new todo.Todo({
            id: payload.todoId,
            userId: userId,
          });
          // console.log({ todoObject });
          const message = new todo.OnEvent({
            onDeleted: todoObject,
          });
          call.write(message as any);
          // const subscriberIds = Object.keys(this.subscribers);
          // for (const subscriberId of subscriberIds) {
          //   const subscriber = this.subscribers[subscriberId];
          //   const call = subscriber.call;
          // }
        }
      }
    }

    return ok();
  }
}
