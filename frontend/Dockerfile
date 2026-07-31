# syntax=docker/dockerfile:1.7

FROM node:24.18.1-alpine3.24 AS build

WORKDIR /workspace

RUN corepack enable && corepack prepare pnpm@11.18.0 --activate

# The image uses the repository-level pnpm workspace and lockfile. Build it with:
# docker build -f frontend/Dockerfile .
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/package.json
COPY frontend/tests/package.json ./frontend/tests/package.json

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm config set store-dir /pnpm/store && \
    pnpm install --filter todo-frontend... --frozen-lockfile

COPY frontend ./frontend

# Vite replaces these public values at build time. Changing them on a running
# container has no effect; rebuild the image with the appropriate --build-arg.
ARG VITE_API_BASE_URL=http://localhost:8080
ARG VITE_AUTH_URL
ARG VITE_REGISTRATION_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL} \
    VITE_AUTH_URL=${VITE_AUTH_URL} \
    VITE_REGISTRATION_URL=${VITE_REGISTRATION_URL}

RUN pnpm --filter todo-frontend run build

FROM nginxinc/nginx-unprivileged:1.31.3-alpine3.24 AS production

COPY --chown=101:101 frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build --chown=101:101 /workspace/frontend/dist /usr/share/nginx/html

USER 101

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:8080/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
