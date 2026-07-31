import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import {
  AuthenticatedPrincipal,
  ExternalIdentity,
} from '@src/lib/bounded-contexts/iam/authentication/domain/authenticated-principal';
import {
  IdentityProviderPort,
  IdentityProviderPortToken,
} from '@src/lib/bounded-contexts/iam/authentication/ports/identity-provider.port';
import {
  UserIdentityRepoPort,
  UserIdentityRepoPortToken,
} from '@src/lib/bounded-contexts/iam/authentication/ports/user-identity.repo-port';

type AuthenticatedRequest = {
  headers: Record<string, string | string[] | undefined>;
  user?: AuthenticatedPrincipal;
};

@Injectable()
export class OidcAuthGuard implements CanActivate {
  constructor(
    @Inject(IdentityProviderPortToken)
    private readonly identityProvider: IdentityProviderPort,
    @Inject(UserIdentityRepoPortToken)
    private readonly identities: UserIdentityRepoPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const accessToken = this.bearerToken(request.headers.authorization);

    let identity: ExternalIdentity;
    try {
      identity = await this.identityProvider.validateAccessToken(accessToken);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired access token', {
        cause: error,
      });
    }

    request.user = await this.identities.reconcile(identity);
    return true;
  }

  private bearerToken(header: string | string[] | undefined): string {
    const value = Array.isArray(header) ? header[0] : header;
    const match = value?.match(/^Bearer\s+(\S+)$/i);
    if (!match) throw new UnauthorizedException('Bearer access token is required');
    return match[1];
  }
}
