import { Domain } from 'ddd-tactical-core-boilerplate';

export class TodoAlreadyUncompletedError extends Domain.Error {
  static readonly errorId = '';

  constructor(id: string) {
    super(
      `Todo ${id} is already uncompleted`,
      TodoAlreadyUncompletedError.errorId,
    );
  }
}
