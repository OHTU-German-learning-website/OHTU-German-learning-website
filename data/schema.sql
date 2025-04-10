CREATE OR REPLACE FUNCTION public.updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
	BEGIN
		NEW.updated_at = NOW();
		RETURN NEW;
	END;
$function$
;

CREATE TABLE public.click_answers (
  id bigint PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id bigint NOT NULL,
  click_exercise_id bigint NOT NULL,
  answer text[] NOT NULL,
  target_words text[] NOT NULL,
  is_correct boolean NOT NULL GENERATED ALWAYS AS ((answer = target_words)) STORED
);

CREATE TRIGGER updated_at BEFORE UPDATE ON public.click_answers FOR EACH ROW EXECUTE FUNCTION updated_at();

CREATE TABLE public.click_exercises (
  id bigint PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  title text NOT NULL,
  category text NOT NULL,
  target_words text[] NOT NULL,
  all_words text[] NOT NULL
);

ALTER TABLE public.click_exercises
ADD CONSTRAINT click_exercises_all_words_target_words_key
UNIQUE (all_words, target_words);

ALTER TABLE public.click_exercises
ADD CONSTRAINT click_exercises_id_target_words_key
UNIQUE (id, target_words);

ALTER TABLE public.click_answers
ADD CONSTRAINT click_answers_click_exercise_id_fkey
FOREIGN KEY (click_exercise_id) REFERENCES click_exercises(id) ON DELETE CASCADE;

ALTER TABLE public.click_answers
ADD CONSTRAINT click_answers_click_exercise_id_target_words_fkey
FOREIGN KEY (click_exercise_id, target_words) REFERENCES click_exercises(id, target_words) ON UPDATE CASCADE ON DELETE CASCADE;

CREATE TABLE public.users (
  id bigint PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  salt text NOT NULL,
  username text NOT NULL DEFAULT ''::text,
  is_admin boolean DEFAULT false
);

ALTER TABLE public.click_answers
ADD CONSTRAINT click_answers_user_id_fkey
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

CREATE TABLE public.click_to_exercises (
  id bigint PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  click_id bigint,
  exercise_id bigint
);

ALTER TABLE public.click_to_exercises
ADD CONSTRAINT click_to_exercises_click_id_fkey
FOREIGN KEY (click_id) REFERENCES click_exercises(id);

