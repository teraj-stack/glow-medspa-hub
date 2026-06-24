-- Revert to security_invoker views (linter-friendly)
ALTER VIEW public.public_doctors SET (security_invoker = true);
ALTER VIEW public.public_time_off SET (security_invoker = true);

-- Column-level SELECT grants to anon on the safe public columns only
GRANT SELECT (
  id, slug, full_name, title, bio, photo_url, display_order,
  professional_title, experience_summary, specializations, education,
  active, portrait_crop
) ON public.doctors TO anon;

GRANT SELECT (doctor_id, starts_at, ends_at) ON public.time_off TO anon;

-- RLS policies so anon can read the rows through the views
DROP POLICY IF EXISTS "Public can view active doctors (safe columns)" ON public.doctors;
CREATE POLICY "Public can view active doctors (safe columns)"
  ON public.doctors FOR SELECT
  TO anon
  USING (active = true);

DROP POLICY IF EXISTS "Public can view time off windows (safe columns)" ON public.time_off;
CREATE POLICY "Public can view time off windows (safe columns)"
  ON public.time_off FOR SELECT
  TO anon
  USING (true);