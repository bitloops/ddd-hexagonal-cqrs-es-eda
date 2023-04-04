import {
  Application,
  asyncLocalStorage,
  Domain,
} from '@bitloops/bl-boilerplate-core';

export type TIncrementTodosCommand = {
  id: string;
};

export class IncrementTodosCommand extends Application.Command {
  public readonly metadata: Application.TCommandMetadata = {
    boundedContextId: 'Marketing',
    createdTimestamp: Date.now(),
    correlationId: asyncLocalStorage.getStore()?.get('correlationId'),
    context: asyncLocalStorage.getStore()?.get('context'),
    messageId: new Domain.UUIDv4().toString(),
  };
  public id: string;

  constructor(props: TIncrementTodosCommand) {
    super();
    this.id = props.id;
  }
}
