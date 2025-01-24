CREATE TABLE public.pgmigrate_migrations (
  id text PRIMARY KEY NOT NULL,
  checksum text NOT NULL,
  execution_time_in_millis bigint NOT NULL,
  applied_at timestamp with time zone NOT NULL
);
