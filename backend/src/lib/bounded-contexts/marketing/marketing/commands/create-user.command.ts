import { Application } from '@bitloops/bl-boilerplate-core';
export type TCreateUserCommand = {
  email: string;
  userId: string;
};

export class CreateUserCommand extends Application.Command {
  public email: string;
  public userId: string;

  constructor(props: TCreateUserCommand) {
    super('Marketing');
    this.email = props.email;
    this.userId = props.userId;
  }
}
