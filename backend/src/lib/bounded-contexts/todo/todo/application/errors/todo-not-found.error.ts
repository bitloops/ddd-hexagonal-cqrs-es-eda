import { Application } from '@bitloops/bl-boilerplate-core';

export class TodoNotFoundError extends Application.Error {
  static readonly errorId = '';

  constructor(id: string) {
    super(`Todo ${id} not found`, TodoNotFoundError.errorId);
  }
}
