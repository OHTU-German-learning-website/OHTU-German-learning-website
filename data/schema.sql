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

CREATE TABLE public.dragdrop (
  id bigint PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
  title text UNIQUE NOT NULL,
  box_id bigint
);

CREATE TABLE public.wordsbox (
  box_id bigint PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
  box_title text NOT NULL,
  box_content text
);

ALTER TABLE public.dragdrop
ADD CONSTRAINT dragdrop_box_id_fkey
FOREIGN KEY (box_id) REFERENCES wordsbox(box_id);

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

CREATE TRIGGER updated_at BEFORE UPDATE ON public.form_parts FOR EACH ROW EXECUTE FUNCTION updated_at();

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

CREATE TABLE public.users (
  id bigint PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  salt text NOT NULL
);

ALTER TABLE public.user_question_answers
ADD CONSTRAINT user_question_answers_user_id_fkey
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
