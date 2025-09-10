-- Create the iam schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS iam;

-- Enable the uuid-ossp extension for UUID generation (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table with UUID v7 support
-- Note: PostgreSQL doesn't natively support UUID v7 generation,
-- so we'll use application-level generation for new records
CREATE TABLE IF NOT EXISTS iam.users (
    id UUID PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    last_login TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON iam.users(email);

-- Create index on created_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_users_created_at ON iam.users(created_at);

-- Create updated_at trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to users table
DROP TRIGGER IF EXISTS update_users_updated_at ON iam.users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON iam.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();