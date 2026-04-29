ALTER TABLE free_form_exercises ADD COLUMN title TEXT;

-- Backfill existing exercises with title from their first question
UPDATE free_form_exercises ffe
SET title = (
  SELECT question FROM free_form_questions 
  WHERE free_form_exercise_id = ffe.id 
  ORDER BY question_order ASC 
  LIMIT 1
)
WHERE title IS NULL;

-- Make title NOT NULL after backfilling
ALTER TABLE free_form_exercises ALTER COLUMN title SET NOT NULL;
