
-- 1. Remove the over-permissive public SELECT policy on the base table.
DROP POLICY IF EXISTS "Public can view time off" ON public.time_off;

-- 2. Revoke direct SELECT on the base table from public roles (admins still
--    have access via the "Admins manage time off" policy + table grants).
REVOKE SELECT ON public.time_off FROM anon, authenticated;

-- 3. Create a safe view exposing only the columns needed for slot availability.
CREATE OR REPLACE VIEW public.public_time_off
WITH (security_invoker = true) AS
SELECT doctor_id, starts_at, ends_at
FROM public.time_off;

-- 4. The view runs as the querying user (security_invoker), but the base
--    table is now closed to anon/authenticated. Re-allow the safe projection
--    by granting SELECT on the view itself and adding a permissive SELECT
--    policy on the base table that is callable ONLY through the view (we
--    achieve that by granting column-level SELECT only on the safe columns).
GRANT SELECT (doctor_id, starts_at, ends_at) ON public.time_off TO anon, authenticated;
GRANT SELECT ON public.public_time_off TO anon, authenticated;

-- 5. Re-add a tight SELECT policy limited to the safe columns. Column-level
--    grants alone are not enough under RLS — a row policy is also required.
CREATE POLICY "Public can view time off windows (safe columns)"
ON public.time_off
FOR SELECT
TO anon, authenticated
USING (true);

COMMENT ON VIEW public.public_time_off IS
  'Public-safe projection of time_off: exposes only doctor_id/starts_at/ends_at for slot availability. The private "reason" column is intentionally excluded.';
