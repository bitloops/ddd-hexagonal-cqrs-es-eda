import { Application, Either } from 'ddd-tactical-core-boilerplate';
import { SendEmailRequest } from '../structs/send-email-request.struct';

export interface EmailServicePort {
  send(
    data: SendEmailRequest,
  ): Promise<Either<void, Application.Repo.Errors.Unexpected>>;
}
