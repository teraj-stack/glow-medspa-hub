-- Add user_id column for future patient portal (nullable - existing bookings won't have it)
ALTER TABLE public.visit_bookings
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS visit_bookings_user_id_idx
  ON public.visit_bookings(user_id)
  WHERE user_id IS NOT NULL;

-- Patients can read only their own bookings (when user_id is set)
DROP POLICY IF EXISTS "Patients can view their own visit bookings" ON public.visit_bookings;
CREATE POLICY "Patients can view their own visit bookings"
  ON public.visit_bookings
  FOR SELECT
  TO authenticated
  USING (user_id IS NOT NULL AND user_id = auth.uid());

-- Patients can update (e.g. cancel) only their own bookings
DROP POLICY IF EXISTS "Patients can update their own visit bookings" ON public.visit_bookings;
CREATE POLICY "Patients can update their own visit bookings"
  ON public.visit_bookings
  FOR UPDATE
  TO authenticated
  USING (user_id IS NOT NULL AND user_id = auth.uid())
  WITH CHECK (user_id IS NOT NULL AND user_id = auth.uid());