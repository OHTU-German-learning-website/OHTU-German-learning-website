-- 00057_create_backups_table.sql
-- Simple backups table for snapshots of created/updated entities

CREATE TABLE IF NOT EXISTS backups (
  id SERIAL PRIMARY KEY,
  entity_type VARCHAR(128) NOT NULL,
  entity_id TEXT,
  actor_id INTEGER,
  checksum VARCHAR(64) NOT NULL,
  payload BYTEA NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Avoid storing identical snapshots for the same entity
CREATE UNIQUE INDEX IF NOT EXISTS backups_entity_checksum_idx
  ON backups(entity_type, entity_id, checksum);
