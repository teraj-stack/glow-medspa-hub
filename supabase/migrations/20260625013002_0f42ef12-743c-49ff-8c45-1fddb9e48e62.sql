
-- Allow public (anon) read access to active doctors via the public_doctors view.
GRANT SELECT ON public.public_doctors TO anon, authenticated;

-- The view uses security_invoker, so callers also need SELECT on the underlying table.
GRANT SELECT (id, slug, full_name, title, bio, photo_url, display_order, professional_title, experience_summary, specializations, education, portrait_crop, active)
  ON public.doctors TO anon, authenticated;

-- And an RLS policy that lets anon/authenticated see only active rows.
CREATE POLICY "Public can view active doctors"
ON public.doctors
FOR SELECT
TO anon, authenticated
USING (active = true);
