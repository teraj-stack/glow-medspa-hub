CREATE TABLE public.consultation_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  consultation_type TEXT NOT NULL CHECK (consultation_type IN ('online','clinic')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  preferred_date TEXT,
  notes TEXT,
  price_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'pln',
  stripe_session_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','canceled','failed')),
  intake_token TEXT UNIQUE,
  intake_completed_at TIMESTAMPTZ,
  email_sent_at TIMESTAMPTZ,
  environment TEXT NOT NULL DEFAULT 'sandbox',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.consultation_orders TO anon;
GRANT SELECT, INSERT, UPDATE ON public.consultation_orders TO authenticated;
GRANT ALL ON public.consultation_orders TO service_role;

ALTER TABLE public.consultation_orders ENABLE ROW LEVEL SECURITY;

-- Anonimowi i zalogowani mogą tworzyć zamówienia (przed płatnością)
CREATE POLICY "Anyone can create consultation orders"
  ON public.consultation_orders FOR INSERT
  WITH CHECK (true);

-- Zalogowani widzą tylko swoje
CREATE POLICY "Users see their own orders"
  ON public.consultation_orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_consultation_orders_stripe_session ON public.consultation_orders(stripe_session_id);
CREATE INDEX idx_consultation_orders_intake_token ON public.consultation_orders(intake_token);

CREATE TRIGGER consultation_orders_updated_at
  BEFORE UPDATE ON public.consultation_orders
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();