import { asyncLocalStorage, Domain } from '@bitloops/bl-boilerplate-core';

export type UserLoggedInDomainEventProps = {
  email: string;
} & {
  aggregateId: string;
};
export class UserLoggedInDomainEvent
  implements Domain.IDomainEvent<UserLoggedInDomainEventProps>
{
  public metadata: Domain.TDomainEventMetadata;
  public aggregateId: string;

  constructor(public readonly payload: UserLoggedInDomainEventProps) {
    this.metadata = {
      boundedContextId: 'IyAM',
      messageId: new Domain.UUIDv4().toString(),
      createdTimestamp: Date.now(),
      correlationId: asyncLocalStorage.getStore()?.get('correlationId'),
      context: asyncLocalStorage.getStore()?.get('context'),
    };
    this.aggregateId = payload.aggregateId;
  }
}
