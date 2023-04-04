import {
  Application,
  Domain,
  asyncLocalStorage,
} from '@bitloops/bl-boilerplate-core';
export type TModifyTodoTitleCommand = {
  id: string;
  title: string;
};
export class ModifyTodoTitleCommand extends Application.Command {
  public readonly id: string;
  public readonly title: string;
  public readonly metadata: Application.TCommandMetadata = {
    boundedContextId: 'Todo',
    createdTimestamp: Date.now(),
    // Async localStorage should perhaps be injected or directly used from our library.
    correlationId: asyncLocalStorage.getStore()?.get('correlationId'),
    context: asyncLocalStorage.getStore()?.get('context'),
    messageId: new Domain.UUIDv4().toString(),
  };

  constructor(modifyTitleTodo: TModifyTodoTitleCommand) {
    super();
    this.id = modifyTitleTodo.id;
    this.title = modifyTitleTodo.title;
  }
}
