CREATE TABLE public.pgmigrate_migrations (
  id text PRIMARY KEY NOT NULL,
  checksum text NOT NULL,
  execution_time_in_millis bigint NOT NULL,
  applied_at timestamp with time zone NOT NULL
);

CREATE TABLE public.users (
    id bigint PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    email text UNIQUE NOT NULL,
    password_hash text NOT NULL
);
