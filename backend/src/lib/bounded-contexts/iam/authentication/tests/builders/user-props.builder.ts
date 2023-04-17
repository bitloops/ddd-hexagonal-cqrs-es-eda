import { Domain } from '@bitloops/bl-boilerplate-core';
import {
  UserEntity,
  UserProps,
} from '@src/lib/bounded-contexts/iam/authentication/domain/user.entity';
import { EmailVO } from '../../domain/email.value-object';

export class UserPropsBuilder {
  private id: string;
  private email: string;
  private password: string;
  private lastLogin: string;

  withEmail(email: string): UserPropsBuilder {
    this.email = email;
    return this;
  }

  withId(id: string): UserPropsBuilder {
    this.id = id;
    return this;
  }

  withPassword(password: string): UserPropsBuilder {
    this.password = password;
    return this;
  }

  withLastLogin(lastLogin: any): UserPropsBuilder {
    this.lastLogin = lastLogin;
    return this;
  }

  build(): UserProps {
    const userProps: UserProps = {
      email: EmailVO.create({ email: this.email }).value as EmailVO,
      password: this.password,
      lastLogin: this.lastLogin,
    };
    if (this.id) {
      userProps.id = new Domain.UUIDv4(this.id);
    }

    return userProps;
  }
}
