import { Infra } from '@bitloops/bl-boilerplate-core';
import { UserUpdatedEmailDomainEvent } from '../../domain/events/user-updated-email.event';

export type IntegrationSchemaV1 = {
  userId: string;
  email: string;
};

type IntegrationSchemas = IntegrationSchemaV1;
type ToIntegrationDataMapper = (
  data: UserUpdatedEmailDomainEvent,
) => IntegrationSchemas;

export class UserEmailChangedIntegrationEvent extends Infra.EventBus
  .IntegrationEvent<IntegrationSchemas> {
  static versions = ['v1'];
  public static readonly boundedContextId = 'IAM';
  // UserUpdatedEmailDomainEvent.fromContextId; // get from it's own context in case we have some props as input
  static versionMappers: Record<string, ToIntegrationDataMapper> = {
    v1: UserEmailChangedIntegrationEvent.toIntegrationDataV1,
  };

  constructor(public payload: IntegrationSchemas, version: string) {
    super('IAM', payload, version);
  }

  static create(
    event: UserUpdatedEmailDomainEvent,
  ): UserEmailChangedIntegrationEvent[] {
    return UserEmailChangedIntegrationEvent.versions.map((version) => {
      const mapper = UserEmailChangedIntegrationEvent.versionMappers[version];
      const data = mapper(event);
      return new UserEmailChangedIntegrationEvent(data, version);
    });
  }

  static toIntegrationDataV1(
    event: UserUpdatedEmailDomainEvent,
  ): IntegrationSchemaV1 {
    return {
      userId: event.payload.aggregateId,
      email: event.payload.email,
    };
  }

  // static getEventTopic(version?: string) {
  //     const topic = `integration.${UserUpdatedEmailIntegrationEvent.name}`;

  //     const eventTopic = version === undefined ? topic : `${topic}.${version}`;
  //     return eventTopic;
  // }
}
