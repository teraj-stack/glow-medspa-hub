ALTER TABLE public.doctors
  ADD COLUMN IF NOT EXISTS professional_title text,
  ADD COLUMN IF NOT EXISTS experience_summary text,
  ADD COLUMN IF NOT EXISTS specializations text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS education text[] NOT NULL DEFAULT '{}';

DROP VIEW IF EXISTS public.public_doctors;
CREATE VIEW public.public_doctors
  WITH (security_invoker = true) AS
SELECT
  id, slug, full_name, title, bio, photo_url,
  slot_minutes, buffer_minutes, default_price_cents, display_order,
  professional_title, experience_summary, specializations, education,
  active
FROM public.doctors;

GRANT SELECT ON public.public_doctors TO anon, authenticated;