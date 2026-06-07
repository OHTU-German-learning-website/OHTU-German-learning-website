-- Backfill updated_by for existing exercises where we can infer the creator
-- from child exercise tables.

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
