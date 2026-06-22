-- Remove permissive anon INSERT — only server functions (service_role) should create orders
REVOKE INSERT, SELECT ON public.consultation_orders FROM anon;
DROP POLICY IF EXISTS "Anyone can create consultation orders" ON public.consultation_orders;

-- Diagnostic form payload
ALTER TABLE public.consultation_orders
  ADD COLUMN IF NOT EXISTS intake_data JSONB;