import { Application } from 'ddd-tactical-core-boilerplate';

export class GetTodosQuery extends Application.Query {
  constructor(public readonly limit?: number, public readonly offset?: number) {
    super('Todo');
  }
}
