import { Domain } from 'ddd-tactical-core-boilerplate';

export class TitleOutOfBoundsError extends Domain.Error {
  static readonly errorId = '';

  constructor(title: string) {
    super(`Title ${title} is out of range`, TitleOutOfBoundsError.errorId);
  }
}
