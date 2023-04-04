import { Domain } from '@bitloops/bl-boilerplate-core';
import { DomainErrors } from '../errors';

export class TodoAlreadyUncompletedRule implements Domain.IRule {
  constructor(private completed: boolean, private todoId: string) {}

  public Error = new DomainErrors.TodoAlreadyUncompletedError(this.todoId);

  public isBrokenIf(): boolean {
    return !this.completed;
  }
}
