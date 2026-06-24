DROP VIEW IF EXISTS public.public_doctors;

CREATE VIEW public.public_doctors
WITH (security_invoker = true)
AS
SELECT
  id,
  slug,
  full_name,
  title,
  bio,
  photo_url,
  display_order,
  professional_title,
  experience_summary,
  specializations,
  education,
  active
FROM public.doctors
WHERE active = true;

GRANT SELECT ON public.public_doctors TO anon, authenticated;

CREATE POLICY "Public can view active doctors"
ON public.doctors
FOR SELECT
TO anon, authenticated
USING (active = true);

REVOKE SELECT (default_price_cents, slot_minutes, buffer_minutes, google_calendar_id)
ON public.doctors FROM anon, authenticated;