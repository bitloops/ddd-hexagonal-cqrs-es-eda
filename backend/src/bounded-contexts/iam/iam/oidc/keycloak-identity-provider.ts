import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jsonwebtoken from 'jsonwebtoken';
import * as jwksRsa from 'jwks-rsa';

import { AuthEnvironmentVariables } from '@src/config/auth.configuration';
import { ExternalIdentity } from '@src/lib/bounded-contexts/iam/authentication/domain/authenticated-principal';
import { IdentityProviderPort } from '@src/lib/bounded-contexts/iam/authentication/ports/identity-provider.port';

type KeycloakAccessToken = jsonwebtoken.JwtPayload & {
  azp?: unknown;
  email?: unknown;
  email_verified?: unknown;
  realm_access?: { roles?: unknown };
  resource_access?: Record<string, { roles?: unknown }>;
};

@Injectable()
export class KeycloakIdentityProvider implements IdentityProviderPort {
  private readonly issuer: string;
  private readonly audience: string;
  private readonly clientId: string;
  private readonly requireVerifiedEmail: boolean;
  private readonly clockToleranceSeconds: number;
  private readonly jwksClient: jwksRsa.JwksClient;

  constructor(configService: ConfigService<AuthEnvironmentVariables, true>) {
    const oidc = configService.get('oidc', { infer: true });
    this.issuer = oidc.issuer;
    this.audience = oidc.audience;
    this.clientId = oidc.clientId;
    this.requireVerifiedEmail = oidc.requireVerifiedEmail;
    this.clockToleranceSeconds = oidc.clockToleranceSeconds;
    this.jwksClient = new jwksRsa.JwksClient({
      jwksUri: oidc.jwksUri,
      cache: true,
      cacheMaxEntries: 5,
      cacheMaxAge: 600_000,
      rateLimit: true,
      jwksRequestsPerMinute: 10,
      timeout: 5_000,
    });
  }

  async validateAccessToken(accessToken: string): Promise<ExternalIdentity> {
    const token = await this.verify(accessToken);
    if (
      typeof token.iss !== 'string' ||
      typeof token.sub !== 'string' ||
      typeof token.email !== 'string'
    ) {
      throw new Error('OIDC token is missing required identity claims');
    }
    if (token.azp !== this.clientId) {
      throw new Error('OIDC token was not issued to the configured client');
    }

    const emailVerified = token.email_verified === true;
    if (this.requireVerifiedEmail && !emailVerified) {
      throw new Error('OIDC email address is not verified');
    }

    const realmRoles = Array.isArray(token.realm_access?.roles)
      ? token.realm_access.roles.filter((role): role is string => typeof role === 'string')
      : [];
    const clientRoleClaims = token.resource_access?.[this.clientId]?.roles;
    const clientRoles = Array.isArray(clientRoleClaims)
      ? clientRoleClaims.filter((role): role is string => typeof role === 'string')
      : [];

    return {
      issuer: token.iss,
      subject: token.sub,
      email: token.email.trim().toLowerCase(),
      emailVerified,
      roles: [...new Set([...realmRoles, ...clientRoles])].sort(),
    };
  }

  private verify(accessToken: string): Promise<KeycloakAccessToken> {
    return new Promise((resolve, reject) => {
      jsonwebtoken.verify(
        accessToken,
        (header, callback) => {
          if (!header.kid) {
            callback(new jsonwebtoken.JsonWebTokenError('JWT key id is missing'));
            return;
          }
          this.jwksClient
            .getSigningKey(header.kid)
            .then((key) => callback(null, key.getPublicKey()))
            .catch((error: Error) => callback(error));
        },
        {
          algorithms: ['RS256'],
          issuer: this.issuer,
          audience: this.audience,
          clockTolerance: this.clockToleranceSeconds,
        },
        (error, decoded) => {
          if (error) {
            reject(error);
            return;
          }
          if (!decoded || typeof decoded === 'string') {
            reject(new jsonwebtoken.JsonWebTokenError('JWT payload is invalid'));
            return;
          }
          resolve(decoded as KeycloakAccessToken);
        },
      );
    });
  }
}
