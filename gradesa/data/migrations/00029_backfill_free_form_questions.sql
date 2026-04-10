INSERT INTO free_form_questions (
  free_form_exercise_id,
  question,
  question_order
)
SELECT
  ffe.id,
  ffe.question,
  1
FROM free_form_exercises ffe
WHERE NOT EXISTS (
  SELECT 1
  FROM free_form_questions ffq
  WHERE ffq.free_form_exercise_id = ffe.id
);

UPDATE free_form_answers ffa
SET free_form_question_id = ffq.id
FROM free_form_questions ffq
WHERE ffa.free_form_exercise_id = ffq.free_form_exercise_id
  AND ffq.question_order = 1
  AND ffa.free_form_question_id IS NULL;