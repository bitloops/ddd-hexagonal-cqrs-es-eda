import {
  Application,
  Domain,
  asyncLocalStorage,
} from '@bitloops/bl-boilerplate-core';
export type TChangeUserEmailCommand = {
  email: string;
  userId: string;
};

export class ChangeUserEmailCommand extends Application.Command {
  public readonly metadata: Application.TCommandMetadata = {
    boundedContextId: 'Marketing',
    createdTimestamp: Date.now(),
    messageId: new Domain.UUIDv4().toString(),
    correlationId: asyncLocalStorage.getStore()?.get('correlationId'),
    context: asyncLocalStorage.getStore()?.get('context'),
  };
  public email: string;
  public userId: string;

  constructor(props: TChangeUserEmailCommand) {
    super();
    this.email = props.email;
    this.userId = props.userId;
  }
}
