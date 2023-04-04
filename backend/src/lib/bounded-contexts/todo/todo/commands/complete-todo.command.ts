import {
  Application,
  Domain,
  asyncLocalStorage,
} from '@bitloops/bl-boilerplate-core';

export type TCompleteTodoCommand = {
  todoId: string;
};

export class CompleteTodoCommand extends Application.Command {
  public readonly metadata: Application.TCommandMetadata = {
    boundedContextId: 'Todo',
    createdTimestamp: Date.now(),
    messageId: new Domain.UUIDv4().toString(),
    correlationId: asyncLocalStorage.getStore()?.get('correlationId'),
    context: asyncLocalStorage.getStore()?.get('context'),
  };
  public id: string;

  constructor(props: TCompleteTodoCommand) {
    super();
    this.id = props.todoId;
  }
}
