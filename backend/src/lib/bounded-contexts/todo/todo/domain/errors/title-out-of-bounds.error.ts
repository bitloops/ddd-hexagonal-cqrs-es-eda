import { Domain } from '@bitloops/bl-boilerplate-core';

export class TitleOutOfBoundsError extends Domain.Error {
  static readonly errorId = '';

  constructor(title: string) {
    super(`Title ${title} is out of range`, TitleOutOfBoundsError.errorId);
  }
}
