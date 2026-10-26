CREATE TABLE public.registration_captcha_attempts (
  ip_hash character(64) PRIMARY KEY NOT NULL,
  window_started_at timestamp with time zone NOT NULL DEFAULT now(),
  failed_attempts integer NOT NULL DEFAULT 0,
  blocked_until timestamp with time zone,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);