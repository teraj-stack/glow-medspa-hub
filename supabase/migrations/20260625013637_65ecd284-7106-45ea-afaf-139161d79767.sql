
-- Cofamy security_definer na widoku (lint 0010)
ALTER VIEW public.public_doctors SET (security_invoker = true);

-- Anon nie ma już SELECT na widoku — przejście wyłącznie przez funkcję
REVOKE ALL ON public.public_doctors FROM anon;

-- Bezpieczna funkcja zwracająca tylko jawne pola aktywnych lekarzy
CREATE OR REPLACE FUNCTION public.get_active_doctors()
RETURNS TABLE (
  id uuid,
  slug text,
  full_name text,
  title text,
  bio text,
  photo_url text,
  display_order integer,
  professional_title text,
  experience_summary text,
  specializations text[],
  education text[]
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    d.id,
    d.slug,
    d.full_name,
    d.title,
    d.bio,
    d.photo_url,
    d.display_order,
    d.professional_title,
    d.experience_summary,
    d.specializations,
    d.education
  FROM public.doctors d
  WHERE d.active = true
  ORDER BY d.display_order ASC, d.full_name ASC;
$$;

-- Domyślnie odbieramy wszystkim, potem przyznajemy EXECUTE wybranym rolom
REVOKE ALL ON FUNCTION public.get_active_doctors() FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_active_doctors() TO anon, authenticated, service_role;
