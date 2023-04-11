import {
  Application,
  Either,
  fail,
  ok,
  Domain,
} from '@bitloops/bl-boilerplate-core';
import { UncompleteTodoCommand } from '../../commands/uncomplete-todo.command';
import { DomainErrors } from '../../domain/errors';
import { Inject } from '@nestjs/common';
import { ApplicationErrors } from '../errors';
import { TodoWriteRepoPort } from '../../ports/todo-write.repo-port';
import { TodoWriteRepoPortToken } from '../../constants';
import { Traceable } from '@bitloops/bl-boilerplate-infra-telemetry';

type UncompleteTodoUseCaseResponse = Either<
  void,
  DomainErrors.TodoAlreadyUncompletedError | ApplicationErrors.TodoNotFoundError
>;

export class UncompleteTodoHandler
  implements
    Application.IUseCase<
      UncompleteTodoCommand,
      Promise<UncompleteTodoUseCaseResponse>
    >
{
  get command() {
    return UncompleteTodoCommand;
  }

  get boundedContext() {
    return 'Todo';
  }
  constructor(
    @Inject(TodoWriteRepoPortToken)
    private readonly todoRepo: TodoWriteRepoPort,
  ) {}

  @Traceable({
    operation: '[Todo] UncompleteTodoCommandHandler',
    serviceName: 'Todo',
    metrics: {
      name: '[Todo] UncompleteTodoCommandHandler',
      category: 'commandHandler',
    },
  })
  async execute(
    command: UncompleteTodoCommand,
  ): Promise<UncompleteTodoUseCaseResponse> {
    const todo = await this.todoRepo.getById(new Domain.UUIDv4(command.id));
    if (todo.isFail()) {
      return fail(todo.value);
    }
    if (!todo.value) {
      return fail(new ApplicationErrors.TodoNotFoundError(command.id));
    }

    const uncompletedOrError = todo.value.uncomplete();
    if (uncompletedOrError.isFail()) {
      return fail(uncompletedOrError.value);
    }
    const saveResult = await this.todoRepo.update(todo.value);
    if (saveResult.isFail()) {
      return fail(saveResult.value);
    }
    return ok();
  }
}
