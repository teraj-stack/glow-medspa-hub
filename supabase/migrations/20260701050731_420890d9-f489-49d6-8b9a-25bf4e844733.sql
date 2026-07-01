
CREATE TABLE public.nap_settings (
  id BOOLEAN PRIMARY KEY DEFAULT TRUE,
  business_name TEXT NOT NULL DEFAULT 'BMClinics.ai',
  legal_name TEXT,
  street_address TEXT NOT NULL DEFAULT 'ul. Wójcickiego 4 (Klinika Promedion)',
  postal_code TEXT NOT NULL DEFAULT '01-938',
  city TEXT NOT NULL DEFAULT 'Warszawa',
  region TEXT NOT NULL DEFAULT 'mazowieckie',
  country_code TEXT NOT NULL DEFAULT 'PL',
  phone TEXT,
  phone_e164 TEXT,
  email TEXT,
  website TEXT NOT NULL DEFAULT 'https://bmclinics.ai',
  hours_json JSONB NOT NULL DEFAULT '[
    {"day":"Mon-Fri","opens":"09:00","closes":"20:00"},
    {"day":"Sat","opens":"09:00","closes":"15:00"}
  ]'::jsonb,
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  google_maps_url TEXT,
  google_business_profile_url TEXT,
  categories TEXT[] NOT NULL DEFAULT ARRAY['Medycyna estetyczna','Klinika laserowa','Dermatologia estetyczna']::text[],
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID,
  CONSTRAINT nap_settings_singleton CHECK (id = TRUE)
);

GRANT SELECT ON public.nap_settings TO anon, authenticated;
GRANT INSERT, UPDATE ON public.nap_settings TO authenticated;
GRANT ALL ON public.nap_settings TO service_role;

ALTER TABLE public.nap_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "NAP is publicly readable"
  ON public.nap_settings FOR SELECT TO anon, authenticated USING (TRUE);

CREATE POLICY "Admins and Managers can insert NAP"
  ON public.nap_settings FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role IN ('admin'::public.app_role, 'moderator'::public.app_role)
    )
  );

CREATE POLICY "Admins and Managers can update NAP"
  ON public.nap_settings FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role IN ('admin'::public.app_role, 'moderator'::public.app_role)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role IN ('admin'::public.app_role, 'moderator'::public.app_role)
    )
  );

CREATE TRIGGER nap_settings_touch_updated_at
  BEFORE UPDATE ON public.nap_settings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER nap_settings_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.nap_settings
  FOR EACH ROW EXECUTE FUNCTION public.audit_admin_change();

INSERT INTO public.nap_settings (
  id, business_name, legal_name, street_address, postal_code, city, region, country_code,
  website, latitude, longitude, google_maps_url, description
) VALUES (
  TRUE,
  'BMClinics.ai',
  'BMClinics.ai',
  'ul. Wójcickiego 4 (Klinika Promedion)',
  '01-938',
  'Warszawa',
  'mazowieckie',
  'PL',
  'https://bmclinics.ai',
  52.286000, 20.937000,
  'https://maps.google.com/?q=Klinika+Promedion+W%C3%B3jcickiego+4+Warszawa',
  'Klinika medycyny estetycznej i laserowej w Warszawie (Bielany). Autorskie protokoły, sprawdzone technologie, naturalny efekt.'
)
ON CONFLICT (id) DO NOTHING;
