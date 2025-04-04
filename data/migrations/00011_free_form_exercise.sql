CREATE TABLE IF NOT EXISTS free_form_exercises (
  id bigint PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  exercise_id BIGINT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  question TEXT NOT NULL
);

CREATE TRIGGER updated_at
  BEFORE UPDATE
  ON public.free_form_exercises
  FOR EACH ROW
EXECUTE FUNCTION updated_at();

CREATE TABLE IF NOT EXISTS free_form_answers (
  id bigint PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  free_form_exercise_id BIGINT NOT NULL REFERENCES free_form_exercises(id) ON DELETE CASCADE,
  answer TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS free_form_answers_free_form_exercise_id_idx
  ON free_form_answers (free_form_exercise_id);

CREATE TRIGGER updated_at
  BEFORE UPDATE
  ON public.free_form_answers
  FOR EACH ROW
EXECUTE FUNCTION updated_at();

CREATE TABLE IF NOT EXISTS free_form_answer_feedbacks (
  id bigint PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  feedback TEXT NOT NULL,
  free_form_answer_id BIGINT NOT NULL REFERENCES free_form_answers(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS free_form_answer_feedbacks_free_form_answer_id_idx
  ON free_form_answer_feedbacks (free_form_answer_id);

CREATE TRIGGER updated_at
  BEFORE UPDATE
  ON public.free_form_answer_feedbacks
  FOR EACH ROW
EXECUTE FUNCTION updated_at();

CREATE TABLE IF NOT EXISTS free_form_user_answers (
  id bigint PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  answer TEXT NOT NULL,
  free_form_exercise_id BIGINT NOT NULL REFERENCES free_form_exercises(id) ON DELETE CASCADE,
  is_correct BOOLEAN DEFAULT false,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE (free_form_exercise_id, user_id)
);

CREATE TRIGGER updated_at
  BEFORE UPDATE
  ON public.free_form_user_answers
  FOR EACH ROW
EXECUTE FUNCTION updated_at();