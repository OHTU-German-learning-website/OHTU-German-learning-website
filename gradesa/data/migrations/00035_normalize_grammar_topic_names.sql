-- Normalize legacy grammar topic names in existing environments.
--
-- Why this migration exists:
-- Older environments may already contain prefixed topic names like
-- 'Das Adjektiv' / 'Die Syntax'. Later code and seed data use canonical
-- names like 'Adjektiv' / 'Syntax'. If both exist, UI can show duplicates.
--
-- This migration is intentionally data-only and forward-safe:
-- - If both old and new names exist, move references and remove old rows.
-- - If only old name exists, rename it to the canonical value.
-- - If neither old nor new exists, do nothing.

DO $$
DECLARE
  r RECORD;
  old_id INT;
  new_id INT;
BEGIN
  FOR r IN
    SELECT *
    FROM (
      VALUES
        ('Das Adjektiv', 'Adjektiv'),
        ('Das Adverb', 'Adverb'),
        ('Das Artikelwort', 'Artikelwort'),
        ('Das Pronomen', 'Pronomen'),
        ('Das Substantiv', 'Substantiv'),
        ('Das Verb', 'Verb'),
        ('Die Präposition', 'Präposition'),
        ('Die Syntax', 'Syntax')
    ) AS m(old_name, new_name)
  LOOP
    SELECT id
      INTO old_id
      FROM grammar_topics
     WHERE name = r.old_name
     ORDER BY id
     LIMIT 1;

    SELECT id
      INTO new_id
      FROM grammar_topics
     WHERE name = r.new_name
     ORDER BY id
     LIMIT 1;

    IF old_id IS NULL THEN
      CONTINUE;
    END IF;

    IF new_id IS NOT NULL AND new_id <> old_id THEN
      -- Repoint all grammar pages to canonical topic id.
      UPDATE html_pages
         SET grammar_topic_id = new_id
       WHERE grammar_topic_id = old_id;

      -- Keep the better (smaller) sort order when both exist.
      UPDATE grammar_topics
         SET sort_order = CASE
           WHEN sort_order IS NULL THEN (SELECT sort_order FROM grammar_topics WHERE id = old_id)
           WHEN (SELECT sort_order FROM grammar_topics WHERE id = old_id) IS NULL THEN sort_order
           ELSE LEAST(sort_order, (SELECT sort_order FROM grammar_topics WHERE id = old_id))
         END
       WHERE id = new_id;

      DELETE FROM grammar_topics WHERE id = old_id;
    ELSE
      -- Only old topic exists: rename in place.
      UPDATE grammar_topics
         SET name = r.new_name
       WHERE id = old_id;
    END IF;
  END LOOP;
END
$$;
