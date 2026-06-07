ALTER TABLE glossary_entries
ADD COLUMN IF NOT EXISTS updated_by bigint;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'glossary_entries_updated_by_fkey'
  ) THEN
    ALTER TABLE glossary_entries
    ADD CONSTRAINT glossary_entries_updated_by_fkey
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END $$;
