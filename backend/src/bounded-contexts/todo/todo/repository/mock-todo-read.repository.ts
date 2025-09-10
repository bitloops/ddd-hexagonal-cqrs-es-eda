import { Injectable } from '@nestjs/common';
import {
  Application,
  Either,
  ok,
} from '@bitloops/bl-boilerplate-core';
import { TodoReadRepoPort } from '@src/lib/bounded-contexts/todo/todo/ports/todo-read.repo-port';
import { TodoReadModel } from '@src/lib/bounded-contexts/todo/todo/domain/todo.read-model';
import { GetTodosQuery } from '@src/lib/bounded-contexts/todo/todo/queries/get-todos.query';

@Injectable()
export class MockTodoReadRepository implements TodoReadRepoPort {
  private todos: Map<string, any> = new Map();

  async getTodos(
    query: GetTodosQuery,
  ): Promise<Either<TodoReadModel[], Application.Repo.Errors.Unexpected>> {
    const userTodos = Array.from(this.todos.values())
      .filter(todo => todo.userId === query.userId)
      .slice(query.offset || 0, (query.offset || 0) + (query.limit || 10))
      .map(todo => TodoReadModel.fromPrimitives(todo));
    
    return ok(userTodos);
  }

  async getAll(): Promise<Either<TodoReadModel[], Application.Repo.Errors.Unexpected>> {
    const allTodos = Array.from(this.todos.values()).map(todo => TodoReadModel.fromPrimitives(todo));
    return ok(allTodos);
  }

  async getById(id: string): Promise<Either<TodoReadModel | null, Application.Repo.Errors.Unexpected>> {
    const todo = this.todos.get(id);
    if (!todo) {
      return ok(null);
    }
    return ok(TodoReadModel.fromPrimitives(todo));
  }

  // Method to add todos for testing
  addTodo(todoData: any): void {
    this.todos.set(todoData.id, todoData);
  }
}