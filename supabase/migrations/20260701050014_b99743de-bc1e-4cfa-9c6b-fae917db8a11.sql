
CREATE TABLE public.seo_indexation_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL CHECK (provider IN ('google','bing_indexnow')),
  kind TEXT NOT NULL CHECK (kind IN ('sitemap','url','inspect')),
  target TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('ok','error')),
  http_status INT,
  response TEXT,
  triggered_by TEXT NOT NULL DEFAULT 'manual',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX seo_indexation_submissions_created_idx ON public.seo_indexation_submissions(created_at DESC);
GRANT SELECT ON public.seo_indexation_submissions TO authenticated;
GRANT ALL ON public.seo_indexation_submissions TO service_role;
ALTER TABLE public.seo_indexation_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin/Manager can read submissions" ON public.seo_indexation_submissions
  FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(),'admin'::public.app_role) OR private.has_role(auth.uid(),'moderator'::public.app_role));
