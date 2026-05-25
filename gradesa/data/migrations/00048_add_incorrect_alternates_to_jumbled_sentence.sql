ALTER TABLE public.jumbled_sentence_sentences
  ADD COLUMN IF NOT EXISTS incorrect_alternates text[] NOT NULL DEFAULT ARRAY[]::text[];