import {
  Application,
  Domain,
  asyncLocalStorage,
} from '@bitloops/bl-boilerplate-core';

export class GetTodosQuery extends Application.Query {
  public metadata: Application.TQueryMetadata;
  public readonly boundedContext = 'Todo';

  constructor() {
    super();
    this.metadata = {
      boundedContextId: 'Todo',
      createdTimestamp: Date.now(),
      correlationId: asyncLocalStorage.getStore()?.get('correlationId'),
      context: asyncLocalStorage.getStore()?.get('context'),
      messageId: new Domain.UUIDv4().toString(),
    };
  }
}
