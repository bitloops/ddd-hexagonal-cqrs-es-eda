import { Application } from '@bitloops/bl-boilerplate-core';
type TRegisterCommandProps = {
  email: string;
  password: string;
};

export class RegisterCommand extends Application.Command {
  public email: string;
  public password: string;
  constructor(props: TRegisterCommandProps) {
    super('IAM');
    this.email = props.email;
    this.password = props.password;
  }
}
