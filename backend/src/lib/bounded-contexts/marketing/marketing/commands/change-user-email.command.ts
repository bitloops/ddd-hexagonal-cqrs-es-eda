import { Application } from '@bitloops/bl-boilerplate-core';
export type TChangeUserEmailCommand = {
  email: string;
  userId: string;
};

export class ChangeUserEmailCommand extends Application.Command {
  public email: string;
  public userId: string;

  constructor(props: TChangeUserEmailCommand) {
    super('Marketing');
    this.email = props.email;
    this.userId = props.userId;
  }
}
