-- Public-safe view of active doctors. Excludes google_calendar_id and any
-- non-presentational/internal columns. security_invoker keeps RLS of the
-- underlying table in effect (active=true policy).
CREATE OR REPLACE VIEW public.public_doctors
WITH (security_invoker = true) AS
SELECT
  id,
  slug,
  full_name,
  title,
  bio,
  photo_url,
  slot_minutes,
  buffer_minutes,
  default_price_cents,
  display_order
FROM public.doctors
WHERE active = true;

GRANT SELECT ON public.public_doctors TO anon, authenticated;
GRANT ALL ON public.public_doctors TO service_role;

COMMENT ON VIEW public.public_doctors IS
  'Public-safe projection of doctors (active only, no google_calendar_id).';