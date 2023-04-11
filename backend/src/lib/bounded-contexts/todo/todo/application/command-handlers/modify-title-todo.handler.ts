import {
  Application,
  Domain,
  Either,
  fail,
  ok,
} from '@bitloops/bl-boilerplate-core';
import { ModifyTodoTitleCommand } from '../../commands/modify-todo-title.command';
import { Inject } from '@nestjs/common';
import { DomainErrors } from '../../domain/errors';
import { TitleVO } from '../../domain/title.value-object';
import { TodoWriteRepoPort } from '../../ports/todo-write.repo-port';
import { TodoWriteRepoPortToken } from '../../constants';
import { ApplicationErrors } from '../errors';
import { Traceable } from '@bitloops/bl-boilerplate-infra-telemetry';

type ModifyTodoTitleResponse = Either<
  void,
  DomainErrors.TitleOutOfBoundsError | Application.Repo.Errors.Unexpected
>;

export class ModifyTodoTitleHandler
  implements
    Application.IUseCase<
      ModifyTodoTitleCommand,
      Promise<ModifyTodoTitleResponse>
    >
{
  constructor(
    @Inject(TodoWriteRepoPortToken)
    private readonly todoRepo: TodoWriteRepoPort,
  ) {}

  get command() {
    return ModifyTodoTitleCommand;
  }

  get boundedContext() {
    return 'Todo';
  }

  @Traceable({
    operation: '[Todo] ModifyTitleCommandHandler',
    serviceName: 'Todo',
    metrics: {
      name: '[Todo] ModifyTitleCommandHandler',
      category: 'commandHandler',
    },
  })
  async execute(
    command: ModifyTodoTitleCommand,
  ): Promise<ModifyTodoTitleResponse> {
    const requestId = new Domain.UUIDv4(command.id);
    const todoFound = await this.todoRepo.getById(requestId);
    if (todoFound.isFail()) {
      return fail(todoFound.value);
    }

    if (!todoFound.value) {
      return fail(
        new ApplicationErrors.TodoNotFoundError(command.id.toString()),
      );
    }

    const titleToUpdate = TitleVO.create({ title: command.title });
    if (titleToUpdate.isFail()) {
      return fail(titleToUpdate.value);
    }

    todoFound.value.modifyTitle(titleToUpdate.value);
    const updateResult = await this.todoRepo.update(todoFound.value);
    if (updateResult.isFail()) {
      return fail(updateResult.value);
    }

    return ok();
  }
}
