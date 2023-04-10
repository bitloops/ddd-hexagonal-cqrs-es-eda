import { Application } from '@bitloops/bl-boilerplate-core';
export type TLogInCommand = {
  userId: string;
};
export class LogInCommand extends Application.Command {
  public readonly userId: string;

  constructor(loginCommand: TLogInCommand) {
    super('IAM');
    this.userId = loginCommand.userId;
  }
}
