import { Domain } from '@bitloops/bl-boilerplate-core';
import { DomainErrors } from '../errors';

export class ValidEmailRule implements Domain.IRule {
  public readonly Error: DomainErrors.InvalidEmailDomainError;

  constructor(private email: string) {
    this.Error = new DomainErrors.InvalidEmailDomainError(email);
  }

  public isBrokenIf(): boolean {
    const re = /\S+@\S+\.\S+/;
    return re.test(this.email) === false;
  }
}
