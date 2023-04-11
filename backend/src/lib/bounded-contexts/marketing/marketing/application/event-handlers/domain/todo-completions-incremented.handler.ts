import {
  Infra,
  Application,
  Either,
  fail,
  ok,
  Domain,
} from '@bitloops/bl-boilerplate-core';
import { TodoCompletionsIncrementedDomainEvent } from '../../../domain/events/todo-completions-incremented.event';
import { SendEmailCommand } from '../../../commands/send-email.command';
import { Inject } from '@nestjs/common';
import { NotificationTemplateReadRepoPort } from '../../../ports/notification-template-read.repo-port';
import { MarketingNotificationService } from '../../../domain/services/marketing-notification.service';
import {
  NotificationTemplateReadRepoPortToken,
  StreamingCommandBusToken,
  UserWriteRepoPortToken,
} from '../../../constants';
import { ApplicationErrors } from '../../errors';
import { Traceable } from '@bitloops/bl-boilerplate-infra-telemetry';
import { UserWriteRepoPort } from '../../../ports/user-write.repo-port';

export class TodoCompletionsIncrementedHandler
  implements Application.IHandleDomainEvent
{
  constructor(
    @Inject(StreamingCommandBusToken)
    private commandBus: Infra.CommandBus.IStreamCommandBus,
    @Inject(UserWriteRepoPortToken)
    private readonly userRepo: UserWriteRepoPort,
    @Inject(NotificationTemplateReadRepoPortToken)
    private notificationTemplateRepo: NotificationTemplateReadRepoPort,
  ) {}

  get event() {
    return TodoCompletionsIncrementedDomainEvent;
  }

  get boundedContext() {
    return 'Marketing';
  }

  @Traceable({
    operation: '[Marketing] TodoCompletionIncrementedDomainEventHandler',
    serviceName: 'Marketing',

    metrics: {
      name: '[Marketing] TodoCompletionIncrementedDomainEventHandler',
      category: 'domainEventHandler',
    },
  })
  public async handle(
    event: TodoCompletionsIncrementedDomainEvent,
  ): Promise<Either<void, Application.Repo.Errors.Unexpected>> {
    const { payload } = event;

    const userId = new Domain.UUIDv4(payload.aggregateId);
    const userFound = await this.userRepo.getById(userId);
    if (userFound.isFail()) {
      //TODO: nakable error for Unexpected Error
      return fail(userFound.value);
    }

    if (!userFound.value) {
      // TODO Error bus
      return fail(new ApplicationErrors.UserNotFoundError(payload.aggregateId));
    }

    const marketingNotificationService = new MarketingNotificationService(
      this.notificationTemplateRepo,
    );

    const emailToBeSentInfoResponse =
      await marketingNotificationService.getNotificationTemplateToBeSent(
        userFound.value,
      );
    if (emailToBeSentInfoResponse.isFail()) {
      return fail(emailToBeSentInfoResponse.value);
    }

    if (
      !emailToBeSentInfoResponse.value ||
      !emailToBeSentInfoResponse.value.notificationTemplate
    ) {
      return ok();
    }

    const command = new SendEmailCommand({
      origin: emailToBeSentInfoResponse.value.emailOrigin,
      destination: userFound.value.email.email,
      content: emailToBeSentInfoResponse.value.notificationTemplate.template,
    });
    await this.commandBus.publish(command);
    return ok();
  }
}
