import {
  Application,
  Either,
  fail,
  ok,
  Domain,
} from '@bitloops/bl-boilerplate-core';
import { Inject } from '@nestjs/common';
import { CompleteTodoCommand } from '../../commands/complete-todo.command';
import { DomainErrors } from '../../domain/errors';
import { ApplicationErrors } from '../errors';
import { TodoWriteRepoPort } from '../../ports/todo-write.repo-port';
import { TodoWriteRepoPortToken } from '../../constants';
import { Traceable } from '@bitloops/bl-boilerplate-infra-telemetry';

type CompleteTodoUseCaseResponse = Either<
  void,
  DomainErrors.TodoAlreadyCompletedError | ApplicationErrors.TodoNotFoundError
>;

export class CompleteTodoHandler
  implements
    Application.IUseCase<
      CompleteTodoCommand,
      Promise<CompleteTodoUseCaseResponse>
    >
{
  constructor(
    @Inject(TodoWriteRepoPortToken)
    private readonly todoRepo: TodoWriteRepoPort,
  ) {}

  get command() {
    return CompleteTodoCommand;
  }

  get boundedContext() {
    return 'Todo';
  }

  @Traceable({
    operation: '[Todo] CompleteTodoCommandHandler',
    serviceName: 'Todo',
    metrics: {
      name: '[Todo] CompleteTodoCommandHandler',
      category: 'commandHandler',
    },
  })
  async execute(
    command: CompleteTodoCommand,
  ): Promise<CompleteTodoUseCaseResponse> {
    const todo = await this.todoRepo.getById(new Domain.UUIDv4(command.id));

    if (todo.isFail()) {
      return fail(todo.value);
    }
    if (!todo.value) {
      return fail(new ApplicationErrors.TodoNotFoundError(command.id));
    }
    const completedOrError = todo.value.complete();
    if (completedOrError.isFail()) {
      return fail(completedOrError.value);
    }
    const saveResult = await this.todoRepo.update(todo.value);
    if (saveResult.isFail()) {
      return fail(saveResult.value);
    }

    return ok();
  }
}
