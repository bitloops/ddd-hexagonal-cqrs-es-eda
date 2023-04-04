import { Domain } from '@bitloops/bl-boilerplate-core';
import { DomainErrors } from '../errors';

export class ValidEmailRule implements Domain.IRule {
  constructor(private email: string) {}

  public Error = new DomainErrors.InvalidEmailDomainError(this.email);

  public isBrokenIf(): boolean {
    const re = /\S+@\S+\.\S+/;
    return re.test(this.email) === false;
  }
}
