import { Infra, Application, ok, Either } from '@bitloops/bl-boilerplate-core';
import { TodoCompletedIntegrationEvent } from '@src/lib/bounded-contexts/todo/todo/contracts/integration-events/todo-completed.integration-event';
import { IncrementTodosCommand } from '../../../commands/Increment-todos.command';
import { StreamingCommandBusToken } from '../../../constants';
import { Inject } from '@nestjs/common';
import { Traceable } from '@bitloops/bl-boilerplate-infra-telemetry';

export class TodoCompletedIntegrationEventHandler
  implements Application.IHandleIntegrationEvent
{
  constructor(
    @Inject(StreamingCommandBusToken)
    private commandBus: Infra.CommandBus.IStreamCommandBus,
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

  @Traceable({
    operation: '[Marketing] TodoCompletedIntegrationEventHandler',
    serviceName: 'Marketing',
    metrics: {
      name: '[Marketing] TodoCompletedIntegrationEventHandler',
      category: 'integrationEventHandler',
    },
  })
  public async handle(
    event: TodoCompletedIntegrationEvent,
  ): Promise<Either<void, never>> {
    const { payload } = event;
    const command = new IncrementTodosCommand({ id: payload.userId });
    await this.commandBus.publish(command);

    console.log(
      `[TodoCompletedIntegrationEvent]: Successfully sent IncrementTodosCommand`,
    );

    return ok();
  }
}
