CREATE TABLE public.pgmigrate_migrations (
  id text PRIMARY KEY NOT NULL,
  checksum text NOT NULL,
  execution_time_in_millis bigint NOT NULL,
  applied_at timestamp with time zone NOT NULL
);

CREATE SEQUENCE public.users_id_seq;

CREATE TABLE public.users (
  id integer PRIMARY KEY NOT NULL DEFAULT nextval('users_id_seq'::regclass),
  name character varying(255) NOT NULL,
  email character varying(255) UNIQUE NOT NULL,
  password character varying(255) NOT NULL
);

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
