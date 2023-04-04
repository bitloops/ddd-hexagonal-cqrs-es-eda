import {
  Application,
  Domain,
  asyncLocalStorage,
} from '@bitloops/bl-boilerplate-core';
type TRegisterCommandProps = {
  email: string;
  password: string;
};

export class RegisterCommand extends Application.Command {
  public metadata: Application.TCommandMetadata = {
    boundedContextId: 'IAM',
    createdTimestamp: Date.now(),

    correlationId: asyncLocalStorage.getStore()?.get('correlationId'),
    context: asyncLocalStorage.getStore()?.get('context'),
    messageId: new Domain.UUIDv4().toString(),
  };
  public email: string;
  public password: string;
  constructor(props: TRegisterCommandProps) {
    super();
    this.email = props.email;
    this.password = props.password;
  }
}
