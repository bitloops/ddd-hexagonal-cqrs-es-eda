# Backend architecture

## Runtime shape

The backend is a modular NestJS application with three bounded contexts:

- IAM manages the application's user identity and profile model.
- Todo is the core domain and uses CQRS plus event sourcing.
- Marketing consumes integration events and maintains the user information it
  needs locally.

The HTTP edge exposes REST for commands and queries and server-sent events for
realtime Todo notifications. NATS Core provides request/reply and pub/sub,
while JetStream carries durable commands, domain events, and integration
events.

## PostgreSQL-only persistence

PostgreSQL is the only application database. The application creates these
tables idempotently during startup:

| Table | Purpose |
| --- | --- |
| `users` | IAM users and credentials during the current built-in auth phase |
| `marketing_users` | Marketing's eventually consistent user view |
| `notification_templates` | Marketing notification content |
| `todo_events` | Append-only Todo aggregate history |
| `todo_projection` | Current Todo query model |
| `todo_outbox` | Domain events waiting for durable publication |

The Todo write repository does not store a mutable aggregate document. It
loads the ordered event stream, rehydrates the aggregate, and appends new
events with an expected version.

## Todo transaction and delivery guarantee

Each Todo command commits three effects in one PostgreSQL transaction:

1. Append one or more immutable rows to `todo_events`.
2. Update or delete the corresponding `todo_projection` row.
3. Insert matching unpublished rows into `todo_outbox`.

The outbox relay claims rows with `FOR UPDATE SKIP LOCKED`, publishes them to
JetStream using the original message identifier, and marks them as published
only after acknowledgement. Failed deliveries use bounded exponential retry.
Consumers must still be idempotent because a crash between publication and the
`published_at` update can cause at-least-once delivery.

## Concurrency

Todo event streams have a unique `(aggregate_id, version)` constraint. Updates
lock the latest version and compare it with the aggregate version before
appending. The projection update also includes the expected version. A stale
aggregate therefore rolls back its event, projection, and outbox changes
together.

## Authentication boundary

The current release validates application-issued JWTs at the HTTP boundary and
again in repositories that enforce ownership. This is intentionally a
transitional implementation. The proposed Keycloak integration is described
in [Keycloak IAM roadmap](./keycloak-iam-roadmap.md).

## Validation

From the repository root:

```bash
pnpm build
pnpm lint
pnpm test
```

The database integration test requires an empty PostgreSQL test database:

```bash
PG_DATABASE=bitloops_test \
PG_USER=user \
PG_PASSWORD=postgres \
pnpm --dir backend test:integration
```
