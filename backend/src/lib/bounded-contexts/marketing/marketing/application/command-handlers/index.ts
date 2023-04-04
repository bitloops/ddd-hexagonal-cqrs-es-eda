import { CreateUserCommandHandler } from './create-user.command-handler';
import { IncrementTodosCommandHandler } from './increment-todos.command-handler';
import { SendEmailCommandHandler } from './send-email.command-handler';
import { ChangeUserEmailCommandHandler } from './change-user-email.command-handler';

export const StreamingCommandHandlers = [
  IncrementTodosCommandHandler,
  SendEmailCommandHandler,
  ChangeUserEmailCommandHandler,
  CreateUserCommandHandler,
];
