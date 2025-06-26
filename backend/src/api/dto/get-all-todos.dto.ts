import { ApiProperty } from '@nestjs/swagger';
import { TodoReadModel } from '@src/lib/bounded-contexts/todo/todo/domain/todo.read-model';

export class TodoDto {
  @ApiProperty({ description: 'The unique identifier of the todo' })
  id: string;

  @ApiProperty({ description: 'The title of the todo' })
  title: string;

  @ApiProperty({ description: 'The completion status of the todo' })
  completed: boolean;

  @ApiProperty({ description: 'The creation timestamp of the todo' })
  createdAt: number;

  @ApiProperty({ description: 'The last update timestamp of the todo', required: false })
  updatedAt?: number;
}

export class GetAllTodosResponseDto {
  @ApiProperty({ 
    type: [TodoDto],
    description: 'Array of todo items'
  })
  todos: TodoDto[];

  constructor(todos: TodoReadModel[]) {
    this.todos = todos.map(todo => ({
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }));
  }
}
