import { Application } from '@bitloops/bl-boilerplate-core';
export type TSendEmailCommand = {
  destination: string;
  origin: string;
  content: string;
};
export class SendEmailCommand extends Application.Command {
  public readonly destination: string;
  public readonly origin: string;
  public readonly content: string;

  constructor(sendEmail: TSendEmailCommand) {
    super('Marketing');
    this.destination = sendEmail.destination;
    this.origin = sendEmail.origin;
    this.content = sendEmail.content;
  }
}
