import { Infra, ok, Application } from '@bitloops/bl-boilerplate-core';

export class MockStreamCommandBus {
  public readonly mockPublish: jest.Mock;
  private mockStreamCommandBus: Infra.CommandBus.IStreamCommandBus;

  constructor() {
    this.mockPublish = this.getMockPublishMethod();
    this.mockStreamCommandBus = {
      publish: this.mockPublish,
      subscribe: jest.fn(),
    };
  }

  getMockStreamCommandBus(): Infra.CommandBus.IStreamCommandBus {
    return this.mockStreamCommandBus;
  }

  private getMockPublishMethod(): jest.Mock {
    return jest.fn((command: Application.Command) => {
      console.log('Publishing...', command);
      return Promise.resolve(ok());
    });
  }
}
