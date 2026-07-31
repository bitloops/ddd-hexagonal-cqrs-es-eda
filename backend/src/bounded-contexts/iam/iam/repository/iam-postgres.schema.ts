export const IAM_POSTGRES_SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    issuer TEXT,
    subject TEXT,
    email VARCHAR(320) NOT NULL,
    last_login TIMESTAMPTZ
  );

  ALTER TABLE users ADD COLUMN IF NOT EXISTS issuer TEXT;
  ALTER TABLE users ADD COLUMN IF NOT EXISTS subject TEXT;
  ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;
  ALTER TABLE users DROP COLUMN IF EXISTS password;

  CREATE UNIQUE INDEX IF NOT EXISTS users_external_identity_idx
    ON users (issuer, subject);

  CREATE TABLE IF NOT EXISTS iam_outbox (
    id UUID PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    available_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    locked_until TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    last_error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS iam_outbox_pending_idx
    ON iam_outbox (available_at, created_at)
    WHERE published_at IS NULL;
`;
