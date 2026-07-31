# Backend architecture

## Runtime shape

The backend is a modular NestJS application with three bounded contexts:

- IAM owns the application's user identity and its integration events.
- Todo is the core domain and uses CQRS plus event sourcing.
- Marketing consumes integration events and keeps the user data it needs
  locally.

The HTTP edge exposes REST for commands and queries and server-sent events for
realtime Todo notifications. NATS Core provides request/reply and pub/sub,
while JetStream carries durable commands, domain events, and integration
events.

## Identity boundary

Keycloak owns authentication. The HTTP OIDC guard verifies RS256 access tokens
through the `IdentityProviderPort`, checking signature, issuer, audience,
authorised client, token lifetime, and claims. The IAM repository then maps the
external `(issuer, subject)` pair to an internal UUID and synchronises the
email and roles.

Only the internal principal is stored in asynchronous request context. Todo
ownership checks use its `userId`; repositories neither receive the bearer
token nor know about Keycloak. `/auth/me` exposes the reconciled application
principal. See [Keycloak IAM architecture](./keycloak-iam-roadmap.md).

## PostgreSQL-only persistence

PostgreSQL is the sole application database. Keycloak has a separate
PostgreSQL database that application code cannot access. The backend creates
these application tables idempotently during startup:

| Table | Purpose |
| --- | --- |
| `users` | Mapping from OIDC issuer/subject to the internal user identity |
| `iam_outbox` | IAM integration events awaiting publication |
| `marketing_users` | Marketing's eventually consistent user view |
| `notification_templates` | Marketing notification content |
| `todo_events` | Append-only Todo aggregate history |
| `todo_projection` | Current Todo query model |
| `todo_outbox` | Todo domain events awaiting durable publication |

IAM provisioning and email reconciliation update `users` and `iam_outbox` in
one transaction. Todo commands similarly commit events, projections, and
outbox messages atomically.

## Todo event sourcing and delivery

The write repository loads the ordered event stream, rehydrates the aggregate,
and appends new events with an expected version. Each command transaction:

1. appends immutable rows to `todo_events`;
2. updates or deletes the corresponding `todo_projection` row; and
3. inserts matching unpublished rows into `todo_outbox`.

Relays claim rows with `FOR UPDATE SKIP LOCKED`, publish using the original
message identifier, and mark them only after acknowledgement. Failed delivery
uses bounded exponential retry. Consumers must be idempotent because a crash
between publication and marking can produce at-least-once delivery.

The unique `(aggregate_id, version)` constraint and expected-version projection
update reject stale aggregates. A conflict rolls back events, projection, and
outbox together.

## Validation

From the repository root:

```bash
pnpm build
pnpm lint
pnpm test
```

The database integration lane requires an empty PostgreSQL test database:

```bash
PG_DATABASE=bitloops_test \
PG_USER=user \
PG_PASSWORD=postgres \
pnpm --dir backend test:integration
```
