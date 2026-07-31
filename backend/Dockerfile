# syntax=docker/dockerfile:1.7

FROM node:24.18.1-alpine3.24 AS pnpm-base

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

RUN corepack enable

WORKDIR /workspace

FROM pnpm-base AS build

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
COPY frontend/tests/package.json frontend/tests/package.json

RUN pnpm install --frozen-lockfile --filter todo...

COPY backend backend

RUN pnpm --dir backend run build

FROM pnpm-base AS production-dependencies

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
COPY frontend/tests/package.json frontend/tests/package.json

RUN pnpm install --frozen-lockfile --prod --filter todo...

FROM node:24.18.1-alpine3.24 AS runtime

ENV NODE_ENV=production

WORKDIR /workspace

COPY --from=production-dependencies /workspace/node_modules node_modules
COPY --from=production-dependencies /workspace/backend/node_modules backend/node_modules
COPY --from=build /workspace/backend/dist backend/dist
COPY backend/package.json backend/package.json

USER node
WORKDIR /workspace/backend

EXPOSE 8080

CMD ["node", "dist/main"]
