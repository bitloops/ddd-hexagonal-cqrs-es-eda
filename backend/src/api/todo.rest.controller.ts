import {
  Body,
  Controller,
  Get,
  Patch,
  HttpException,
  HttpCode,
  HttpStatus,
  Inject,
  Injectable,
  Post,
  Delete,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AddTodoRequestDto } from './dto/add-todo.dto';
import { ModifyTodoTitleRequestDto } from './dto/modify-todo-title.dto';
import { BUSES_TOKENS } from '../lib/infra/nest-jetstream';
import { JwtAuthGuard } from '../lib/infra/nest-auth-passport';
import { Infra } from '@bitloops/bl-boilerplate-core';
import { GetAllTodosResponseDto } from './dto/get-all-todos.dto';
import { CompleteTodoCommand } from '@src/lib/bounded-contexts/todo/todo/commands/complete-todo.command';
import { TodoReadModel } from '@src/lib/bounded-contexts/todo/todo/domain/todo.read-model';
import { AddTodoCommand } from '@src/lib/bounded-contexts/todo/todo/commands/add-todo.command';
import { GetTodosQuery } from '@src/lib/bounded-contexts/todo/todo/queries/get-todos.query';
import { UncompleteTodoCommand } from '@src/lib/bounded-contexts/todo/todo/commands/uncomplete-todo.command';
import { DeleteTodoCommand } from '@src/lib/bounded-contexts/todo/todo/commands/delete-todo.command';
import { ModifyTodoTitleCommand } from '@src/lib/bounded-contexts/todo/todo/commands/modify-todo-title.command';

@ApiTags('todos')
@ApiBearerAuth()
@Controller('todos')
@UseGuards(JwtAuthGuard)
@Injectable()
export class TodoController {
  constructor(
    @Inject(BUSES_TOKENS.PUBSUB_COMMAND_BUS)
    private readonly commandBus: Infra.CommandBus.IPubSubCommandBus,
    @Inject(BUSES_TOKENS.PUBSUB_QUERY_BYS)
    private readonly queryBus: Infra.QueryBus.IQueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new todo' })
  @ApiResponse({ status: 201, description: 'Todo created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async addTodo(@Body() dto: AddTodoRequestDto) {
    const command = new AddTodoCommand({ title: dto.title });
    const result = await this.commandBus.request(command);

    if (result.isOk) {
      return { id: result.data };
    } else {
      throw new HttpException(
        result.error?.message || 'Failed to create todo',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all todos' })
  @ApiResponse({ status: 200, type: GetAllTodosResponseDto, description: 'Returns all todos' })
  async getAll(@Query('limit') limit: number, @Query('offset') offset: number) {
    const results = await this.queryBus.request(
      new GetTodosQuery(limit, offset),
    );
    if (results.isOk) {
      const data = results.data;
      const todos: TodoReadModel[] = data.map((todo) => TodoReadModel.fromPrimitives(todo));
      return new GetAllTodosResponseDto(todos);
    } else {
      throw new HttpException(
        results.error?.message || 'Failed to fetch todos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id/complete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Mark a todo as completed' })
  @ApiParam({ name: 'id', description: 'Todo ID' })
  @ApiResponse({ status: 204, description: 'Todo marked as completed' })
  @ApiResponse({ status: 400, description: 'Invalid todo ID' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  async completeTodo(@Param('id') id: string) {
    const command = new CompleteTodoCommand({ todoId: id });
    const result = await this.commandBus.request(command);

    if (!result.isOk) {
      throw new HttpException(
        result.error?.message || 'Failed to complete todo',
        result.error?.code === 'TODO_NOT_FOUND'
          ? HttpStatus.NOT_FOUND
          : HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch(':id/uncomplete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Mark a todo as uncompleted' })
  @ApiParam({ name: 'id', description: 'Todo ID' })
  @ApiResponse({ status: 204, description: 'Todo marked as uncompleted' })
  @ApiResponse({ status: 400, description: 'Invalid todo ID' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  async uncompleteTodo(@Param('id') id: string) {
    const command = new UncompleteTodoCommand({ id });
    const result = await this.commandBus.request(command);

    if (!result.isOk) {
      throw new HttpException(
        result.error?.message || 'Failed to uncomplete todo',
        result.error?.code === 'TODO_NOT_FOUND'
          ? HttpStatus.NOT_FOUND
          : HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch(':id/title')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update a todo title' })
  @ApiParam({ name: 'id', description: 'Todo ID' })
  @ApiResponse({ status: 204, description: 'Todo title updated' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  async modifyTitle(@Param('id') id: string, @Body() dto: ModifyTodoTitleRequestDto) {
    const command = new ModifyTodoTitleCommand({
      id,
      title: dto.title,
    });

    const result = await this.commandBus.request(command);

    if (!result.isOk) {
      throw new HttpException(
        result.error?.message || 'Failed to update todo title',
        result.error?.code === 'TODO_NOT_FOUND'
          ? HttpStatus.NOT_FOUND
          : HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a todo' })
  @ApiParam({ name: 'id', description: 'Todo ID' })
  @ApiResponse({ status: 204, description: 'Todo deleted' })
  @ApiResponse({ status: 400, description: 'Invalid todo ID' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  async deleteTodo(@Param('id') id: string) {
    const command = new DeleteTodoCommand({ id });
    const result = await this.commandBus.request(command);

    if (!result.isOk) {
      throw new HttpException(
        result.error?.message || 'Failed to delete todo',
        result.error?.code === 'TODO_NOT_FOUND'
          ? HttpStatus.NOT_FOUND
          : HttpStatus.BAD_REQUEST,
      );
    }
  }
}
