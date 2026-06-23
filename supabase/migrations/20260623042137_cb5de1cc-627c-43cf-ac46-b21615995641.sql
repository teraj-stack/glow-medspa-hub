ALTER TABLE public.visit_bookings
  ADD COLUMN IF NOT EXISTS calendar_sync_attempts integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS calendar_sync_next_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_visit_bookings_calendar_retry
  ON public.visit_bookings (calendar_sync_next_at)
  WHERE calendar_sync_status = 'error';