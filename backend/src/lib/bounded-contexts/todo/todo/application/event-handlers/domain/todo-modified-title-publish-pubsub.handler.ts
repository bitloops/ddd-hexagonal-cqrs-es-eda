import { Infra, Application, ok, Either } from '@bitloops/bl-boilerplate-core';
import { Inject } from '@nestjs/common';
import { TodoModifiedTitleDomainEvent } from '../../../domain/events/todo-modified-title.event';
import { PubSubIntegrationEventBusToken } from '../../../constants';
import { TodoModifiedTitleIntegrationEvent } from '../../../contracts/integration-events/todo-modified-title.integration-event';
import { Traceable } from '@bitloops/bl-boilerplate-infra-telemetry';

export class TodoModifiedTitleDomainToPubSubIntegrationEventHandler
  implements Application.IHandleDomainEvent
{
  constructor(
    @Inject(PubSubIntegrationEventBusToken)
    private eventBus: Infra.EventBus.IEventBus,
  ) {}
  get event() {
    return TodoModifiedTitleDomainEvent;
  }

  get boundedContext(): string {
    return 'Todo';
  }

  @Traceable({
    operation: '[Todo] TodoModifiedTitlePubSubDomainEventHandler',
    serviceName: 'Todo',
    metrics: {
      name: '[Todo] TodoModifiedTitlePubSubDomainEventHandler',
      category: 'domainEventHandler',
    },
  })
  public async handle(
    event: TodoModifiedTitleDomainEvent,
  ): Promise<Either<void, never>> {
    const events = TodoModifiedTitleIntegrationEvent.create(event);

    await this.eventBus.publish(events);

    console.log(
      `[TodoModifiedTitleDomainEventHandler]: Successfully published TodoModifiedTitlePubSubIntegrationEvent`,
    );
    return ok();
  }
}
