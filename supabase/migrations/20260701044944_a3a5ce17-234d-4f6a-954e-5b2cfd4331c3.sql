
CREATE TABLE public.seo_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  domain TEXT NOT NULL,
  database TEXT NOT NULL,
  organic_keywords INTEGER,
  organic_traffic INTEGER,
  organic_cost NUMERIC(12,2),
  competitors_count INTEGER,
  gap_keywords_count INTEGER,
  triggered_by TEXT NOT NULL DEFAULT 'cron',
  error TEXT,
  raw_debug JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_seo_snapshots_captured_at ON public.seo_snapshots (captured_at DESC);
CREATE INDEX idx_seo_snapshots_domain ON public.seo_snapshots (domain, captured_at DESC);
GRANT SELECT ON public.seo_snapshots TO authenticated;
GRANT ALL ON public.seo_snapshots TO service_role;
ALTER TABLE public.seo_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin/Manager read seo_snapshots"
  ON public.seo_snapshots FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin'::public.app_role,'moderator'::public.app_role)));

CREATE TABLE public.seo_snapshot_keywords (
  id BIGSERIAL PRIMARY KEY,
  snapshot_id UUID NOT NULL REFERENCES public.seo_snapshots(id) ON DELETE CASCADE,
  phrase TEXT NOT NULL,
  position INTEGER,
  previous_position INTEGER,
  search_volume INTEGER,
  cpc NUMERIC(10,2),
  url TEXT,
  traffic_percent NUMERIC(6,2),
  position_index INTEGER
);
CREATE INDEX idx_seo_snap_kw_snap ON public.seo_snapshot_keywords (snapshot_id, position_index);
GRANT SELECT ON public.seo_snapshot_keywords TO authenticated;
GRANT ALL ON public.seo_snapshot_keywords TO service_role;
ALTER TABLE public.seo_snapshot_keywords ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin/Manager read seo_snapshot_keywords"
  ON public.seo_snapshot_keywords FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin'::public.app_role,'moderator'::public.app_role)));

CREATE TABLE public.seo_snapshot_competitors (
  id BIGSERIAL PRIMARY KEY,
  snapshot_id UUID NOT NULL REFERENCES public.seo_snapshots(id) ON DELETE CASCADE,
  competitor_domain TEXT NOT NULL,
  common_keywords INTEGER,
  competitor_keywords INTEGER,
  competitor_traffic INTEGER,
  competition_level NUMERIC(6,4),
  rank_position INTEGER
);
CREATE INDEX idx_seo_snap_comp_snap ON public.seo_snapshot_competitors (snapshot_id, rank_position);
GRANT SELECT ON public.seo_snapshot_competitors TO authenticated;
GRANT ALL ON public.seo_snapshot_competitors TO service_role;
ALTER TABLE public.seo_snapshot_competitors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin/Manager read seo_snapshot_competitors"
  ON public.seo_snapshot_competitors FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin'::public.app_role,'moderator'::public.app_role)));

CREATE TABLE public.seo_snapshot_gap_keywords (
  id BIGSERIAL PRIMARY KEY,
  snapshot_id UUID NOT NULL REFERENCES public.seo_snapshots(id) ON DELETE CASCADE,
  competitor_domain TEXT,
  phrase TEXT NOT NULL,
  competitor_position INTEGER,
  search_volume INTEGER,
  cpc NUMERIC(10,2),
  position_index INTEGER
);
CREATE INDEX idx_seo_snap_gap_snap ON public.seo_snapshot_gap_keywords (snapshot_id, position_index);
GRANT SELECT ON public.seo_snapshot_gap_keywords TO authenticated;
GRANT ALL ON public.seo_snapshot_gap_keywords TO service_role;
ALTER TABLE public.seo_snapshot_gap_keywords ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin/Manager read seo_snapshot_gap_keywords"
  ON public.seo_snapshot_gap_keywords FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin'::public.app_role,'moderator'::public.app_role)));
