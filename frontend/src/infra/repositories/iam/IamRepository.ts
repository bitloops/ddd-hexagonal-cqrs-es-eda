import { TODO_URL } from '../../../config';
import { EventBus, Events } from '../../../Events';
import type { User } from '../../../models/User';
import type { IIamRepository } from '../../interfaces/IIamRepository';
import type {
  IdentityProviderSession,
  IIamService,
} from '../../interfaces/IIamService';

type PrincipalResponse = {
  id: string;
  email: string;
  roles: string[];
};

class IamRepository implements IIamRepository {
  private readonly iamService: IIamService;
  private currentToken: string | null = null;
  private currentUser: User | null = null;

  constructor(iamService: IIamService) {
    this.iamService = iamService;
    this.iamService.onSessionLoaded((session) => {
      void this.reconcile(session).catch((error: unknown) => {
        console.error('Unable to reconcile the renewed OIDC session', error);
        this.clearUser();
      });
    });
    this.iamService.onSessionUnloaded(() => this.clearUser());
  }

  login(): Promise<void> {
    return this.iamService.login();
  }

  register(): Promise<void> {
    return this.iamService.register();
  }

  async completeLogin(): Promise<User> {
    return this.reconcile(await this.iamService.completeLogin());
  }

  logout(): Promise<void> {
    return this.iamService.logout();
  }

  async completeLogout(): Promise<void> {
    await this.iamService.completeLogout();
    this.clearUser();
  }

  async getUser(): Promise<User | null> {
    const session = await this.iamService.getSession();
    return session ? this.reconcile(session) : null;
  }

  private async reconcile(session: IdentityProviderSession): Promise<User> {
    if (this.currentToken === session.accessToken && this.currentUser) {
      return this.currentUser;
    }

    const response = await fetch(`${TODO_URL}/auth/me`, {
      headers: {
        authorization: `Bearer ${session.accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`IAM reconciliation failed with HTTP ${response.status}`);
    }

    const principal = (await response.json()) as PrincipalResponse;
    if (!principal.id || !principal.email || !Array.isArray(principal.roles)) {
      throw new Error('IAM reconciliation returned an invalid principal');
    }

    const user: User = {
      id: principal.id,
      email: principal.email,
      roles: principal.roles,
      accessToken: session.accessToken,
    };
    this.currentToken = session.accessToken;
    this.currentUser = user;
    EventBus.emit(Events.AUTH_CHANGED, user);
    return user;
  }

  private clearUser(): void {
    this.currentToken = null;
    this.currentUser = null;
    EventBus.emit(Events.AUTH_CHANGED, null);
  }
}

export { IamRepository };
