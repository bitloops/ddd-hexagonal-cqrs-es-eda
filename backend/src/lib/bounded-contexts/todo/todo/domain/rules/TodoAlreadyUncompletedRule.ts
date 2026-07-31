import { Domain } from '@bitloops/bl-boilerplate-core';
import { DomainErrors } from '../errors';

export class TodoAlreadyUncompletedRule implements Domain.IRule {
  public readonly Error: DomainErrors.TodoAlreadyUncompletedError;

  constructor(private completed: boolean, private todoId: string) {
    this.Error = new DomainErrors.TodoAlreadyUncompletedError(todoId);
  }

  public isBrokenIf(): boolean {
    return !this.completed;
  }
}
