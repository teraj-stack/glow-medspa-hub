-- Remove anon SELECT policy on doctors table; column-level secrets
-- (google_calendar_id, default_price_cents) must only be reachable via the
-- public_doctors view that omits them.
DROP POLICY IF EXISTS "Public can view active doctors (safe columns)" ON public.doctors;

-- Ensure the safe public view is readable by anon/authenticated.
GRANT SELECT ON public.public_doctors TO anon, authenticated;