export type IdentityProviderSession = {
  accessToken: string;
  idToken?: string;
  subject: string;
};

export interface IIamService {
  login(): Promise<void>;
  register(): Promise<void>;
  completeLogin(): Promise<IdentityProviderSession>;
  logout(): Promise<void>;
  completeLogout(): Promise<void>;
  getSession(): Promise<IdentityProviderSession | null>;
  onSessionLoaded(listener: (session: IdentityProviderSession) => void): () => void;
  onSessionUnloaded(listener: () => void): () => void;
}
