export const TODO_POSTGRES_SCHEMA = `
  CREATE TABLE IF NOT EXISTS todo_events (
    event_id UUID PRIMARY KEY,
    aggregate_id UUID NOT NULL,
    version INTEGER NOT NULL CHECK (version > 0),
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    metadata JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (aggregate_id, version)
  );

  CREATE INDEX IF NOT EXISTS todo_events_aggregate_version_idx
    ON todo_events (aggregate_id, version);

  CREATE TABLE IF NOT EXISTS todo_projection (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN NOT NULL,
    version INTEGER NOT NULL CHECK (version > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS todo_projection_user_updated_idx
    ON todo_projection (user_id, updated_at DESC, id);

  CREATE TABLE IF NOT EXISTS todo_outbox (
    id UUID PRIMARY KEY,
    aggregate_id UUID NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    metadata JSONB NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    available_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    locked_until TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    last_error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS todo_outbox_pending_idx
    ON todo_outbox (available_at, created_at)
    WHERE published_at IS NULL;
`;
