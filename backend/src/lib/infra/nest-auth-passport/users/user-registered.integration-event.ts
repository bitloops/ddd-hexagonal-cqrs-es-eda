import { Infra, asyncLocalStorage } from '@bitloops/bl-boilerplate-core';

type UserRegisteredIntegrationSchemaV1 = {
  userId: string;
  email: string;
};

export class UserRegisteredIntegrationEvent extends Infra.EventBus
  .IntegrationEvent<UserRegisteredIntegrationSchemaV1> {
  static readonly boundedContextId = 'Bitloops_IAM';
  static readonly versions = ['v1'];

  constructor(payload: UserRegisteredIntegrationSchemaV1) {
    const store = asyncLocalStorage.getStore();
    super(
      UserRegisteredIntegrationEvent.boundedContextId,
      payload,
      UserRegisteredIntegrationEvent.versions[0],
      {
        correlationId: store?.get('correlationId'),
        context: store?.get('context') ?? {},
      },
    );
  }
}
