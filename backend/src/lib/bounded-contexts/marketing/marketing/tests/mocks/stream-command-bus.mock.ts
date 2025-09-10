import { Infra, ok, Application } from '@bitloops/bl-boilerplate-core';
import { vi } from 'vitest';

export class MockStreamCommandBus {
  public readonly mockPublish: any;
  private mockStreamCommandBus: Infra.CommandBus.IStreamCommandBus;

  constructor() {
    this.mockPublish = this.getMockPublishMethod();
    this.mockStreamCommandBus = {
      publish: this.mockPublish,
      subscribe: vi.fn(),
    };
  }

  getMockStreamCommandBus(): Infra.CommandBus.IStreamCommandBus {
    return this.mockStreamCommandBus;
  }

  private getMockPublishMethod(): any {
    return vi.fn((command: Application.Command) => {
      console.log('Publishing...', command);
      return Promise.resolve(ok());
    });
  }
}