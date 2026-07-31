import { generateKeyPairSync, KeyObject } from 'node:crypto';

import { ConfigService } from '@nestjs/config';
import * as jsonwebtoken from 'jsonwebtoken';

import { AuthEnvironmentVariables } from '@src/config/auth.configuration';
import { KeycloakIdentityProvider } from '../keycloak-identity-provider';

type SigningFixture = {
  kid: string;
  privateKey: KeyObject;
  publicKey: string;
};

const mockSigningKeys = new Map<string, string>();

jest.mock('jwks-rsa', () => ({
  JwksClient: class {
    async getSigningKey(kid: string) {
      const publicKey = mockSigningKeys.get(kid);
      if (!publicKey) throw new Error(`Signing key ${kid} was not found`);
      return { getPublicKey: () => publicKey };
    }
  },
}));

describe('KeycloakIdentityProvider', () => {
  const issuer = 'https://identity.example.test/realms/bitloops';
  const audience = 'todo-api';
  const clientId = 'todo-frontend';
  const primary = signingFixture('primary-key');
  const rotated = signingFixture('rotated-key');

  beforeEach(() => {
    mockSigningKeys.clear();
    mockSigningKeys.set(primary.kid, primary.publicKey);
  });

  it('validates issuer, audience, authorised party and identity claims', async () => {
    const identity = await provider().validateAccessToken(token(primary));

    expect(identity).toEqual({
      issuer,
      subject: 'external-user-1',
      email: 'user@example.com',
      emailVerified: true,
      roles: ['todo-admin', 'todo-user'],
    });
  });

  it.each([
    ['issuer', { issuer: 'https://attacker.example.test/realms/bitloops' }],
    ['audience', { audience: 'another-api' }],
    ['authorised party', { azp: 'another-client' }],
  ])('rejects an invalid %s', async (_claim, overrides) => {
    await expect(
      provider().validateAccessToken(token(primary, overrides)),
    ).rejects.toThrow();
  });

  it('rejects expired access tokens', async () => {
    await expect(
      provider().validateAccessToken(token(primary, { expiresIn: -60 })),
    ).rejects.toThrow(/expired/i);
  });

  it('selects a newly rotated signing key by key id', async () => {
    const identityProvider = provider();
    await expect(identityProvider.validateAccessToken(token(primary))).resolves.toBeDefined();

    mockSigningKeys.set(rotated.kid, rotated.publicKey);
    await expect(identityProvider.validateAccessToken(token(rotated))).resolves.toMatchObject({
      subject: 'external-user-1',
    });
  });

  it('can require a verified email claim', async () => {
    await expect(
      provider(true).validateAccessToken(token(primary, { emailVerified: false })),
    ).rejects.toThrow(/not verified/i);
  });

  function provider(requireVerifiedEmail = false): KeycloakIdentityProvider {
    const config = new ConfigService({
      oidc: {
        issuer,
        audience,
        clientId,
        jwksUri: 'https://identity.example.test/realms/bitloops/certs',
        requireVerifiedEmail,
        clockToleranceSeconds: 0,
      },
    }) as ConfigService<AuthEnvironmentVariables, true>;
    return new KeycloakIdentityProvider(config);
  }

  function token(
    key: SigningFixture,
    overrides: {
      issuer?: string;
      audience?: string;
      azp?: string;
      emailVerified?: boolean;
      expiresIn?: number;
    } = {},
  ): string {
    return jsonwebtoken.sign(
      {
        azp: overrides.azp ?? clientId,
        email: 'User@Example.com',
        email_verified: overrides.emailVerified ?? true,
        realm_access: { roles: ['todo-user'] },
        resource_access: { [clientId]: { roles: ['todo-admin'] } },
      },
      key.privateKey,
      {
        algorithm: 'RS256',
        keyid: key.kid,
        issuer: overrides.issuer ?? issuer,
        audience: overrides.audience ?? audience,
        subject: 'external-user-1',
        expiresIn: overrides.expiresIn ?? 300,
      },
    );
  }
});

function signingFixture(kid: string): SigningFixture {
  const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
  });
  return {
    kid,
    privateKey,
    publicKey: publicKey.export({ type: 'spki', format: 'pem' }).toString(),
  };
}
