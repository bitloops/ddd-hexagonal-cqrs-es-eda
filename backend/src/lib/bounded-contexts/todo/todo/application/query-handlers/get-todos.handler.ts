import { Application, Either, ok, fail } from '@bitloops/bl-boilerplate-core';
import { Inject } from '@nestjs/common';
// import { QueryHandler } from '@nestjs/cqrs';
import { TTodoReadModelSnapshot } from '../../domain/TodoReadModel';
import {
  TodoReadRepoPortToken,
  TodoReadRepoPort,
} from '../../ports/TodoReadRepoPort';
import { GetTodosQuery } from '../../queries/get-todos.query';
import { Traceable } from '@bitloops/bl-boilerplate-infra-telemetry';

export type GetTodosQueryHandlerResponse = Either<
  TTodoReadModelSnapshot[],
  Application.Repo.Errors.Unexpected
>;

export class GetTodosHandler
  implements Application.IQueryHandler<GetTodosQuery, TTodoReadModelSnapshot[]>
{
  constructor(
    @Inject(TodoReadRepoPortToken)
    private readonly todoRepo: TodoReadRepoPort,
  ) {}

  get query() {
    return GetTodosQuery;
  }

  get boundedContext() {
    return 'Todo';
  }

  @Traceable({
    operation: '[Todo] GetTodosQueryHandler',
    metrics: {
      name: '[Todo] GetTodosQueryHandler',
      category: 'queryHandler',
    },
  })
  async execute(command: GetTodosQuery): Promise<GetTodosQueryHandlerResponse> {
    console.log('GetTodosQuery handler...');

    const results = await this.todoRepo.getAll();
    if (results.isFail()) return fail(results.value);
    if (results.value) return ok(results.value);
    return ok([]);
  }
}

// @QueryHandler(GetTodosQuery)
// export class GetTodosHandler
//   implements
//     Application.IQueryHandler<
//       GetTodosQuery,
//       Promise<GetTodosQueryHandlerResponse>
//     >
// {
//   get query() {
//     return GetTodosQuery;
//   }

//   get boundedContext() {
//     return 'Todo';
//   }
//   constructor(
//     @Inject(TodoReadRepoPortToken) private todoRepo: TodoReadRepoPort,
//   ) {}

//   async execute(query: GetTodosQuery): Promise<GetTodosQueryHandlerResponse> {
//     const todos = await this.todoRepo.getAll(query.ctx);
//     if (todos) return ok(todos);
//     return ok([]);
//   }
// }
