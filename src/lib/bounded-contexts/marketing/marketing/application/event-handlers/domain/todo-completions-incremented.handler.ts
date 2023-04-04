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
import {
  UserEmailReadRepoPort,
  UserEmailReadRepoPortToken,
} from '../../../ports/user-email-read.repo-port';
import {
  NotificationTemplateReadRepoPort,
  NotificationTemplateReadRepoPortToken,
} from '../../../ports/notification-template-read.repo-port.';
import { MarketingNotificationService } from '../../../domain/services/marketing-notification.service';
import { StreamingCommandBusToken } from '../../../constants';
import { ApplicationErrors } from '../../errors';
import { Traceable } from '@bitloops/bl-boilerplate-infra-telemetry';
import { UserEntity } from '../../../domain/user.entity';
import { CompletedTodosVO } from '../../../domain/completed-todos.vo';

export class TodoCompletionsIncrementedHandler
  implements Application.IHandleDomainEvent
{
  constructor(
    @Inject(StreamingCommandBusToken)
    private commandBus: Infra.CommandBus.IStreamCommandBus,
    @Inject(UserEmailReadRepoPortToken)
    private readonly emailRepoPort: UserEmailReadRepoPort,
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
    metrics: {
      name: '[Marketing] TodoCompletionIncrementedDomainEventHandler',
      category: 'domainEventHandler',
    },
  })
  public async handle(
    event: TodoCompletionsIncrementedDomainEvent,
  ): Promise<Either<void, Application.Repo.Errors.Unexpected>> {
    const { payload } = event;

    const marketingNotificationService = new MarketingNotificationService(
      this.notificationTemplateRepo,
    );
    const completedTodos = CompletedTodosVO.create({
      counter: payload.completedTodos,
    });
    if (completedTodos.isFail()) {
      return fail(completedTodos.value);
    }
    const user = UserEntity.create({
      id: new Domain.UUIDv4(payload.aggregateId),
      completedTodos: completedTodos.value,
    });
    if (user.isFail()) {
      return fail(user.value);
    }
    const emailToBeSentInfoResponse =
      await marketingNotificationService.getNotificationTemplateToBeSent(
        user.value,
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

    const userId = user.value.id;
    const userEmail = await this.emailRepoPort.getUserEmail(userId);
    if (userEmail.isFail()) {
      //TODO: nakable error for Unexpected Error
      return fail(userEmail.value);
    }

    if (!userEmail.value) {
      // TODO Error bus
      return fail(
        new ApplicationErrors.UserEmailNotFoundError(user.value.id.toString()),
      );
    }

    const command = new SendEmailCommand({
      origin: emailToBeSentInfoResponse.value.emailOrigin,
      destination: userEmail.value.email,
      content: emailToBeSentInfoResponse.value.notificationTemplate.template,
    });
    await this.commandBus.publish(command);
    return ok();
  }
}
