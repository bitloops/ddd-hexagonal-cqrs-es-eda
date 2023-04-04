import {
  Application,
  asyncLocalStorage,
  Domain,
} from '@bitloops/bl-boilerplate-core';
export type TCreateUserCommand = {
  email: string;
  userId: string;
};

export class CreateUserCommand extends Application.Command {
  public readonly metadata: Application.TCommandMetadata = {
    boundedContextId: 'Marketing',
    createdTimestamp: Date.now(),
    correlationId: asyncLocalStorage.getStore()?.get('correlationId'),
    context: asyncLocalStorage.getStore()?.get('context'),
    messageId: new Domain.UUIDv4().toString(),
  };
  public email: string;
  public userId: string;

  constructor(props: TCreateUserCommand) {
    super();
    this.email = props.email;
    this.userId = props.userId;
  }
}
