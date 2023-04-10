import { Application } from '@bitloops/bl-boilerplate-core';

export class GetTodosQuery extends Application.Query {
  constructor() {
    super('Todo');
  }
}
