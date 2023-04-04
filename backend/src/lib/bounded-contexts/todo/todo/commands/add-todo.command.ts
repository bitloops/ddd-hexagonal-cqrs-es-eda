import {
  Application,
  Domain,
  asyncLocalStorage,
} from '@bitloops/bl-boilerplate-core';

export type TAddTodoCommand = {
  title: string;
};

export class AddTodoCommand extends Application.Command {
  public readonly metadata: Application.TCommandMetadata = {
    boundedContextId: 'Todo',
    createdTimestamp: Date.now(),
    messageId: new Domain.UUIDv4().toString(),
    // Async localStorage should perhaps be injected or directly used from our library.
    correlationId: asyncLocalStorage.getStore()?.get('correlationId'),
    context: asyncLocalStorage.getStore()?.get('context') || {},
  };
  public title: string;

  constructor(props: TAddTodoCommand) {
    super();
    this.title = props.title;
  }
}
