# Keycloak IAM architecture

Keycloak owns credentials, login, registration, recovery, browser sessions,
and token issuance. The application retains its IAM bounded context: it owns
the internal user identifier and publishes application integration events.
Keycloak tables are private to Keycloak and are never read by application
code.

## Request flow

1. The React client redirects to the public `todo-frontend` client using OpenID
   Connect Authorization Code Flow with PKCE (`S256`).
2. Keycloak authenticates the user and returns a short-lived access token whose
   audience includes `todo-api`.
3. The API guard passes the bearer token to `IdentityProviderPort`.
4. `KeycloakIdentityProvider` verifies the RS256 signature against a cached,
   rate-limited JWKS client and validates issuer, audience, authorised party,
   expiry, and required claims.
5. `UserIdentityRepositoryPort` reconciles `(issuer, subject)` to an
   application UUID. First access provisions the user; a later email claim
   updates it.
6. Only the application UUID enters application request context. Todo
   repositories never receive Keycloak claims or verify tokens themselves.

This is the IAM anti-corruption layer: external OIDC vocabulary and identifiers
stop at the boundary, while downstream bounded contexts continue to use the
application identity model.

## Events and consistency

Provisioning or changing an email writes the `users` row and an `iam_outbox`
row in the same PostgreSQL transaction. The relay publishes
`UserRegisteredIntegrationEvent` or `UserEmailChangedIntegrationEvent` to
NATS. Marketing consumes those application-owned events and does not consume
Keycloak-specific events.

Reconciliation happens on authenticated API access. Therefore an email change
in Keycloak becomes visible to the application on the user's next request.
The outbox is at-least-once; consumers must remain idempotent.

## Browser session

The frontend uses `oidc-client-ts`. Access tokens are kept in memory, while
only transient PKCE state uses session storage. A new browser window recovers
an existing Keycloak SSO session through a top-level `prompt=none` request; it
does not persist or copy the access token between windows. Login, registration,
callback, renewal, and logout stay behind the frontend IAM repository
interface. REST and SSE both receive the same access token without exposing
OIDC details to UI components.

## Development realm

Compose imports `keycloak/bitloops-realm.json` into the `bitloops` realm and
runs Keycloak 26.7.0 with a separate PostgreSQL database.

- Issuer: `http://localhost:8090/realms/bitloops`
- Admin console: `http://localhost:8090/admin/`
- Development administrator: `admin` / `admin-development-only`
- Development user: `demo@example.com` / `Todo-Demo-2026!`

These values are deliberately local-development defaults. Never reuse them in
an exposed environment.

## Production checklist

- Replace all bootstrap and database credentials with externally managed
  secrets; do not use the committed development realm as a production realm.
- Configure the public HTTPS hostname in Keycloak, the backend `OIDC_ISSUER`,
  and the frontend `VITE_OIDC_AUTHORITY` to the same issuer.
- Replace localhost redirect URIs and web origins with exact HTTPS origins.
- Enable email verification and set `OIDC_REQUIRE_VERIFIED_EMAIL=true`.
- Run Keycloak in production mode behind a supported ingress or proxy, retain
  its separate database, and back it up independently.
- Restrict management port `9000` to cluster health and metrics traffic.
- Use multiple Keycloak replicas and an appropriately highly available
  database when availability requirements demand it.

## References

- [Keycloak OpenID Connect endpoints](https://www.keycloak.org/securing-apps/oidc-layers)
- [Keycloak container guidance](https://www.keycloak.org/server/containers)
- [Keycloak realm import and export](https://www.keycloak.org/server/importExport)
- [oidc-client-ts documentation](https://authts.github.io/oidc-client-ts/)