CREATE TABLE public.exercises (
  id bigint PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.click_to_exercises
ADD CONSTRAINT click_to_exercises_exercise_id_fkey
FOREIGN KEY (exercise_id) REFERENCES exercises(id);

CREATE TABLE public.draggable_words (
  id bigint PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  word text NOT NULL,
  correct_answer text NOT NULL
);

ALTER TABLE public.draggable_words
ADD CONSTRAINT draggable_words_id_correct_answer_key
UNIQUE (id, correct_answer);

ALTER TABLE public.draggable_words
ADD CONSTRAINT draggable_words_word_correct_answer_key
UNIQUE (word, correct_answer);

CREATE TABLE public.exercises_to_grammar_items (
  id bigint PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
  grammar_item_id bigint,
  exercise_id bigint
);

ALTER TABLE public.exercises_to_grammar_items
ADD CONSTRAINT exercises_to_grammar_items_exercise_id_fkey
FOREIGN KEY (exercise_id) REFERENCES exercises(id);

CREATE TABLE public.grammar_items (
  id bigint PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
  grammar_item text UNIQUE NOT NULL
);

ALTER TABLE public.exercises_to_grammar_items
ADD CONSTRAINT exercises_to_grammar_items_grammar_item_id_fkey
FOREIGN KEY (grammar_item_id) REFERENCES grammar_items(id);

CREATE SEQUENCE public.feedbacks_id_seq;

CREATE TABLE public.feedbacks (
  id integer PRIMARY KEY NOT NULL DEFAULT nextval('feedbacks_id_seq'::regclass),
  email character varying(255) NOT NULL,
  message text NOT NULL,
  user_id integer NOT NULL,
  timestamp timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER SEQUENCE public.feedbacks_id_seq OWNED BY public.feedbacks.id;

CREATE TABLE public.form_parts (
  id bigint PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  form_id bigint NOT NULL,
  title_en text,
  title_de text,
  step_label text NOT NULL,
  advice_en text,
  advice_de text,
  advice_threshold numeric(5,2) DEFAULT 3
);

ALTER TABLE public.form_parts
ADD CONSTRAINT check_step_label
CHECK ((step_label ~ '^[A-Za-z0-9]$'::text));

ALTER TABLE public.form_parts
ADD CONSTRAINT unique_step_label
UNIQUE (form_id, step_label);

CREATE TABLE public.forms (
  id bigint PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  public_id text UNIQUE NOT NULL,
  title_en text,
  title_de text,
  description_en text,
  description_de text
);

ALTER TABLE public.form_parts
ADD CONSTRAINT form_parts_form_id_fkey
FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE RESTRICT;

CREATE TABLE public.free_form_answers (
  id bigint PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  free_form_exercise_id bigint NOT NULL,
  answer text NOT NULL,
  is_correct boolean DEFAULT false,
  feedback text
);

CREATE INDEX free_form_answers_free_form_exercise_id_idx ON public.free_form_answers USING btree (free_form_exercise_id);

CREATE TABLE public.free_form_exercises (
  id bigint PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  exercise_id bigint NOT NULL,
  question text NOT NULL
);

ALTER TABLE public.free_form_answers
ADD CONSTRAINT free_form_answers_free_form_exercise_id_fkey
FOREIGN KEY (free_form_exercise_id) REFERENCES free_form_exercises(id) ON DELETE CASCADE;

ALTER TABLE public.free_form_exercises
ADD CONSTRAINT free_form_exercises_exercise_id_fkey
FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE;

CREATE TABLE public.free_form_user_answers (
  id bigint PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  answer text NOT NULL,
  free_form_exercise_id bigint NOT NULL,
  is_correct boolean DEFAULT false,
  user_id bigint NOT NULL
);

ALTER TABLE public.free_form_user_answers
ADD CONSTRAINT free_form_user_answers_free_form_exercise_id_user_id_key
UNIQUE (free_form_exercise_id, user_id);

ALTER TABLE public.free_form_user_answers
ADD CONSTRAINT free_form_user_answers_free_form_exercise_id_fkey
FOREIGN KEY (free_form_exercise_id) REFERENCES free_form_exercises(id) ON DELETE CASCADE;

ALTER TABLE public.free_form_user_answers
ADD CONSTRAINT free_form_user_answers_user_id_fkey
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

CREATE TABLE public.part_questions (
  id bigint PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  form_part_id bigint NOT NULL,
  title_en text,
  title_de text
);

ALTER TABLE public.part_questions
ADD CONSTRAINT part_questions_form_part_id_fkey
FOREIGN KEY (form_part_id) REFERENCES form_parts(id) ON DELETE RESTRICT;

CREATE TABLE public.pgmigrate_migrations (
  id text PRIMARY KEY NOT NULL,
  checksum text NOT NULL,
  execution_time_in_millis bigint NOT NULL,
  applied_at timestamp with time zone NOT NULL
);

CREATE TABLE public.user_answers (
  id bigint PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id bigint NOT NULL,
  draggable_words_id bigint NOT NULL,
  answer text NOT NULL,
  correct_answer text NOT NULL,
  is_correct boolean NOT NULL GENERATED ALWAYS AS ((answer = correct_answer)) STORED
);

ALTER TABLE public.user_answers
ADD CONSTRAINT user_answers_draggable_words_id_correct_answer_fkey
FOREIGN KEY (draggable_words_id, correct_answer) REFERENCES draggable_words(id, correct_answer) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE public.user_answers
ADD CONSTRAINT user_answers_draggable_words_id_fkey
FOREIGN KEY (draggable_words_id) REFERENCES draggable_words(id) ON DELETE CASCADE;

ALTER TABLE public.user_answers
ADD CONSTRAINT user_answers_user_id_fkey
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

CREATE TABLE public.user_question_answers (
  id bigint PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  answer integer NOT NULL,
  user_id bigint NOT NULL,
  part_question_id bigint NOT NULL
);

ALTER TABLE public.user_question_answers
ADD CONSTRAINT user_question_answers_user_id_part_question_id_key
UNIQUE (user_id, part_question_id);

ALTER TABLE public.user_question_answers
ADD CONSTRAINT user_question_answers_part_question_id_fkey
FOREIGN KEY (part_question_id) REFERENCES part_questions(id) ON DELETE RESTRICT;

ALTER TABLE public.user_question_answers
ADD CONSTRAINT user_question_answers_user_id_fkey
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

CREATE TABLE public.words_to_exercises (
  id bigint PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  word_id bigint,
  exercise_id bigint
);

ALTER TABLE public.words_to_exercises
ADD CONSTRAINT words_to_exercises_exercise_id_fkey
FOREIGN KEY (exercise_id) REFERENCES exercises(id);

ALTER TABLE public.words_to_exercises
ADD CONSTRAINT words_to_exercises_word_id_fkey
FOREIGN KEY (word_id) REFERENCES draggable_words(id);
