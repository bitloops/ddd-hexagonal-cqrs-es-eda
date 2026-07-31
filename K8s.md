# Deploying on Kubernetes

The sample manifests under `k8s` deploy the frontend, backend, application
PostgreSQL, NATS, Keycloak with its own PostgreSQL database, and the
observability services. MongoDB and the former Envoy/gRPC edge are not part of
the deployment.

## Prepare images and identity settings

Build and publish the application images, or load them into a local cluster:

```bash
docker build -f backend/Dockerfile -t todo-backend:latest .
docker build -f frontend/Dockerfile \
  --build-arg VITE_API_BASE_URL=http://localhost:8080 \
  --build-arg VITE_OIDC_AUTHORITY=http://localhost:8090/realms/bitloops \
  --build-arg VITE_OIDC_CLIENT_ID=todo-frontend \
  -t todo-frontend:latest .
```

For a registry, change both deployment image references to immutable,
registry-qualified tags. Before applying, replace every value in
`k8s/secret-bl-postgres-secret.yaml` and
`k8s/secret-bl-keycloak-secret.yaml`; production secrets belong in an external
secret manager, not Git.

The committed realm and hostnames are for local development. For an exposed
cluster, update all of the following to the same public HTTPS identity origin:

- `KC_HOSTNAME` in `deployment-bl-keycloak.yaml`;
- `OIDC_ISSUER` in `deployment-todo-backend.yaml`;
- the frontend `VITE_OIDC_AUTHORITY` build argument; and
- redirect URIs, post-logout URIs, and web origins in the realm import.

Keep `OIDC_JWKS_URI` on the cluster-internal Keycloak service. Enable realm
email verification and `OIDC_REQUIRE_VERIFIED_EMAIL` together in production.

## Validate and apply

Perform client-side validation first:

```bash
kubectl apply --dry-run=client --validate=false -f k8s
```

Apply resources in dependency order:

```bash
./apply_k8s_files.sh
```

Keycloak health and metrics use management port `9000`; do not expose that
port publicly in a production ingress. The sample uses one replica and a realm
import for clarity. A production installation should use externally managed
secrets, TLS, backups, suitable high availability, and a supported ingress
configuration.

The backend currently creates schemas idempotently at startup. Introduce a
dedicated migration job before scaling it beyond one replica. More detail is
in [Keycloak IAM architecture](./docs/keycloak-iam-roadmap.md).
