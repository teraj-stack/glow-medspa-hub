
CREATE INDEX IF NOT EXISTS idx_visit_bookings_starts_at_desc
  ON public.visit_bookings (starts_at DESC);

CREATE INDEX IF NOT EXISTS idx_visit_bookings_user_id_starts_at
  ON public.visit_bookings (user_id, starts_at DESC)
  WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_doctors_active_display_order
  ON public.doctors (display_order, full_name)
  WHERE active = true;

CREATE INDEX IF NOT EXISTS idx_audit_log_occurred_at_desc
  ON public.audit_log (occurred_at DESC);
