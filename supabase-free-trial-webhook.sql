-- Sends a webhook to an Edge Function whenever a free trial request is created.
-- Replace the placeholders before running in Supabase SQL editor.

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

CREATE OR REPLACE FUNCTION public.notify_free_trial()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  request_id bigint;
  payload jsonb;
BEGIN
  payload := jsonb_build_object('record', to_jsonb(NEW));

  request_id := net.http_post(
    url := 'https://ullfdkgxjseubwjigdhb.functions.supabase.co/free-trial-notify',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-webhook-secret', 'FT_2026_01_15_9f3aC2kLm8QzX'
    ),
    body := payload
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS free_trial_notify ON public.free_trials;

CREATE TRIGGER free_trial_notify
AFTER INSERT ON public.free_trials
FOR EACH ROW EXECUTE FUNCTION public.notify_free_trial();
