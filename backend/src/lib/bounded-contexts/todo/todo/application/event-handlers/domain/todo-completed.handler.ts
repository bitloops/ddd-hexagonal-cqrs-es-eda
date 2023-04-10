import { Infra, Application, Either, ok } from '@bitloops/bl-boilerplate-core';
import { Inject } from '@nestjs/common';
import { TodoCompletedDomainEvent } from '../../../domain/events/todo-completed.event';
import { TodoCompletedIntegrationEvent } from '../../../contracts/integration-events/todo-completed.integration-event';
import { StreamingIntegrationEventBusToken } from '../../../constants';
import { Traceable } from '@bitloops/bl-boilerplate-infra-telemetry';

export class TodoCompletedDomainToIntegrationEventHandler
  implements Application.IHandleDomainEvent
{
  constructor(
    @Inject(StreamingIntegrationEventBusToken)
    private integrationEventBus: Infra.EventBus.IEventBus,
  ) {}
  get event() {
    return TodoCompletedDomainEvent;
  }

  get boundedContext(): string {
    return 'Todo';
  }

  @Traceable({
    operation: '[Todo] TodoCompletedDomainEventHandler',
    serviceName: 'Todo',
    metrics: {
      name: '[Todo] TodoCompletedDomainEventHandler',
      category: 'domainEventHandler',
    },
  })
  public async handle(
    event: TodoCompletedDomainEvent,
  ): Promise<Either<void, never>> {
    const events = TodoCompletedIntegrationEvent.create(event);

    await this.integrationEventBus.publish(events);

    console.log(
      `[TodoCompletedDomainEventHandler]: Successfully published TodoCompletedIntegrationEvent`,
    );
    return ok();
  }
}
