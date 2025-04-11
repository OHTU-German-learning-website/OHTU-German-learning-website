CREATE TABLE IF NOT EXISTS multichoice_exercises (
  id bigint PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
  exercise_id bigint NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  title text NOT NULL,
  exercise_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER updated_at
    BEFORE UPDATE
    ON public.multichoice_exercises
    FOR EACH ROW
EXECUTE FUNCTION updated_at();

CREATE TABLE IF NOT EXISTS multichoice_content (
  id bigint PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
  multichoice_exercise_id bigint NOT NULL REFERENCES multichoice_exercises(id) ON DELETE CASCADE,
  content_type text NOT NULL,
  content_value text NOT NULL,
  content_order integer NOT NULL,
  correct_answer text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER updated_at
    BEFORE UPDATE
    ON public.multichoice_content
    FOR EACH ROW
EXECUTE FUNCTION updated_at();

CREATE TABLE IF NOT EXISTS multichoice_options (
  id bigint PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
  multichoice_content_id bigint NOT NULL REFERENCES multichoice_content(id) ON DELETE CASCADE,
  option_value text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER updated_at
    BEFORE UPDATE
    ON public.multichoice_options
    FOR EACH ROW
EXECUTE FUNCTION updated_at();
