import {
  AuthenticatedPrincipal,
  ExternalIdentity,
} from '../domain/authenticated-principal';

export interface UserIdentityRepoPort {
  reconcile(identity: ExternalIdentity): Promise<AuthenticatedPrincipal>;
}

export const UserIdentityRepoPortToken = Symbol('UserIdentityRepoPort');
