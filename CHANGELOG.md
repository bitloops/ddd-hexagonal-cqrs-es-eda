# Changelog

All notable changes to this project are documented in this file. The format is
based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the
project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Upgraded `ddd-tactical-core-boilerplate` to 2.0.0 and adopted its explicit
  aggregate identity, immutable value-object, and domain-event lifecycle
  contracts.

## [1.0.2] - 2026-08-02

### Changed

- Replaced the legacy `@bitloops/bl-boilerplate-core` dependency with the
  maintained, dependency-free `ddd-tactical-core-boilerplate` package.
- Aligned the root, backend, frontend, and frontend-test package versions at
  `1.0.2`.

## [1.0.1] - 2026-07-31

### Added

- Keycloak 26.7 with an imported development realm, isolated PostgreSQL
  database, Compose services, and Kubernetes manifests.
- OpenID Connect Authorization Code Flow with PKCE in the frontend and
  standards-based RS256/JWKS access-token validation in the backend.
- An IAM anti-corruption layer that maps Keycloak issuer/subject identities to
  internal user UUIDs.
- A transactional IAM outbox for user registration and email-change
  integration events.
- OIDC validation tests covering issuer, audience, authorised client, expiry,
  verified email, and signing-key rotation, plus identity reconciliation
  integration tests.
- React 19.2 and React Router 8.3, including the patched router release for the
  current RSC action security advisory.

### Changed

- Replaced application-owned credentials and sessions with Keycloak while
  retaining the IAM bounded context and `/auth/me` reconciliation endpoint.
- Kept browser access tokens in memory and limited session storage to transient
  PKCE state.
- Restored an existing Keycloak SSO session non-interactively when the
  application opens in another browser window.
- Regenerated the OpenAPI client after removing local authentication routes.
- Aligned the root, backend, frontend, and frontend-test package versions at
  `1.0.1`.

### Removed

- Passport strategies, password hashing, local registration/login commands,
  locally issued JWTs, and the old `/auth/login` and `/auth/register` routes.

## [1.0.0] - 2026-07-31

### Added

- A pnpm workspace pinned through Corepack, with Node.js 24 and TypeScript 6.
- A frontend anti-corruption layer that translates backend `completed` values
  into the UI model's `isCompleted` property for REST and SSE messages.
- Unit and behavioural frontend tests for transport mapping and Todo state
  transitions.
- PostgreSQL event sourcing for the Todo aggregate, including append-only
  events, an optimistic version check, and a query projection.
- A PostgreSQL transactional outbox and retrying NATS relay for Todo domain
  events.
- Real-PostgreSQL integration tests for atomic persistence and stale aggregate
  rejection.
- Backend linting, database integration tests, and PostgreSQL 18 in CI.
- Production-focused Node.js 24 Docker images and validated Kubernetes
  manifests.

### Changed

- Modernised the frontend to Vite 7, Redux Toolkit, current generated OpenAPI
  client tooling, and an nginx runtime image.
- Modernised the backend to NestJS 11, Fastify 5, ESLint 10, Jest 30, pnpm 11,
  and TypeScript 6.
- Consolidated IAM, Marketing, Todo projections, Todo events, and the outbox on
  PostgreSQL as the sole application database.
- Changed external browser communication to REST and server-sent events.
- Made NATS publishing awaitable, bounded failed-message redelivery, and
  isolated tracing delivery failures from business operations.
- Aligned the root, backend, frontend, and frontend-test package versions at
  `1.0.0`.

### Removed

- Yarn and npm lockfiles in favour of one pnpm lockfile.
- MongoDB code, dependencies, Compose services, persistent volumes, and
  Kubernetes resources.
- The unused gRPC/protobuf generation pipeline, generated stubs, gRPC guard,
  and Envoy deployment resources.

### Security

- Updated direct dependencies and constrained vulnerable Fastify/Nest
  transitive packages to patched releases.
- Stopped persisting request JWTs in Todo event or outbox metadata.
