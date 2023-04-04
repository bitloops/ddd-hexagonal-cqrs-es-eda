import { Application, Either, ok } from '@bitloops/bl-boilerplate-core';
import { Injectable } from '@nestjs/common';
import {
  EmailServicePort,
  SendEmailRequest,
} from 'src/lib/bounded-contexts/marketing/marketing/ports/email-service-port';

@Injectable()
export class MockEmailService implements EmailServicePort {
  send(
    data: SendEmailRequest,
  ): Promise<Either<void, Application.Repo.Errors.Unexpected>> {
    console.log('MockEmailService sending data:', data);
    return Promise.resolve(ok());
  }
}
