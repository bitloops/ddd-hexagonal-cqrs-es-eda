import { Domain } from '@bitloops/bl-boilerplate-core';
import { DomainErrors } from '../errors';

export class TodoAlreadyCompletedRule implements Domain.IRule {
  constructor(private completed: boolean, private todoId: string) {}

  public Error = new DomainErrors.TodoAlreadyCompletedError(this.todoId);

  public isBrokenIf(): boolean {
    return this.completed;
  }
}
