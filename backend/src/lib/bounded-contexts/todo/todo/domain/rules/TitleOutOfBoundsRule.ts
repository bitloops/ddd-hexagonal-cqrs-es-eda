import { Domain } from 'ddd-tactical-core-boilerplate';
import { DomainErrors } from '../errors';

export class TitleOutOfBoundsRule implements Domain.IRule {
  public readonly Error: DomainErrors.TitleOutOfBoundsError;

  constructor(private title: string) {
    this.Error = new DomainErrors.TitleOutOfBoundsError(title);
  }

  public isBrokenIf(): boolean {
    return this.title.length > 150 || this.title.length < 4;
  }
}
