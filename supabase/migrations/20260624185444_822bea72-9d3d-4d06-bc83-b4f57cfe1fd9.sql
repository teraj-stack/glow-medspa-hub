GRANT SELECT ON public.doctors TO anon, authenticated;
GRANT ALL ON public.doctors TO service_role;
GRANT SELECT ON public.public_doctors TO anon, authenticated;
GRANT ALL ON public.public_doctors TO service_role;