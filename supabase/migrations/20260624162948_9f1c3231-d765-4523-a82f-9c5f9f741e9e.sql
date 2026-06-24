-- Lock down direct table access to public.doctors so internal columns
-- (notably google_calendar_id) are not readable via PostgREST.
-- Public site reads through the public_doctors view; admin operations
-- use the service_role client which bypasses RLS/grants.

REVOKE ALL ON TABLE public.doctors FROM anon, authenticated;

-- Re-grant column-level SELECT only for columns exposed by the public view
-- (security_invoker=true means the view executes with caller's privileges,
-- so anon needs SELECT on each referenced column).
GRANT SELECT (
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
) ON public.doctors TO anon, authenticated;

-- Ensure service_role retains full access for admin server functions.
GRANT ALL ON public.doctors TO service_role;