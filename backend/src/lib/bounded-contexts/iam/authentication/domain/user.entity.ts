import { Domain, Either, ok } from '@bitloops/bl-boilerplate-core';
import { UserLoggedInDomainEvent } from './events/user-logged-in.event';
import { EmailVO } from './email.value-object';
import { UserUpdatedEmailDomainEvent } from './events/user-updated-email.event';

export interface UserProps {
  id?: Domain.UUIDv4;
  email: EmailVO;
  password: string; // TODO PasswordVO;
  lastLogin?: string; //TODO TimestampVO;
}

type TUserEntityPrimitives = {
  id: string;
  email: string;
  password: string;
  lastLogin?: string;
};

export class UserEntity extends Domain.Aggregate<UserProps> {
  private constructor(props: UserProps) {
    super(props, props.id);
  }

  public static create(props: UserProps): Either<UserEntity, never> {
    const user = new UserEntity(props);

    // const isNew = !props.id;
    // if (isNew) {
    //   user.addDomainEvent(new UserRegisteredDomainEvent(user));
    // }
    return ok(user);
  }

  get email(): EmailVO {
    return this.props.email;
  }

  get id() {
    return this._id;
  }

  get password(): string {
    //PasswordVO
    return this.props.password;
  }

  get lastLogin(): string | undefined {
    //TimestampVO
    return this.props.lastLogin;
  }

  public login(): Either<void, never> {
    // this.props.lastLogin = timestampVO; // update last login
    this.addDomainEvent(
      new UserLoggedInDomainEvent({
        email: this.email.email,
        aggregateId: this.id.toString(),
      }),
    );
    return ok();
  }

  public updateEmail(email: EmailVO): void {
    this.props.email = email;
    this.addDomainEvent(
      new UserUpdatedEmailDomainEvent({
        email: this.email.email,
        aggregateId: this.id.toString(),
      }),
    );
  }

  public static fromPrimitives(data: TUserEntityPrimitives): UserEntity {
    const UserEntityProps = {
      id: new Domain.UUIDv4(data.id) as Domain.UUIDv4,
      email: EmailVO.create({
        email: data.email,
      }).value as EmailVO,
      password: data.password, //PasswordVO.create({ password: data.password }).value as PasswordVO,
      lastLogin: data.lastLogin, //TimestampVO.create({ timestamp: data.lastLogin }).value as TimestampVO,
    };
    return new UserEntity(UserEntityProps);
  }

  public toPrimitives(): TUserEntityPrimitives {
    return {
      id: this.id.toString(),
      email: this.props.email.email,
      password: this.props.password, //this.props.password.password,
      lastLogin: this.props.lastLogin, //this.props.lastLogin.timestamp,
    };
  }
}
