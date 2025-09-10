import { Injectable } from '@nestjs/common';
import {
  Application,
  Domain,
  Either,
  ok,
  fail,
} from '@bitloops/bl-boilerplate-core';
import { TodoWriteRepoPort } from '@src/lib/bounded-contexts/todo/todo/ports/todo-write.repo-port';
import { TodoEntity } from '@src/lib/bounded-contexts/todo/todo/domain/todo.entity';
import { DomainErrors } from '@src/lib/bounded-contexts/todo/todo/domain/errors';

@Injectable()
export class MockTodoWriteRepository implements TodoWriteRepoPort {
  private todos: Map<string, any> = new Map();

  async save(todo: TodoEntity): Promise<Either<void, Application.Repo.Errors.Unexpected>> {
    const primitives = todo.toPrimitives();
    this.todos.set(primitives.id, primitives);
    return ok();
  }

  async update(todo: TodoEntity): Promise<Either<void, Application.Repo.Errors.Unexpected>> {
    const primitives = todo.toPrimitives();
    this.todos.set(primitives.id, primitives);
    return ok();
  }

  async delete(todo: TodoEntity): Promise<Either<void, Application.Repo.Errors.Unexpected>> {
    const primitives = todo.toPrimitives();
    this.todos.delete(primitives.id);
    return ok();
  }

  async getById(
    id: Domain.UUIDv4,
  ): Promise<
    Either<
      TodoEntity | null,
      | DomainErrors.TodoAlreadyCompletedError
      | Application.Repo.Errors.Unexpected
    >
  > {
    const todo = this.todos.get(id.toString());
    if (!todo) {
      return ok(null);
    }
    return ok(TodoEntity.fromPrimitives(todo));
  }
}