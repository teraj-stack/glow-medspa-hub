
-- Store a strong CRON secret in Vault and reschedule the calendar-sync job
-- to authenticate via a Bearer token instead of the public anon key.

DO $$
DECLARE
  v_secret text;
BEGIN
  -- Generate once; subsequent runs leave the existing secret untouched.
  IF NOT EXISTS (SELECT 1 FROM vault.secrets WHERE name = 'cron_calendar_sync_secret') THEN
    v_secret := encode(gen_random_bytes(32), 'hex');
    PERFORM vault.create_secret(v_secret, 'cron_calendar_sync_secret', 'Bearer token for /api/public/hooks/calendar-sync-retry');
  END IF;
END $$;

-- Reschedule cron job using the Vault-stored secret.
SELECT cron.unschedule('calendar-sync-retry')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'calendar-sync-retry');

SELECT cron.schedule(
  'calendar-sync-retry',
  '* * * * *',
  $job$
  SELECT net.http_post(
    url := 'https://project--7c40afc9-5d62-4e26-8703-fb0c05436327.lovable.app/api/public/hooks/calendar-sync-retry',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'cron_calendar_sync_secret' LIMIT 1)
    ),
    body := '{}'::jsonb
  ) AS request_id;
  $job$
);
