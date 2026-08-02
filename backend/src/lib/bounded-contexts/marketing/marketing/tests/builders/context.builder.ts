import { Application } from 'ddd-tactical-core-boilerplate';

export class ContextBuilder {
  private userId: string;

  withUserId(userId: string): ContextBuilder {
    this.userId = userId;
    return this;
  }

  build(): Application.TContext {
    // The shared boilerplate type still requires its retired `jwt` field.
    // Application request context deliberately contains only the internal ID.
    const context = {
      userId: this.userId,
    } as unknown as Application.TContext;
    return context;
  }
}
