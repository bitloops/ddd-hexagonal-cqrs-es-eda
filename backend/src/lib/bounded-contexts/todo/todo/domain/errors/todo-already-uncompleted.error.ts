import { Domain } from '@bitloops/bl-boilerplate-core';

export class TodoAlreadyUncompletedError extends Domain.Error {
  static readonly errorId = '';

  constructor(id: string) {
    super(
      `Todo ${id} is already uncompleted`,
      TodoAlreadyUncompletedError.errorId,
    );
  }
}
