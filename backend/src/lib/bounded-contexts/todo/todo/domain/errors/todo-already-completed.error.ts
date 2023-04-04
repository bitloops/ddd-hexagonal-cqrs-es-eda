import { Domain } from '@bitloops/bl-boilerplate-core';

export class TodoAlreadyCompletedError extends Domain.Error {
  static readonly errorId = '';

  constructor(id: string) {
    super(`Todo ${id} is already completed`, TodoAlreadyCompletedError.errorId);
  }
}
