ALTER TABLE public.jumbled_sentence_exercises
ADD COLUMN IF NOT EXISTS instruction_text text;
