import { Application } from '@bitloops/bl-boilerplate-core';

export class EmailNotFoundIntegrationErrorEvent
  implements Application.IErrorEvent
{
  constructor(
    public readonly metadata: Application.IErrorEvent['metadata'],
    public payload: any,
    public message: string,
    public errorCode: string,
  ) {}
}
