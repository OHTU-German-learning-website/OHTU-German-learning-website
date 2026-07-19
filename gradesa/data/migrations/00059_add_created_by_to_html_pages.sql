ALTER TABLE html_pages
ADD COLUMN IF NOT EXISTS created_by bigint;

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'html_pages_created_by_fkey'
	) THEN
		ALTER TABLE html_pages
		ADD CONSTRAINT html_pages_created_by_fkey
		FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;
	END IF;
END $$;