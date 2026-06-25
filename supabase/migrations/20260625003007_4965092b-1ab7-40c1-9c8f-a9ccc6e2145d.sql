DROP POLICY IF EXISTS "Anyone can read hidden pricing items" ON public.hidden_pricing_items;

REVOKE SELECT ON public.hidden_pricing_items FROM anon;
GRANT SELECT ON public.hidden_pricing_items TO authenticated;

CREATE POLICY "Admins can read hidden pricing items"
  ON public.hidden_pricing_items
  FOR SELECT
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));