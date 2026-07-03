ALTER TABLE public.og_rescrape_runs
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'done',
  ADD COLUMN IF NOT EXISTS processed INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_progress_at TIMESTAMPTZ;

ALTER TABLE public.og_rescrape_results
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_og_rescrape_results_run_status
  ON public.og_rescrape_results(run_id, status);