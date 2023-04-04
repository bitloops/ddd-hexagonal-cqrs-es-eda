import {
  Application,
  asyncLocalStorage,
  Domain,
} from '@bitloops/bl-boilerplate-core';
import { ChangeEmailCommandDTO } from '../dtos/change-email-command.dto';
export type TChangeEmailCommand = {
  userId: string;
  email: string;
};
export class ChangeEmailCommand extends Application.Command {
  public readonly userId: string;
  public readonly email: string;
  public readonly metadata: Application.TCommandMetadata = {
    boundedContextId: 'IAM',
    createdTimestamp: Date.now(),
    messageId: new Domain.UUIDv4().toString(),
    correlationId: asyncLocalStorage.getStore()?.get('correlationId'),
    context: asyncLocalStorage.getStore()?.get('context'),
  };
  constructor(changeEmailCommandDTO: ChangeEmailCommandDTO) {
    super();
    this.userId = changeEmailCommandDTO.userId;
    this.email = changeEmailCommandDTO.email;
  }
}
