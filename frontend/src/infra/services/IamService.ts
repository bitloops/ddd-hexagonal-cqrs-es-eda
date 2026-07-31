import {
  InMemoryWebStorage,
  User,
  UserManager,
  WebStorageStateStore,
} from 'oidc-client-ts';

import {
  OIDC_AUTHORITY,
  OIDC_CLIENT_ID,
  OIDC_POST_LOGOUT_REDIRECT_URI,
  OIDC_REDIRECT_URI,
} from '../../config';
import type {
  IdentityProviderSession,
  IIamService,
} from '../interfaces/IIamService';

const SSO_RESTORE_ATTEMPTED = 'bitloops.oidc.sso-restore-attempted';

class IamService implements IIamService {
  private readonly manager = new UserManager({
    authority: OIDC_AUTHORITY,
    client_id: OIDC_CLIENT_ID,
    redirect_uri: OIDC_REDIRECT_URI,
    post_logout_redirect_uri: OIDC_POST_LOGOUT_REDIRECT_URI,
    response_type: 'code',
    scope: 'openid profile email',
    automaticSilentRenew: true,
    monitorSession: true,
    loadUserInfo: false,
    revokeTokensOnSignout: true,
    userStore: new WebStorageStateStore({ store: new InMemoryWebStorage() }),
    stateStore: new WebStorageStateStore({ store: window.sessionStorage }),
  });

  login(): Promise<void> {
    window.sessionStorage.removeItem(SSO_RESTORE_ATTEMPTED);
    return this.manager.signinRedirect();
  }

  register(): Promise<void> {
    return this.manager.signinRedirect({ prompt: 'create' });
  }

  async completeLogin(): Promise<IdentityProviderSession> {
    const session = this.toSession(await this.manager.signinCallback());
    window.sessionStorage.removeItem(SSO_RESTORE_ATTEMPTED);
    return session;
  }

  logout(): Promise<void> {
    return this.manager.signoutRedirect();
  }

  async completeLogout(): Promise<void> {
    await this.manager.signoutCallback();
    await this.manager.removeUser();
  }

  async getSession(): Promise<IdentityProviderSession | null> {
    let user = await this.manager.getUser();
    if (user?.expired && user.refresh_token) {
      try {
        user = await this.manager.signinSilent();
      } catch {
        await this.manager.removeUser();
        user = null;
      }
    }
    if (user && !user.expired) return this.toSession(user);

    if (!window.sessionStorage.getItem(SSO_RESTORE_ATTEMPTED)) {
      window.sessionStorage.setItem(SSO_RESTORE_ATTEMPTED, 'true');
      await this.manager.signinRedirect({ prompt: 'none' });
    }
    return null;
  }

  onSessionLoaded(listener: (session: IdentityProviderSession) => void): () => void {
    const callback = (user: User) => listener(this.toSession(user));
    this.manager.events.addUserLoaded(callback);
    return () => this.manager.events.removeUserLoaded(callback);
  }

  onSessionUnloaded(listener: () => void): () => void {
    this.manager.events.addUserUnloaded(listener);
    return () => this.manager.events.removeUserUnloaded(listener);
  }

  private toSession(user: User | undefined): IdentityProviderSession {
    if (!user?.access_token || typeof user.profile.sub !== 'string') {
      throw new Error('The identity provider did not return a usable session');
    }
    return {
      accessToken: user.access_token,
      idToken: user.id_token,
      subject: user.profile.sub,
    };
  }
}

export default IamService;
