DROP POLICY IF EXISTS "Public can view time off windows (safe columns)" ON public.time_off;
GRANT SELECT ON public.public_time_off TO anon, authenticated;
REVOKE SELECT ON public.time_off FROM anon;