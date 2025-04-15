CREATE TABLE fillinthegap_exercises (
  id BIGSERIAL PRIMARY KEY,
  sentence_template TEXT[] NOT NULL,
  correct_answers TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TRIGGER fillinthegap_exercises_updated_at
BEFORE UPDATE ON fillinthegap_exercises
FOR EACH ROW EXECUTE FUNCTION public.updated_at();

CREATE TABLE fillinthegap_submissions (
  id BIGSERIAL PRIMARY KEY,
  exercise_id BIGINT NOT NULL REFERENCES fillinthegap_exercises(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_answers TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TRIGGER fillinthegap_submissions_updated_at
BEFORE UPDATE ON fillinthegap_submissions
FOR EACH ROW EXECUTE FUNCTION public.updated_at();
