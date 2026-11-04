-- Existing exercises keep the letters-only tokenizer (1) so their stored slot keys stay valid.
-- New exercises are saved with version 2 (letters and digits are clickable).
ALTER TABLE public.click_exercises
ADD COLUMN token_version smallint NOT NULL DEFAULT 1;
