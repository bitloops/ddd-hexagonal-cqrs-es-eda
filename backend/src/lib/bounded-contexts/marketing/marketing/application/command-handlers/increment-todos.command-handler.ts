import {
  Application,
  ok,
  Either,
  Domain,
  fail,
} from '@bitloops/bl-boilerplate-core';
import { Inject } from '@nestjs/common';
import { IncrementTodosCommand } from '../../commands/Increment-todos.command';
import { DomainErrors } from '../../domain/errors';
import { UserWriteRepoPort } from '../../ports/user-write.repo-port';
import { Traceable } from '@bitloops/bl-boilerplate-infra-telemetry';
import { ApplicationErrors } from '../errors';
import { UserWriteRepoPortToken } from '../../constants';

type IncrementDepositsCommandHandlerResponse = Either<
  void,
  DomainErrors.InvalidTodosCounterError
>;

export class IncrementTodosCommandHandler
  implements
    Application.IUseCase<
      IncrementTodosCommand,
      Promise<IncrementDepositsCommandHandlerResponse>
    >
{
  constructor(
    @Inject(UserWriteRepoPortToken) private userRepo: UserWriteRepoPort,
  ) {}

  get command() {
    return IncrementTodosCommand;
  }

  get boundedContext(): string {
    return 'Marketing';
  }

  @Traceable({
    operation: '[Marketing] IncrementTodosCommandHandler',
    serviceName: 'Marketing',
    metrics: {
      name: '[Marketing] IncrementTodosCommandHandler',
      category: 'commandHandler',
    },
  })
  async execute(
    command: IncrementTodosCommand,
  ): Promise<IncrementDepositsCommandHandlerResponse> {
    const requestUserId = new Domain.UUIDv4(command.id);
    const user = await this.userRepo.getById(requestUserId);
    if (user.isFail()) {
      return fail(user.value);
    }

    if (!user.value) {
      return fail(new ApplicationErrors.UserNotFoundError(command.id));
    }
    const incrementedOrError = user.value.incrementCompletedTodos();
    if (incrementedOrError.isFail()) {
      return fail(incrementedOrError.value);
    }
    const saveResult = await this.userRepo.update(user.value);
    if (saveResult.isFail()) {
      return fail(saveResult.value);
    }
    return ok();
  }
}
