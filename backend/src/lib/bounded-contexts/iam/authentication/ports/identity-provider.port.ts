import { ExternalIdentity } from '../domain/authenticated-principal';

export interface IdentityProviderPort {
  validateAccessToken(accessToken: string): Promise<ExternalIdentity>;
}

export const IdentityProviderPortToken = Symbol('IdentityProviderPort');
