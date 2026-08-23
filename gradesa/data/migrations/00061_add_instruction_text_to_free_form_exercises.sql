ALTER TABLE public.free_form_exercises
ADD COLUMN IF NOT EXISTS instruction_text text;
