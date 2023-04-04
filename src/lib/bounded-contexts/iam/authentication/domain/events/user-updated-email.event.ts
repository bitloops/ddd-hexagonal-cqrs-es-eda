import { asyncLocalStorage, Domain } from '@bitloops/bl-boilerplate-core';

export type UserUpdatedEmailDomainEventProps = {
  email: string;
} & {
  aggregateId: string;
};
export class UserUpdatedEmailDomainEvent
  implements Domain.IDomainEvent<UserUpdatedEmailDomainEventProps>
{
  public metadata: Domain.TDomainEventMetadata;
  public aggregateId: any;

  constructor(public readonly payload: UserUpdatedEmailDomainEventProps) {
    this.metadata = {
      boundedContextId: 'IAM',
      messageId: new Domain.UUIDv4().toString(),
      createdTimestamp: Date.now(),
      correlationId: asyncLocalStorage.getStore()?.get('correlationId'),
      context: asyncLocalStorage.getStore()?.get('context'),
    };
    this.aggregateId = payload.aggregateId;
  }
}
