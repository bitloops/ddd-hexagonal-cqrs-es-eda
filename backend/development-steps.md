# Backend development

## Prerequisites

- Node.js 24
- Corepack with the repository-pinned pnpm version
- Docker and Docker Compose

Install the complete workspace from the repository root:

```bash
corepack enable
pnpm install --frozen-lockfile
```

## Configuration and infrastructure

Copy `backend/.template-env` to `backend/.development.env` and replace the
development JWT secret. Start PostgreSQL and NATS:

```bash
docker compose -p bitloops-todo-app up -d bl-postgres bl-nats
```

PostgreSQL is the only application database. The backend creates the IAM,
Marketing, Todo event-store, projection, and outbox tables idempotently during
startup.

Start the backend in watch mode:

```bash
pnpm --dir backend start:dev
```

The REST API listens on `http://localhost:8080`, Swagger UI is available at
`/api`, and the OpenAPI document at `/api-json`.

## Module boundaries

- `src/api` contains REST and SSE driving adapters.
- `src/lib/bounded-contexts` contains application and domain code.
- `src/bounded-contexts` contains PostgreSQL, NATS, and service adapters.
- `src/lib/infra` contains reusable NestJS infrastructure.

Controllers dispatch commands and queries through NATS request/reply. The Todo
write adapter reconstructs aggregates from `todo_events`, then commits events,
the query projection, and outbox rows in one PostgreSQL transaction. See
[`../docs/backend-architecture.md`](../docs/backend-architecture.md).

## Validation

```bash
pnpm --dir backend run build
pnpm --dir backend run lint
pnpm --dir backend run test
```

Run the database integration lane against an isolated test database:

```bash
PG_DATABASE=bitloops_test \
PG_USER=user \
PG_PASSWORD=postgres \
pnpm --dir backend run test:integration
```

## Tracing

Register `TracingModule` with the system message bus and apply `@Traceable` to
async application or adapter methods. Tracing publication is deliberately
isolated from business results: an observability outage must not turn a valid
command into an HTTP failure.

## IAM direction

The application-owned password and JWT implementation is transitional. New IAM
work should follow the
[`../docs/keycloak-iam-roadmap.md`](../docs/keycloak-iam-roadmap.md) and keep
Keycloak behind an OpenID Connect anti-corruption adapter.
