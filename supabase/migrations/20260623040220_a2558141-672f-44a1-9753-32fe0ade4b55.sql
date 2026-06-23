ALTER TABLE public.visit_bookings
  ADD COLUMN IF NOT EXISTS calendar_sync_status text,
  ADD COLUMN IF NOT EXISTS calendar_sync_error text,
  ADD COLUMN IF NOT EXISTS calendar_sync_at timestamptz;