import { Application, Either, ok, fail } from '@bitloops/bl-boilerplate-core';
import { EmailServicePort } from '@src/lib/bounded-contexts/marketing/marketing/ports/email.service-port';
import { SendEmailRequest } from '../../../structs/send-email-request.struct';

export class MockEmailService {
  public readonly mockSendMethod: jest.Mock;
  private mockEmailServicePort: EmailServicePort;

  constructor() {
    this.mockSendMethod = this.getMockSendMethod();
    this.mockEmailServicePort = {
      send: this.mockSendMethod,
    };
  }

  getMockMarketingService(): EmailServicePort {
    return this.mockEmailServicePort;
  }

  private getMockSendMethod(): jest.Mock {
    return jest.fn(
      (
        emailRequest: SendEmailRequest,
      ): Promise<Either<void, Application.Repo.Errors.Unexpected>> => {
        if (emailRequest.destination === 'user@bitloops.com')
          return Promise.resolve(ok());
        if (emailRequest.destination === 'user2@bitloops.com')
          return Promise.resolve(
            fail(new Application.Repo.Errors.Unexpected()),
          );
        return Promise.resolve(ok());
      },
    );
  }
}
