import { Domain, Either, ok } from 'ddd-tactical-core-boilerplate';

interface UserIdProps {
  id: string;
}

export class UserIdVO extends Domain.ValueObject<UserIdProps> {
  get id(): Domain.UUIDv4 {
    return Domain.UUIDv4.fromString(this.props.id);
  }

  private constructor(props: UserIdProps) {
    super(props);
  }

  public static create(props: { id: Domain.UUIDv4 }): Either<UserIdVO, never> {
    return ok(new UserIdVO({ id: props.id.toString() }));
  }
}
