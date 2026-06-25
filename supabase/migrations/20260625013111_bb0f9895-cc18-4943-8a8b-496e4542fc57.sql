
GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT ON public.public_doctors TO anon;
GRANT SELECT ON public.public_doctors TO authenticated;

GRANT SELECT (
  id, slug, full_name, title, bio, photo_url, display_order,
  professional_title, experience_summary, specializations, education,
  portrait_crop, active
) ON public.doctors TO anon;

GRANT SELECT (
  id, slug, full_name, title, bio, photo_url, display_order,
  professional_title, experience_summary, specializations, education,
  portrait_crop, active
) ON public.doctors TO authenticated;
