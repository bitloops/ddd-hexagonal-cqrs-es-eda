import { Infra, Application, Either, ok } from '@bitloops/bl-boilerplate-core';
import { UserEmailChangedIntegrationEvent } from '@src/lib/bounded-contexts/iam/authentication/contracts/integration-events/user-email-changed.integration-event';
import { ChangeUserEmailCommand } from '../../../commands/change-user-email.command';
import { Traceable } from '@bitloops/bl-boilerplate-infra-telemetry';
import { StreamingCommandBusToken } from '../../../constants';
import { Inject } from '@nestjs/common';

export class UserEmailChangedIntegrationEventHandler
  implements Application.IHandleIntegrationEvent
{
  constructor(
    @Inject(StreamingCommandBusToken)
    private commandBus: Infra.CommandBus.IStreamCommandBus,
  ) {}

  get event() {
    return UserEmailChangedIntegrationEvent;
  }

  get boundedContext() {
    return UserEmailChangedIntegrationEvent.boundedContextId;
  }

  get version() {
    return UserEmailChangedIntegrationEvent.versions[0]; // here output will be 'v1'
  }

  @Traceable({
    operation: '[Marketing] UserEmailChangedIntegrationEventHandler',
    serviceName: 'Marketing',
    metrics: {
      name: '[Marketing] UserEmailChangedIntegrationEventHandler',
      category: 'integrationEventHandler',
    },
  })
  public async handle(
    event: UserEmailChangedIntegrationEvent,
  ): Promise<Either<void, never>> {
    const { payload } = event;
    const command = new ChangeUserEmailCommand({
      userId: payload.userId,
      email: payload.email,
    });
    await this.commandBus.publish(command);

    console.log(
      `[UserEmailChangedIntegrationEvent]: Successfully sent UpdateUserEmail`,
    );
    return ok();
  }
}
