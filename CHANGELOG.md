# Changelog

All notable changes to this project are documented in this file. The format is
based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the
project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
