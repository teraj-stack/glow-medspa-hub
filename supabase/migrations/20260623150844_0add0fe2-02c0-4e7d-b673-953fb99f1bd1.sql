-- Standardize hidden_pricing_items write policies to use private.has_role()
-- (consistency + safer: SECURITY DEFINER w/ fixed search_path)

DROP POLICY IF EXISTS "Admins can insert hidden pricing items" ON public.hidden_pricing_items;
DROP POLICY IF EXISTS "Admins can delete hidden pricing items" ON public.hidden_pricing_items;
DROP POLICY IF EXISTS "Admins can update hidden pricing items" ON public.hidden_pricing_items;

CREATE POLICY "Admins can insert hidden pricing items"
  ON public.hidden_pricing_items
  FOR INSERT
  TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update hidden pricing items"
  ON public.hidden_pricing_items
  FOR UPDATE
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete hidden pricing items"
  ON public.hidden_pricing_items
  FOR DELETE
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));