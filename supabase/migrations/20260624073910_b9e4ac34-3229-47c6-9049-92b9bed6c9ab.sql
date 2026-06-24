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
FROM public.doctors;

GRANT SELECT ON public.public_doctors TO anon, authenticated;