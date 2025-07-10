-- Add password_hash column to organizations table if it doesn't exist
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255); 