# Deploying on Kubernetes

The manifests under `k8s` deploy the frontend, backend, PostgreSQL, NATS, and
the observability services. MongoDB and the former Envoy/gRPC edge are no
longer part of the deployment.

## Prepare images and secrets

Build and publish the application images, or load them into your local cluster:

```bash
docker build -f backend/Dockerfile -t todo-backend:latest .
docker build -f frontend/Dockerfile -t todo-frontend:latest .
```

For a remote registry, change the image names in
`k8s/deployment-todo-backend.yaml` and
`k8s/deployment-todo-frontend.yaml` to immutable, registry-qualified tags.

Before applying the manifests, replace every development value in
`k8s/secret-bl-postgres-secret.yaml`, especially `POSTGRES_PASSWORD` and
`JWT_SECRET`. Do not commit production secrets. PostgreSQL is the sole
application database and uses the `bitloops` database by default.

## Validate and apply

Perform a client-side validation first:

```bash
kubectl apply --dry-run=client --validate=false -f k8s
```

Apply the namespace and resources in dependency order with:

```bash
./apply_k8s_files.sh
```

The application image currently initialises its schemas idempotently at
startup. For a production deployment, introduce a dedicated migration job
before scaling the backend beyond one replica.

Keycloak is not included in the 1.0.0 manifests. Its proposed database and
deployment boundary are documented in
[`docs/keycloak-iam-roadmap.md`](./docs/keycloak-iam-roadmap.md).
