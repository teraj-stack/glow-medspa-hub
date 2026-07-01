
DO $$
DECLARE
  v_token TEXT;
BEGIN
  SELECT decrypted_secret INTO v_token FROM vault.decrypted_secrets WHERE name = 'cron_seo_snapshot_secret';
  IF v_token IS NULL THEN
    RAISE EXCEPTION 'cron_seo_snapshot_secret missing from vault';
  END IF;

  -- Remove any prior schedule with this name.
  PERFORM cron.unschedule(jobid) FROM cron.job WHERE jobname = 'seo_snapshot_daily';

  PERFORM cron.schedule(
    'seo_snapshot_daily',
    '0 4 * * *', -- 04:00 UTC ≈ 06:00 Europe/Warsaw (winter 05:00)
    format($cmd$
      SELECT net.http_post(
        url := 'https://bmclinics.ai/api/public/hooks/seo-snapshot',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer %s'
        ),
        body := jsonb_build_object(
          'domain', 'bmclinics.ai',
          'database', 'pl',
          'triggeredBy', 'cron',
          'notify', true
        ),
        timeout_milliseconds := 60000
      );
    $cmd$, v_token)
  );
END $$;
