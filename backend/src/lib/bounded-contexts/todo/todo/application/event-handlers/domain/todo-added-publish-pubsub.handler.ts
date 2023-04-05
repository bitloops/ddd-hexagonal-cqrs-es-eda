import { Infra, Application, ok, Either } from '@bitloops/bl-boilerplate-core';
import { Inject } from '@nestjs/common';
import { TodoAddedDomainEvent } from '../../../domain/events/todo-added.event';
import { PubSubIntegrationEventBusToken } from '../../../constants';
import { TodoAddedIntegrationEvent } from '../../../contracts/integration-events/todo-added.integration-event';
import { Traceable } from '@bitloops/bl-boilerplate-infra-telemetry';

export class TodoAddedDomainToPubSubIntegrationEventHandler
  implements Application.IHandleDomainEvent
{
  constructor(
    @Inject(PubSubIntegrationEventBusToken)
    private eventBus: Infra.EventBus.IEventBus,
  ) {}
  get event() {
    return TodoAddedDomainEvent;
  }

  get boundedContext(): string {
    return 'Todo';
  }

  @Traceable({
    operation: '[Todo] TodoAddedPubSubDomainEventHandler',
    serviceName: 'Todo',
    metrics: {
      name: '[Todo] TodoAddedPubSubDomainEventHandler',
      category: 'domainEventHandler',
    },
  })
  public async handle(
    event: TodoAddedDomainEvent,
  ): Promise<Either<void, never>> {
    const events = TodoAddedIntegrationEvent.create(event);

    await this.eventBus.publish(events);

    console.log(
      `[TodoAddedDomainEventHandler]: Successfully published TodoAddedPubSubIntegrationEvent`,
    );
    return ok();
  }
}
