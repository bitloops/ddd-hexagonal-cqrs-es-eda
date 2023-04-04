import {
  Application,
  Either,
  fail,
  ok,
  Domain,
} from '@bitloops/bl-boilerplate-core';
import { Inject } from '@nestjs/common';
import { ChangeEmailCommand } from '../../commands/change-email.command';
import { EmailVO } from '../../domain/EmailVO';
import {
  UserWriteRepoPortToken,
  UserWriteRepoPort,
} from '../../ports/UserWriteRepoPort';
import { ApplicationErrors } from '../errors';
import { Traceable } from '@bitloops/bl-boilerplate-infra-telemetry';

type ChangeEmailResponse = Either<
  void,
  ApplicationErrors.UserNotFoundApplicationError
>;

export class ChangeEmailHandler
  implements Application.ICommandHandler<ChangeEmailCommand, void>
{
  constructor(
    @Inject(UserWriteRepoPortToken)
    private readonly userRepo: UserWriteRepoPort,
  ) {}

  get command() {
    return ChangeEmailCommand;
  }

  get boundedContext() {
    return 'IAM';
  }

  @Traceable({
    operation: '[IAM] ChangeEmailCommandHandler',
    metrics: {
      name: '[IAM] ChangeEmailCommandHandler',
      category: 'commandHandler',
    },
  })
  async execute(command: ChangeEmailCommand): Promise<ChangeEmailResponse> {
    console.log('ChangeEmail command');
    const userId = new Domain.UUIDv4(command.userId);
    const email = EmailVO.create({ email: command.email });
    if (email.isFail()) {
      return fail(email.value);
    }

    const userFound = await this.userRepo.getById(userId);
    if (userFound.isFail()) {
      return fail(userFound.value);
    }

    if (!userFound.value) {
      return fail(
        new ApplicationErrors.UserNotFoundApplicationError(command.userId),
      );
    }

    userFound.value.updateEmail(email.value);

    const saveResult = await this.userRepo.update(userFound.value);
    if (saveResult.isFail()) {
      return fail(saveResult.value);
    }

    return ok();
  }
}
