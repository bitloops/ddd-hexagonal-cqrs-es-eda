import { Infra } from '@bitloops/bl-boilerplate-core';

export type IntegrationSchemaV1 = {
  userId: string;
  email: string;
};

export class UserEmailChangedIntegrationEvent extends Infra.EventBus
  .IntegrationEvent<IntegrationSchemaV1> {
  static readonly versions = ['v1'];
  public static readonly boundedContextId = 'IAM';

  constructor(public payload: IntegrationSchemaV1, version = 'v1') {
    super('IAM', payload, version);
  }
}
