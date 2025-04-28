ALTER TABLE public.click_answers
ADD CONSTRAINT click_answers_unique
UNIQUE (user_id, click_exercise_id);