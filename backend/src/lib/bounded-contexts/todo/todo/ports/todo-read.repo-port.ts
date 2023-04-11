import { Application } from '@bitloops/bl-boilerplate-core';
import { TTodoReadModelSnapshot } from '../domain/TodoReadModel.js';

export type TodoReadRepoPort =
  Application.Repo.ICRUDReadPort<TTodoReadModelSnapshot>;

// export interface ITodoReadRepository {
//   findAll(): Promise<TodoReadModel[]>;
// }

export const TodoReadRepoPortToken = Symbol('TodoReadRepoPort');
