import { Domain } from 'ddd-tactical-core-boilerplate';

export class InvalidTodosCounterError extends Domain.Error {
  static readonly errorId = '';

  constructor() {
    super(
      `Completed Todos counter is invalid`,
      InvalidTodosCounterError.errorId,
    );
  }
}
