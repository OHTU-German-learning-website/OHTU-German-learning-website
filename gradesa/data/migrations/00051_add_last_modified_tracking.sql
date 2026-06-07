ALTER TABLE exercises
ADD COLUMN IF NOT EXISTS updated_by bigint;

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'exercises_updated_by_fkey'
	) THEN
		ALTER TABLE exercises
		ADD CONSTRAINT exercises_updated_by_fkey
		FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL;
	END IF;
END $$;

UPDATE exercises
SET updated_by = created_by
WHERE updated_by IS NULL;

ALTER TABLE html_pages
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone NOT NULL DEFAULT now();

ALTER TABLE html_pages
ADD COLUMN IF NOT EXISTS updated_by bigint;

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'html_pages_updated_by_fkey'
	) THEN
		ALTER TABLE html_pages
		ADD CONSTRAINT html_pages_updated_by_fkey
		FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL;
	END IF;
END $$;

DROP TRIGGER IF EXISTS update_exercises_updated_at ON exercises;
CREATE TRIGGER update_exercises_updated_at
BEFORE UPDATE ON exercises
FOR EACH ROW
EXECUTE FUNCTION updated_at();

DROP TRIGGER IF EXISTS update_html_pages_updated_at ON html_pages;
CREATE TRIGGER update_html_pages_updated_at
BEFORE UPDATE ON html_pages
FOR EACH ROW
EXECUTE FUNCTION updated_at();
