
DO $$
DECLARE
  v_secret TEXT;
  v_exists UUID;
BEGIN
  SELECT id INTO v_exists FROM vault.secrets WHERE name = 'cron_seo_snapshot_secret';
  IF v_exists IS NULL THEN
    v_secret := encode(gen_random_bytes(32), 'hex');
    PERFORM vault.create_secret(v_secret, 'cron_seo_snapshot_secret', 'Bearer token for /api/public/hooks/seo-snapshot');
  END IF;
END $$;
