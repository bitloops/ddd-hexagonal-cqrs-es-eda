import { AddTodoCommandHandler } from './add-todo.handler';
import { CompleteTodoHandler } from './complete-todo.handler';
import { UncompleteTodoHandler } from './uncomplete-todo.handler';
import { ModifyTodoTitleHandler } from './modify-title-todo.handler';
import { DeleteTodoHandler } from './delete-todo.handler';
// export const CommandHandlers = [
//   AddTodoHandler,
//   CompleteTodoHandler,
//   UncompleteTodoHandler,
//   ModifyTodoTitleHandler,
// ];

export const PubSubCommandHandlers = [
  AddTodoCommandHandler,
  CompleteTodoHandler,
  UncompleteTodoHandler,
  ModifyTodoTitleHandler,
  DeleteTodoHandler,
];

export const StreamingCommandHandlers = [
  // AddTodoCommandHandler,
  // CompleteTodoHandler,
];
