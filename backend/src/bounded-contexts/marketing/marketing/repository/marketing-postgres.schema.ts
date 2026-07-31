export const MARKETING_POSTGRES_SCHEMA = `
  CREATE TABLE IF NOT EXISTS marketing_users (
    id UUID PRIMARY KEY,
    completed_todos INTEGER NOT NULL DEFAULT 0 CHECK (completed_todos >= 0),
    email VARCHAR(320) NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS notification_templates (
    id UUID PRIMARY KEY,
    type VARCHAR(100) NOT NULL UNIQUE,
    template TEXT NOT NULL
  );

  INSERT INTO notification_templates (id, type, template)
  VALUES (
    '00000000-0000-4000-8000-000000000001',
    'firstTodo',
    'Congratulations on completing your first todo!'
  )
  ON CONFLICT (type) DO NOTHING;
`;
