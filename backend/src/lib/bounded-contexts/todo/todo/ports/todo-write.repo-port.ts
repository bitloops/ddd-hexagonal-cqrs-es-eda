import { Application, Domain } from 'ddd-tactical-core-boilerplate';
import { TodoEntity } from '../domain/todo.entity.js';

export type TodoWriteRepoPort = Application.Repo.ICRUDWritePort<
  TodoEntity,
  Domain.UUIDv4
>;

// export interface ITodoWriteRepository {
//   findOneById(id: number): Promise<TodoEntity>;
//   findAll(): Promise<TodoEntity[]>;
//   save(hero: TodoEntity): Promise<void>;
// }
