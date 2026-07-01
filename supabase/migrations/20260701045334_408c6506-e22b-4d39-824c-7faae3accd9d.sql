
CREATE TABLE public.seo_report_settings (
  id BOOLEAN PRIMARY KEY DEFAULT TRUE,
  channel TEXT NOT NULL DEFAULT 'email',
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  notification_emails TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  fallback_to_admins BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID,
  CONSTRAINT seo_report_settings_singleton CHECK (id = TRUE)
);

INSERT INTO public.seo_report_settings (id) VALUES (TRUE) ON CONFLICT DO NOTHING;

GRANT SELECT, INSERT, UPDATE ON public.seo_report_settings TO authenticated;
GRANT ALL ON public.seo_report_settings TO service_role;
ALTER TABLE public.seo_report_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin/Manager read seo_report_settings"
  ON public.seo_report_settings FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin'::public.app_role,'moderator'::public.app_role)));

CREATE POLICY "Admin/Manager update seo_report_settings"
  ON public.seo_report_settings FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin'::public.app_role,'moderator'::public.app_role)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin'::public.app_role,'moderator'::public.app_role)));

CREATE POLICY "Admin/Manager insert seo_report_settings"
  ON public.seo_report_settings FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin'::public.app_role,'moderator'::public.app_role)));
