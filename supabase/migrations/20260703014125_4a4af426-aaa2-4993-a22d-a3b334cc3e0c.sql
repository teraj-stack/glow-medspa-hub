ALTER TABLE public.seo_keyword_research_reports
  ADD COLUMN IF NOT EXISTS clusters jsonb,
  ADD COLUMN IF NOT EXISTS clusters_generated_at timestamptz;
