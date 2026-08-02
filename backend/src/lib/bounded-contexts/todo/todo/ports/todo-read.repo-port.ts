import { Application, Either } from 'ddd-tactical-core-boilerplate';
import { TTodoReadModelSnapshot } from '../domain/todo.read-model.js';

export interface TodoReadRepoPort
  extends Application.Repo.ICRUDReadPort<TTodoReadModelSnapshot> {
  getAll(params?: {
    limit?: number;
    offset?: number;
  }): Promise<
    Either<TTodoReadModelSnapshot[], Application.Repo.Errors.Unexpected>
  >;
}
// export interface ITodoReadRepository {
//   findAll(): Promise<TodoReadModel[]>;
// }
