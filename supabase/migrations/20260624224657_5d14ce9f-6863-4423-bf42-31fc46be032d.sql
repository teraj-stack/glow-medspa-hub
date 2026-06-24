DROP POLICY IF EXISTS "Public can view time off windows (safe columns)" ON public.time_off;
REVOKE SELECT ON public.time_off FROM anon;
-- Public access flows through the view only
GRANT SELECT ON public.public_time_off TO anon, authenticated;
