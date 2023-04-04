export type TUserReadModelSnapshot = {
  userId: string;
  email: string;
};

export class UserReadModel {
  constructor(public readonly userId: string, public readonly email: string) {}

  static fromPrimitives(primitives: TUserReadModelSnapshot): UserReadModel {
    return new UserReadModel(primitives.userId, primitives.email);
  }

  toPrimitives(): TUserReadModelSnapshot {
    return {
      userId: this.userId,
      email: this.email,
    };
  }
}
