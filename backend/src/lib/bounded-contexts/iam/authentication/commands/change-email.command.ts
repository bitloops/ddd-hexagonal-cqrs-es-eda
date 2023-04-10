import { Application } from '@bitloops/bl-boilerplate-core';
import { ChangeEmailCommandDTO } from '../dtos/change-email-command.dto';
export type TChangeEmailCommand = {
  userId: string;
  email: string;
};
export class ChangeEmailCommand extends Application.Command {
  public readonly userId: string;
  public readonly email: string;

  constructor(changeEmailCommandDTO: ChangeEmailCommandDTO) {
    super('IAM');
    this.userId = changeEmailCommandDTO.userId;
    this.email = changeEmailCommandDTO.email;
  }
}
