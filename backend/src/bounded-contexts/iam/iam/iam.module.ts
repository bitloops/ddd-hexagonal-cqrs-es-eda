import { DynamicModule, Module } from '@nestjs/common';

import {
  PostgresModule,
  PostgresModuleAsyncOptions,
} from '@lib/infra/postgres';
import { IdentityProviderPortToken } from '@src/lib/bounded-contexts/iam/authentication/ports/identity-provider.port';
import { UserIdentityRepoPortToken } from '@src/lib/bounded-contexts/iam/authentication/ports/user-identity.repo-port';
import { KeycloakIdentityProvider } from './oidc/keycloak-identity-provider';
import { OidcAuthGuard } from './oidc/oidc-auth.guard';
import { IAM_POSTGRES_SCHEMA } from './repository/iam-postgres.schema';
import { IamOutboxRelay } from './repository/iam-outbox.relay';
import { UserIdentityPostgresRepository } from './repository/user-identity.pg.repository';

@Module({})
export class IamModule {
  static forRootAsync(postgresOptions: PostgresModuleAsyncOptions): DynamicModule {
    return {
      module: IamModule,
      imports: [
        PostgresModule.forRootAsync(postgresOptions),
        PostgresModule.forFeature(IAM_POSTGRES_SCHEMA),
      ],
      providers: [
        IamOutboxRelay,
        OidcAuthGuard,
        {
          provide: IdentityProviderPortToken,
          useClass: KeycloakIdentityProvider,
        },
        {
          provide: UserIdentityRepoPortToken,
          useClass: UserIdentityPostgresRepository,
        },
      ],
      exports: [
        OidcAuthGuard,
        IdentityProviderPortToken,
        UserIdentityRepoPortToken,
      ],
    };
  }
}
