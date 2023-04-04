import { UserReadModel } from '../../domain/read-models/user-email.read-model';

export class UserEmailReadModelBuilder {
  private userId: string;
  private email: string;

  withUserId(userId: string): UserEmailReadModelBuilder {
    this.userId = userId;
    return this;
  }

  withEmail(email: string): UserEmailReadModelBuilder {
    this.email = email;
    return this;
  }

  build(): UserReadModel {
    return new UserReadModel(this.userId, this.email);
  }
}
