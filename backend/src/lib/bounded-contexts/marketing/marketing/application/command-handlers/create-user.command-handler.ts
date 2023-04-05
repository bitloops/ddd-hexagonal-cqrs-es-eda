import {
  Application,
  ok,
  Either,
  Domain,
  fail,
} from '@bitloops/bl-boilerplate-core';
import { Inject } from '@nestjs/common';
import { CreateUserCommand } from '../../commands/create-user.command';
import { Traceable } from '@bitloops/bl-boilerplate-infra-telemetry';
import { UserEntity } from '../../domain/user.entity';
import { EmailVO } from '../../domain/email.vo';
import { CompletedTodosVO } from '../../domain/completed-todos.vo';
import {
  UserWriteRepoPort,
  UserWriteRepoPortToken,
} from '../../ports/user-write.repo-port';

type CreateUserCommandHandlerResponse = Either<
  void,
  Application.Repo.Errors.Unexpected
>;

export class CreateUserCommandHandler
  implements Application.ICommandHandler<CreateUserCommand, void>
{
  constructor(
    @Inject(UserWriteRepoPortToken)
    private userRepo: UserWriteRepoPort,
  ) {}

  get command() {
    return CreateUserCommand;
  }

  get boundedContext(): string {
    return 'Marketing';
  }

  @Traceable({
    operation: '[Marketing] CreateUserCommandHandler',
    serviceName: 'marketing',
    metrics: {
      name: '[Marketing] CreateUserCommandHandler',
      category: 'commandHandler',
    },
  })
  async execute(
    command: CreateUserCommand,
  ): Promise<CreateUserCommandHandlerResponse> {
    console.log('CreateUserCommandHandler');
    const requestUserId = new Domain.UUIDv4(command.userId);

    const completedTodosVO = CompletedTodosVO.create({ counter: 0 });
    if (completedTodosVO.isFail()) {
      return fail(completedTodosVO.value);
    }
    const emailVO = EmailVO.create({ email: command.email });
    if (emailVO.isFail()) {
      return fail(emailVO.value);
    }
    const user = UserEntity.create({
      completedTodos: completedTodosVO.value,
      email: emailVO.value,
      id: requestUserId,
    });
    if (user.isFail()) {
      return fail(user.value);
    }

    const createOrError = await this.userRepo.save(user.value);
    if (createOrError.isFail()) {
      return fail(createOrError.value);
    }
    return ok();
  }
}
