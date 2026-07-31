# Backend development

## Prerequisites

- Node.js 24
- Corepack with the repository-pinned pnpm version
- Docker and Docker Compose

Install the workspace from the repository root:

```bash
corepack enable
pnpm install --frozen-lockfile
```

## Configuration and infrastructure

Copy `backend/.template-env` to `backend/.development.env`. Start the backend's
dependencies, including the OIDC issuer:

```bash
docker compose -p bitloops-todo-app up -d \
  bl-postgres bl-nats bl-keycloak-postgres bl-keycloak
```

The default issuer is `http://localhost:8090/realms/bitloops`; the backend uses
the internal Keycloak URL only for JWKS retrieval. PostgreSQL is the only
application database. Keycloak owns a separate database that application code
must not access.

Start the backend in watch mode:

```bash
pnpm --dir backend start:dev
```

The REST API listens on `http://localhost:8080`, Swagger UI is at `/api`, and
the OpenAPI document is at `/api-json`.

## Module boundaries

- `src/api` contains REST and SSE driving adapters.
- `src/lib/bounded-contexts` contains application and domain code.
- `src/bounded-contexts` contains OIDC, PostgreSQL, NATS, and service adapters.
- `src/lib/infra` contains reusable NestJS infrastructure.

The OIDC guard validates the external access token and the IAM repository
reconciles it to an internal UUID. Controllers dispatch Todo commands and
queries through NATS. The Todo write adapter reconstructs aggregates from
`todo_events`, then commits events, projection updates, and outbox rows in one
transaction. See [backend architecture](../docs/backend-architecture.md).

## Validation

```bash
pnpm --dir backend build
pnpm --dir backend lint
pnpm --dir backend test
```

Run the database integration lane against an isolated test database:

```bash
PG_DATABASE=bitloops_test \
PG_USER=user \
PG_PASSWORD=postgres \
pnpm --dir backend test:integration
```

## IAM configuration

`OIDC_ISSUER`, `OIDC_AUDIENCE`, and `OIDC_CLIENT_ID` are mandatory.
`OIDC_JWKS_URI` supports an internal JWKS endpoint while issuer validation
continues to use the public URL. Enable `OIDC_REQUIRE_VERIFIED_EMAIL` in
environments whose Keycloak realm enforces email verification.

Keycloak remains behind `IdentityProviderPort`; application and domain code
must not import Keycloak libraries or consume Keycloak database records. See
[Keycloak IAM architecture](../docs/keycloak-iam-roadmap.md).
