CREATE TABLE public.sitemap_validation_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  base_url TEXT NOT NULL,
  fetch_ok BOOLEAN NOT NULL,
  fetch_error TEXT,
  expected_count INTEGER NOT NULL DEFAULT 0,
  live_count INTEGER NOT NULL DEFAULT 0,
  missing_count INTEGER NOT NULL DEFAULT 0,
  extras_count INTEGER NOT NULL DEFAULT 0,
  duplicates_count INTEGER NOT NULL DEFAULT 0,
  http_error_count INTEGER NOT NULL DEFAULT 0,
  triggered_by TEXT NOT NULL DEFAULT 'cron',
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX sitemap_validation_history_checked_at_idx
  ON public.sitemap_validation_history (checked_at DESC);

GRANT SELECT ON public.sitemap_validation_history TO authenticated;
GRANT ALL ON public.sitemap_validation_history TO service_role;

ALTER TABLE public.sitemap_validation_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read sitemap validation history"
  ON public.sitemap_validation_history
  FOR SELECT
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));