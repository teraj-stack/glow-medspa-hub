CREATE TABLE public.hidden_pricing_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL,
  label text NOT NULL,
  hidden_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (slug, label)
);

GRANT SELECT ON public.hidden_pricing_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hidden_pricing_items TO authenticated;
GRANT ALL ON public.hidden_pricing_items TO service_role;

ALTER TABLE public.hidden_pricing_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read hidden pricing items"
  ON public.hidden_pricing_items FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert hidden pricing items"
  ON public.hidden_pricing_items FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete hidden pricing items"
  ON public.hidden_pricing_items FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));