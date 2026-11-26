CREATE TABLE public.consultation_ai_access_state (id text PRIMARY KEY CHECK (id = 'questions'), status integer NOT NULL CHECK (status IN (402,403)), message text NOT NULL, updated_at timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.consultation_ai_access_state TO service_role;
ALTER TABLE public.consultation_ai_access_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY service_only ON public.consultation_ai_access_state FOR ALL TO service_role USING (true) WITH CHECK (true);