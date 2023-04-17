import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AddTodoDto } from './dto/add-todo.dto';
import { CompleteTodoDto } from './dto/complete-todo.dto';

import { BUSES_TOKENS } from '@bitloops/bl-boilerplate-infra-nest-jetstream';
import { AuthEnvironmentVariables } from '@src/config/auth.configuration';
import { JwtAuthGuard } from '@bitloops/bl-boilerplate-infra-nest-auth-passport';
import { Infra } from '@bitloops/bl-boilerplate-core';
import { CompleteTodoCommand } from '@src/lib/bounded-contexts/todo/todo/commands/complete-todo.command';
import { TodoReadModel } from '@src/lib/bounded-contexts/todo/todo/domain/todo.read-model';
import { AddTodoCommand } from '@src/lib/bounded-contexts/todo/todo/commands/add-todo.command';
import { GetTodosQuery } from '@src/lib/bounded-contexts/todo/todo/queries/get-todos.query';

@Injectable()
@Controller('todo')
export class TodoController {
  private readonly JWT_SECRET: string;
  constructor(
    @Inject(BUSES_TOKENS.PUBSUB_COMMAND_BUS)
    private readonly commandBus: Infra.CommandBus.IPubSubCommandBus,
    @Inject(BUSES_TOKENS.PUBSUB_QUERY_BYS)
    private readonly queryBus: Infra.QueryBus.IQueryBus,
    private configService: ConfigService<AuthEnvironmentVariables, true>,
  ) {
    this.JWT_SECRET = this.configService.get('jwtSecret', {
      infer: true,
    });

    if (this.JWT_SECRET === '') {
      throw new Error('JWT_SECRET is not defined!');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async addTodo(@Request() req, @Body() dto: AddTodoDto) {
    // const jwt = jwtwebtoken.sign({ userId: dto.userId }, this.JWT_SECRET);
    const command = new AddTodoCommand({ title: dto.title });
    // const context = asyncLocalStorage.getStore()?.get('context');
    const results = await this.commandBus.request(command);
    if (results.isOk) return results.data;
    else throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/complete')
  async completeTodo(@Body() dto: CompleteTodoDto) {
    // userId get from context
    const command = new CompleteTodoCommand({ todoId: dto.todoId });
    const result = await this.commandBus.request(command);
    if (result.isOk) return result.data;
    else throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req): Promise<TodoReadModel[]> {
    // const jwt = jwtwebtoken.sign({ userId: 'vasilis' }, this.JWT_SECRET);
    const results = await this.queryBus.request(new GetTodosQuery());
    if (results.isOk) return results.data;
    else throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
}
