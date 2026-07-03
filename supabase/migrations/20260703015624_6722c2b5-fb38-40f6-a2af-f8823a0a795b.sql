
CREATE TABLE public.og_rescrape_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  duration_ms INTEGER NOT NULL DEFAULT 0,
  base_url TEXT NOT NULL,
  triggered_by TEXT NOT NULL DEFAULT 'post-deploy',
  commit_sha TEXT,
  total INTEGER NOT NULL DEFAULT 0,
  facebook_ok INTEGER NOT NULL DEFAULT 0,
  linkedin_ok INTEGER NOT NULL DEFAULT 0,
  facebook_skipped BOOLEAN NOT NULL DEFAULT false,
  error TEXT
);

CREATE TABLE public.og_rescrape_results (
  id BIGSERIAL PRIMARY KEY,
  run_id UUID NOT NULL REFERENCES public.og_rescrape_runs(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  facebook_ok BOOLEAN NOT NULL DEFAULT false,
  facebook_status INTEGER,
  facebook_skipped BOOLEAN NOT NULL DEFAULT false,
  facebook_error TEXT,
  linkedin_ok BOOLEAN NOT NULL DEFAULT false,
  linkedin_status INTEGER,
  linkedin_error TEXT
);

CREATE INDEX idx_og_rescrape_runs_started_at ON public.og_rescrape_runs(started_at DESC);
CREATE INDEX idx_og_rescrape_results_run_id ON public.og_rescrape_results(run_id);

GRANT SELECT ON public.og_rescrape_runs TO authenticated;
GRANT ALL ON public.og_rescrape_runs TO service_role;
GRANT SELECT ON public.og_rescrape_results TO authenticated;
GRANT ALL ON public.og_rescrape_results TO service_role;

ALTER TABLE public.og_rescrape_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.og_rescrape_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read OG rescrape runs"
  ON public.og_rescrape_runs FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can read OG rescrape results"
  ON public.og_rescrape_results FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));
