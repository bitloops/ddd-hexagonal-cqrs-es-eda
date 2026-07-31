import { asyncLocalStorage } from '@bitloops/bl-boilerplate-core';
import { ContextBuilder } from '../builders/context.builder';
export function mockAsyncLocalStorageGet(userId: string) {
  jest
    .mocked(asyncLocalStorage.getStore()?.get)
    ?.mockImplementation((arg: string) => {
      if (arg === 'correlationId') {
        return 'testing...';
      }
      if (arg === 'context') {
        return new ContextBuilder().withUserId(userId).build();
      }
    });
}
