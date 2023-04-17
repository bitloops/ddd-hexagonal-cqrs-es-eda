import { Application } from '@bitloops/bl-boilerplate-core';
import { TTodoReadModelSnapshot } from '../domain/todo.read-model.js';

export type TodoReadRepoPort =
  Application.Repo.ICRUDReadPort<TTodoReadModelSnapshot>;

// export interface ITodoReadRepository {
//   findAll(): Promise<TodoReadModel[]>;
// }
