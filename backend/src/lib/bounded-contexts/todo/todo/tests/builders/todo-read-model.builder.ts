import {
  TodoReadModel,
  TTodoReadModelSnapshot,
} from '../../domain/todo.read-model';

export class TodoReadModelBuilder {
  private userId: string;
  private title: string;
  private completed: boolean;
  private id: string;

  withUserId(userId: string): TodoReadModelBuilder {
    this.userId = userId;
    return this;
  }

  withTitle(title: string): TodoReadModelBuilder {
    this.title = title;
    return this;
  }

  withCompleted(completed: boolean): TodoReadModelBuilder {
    this.completed = completed;
    return this;
  }

  withId(id: string): TodoReadModelBuilder {
    this.id = id;
    return this;
  }

  build(): TodoReadModel {
    const todoSnapshot: TTodoReadModelSnapshot = {
      userId: this.userId,
      title: this.title,
      completed: this.completed,
      id: this.id,
    };

    return new TodoReadModel(todoSnapshot);
  }
}
