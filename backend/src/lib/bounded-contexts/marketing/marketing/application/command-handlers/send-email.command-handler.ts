import { Application, Either, ok, fail } from '@bitloops/bl-boilerplate-core';
import { SendEmailCommand } from '../../commands/send-email.command';
import { Inject } from '@nestjs/common';
import { EmailServicePort } from '../../ports/email.service-port';
import { EmailServicePortToken } from '../../constants';
import { Traceable } from '@bitloops/bl-boilerplate-infra-telemetry';

type SendEmailCommandHandlerResponse = Either<
  void,
  Application.Repo.Errors.Unexpected
>;

export class SendEmailCommandHandler
  implements Application.ICommandHandler<SendEmailCommand, void>
{
  constructor(
    @Inject(EmailServicePortToken)
    private readonly emailService: EmailServicePort,
  ) {}

  get command() {
    return SendEmailCommand;
  }

  get boundedContext(): string {
    return 'Marketing';
  }

  @Traceable({
    operation: '[Marketing] SendEmailCommandHandler',
    serviceName: 'Marketing',
    metrics: {
      name: '[Marketing] SendEmailCommandHandler',
      category: 'commandHandler',
    },
  })
  async execute(
    command: SendEmailCommand,
  ): Promise<SendEmailCommandHandlerResponse> {
    const sendOrError = await this.emailService.send({
      origin: command.origin,
      destination: command.destination,
      content: command.content,
    });
    if (sendOrError.isFail()) {
      return fail(sendOrError.value);
    }
    return ok();
  }
}
