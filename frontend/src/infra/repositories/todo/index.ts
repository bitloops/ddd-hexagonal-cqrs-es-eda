import Todo from '../../../models/Todo';
import TodoRepository from './TodoRepository';

type GetAllTodoSuccessResponse = {
  status: 'success';
  todos: Todo[];
  error: undefined;
};

type GetAllTodoCachedResponse = {
  status: 'cached';
  todos: Todo[];
  error: undefined;
};

type GetAllTodoErrorResponse = {
  status: 'error';
  error: string;
  todos: undefined;
};

export type GetAllTodoResponse =
  | GetAllTodoSuccessResponse
  | GetAllTodoCachedResponse
  | GetAllTodoErrorResponse;

interface ITodoRepository {
  getAllTodo(callback: (asyncResponse: GetAllTodoResponse) => void): GetAllTodoResponse;
  modifyTodoTitle(id: string, title: string): Promise<void>;
  completeTodo(id: string): Promise<void>;
  uncompleteTodo(id: string): Promise<void>;
  deleteTodo(id: string): Promise<void>;
  addTodo(title: string): Promise<void>;
}

export { TodoRepository };
export type { ITodoRepository };
