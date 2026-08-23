ALTER TABLE public.multichoice_exercises
ADD COLUMN IF NOT EXISTS instruction_text text;
