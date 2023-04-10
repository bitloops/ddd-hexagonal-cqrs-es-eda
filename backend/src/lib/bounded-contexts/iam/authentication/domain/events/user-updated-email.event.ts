import { Domain } from '@bitloops/bl-boilerplate-core';

export type UserUpdatedEmailDomainEventProps = Domain.TDomainEventProps<{
  email: string;
}>;

export class UserUpdatedEmailDomainEvent extends Domain.DomainEvent<UserUpdatedEmailDomainEventProps> {
  public metadata: Domain.TDomainEventMetadata;
  public aggregateId: string;

  constructor(payload: UserUpdatedEmailDomainEventProps) {
    super('IAM', payload);
    this.aggregateId = payload.aggregateId;
  }
}
