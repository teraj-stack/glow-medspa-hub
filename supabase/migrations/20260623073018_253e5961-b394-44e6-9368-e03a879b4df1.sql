
DROP POLICY IF EXISTS "Anyone can create a visit booking" ON public.visit_bookings;

CREATE POLICY "Anyone can create a visit booking"
ON public.visit_bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (
  rodo_consent = true
  AND status = 'pending_payment'::visit_booking_status
  AND payment_status = 'unpaid'::visit_payment_status
  AND stripe_session_id IS NULL
  AND stripe_payment_intent_id IS NULL
  AND google_event_id IS NULL
  AND calendar_sync_status IS NULL
  AND calendar_sync_error IS NULL
  AND calendar_sync_at IS NULL
  AND calendar_sync_attempts = 0
  AND calendar_sync_next_at IS NULL
  AND char_length(btrim(patient_name)) >= 2
  AND char_length(btrim(patient_phone)) >= 6
  AND patient_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND ends_at > starts_at
  AND starts_at > now()
);
