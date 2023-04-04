import { SendEmailCommand } from '../../commands/send-email.command';

export class SendEmailCommandBuilder {
  destination: string;
  origin: string;
  content: string;

  withDestination(destination: string): SendEmailCommandBuilder {
    this.destination = destination;
    return this;
  }

  withOrigin(origin: string): SendEmailCommandBuilder {
    this.origin = origin;
    return this;
  }

  withContent(content: string): SendEmailCommandBuilder {
    this.content = content;
    return this;
  }

  build(): SendEmailCommand {
    return new SendEmailCommand({
      destination: this.destination,
      origin: this.origin,
      content: this.content,
    });
  }
}
