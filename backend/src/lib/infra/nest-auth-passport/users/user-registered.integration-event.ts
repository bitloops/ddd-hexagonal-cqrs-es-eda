import { Infra, Domain, asyncLocalStorage } from '@bitloops/bl-boilerplate-core';

type UserRegisteredIntegrationSchemaV1 = {
  userId: string;
  email: string;
};

export class UserRegisteredIntegrationEvent
  implements Infra.EventBus.IIntegrationEvent<UserRegisteredIntegrationSchemaV1>
{
  [x: string]: any;
  public payload: UserRegisteredIntegrationSchemaV1;
  public metadata: Infra.EventBus.TIntegrationEventMetadata;
  static boundedContextId = 'Bitloops_IAM';
  static versions = ['v1'];

  constructor(payload: UserRegisteredIntegrationSchemaV1) {
    this.metadata = {
      boundedContextId: UserRegisteredIntegrationEvent.boundedContextId,
      version: UserRegisteredIntegrationEvent.versions[0],
      createdTimestamp: Date.now(),
      messageId: new Domain.UUIDv4().toString(),
      context: {},
      correlationId: asyncLocalStorage.getStore()?.get('correlationId'),
    };
    Object.assign(this, payload, this.metadata);
  }
}
