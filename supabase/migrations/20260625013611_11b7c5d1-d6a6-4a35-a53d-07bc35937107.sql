
-- 1) Przełącz widok na security_definer, żeby działał bez polityki RLS dla anon
ALTER VIEW public.public_doctors SET (security_invoker = false);

-- 2) Zawęź politykę "Public can view active doctors" tylko do authenticated
DROP POLICY IF EXISTS "Public can view active doctors" ON public.doctors;
CREATE POLICY "Authenticated can view active doctors"
ON public.doctors
FOR SELECT
TO authenticated
USING (active = true);

-- 3) Odbierz anon wszystkie bezpośrednie uprawnienia do tabeli doctors
REVOKE ALL ON public.doctors FROM anon;

-- 4) Widok pozostaje czytelny dla anon (grant już istnieje, potwierdzamy)
GRANT SELECT ON public.public_doctors TO anon;
GRANT SELECT ON public.public_doctors TO authenticated;
