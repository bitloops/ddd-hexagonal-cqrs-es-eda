import {
  Application,
  Either,
  fail,
  ok,
  Domain,
} from '@bitloops/bl-boilerplate-core';
import { DeleteTodoCommand } from '../../commands/delete-todo.command';
import { Inject } from '@nestjs/common';
import { ApplicationErrors } from '../errors';
import { TodoWriteRepoPort } from '../../ports/todo-write.repo-port';
import { TodoWriteRepoPortToken } from '../../constants';
import { Traceable } from '@bitloops/bl-boilerplate-infra-telemetry';

type DeleteTodoUseCaseResponse = Either<
  void,
  ApplicationErrors.TodoNotFoundError
>;

export class DeleteTodoHandler
  implements
    Application.IUseCase<DeleteTodoCommand, Promise<DeleteTodoUseCaseResponse>>
{
  get command() {
    return DeleteTodoCommand;
  }

  get boundedContext() {
    return 'Todo';
  }
  constructor(
    @Inject(TodoWriteRepoPortToken)
    private readonly todoRepo: TodoWriteRepoPort,
  ) {}

  @Traceable({
    operation: '[Todo] DeleteTodoCommandHandler',
    serviceName: 'Todo',
    metrics: {
      name: '[Todo] DeleteTodoCommandHandler',
      category: 'commandHandler',
    },
  })
  async execute(
    command: DeleteTodoCommand,
  ): Promise<DeleteTodoUseCaseResponse> {
    const todo = await this.todoRepo.getById(new Domain.UUIDv4(command.id));
    if (todo.isFail()) {
      return fail(todo.value);
    }
    if (!todo.value) {
      return fail(new ApplicationErrors.TodoNotFoundError(command.id));
    }

    todo.value.delete();

    const deleteResult = await this.todoRepo.delete(todo.value);
    if (deleteResult.isFail()) {
      return fail(deleteResult.value);
    }
    return ok();
  }
}
