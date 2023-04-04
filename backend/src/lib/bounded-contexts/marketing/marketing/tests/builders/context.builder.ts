import { Application } from '@bitloops/bl-boilerplate-core';

export class ContextBuilder {
  private userId: string;
  private jwt: string;

  withJWT(jwt: string): ContextBuilder {
    this.jwt = jwt;
    return this;
  }

  withUserId(userId: string): ContextBuilder {
    this.userId = userId;
    return this;
  }

  build(): Application.TContext {
    const context: Application.TContext = {
      userId: this.userId,
      jwt: this.jwt,
    };
    return context;
  }
}
