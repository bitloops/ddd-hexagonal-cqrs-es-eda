import { Domain, Either, ok } from '@bitloops/bl-boilerplate-core';

interface UserIdProps {
  id: Domain.UUIDv4;
}

export class UserIdVO extends Domain.ValueObject<UserIdProps> {
  get id(): Domain.UUIDv4 {
    return this.props.id;
  }

  private constructor(props: UserIdProps) {
    super(props);
  }

  public static create(props: UserIdProps): Either<UserIdVO, never> {
    return ok(new UserIdVO(props));
  }
}
