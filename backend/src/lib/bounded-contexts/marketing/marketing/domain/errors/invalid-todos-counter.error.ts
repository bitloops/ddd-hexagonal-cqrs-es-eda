import { Domain } from '@bitloops/bl-boilerplate-core';

export class InvalidTodosCounterError extends Domain.Error {
  static readonly errorId = '';

  constructor() {
    super(
      `Completed Todos counter is invalid`,
      InvalidTodosCounterError.errorId,
    );
  }
}
