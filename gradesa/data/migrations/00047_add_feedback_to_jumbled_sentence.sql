ALTER TABLE public.jumbled_sentence_sentences
  ADD COLUMN IF NOT EXISTS correct_feedback text,
  ADD COLUMN IF NOT EXISTS alternate_feedbacks text[] NOT NULL DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS incorrect_feedbacks text[] NOT NULL DEFAULT ARRAY[]::text[];
