-- Re-apply exercise updated_by backfill in a new migration.
-- This is intentionally idempotent and safe to run multiple times.
-- It addresses environments where earlier backfill migration content differed
-- but migration version 00052 is already marked as applied.

UPDATE exercises
SET updated_by = created_by
WHERE updated_by IS NULL
  AND created_by IS NOT NULL;

UPDATE exercises e
SET updated_by = de.created_by
FROM dnd_exercises de
WHERE e.id = de.exercise_id
  AND e.updated_by IS NULL
  AND de.created_by IS NOT NULL;

UPDATE exercises e
SET updated_by = dme.created_by
FROM dnd_match_exercises dme
WHERE e.id = dme.exercise_id
  AND e.updated_by IS NULL
  AND dme.created_by IS NOT NULL;

UPDATE exercises e
SET updated_by = mge.created_by
FROM memory_game_exercises mge
WHERE e.id = mge.exercise_id
  AND e.updated_by IS NULL
  AND mge.created_by IS NOT NULL;

UPDATE exercises e
SET updated_by = jse.created_by
FROM jumbled_sentence_exercises jse
WHERE e.id = jse.exercise_id
  AND e.updated_by IS NULL
  AND jse.created_by IS NOT NULL;
