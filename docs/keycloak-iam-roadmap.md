# Keycloak IAM roadmap

## Decision

Adopt Keycloak as the identity provider, but do not replace the IAM bounded
context with Keycloak.

Keycloak should own authentication concerns: credentials, password policies,
email verification, recovery, MFA/passkeys, login sessions, token issuance,
and external identity brokering. The application should continue to own its
internal user identity, profile lifecycle, domain policies, ownership checks,
and integration events.

This split keeps a third-party identity system outside the domain model and
gives the application an explicit anti-corruption layer.

## Target flow

1. The browser uses OpenID Connect Authorization Code Flow with PKCE against a
   public Keycloak client.
2. The frontend holds tokens in memory and delegates renewal to an OIDC client;
   it no longer posts passwords to this backend.
3. The backend validates issuer, audience, signature, expiry, and authorised
   party using the realm discovery document and JWKS.
4. An authentication adapter maps standard claims such as `sub`, `email`, and
   roles into an application `AuthenticatedPrincipal`.
5. IAM provisions or reconciles an internal user idempotently, keyed by the
   immutable `(issuer, subject)` pair.
6. IAM emits application-owned integration events such as user registered or
   email changed. Downstream contexts never consume Keycloak events directly.

Use standards-based OpenID Connect libraries from the NestJS and browser
ecosystems rather than a Keycloak-specific application adapter. Keycloak's
current guidance recommends ecosystem protocol support where available.

## Ownership boundaries

| Concern | Owner |
| --- | --- |
| Credentials, MFA, recovery and login UI | Keycloak |
| Browser session and token issuance | Keycloak |
| Token verification and claim translation | IAM infrastructure adapter |
| Internal user id and profile lifecycle | IAM domain |
| Todo ownership and business authorisation | Application domain |
| User registration/email integration events | IAM application layer |
| Marketing's user/email view | Marketing bounded context |

Keycloak roles may be mapped into the principal for coarse access control, but
fine-grained domain authorisation should remain in application policies and
repositories during the first migration.

## Rollout sequence

### 1. Infrastructure and reproducibility

- Add a pinned Keycloak container and a committed development realm import.
- Give Keycloak an isolated database/schema and database user; application code
  must not read Keycloak tables.
- Add health checks, secrets, backup notes, and CI smoke coverage.

### 2. Backend resource server

- Introduce an `IdentityProviderPort` and a Keycloak/OIDC adapter.
- Replace local JWT signature checks with discovery/JWKS validation.
- Map `(iss, sub)` to the internal user and retain repository ownership checks.
- Test key rotation, invalid issuer/audience, expiry, clock skew, and disabled
  users.

### 3. Frontend PKCE client

- Redirect login, registration, verification, and recovery to Keycloak.
- Use Authorization Code Flow with PKCE; do not use the password grant.
- Preserve the frontend IAM repository interface so Keycloak details remain at
  the boundary.

### 4. User lifecycle bridge

- Reconcile the internal IAM user on the first authenticated request or a
  dedicated callback.
- Make provisioning idempotent and publish application integration events only
  after the local user transaction succeeds.
- Add a scheduled reconciliation path before considering a custom Keycloak
  Event Listener SPI. Avoid making an SPI the first dependency.

### 5. Remove local authentication

- Deprecate and then remove `/auth/login` and `/auth/register`.
- Remove local password hashes, Passport Local, application token issuance, and
  refresh logic only after all clients use Keycloak.
- Define an explicit migration/reset flow for any existing local accounts;
  password hashes should not be copied casually.

## Acceptance criteria

- The backend never receives a user's password.
- Token validation fails closed and supports signing-key rotation.
- A Keycloak outage does not invalidate already issued access tokens while
  cached signing keys remain valid, subject to normal expiry.
- Duplicate lifecycle notifications do not create duplicate users or events.
- Todo ownership rules use the internal principal and remain independent of
  Keycloak APIs.
- Local development, CI, Compose, and Kubernetes paths are reproducible.

## Trade-offs

Keycloak removes a sizeable amount of security-sensitive custom code and adds
MFA, recovery, session administration, federation, and standards compliance.
It also adds an operationally significant Java service, database lifecycle,
realm configuration, upgrades, and availability requirements. For this
architecture reference, that trade is worthwhile if the deployment and realm
configuration are treated as first-class code rather than an optional manual
setup.

References:

- [Keycloak OpenID Connect endpoints](https://www.keycloak.org/securing-apps/oidc-layers)
- [Keycloak securing applications guidance](https://www.keycloak.org/securing-apps/overview)
- [Keycloak server administration guide](https://www.keycloak.org/docs/latest/server_admin/)
