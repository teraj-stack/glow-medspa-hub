
CREATE TABLE public.doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  full_name text NOT NULL,
  title text,
  bio text,
  photo_url text,
  google_calendar_id text,
  slot_minutes int NOT NULL DEFAULT 30,
  buffer_minutes int NOT NULL DEFAULT 10,
  default_price_cents int,
  active boolean NOT NULL DEFAULT true,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.doctors TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.doctors TO authenticated;
GRANT ALL ON public.doctors TO service_role;

ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active doctors"
  ON public.doctors FOR SELECT TO anon, authenticated
  USING (active = true);

CREATE POLICY "Admins can view all doctors"
  ON public.doctors FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can insert doctors"
  ON public.doctors FOR INSERT TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update doctors"
  ON public.doctors FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete doctors"
  ON public.doctors FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER doctors_touch_updated_at
  BEFORE UPDATE ON public.doctors
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.working_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  weekday smallint NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_time > start_time)
);

CREATE INDEX working_hours_doctor_weekday_idx
  ON public.working_hours (doctor_id, weekday);

GRANT SELECT ON public.working_hours TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.working_hours TO authenticated;
GRANT ALL ON public.working_hours TO service_role;

ALTER TABLE public.working_hours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view working hours"
  ON public.working_hours FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins manage working hours"
  ON public.working_hours FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TABLE public.time_off (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at > starts_at)
);

CREATE INDEX time_off_doctor_range_idx
  ON public.time_off (doctor_id, starts_at, ends_at);

GRANT SELECT ON public.time_off TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.time_off TO authenticated;
GRANT ALL ON public.time_off TO service_role;

ALTER TABLE public.time_off ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view time off"
  ON public.time_off FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins manage time off"
  ON public.time_off FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TYPE public.visit_booking_status AS ENUM (
  'pending_payment', 'confirmed', 'cancelled', 'completed', 'no_show'
);

CREATE TYPE public.visit_payment_status AS ENUM (
  'unpaid', 'paid', 'refunded', 'failed'
);

CREATE TABLE public.visit_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid NOT NULL REFERENCES public.doctors(id) ON DELETE RESTRICT,
  treatment_slug text,
  patient_name text NOT NULL,
  patient_email text NOT NULL,
  patient_phone text NOT NULL,
  notes text,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  status public.visit_booking_status NOT NULL DEFAULT 'pending_payment',
  payment_status public.visit_payment_status NOT NULL DEFAULT 'unpaid',
  amount_cents int,
  currency text NOT NULL DEFAULT 'pln',
  stripe_session_id text,
  stripe_payment_intent_id text,
  google_event_id text,
  cancel_token uuid NOT NULL DEFAULT gen_random_uuid(),
  rodo_consent boolean NOT NULL DEFAULT false,
  ip_hash text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at > starts_at)
);

CREATE UNIQUE INDEX visit_bookings_cancel_token_idx
  ON public.visit_bookings (cancel_token);

CREATE UNIQUE INDEX visit_bookings_active_slot_idx
  ON public.visit_bookings (doctor_id, starts_at)
  WHERE status IN ('pending_payment', 'confirmed');

CREATE INDEX visit_bookings_doctor_range_idx
  ON public.visit_bookings (doctor_id, starts_at);

GRANT INSERT ON public.visit_bookings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.visit_bookings TO authenticated;
GRANT ALL ON public.visit_bookings TO service_role;

ALTER TABLE public.visit_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create a visit booking"
  ON public.visit_bookings FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins manage visit bookings"
  ON public.visit_bookings FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER visit_bookings_touch_updated_at
  BEFORE UPDATE ON public.visit_bookings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
