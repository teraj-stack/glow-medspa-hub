-- Move has_role to a private schema so it's no longer exposed via PostgREST RPC
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

-- Recreate function in private schema
CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Update RLS policies to use private.has_role
DROP POLICY IF EXISTS "admins manage catalog" ON public.treatment_catalog;
CREATE POLICY "admins manage catalog" ON public.treatment_catalog
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "admins can read bookings" ON public.bookings;
CREATE POLICY "admins can read bookings" ON public.bookings
  FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "admins can update bookings" ON public.bookings;
CREATE POLICY "admins can update bookings" ON public.bookings
  FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- Drop the public-schema function now that nothing references it
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);