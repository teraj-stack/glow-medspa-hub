-- Drop the over-permissive public SELECT policy on doctors
DROP POLICY IF EXISTS "Public can view active doctors" ON public.doctors;

-- Revoke direct SELECT from anon entirely
REVOKE SELECT ON public.doctors FROM anon;

-- Public reads continue through existing public_doctors view (security_invoker, safe columns only)
-- Admin policies on doctors remain in place for authenticated admins