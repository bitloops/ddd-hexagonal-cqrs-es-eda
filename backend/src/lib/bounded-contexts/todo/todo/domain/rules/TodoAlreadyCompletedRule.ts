import { Domain } from 'ddd-tactical-core-boilerplate';
import { DomainErrors } from '../errors';

export class TodoAlreadyCompletedRule implements Domain.IRule {
  public readonly Error: DomainErrors.TodoAlreadyCompletedError;

  constructor(private completed: boolean, private todoId: string) {
    this.Error = new DomainErrors.TodoAlreadyCompletedError(todoId);
  }

  public isBrokenIf(): boolean {
    return this.completed;
  }
}
