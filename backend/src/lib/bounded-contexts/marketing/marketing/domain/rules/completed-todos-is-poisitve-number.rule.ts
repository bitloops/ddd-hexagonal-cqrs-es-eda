import { Domain } from 'ddd-tactical-core-boilerplate';
import { DomainErrors } from '../errors';

export class CompletedTodosIsPositiveNumber implements Domain.IRule {
  constructor(private counter: number) {}

  public Error = new DomainErrors.InvalidTodosCounterError();

  public isBrokenIf(): boolean {
    return isNaN(this.counter) || this.counter < 0;
  }
}
