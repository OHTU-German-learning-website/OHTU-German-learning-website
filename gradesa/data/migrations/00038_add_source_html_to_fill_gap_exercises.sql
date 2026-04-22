ALTER TABLE fill_gap_exercises
ADD COLUMN IF NOT EXISTS source_html text NOT NULL DEFAULT '';
