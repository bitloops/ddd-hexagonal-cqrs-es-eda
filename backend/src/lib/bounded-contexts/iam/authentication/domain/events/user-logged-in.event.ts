import { Domain } from '@bitloops/bl-boilerplate-core';

export type UserLoggedInDomainEventProps = Domain.TDomainEventProps<{
  email: string;
}>;

export class UserLoggedInDomainEvent extends Domain.DomainEvent<UserLoggedInDomainEventProps> {
  public metadata: Domain.TDomainEventMetadata;
  public aggregateId: string;

  constructor(payload: UserLoggedInDomainEventProps) {
    super('IAM', payload);
    this.aggregateId = payload.aggregateId;
  }
}
