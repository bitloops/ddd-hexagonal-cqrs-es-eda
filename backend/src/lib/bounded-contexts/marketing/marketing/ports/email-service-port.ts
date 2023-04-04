import { Application, Either } from '@bitloops/bl-boilerplate-core';

export type SendEmailRequest = {
  origin: string;
  destination: string;
  content: string;
};

export interface EmailServicePort {
  send(
    data: SendEmailRequest,
  ): Promise<Either<void, Application.Repo.Errors.Unexpected>>;
}
