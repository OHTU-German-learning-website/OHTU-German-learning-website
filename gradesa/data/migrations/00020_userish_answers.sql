ALTER TABLE user_question_answers
ALTER COLUMN user_id DROP NOT NULL,
ADD COLUMN answerer_id TEXT;

UPDATE user_question_answers
SET answerer_id = user_id::TEXT;

ALTER TABLE user_question_answers
ALTER COLUMN answerer_id SET NOT NULL;

