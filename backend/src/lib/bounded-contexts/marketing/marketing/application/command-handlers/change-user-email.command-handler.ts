import {
  Application,
  ok,
  Either,
  Domain,
  fail,
} from '@bitloops/bl-boilerplate-core';
import { Inject } from '@nestjs/common';
import { ChangeUserEmailCommand } from '../../commands/change-user-email.command';
import { UserReadModel } from '../../domain/read-models/user-email.read-model';
import {
  UserEmailReadRepoPort,
  UserEmailReadRepoPortToken,
} from '../../ports/user-email-read.repo-port';
import { Traceable } from '@bitloops/bl-boilerplate-infra-telemetry';

type UpdateUserEmailCommandHandlerResponse = Either<
  void,
  Application.Repo.Errors.Unexpected
>;

export class ChangeUserEmailCommandHandler
  implements Application.ICommandHandler<ChangeUserEmailCommand, void>
{
  constructor(
    @Inject(UserEmailReadRepoPortToken)
    private userEmailRepo: UserEmailReadRepoPort,
  ) {}

  get command() {
    return ChangeUserEmailCommand;
  }

  get boundedContext(): string {
    return 'Marketing';
  }

  @Traceable({
    operation: '[Marketing] ChangeUserEmailCommandHandler',
    metrics: {
      name: '[Marketing] ChangeUserEmailCommandHandler',
      category: 'commandHandler',
    },
  })
  async execute(
    command: ChangeUserEmailCommand,
  ): Promise<UpdateUserEmailCommandHandlerResponse> {
    console.log('ChangeUserEmailCommandHandler');
    const requestUserId = new Domain.UUIDv4(command.userId);
    const userIdEmail = new UserReadModel(
      requestUserId.toString(),
      command.email,
    );

    const updateOrError = await this.userEmailRepo.update(userIdEmail);
    if (updateOrError.isFail()) {
      return fail(updateOrError.value);
    }
    return ok();
  }
}
