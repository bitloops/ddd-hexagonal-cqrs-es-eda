import { Application } from '@bitloops/bl-boilerplate-core';

export class GetTodosQuery extends Application.Query {
  constructor(public readonly limit?: number, public readonly offset?: number) {
    super('Todo');
  }
}
