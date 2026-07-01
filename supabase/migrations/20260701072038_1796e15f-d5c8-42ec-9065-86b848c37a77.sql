CREATE TABLE public.seo_bulk_inspection_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  triggered_by TEXT NOT NULL,
  url_count INT NOT NULL,
  summary JSONB NOT NULL DEFAULT '{}'::jsonb,
  results JSONB NOT NULL DEFAULT '[]'::jsonb
);

GRANT SELECT, INSERT ON public.seo_bulk_inspection_reports TO authenticated;
GRANT ALL ON public.seo_bulk_inspection_reports TO service_role;

ALTER TABLE public.seo_bulk_inspection_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_manager_select_bulk_reports"
  ON public.seo_bulk_inspection_reports FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin','moderator')));

CREATE POLICY "admin_manager_insert_bulk_reports"
  ON public.seo_bulk_inspection_reports FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin','moderator')));

CREATE INDEX idx_seo_bulk_inspection_reports_created_at ON public.seo_bulk_inspection_reports (created_at DESC);