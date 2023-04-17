import {
  Application,
  ok,
  Either,
  Domain,
  fail,
} from '@bitloops/bl-boilerplate-core';
import { Inject } from '@nestjs/common';
import { ChangeUserEmailCommand } from '../../commands/change-user-email.command';
import { Traceable } from '@bitloops/bl-boilerplate-infra-telemetry';
import { UserWriteRepoPort } from '../../ports/user-write.repo-port';
import { ApplicationErrors } from '../errors';
import { DomainErrors } from '../../domain/errors';
import { UserWriteRepoPortToken } from '../../constants';

type UpdateUserEmailCommandHandlerResponse = Either<
  void,
  DomainErrors.InvalidEmailDomainError | Application.Repo.Errors.Unexpected
>;

export class ChangeUserEmailCommandHandler
  implements Application.ICommandHandler<ChangeUserEmailCommand, void>
{
  constructor(
    @Inject(UserWriteRepoPortToken)
    private userRepo: UserWriteRepoPort,
  ) {}

  get command() {
    return ChangeUserEmailCommand;
  }

  get boundedContext(): string {
    return 'Marketing';
  }

  @Traceable({
    operation: '[Marketing] ChangeUserEmailCommandHandler',
    serviceName: 'marketing',
    metrics: {
      name: '[Marketing] ChangeUserEmailCommandHandler',
      category: 'commandHandler',
    },
  })
  async execute(
    command: ChangeUserEmailCommand,
  ): Promise<UpdateUserEmailCommandHandlerResponse> {
    const requestUserId = new Domain.UUIDv4(command.userId);
    const userFound = await this.userRepo.getById(requestUserId);
    if (userFound.isFail()) {
      return fail(userFound.value);
    }

    if (!userFound.value) {
      return fail(new ApplicationErrors.UserNotFoundError(command.userId));
    }

    const changeEmailResult = userFound.value.changeEmail(command.email);
    if (changeEmailResult.isFail()) {
      return fail(changeEmailResult.value);
    }

    const updateOrError = await this.userRepo.update(userFound.value);
    if (updateOrError.isFail()) {
      return fail(updateOrError.value);
    }
    return ok();
  }
}
