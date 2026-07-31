# Todo frontend

The React application uses Vite, Redux Toolkit, a generated OpenAPI client,
and server-sent events. Its UI follows a lightweight MVVM arrangement:

- presentational components render props;
- controllers connect components to Redux state and actions;
- repositories coordinate application operations;
- services contain OIDC, REST, and SSE transport details.

The Todo mapper is an anti-corruption layer. Backend payloads use `completed`,
whereas the UI model uses `isCompleted`; REST responses and SSE lifecycle
events use the same mapping and validation before entering Redux.

## Keycloak authentication

`oidc-client-ts` implements OpenID Connect Authorization Code Flow with PKCE.
Login and registration redirect to Keycloak. The callback obtains a
short-lived access token, then the IAM repository calls `/auth/me` to reconcile
the external identity to the internal application user. Access tokens remain
in memory and transient PKCE state uses session storage. A newly opened window
uses a top-level, non-interactive OIDC `prompt=none` request to join an existing
Keycloak SSO session; when no SSO session exists it falls back to the login
screen after one attempt.

Configure these Vite variables before building:

```text
VITE_API_BASE_URL=http://localhost:8080
VITE_OIDC_AUTHORITY=http://localhost:8090/realms/bitloops
VITE_OIDC_CLIENT_ID=todo-frontend
```

The authority is a browser-visible URL, so an internal container hostname will
not work. Production values must use the public HTTPS issuer and exact redirect
origins configured in Keycloak.

## Development

Install from the repository root and start Keycloak, its database, the
application database, NATS, and the backend:

```bash
corepack enable
pnpm install --frozen-lockfile
docker compose -p bitloops-todo-app up -d \
  bl-keycloak-postgres bl-keycloak bl-postgres bl-nats todo-backend
pnpm --dir frontend dev
```

Open `http://localhost:5173`. The development realm includes
`demo@example.com` with password `Todo-Demo-2026!`.

## Commands

```bash
pnpm --dir frontend build
pnpm --dir frontend lint
pnpm --dir frontend/tests test
pnpm --dir frontend openapi-ts
```

The OpenAPI generator reads `http://localhost:8080/api-json`, so run the
backend before regenerating `src/api`.

Build the production container from the repository root:

```bash
docker build -f frontend/Dockerfile \
  --build-arg VITE_API_BASE_URL=http://localhost:8080 \
  --build-arg VITE_OIDC_AUTHORITY=http://localhost:8090/realms/bitloops \
  --build-arg VITE_OIDC_CLIENT_ID=todo-frontend \
  -t todo-frontend .
```
