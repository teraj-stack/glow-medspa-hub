REVOKE ALL ON TABLE public.doctors FROM anon, authenticated;
REVOKE ALL (google_calendar_id) ON TABLE public.doctors FROM anon, authenticated, PUBLIC;
GRANT ALL ON TABLE public.doctors TO service_role;