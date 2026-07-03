ALTER TABLE public.og_rescrape_results
  ADD COLUMN IF NOT EXISTS facebook_attempts smallint NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS linkedin_attempts smallint NOT NULL DEFAULT 0;