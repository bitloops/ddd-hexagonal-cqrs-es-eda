import {
  Application,
  Either,
  fail,
  ok,
  Domain,
} from '@bitloops/bl-boilerplate-core';
import { Inject } from '@nestjs/common';
import { LogInCommand } from '../../commands/log-in.command';
import { UserWriteRepoPort } from '../../ports/user-write.repo-port';
import { UserWriteRepoPortToken } from '../../constants';
import { ApplicationErrors } from '../errors';
import { Traceable } from '@bitloops/bl-boilerplate-infra-telemetry';

type LogInUseCaseResponse = Either<
  void,
  ApplicationErrors.UserNotFoundApplicationError
>;

export class LogInHandler
  implements Application.ICommandHandler<LogInCommand, void>
{
  constructor(
    @Inject(UserWriteRepoPortToken)
    private readonly userRepo: UserWriteRepoPort, // @Inject(IAMWriteRepoPortToken) private readonly authService: AuthService,
  ) {}

  get command() {
    return LogInCommand;
  }

  get boundedContext() {
    return 'IAM';
  }

  @Traceable({
    operation: '[IAM] LogInCommandHandler',
    serviceName: 'IAM',
    metrics: {
      name: '[IAM] LogInCommandHandler',
      category: 'commandHandler',
    },
  })
  async execute(command: LogInCommand): Promise<LogInUseCaseResponse> {
    const userId = new Domain.UUIDv4(command.userId);

    const user = await this.userRepo.getById(userId);
    if (user.isFail()) {
      return fail(user.value);
    }

    if (!user.value) {
      return fail(
        new ApplicationErrors.UserNotFoundApplicationError(command.userId),
      );
    }

    const loginOrError = user.value.login();
    if (loginOrError.isFail()) {
      return fail(loginOrError.value);
    }

    const saveResult = await this.userRepo.update(user.value);
    if (saveResult.isFail()) {
      return fail(saveResult.value);
    }
    return ok();
  }
}
