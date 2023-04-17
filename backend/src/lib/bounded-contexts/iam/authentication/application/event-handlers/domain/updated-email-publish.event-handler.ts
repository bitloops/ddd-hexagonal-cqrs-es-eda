import { Infra, Application, Either, ok } from '@bitloops/bl-boilerplate-core';
import { Inject } from '@nestjs/common';
import { StreamingIntegrationEventBusToken } from '../../../constants';
import { UserEmailChangedIntegrationEvent } from '../../../contracts/integration-events/user-email-changed.integration-event';
import { UserUpdatedEmailDomainEvent } from '../../../domain/events/user-updated-email.event';
import { Traceable } from '@bitloops/bl-boilerplate-infra-telemetry';

export class UserUpdatedEmailPublishIntegrationEventHandler
  implements Application.IHandleDomainEvent
{
  constructor(
    @Inject(StreamingIntegrationEventBusToken)
    private eventBus: Infra.EventBus.IEventBus,
  ) {}

  get event() {
    return UserUpdatedEmailDomainEvent;
  }

  get boundedContext(): string {
    return 'IAM';
  }

  @Traceable({
    operation: '[IAM] UpdatedEmailDomainEventHandler',
    serviceName: 'authentication',
    metrics: {
      name: '[IAM] UpdatedEmailDomainEventHandler',
      category: 'domainEventHandler',
    },
  })
  public async handle(
    event: UserUpdatedEmailDomainEvent,
  ): Promise<Either<void, never>> {
    const events = UserEmailChangedIntegrationEvent.create(event);
    await this.eventBus.publish(events);

    console.log(
      `[UserUpdatedEmailPublishIntegrationEventHandler]: Successfully published UserUpdatedEmailIntegrationEvent`,
    );
    return ok();
  }
}
