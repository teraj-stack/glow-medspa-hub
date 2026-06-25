DROP POLICY IF EXISTS "Patients can update their own visit bookings" ON public.visit_bookings;
REVOKE UPDATE ON public.visit_bookings FROM authenticated;
REVOKE UPDATE ON public.visit_bookings FROM anon;