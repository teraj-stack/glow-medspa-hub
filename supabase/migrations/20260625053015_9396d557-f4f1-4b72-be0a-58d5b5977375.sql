CREATE TABLE public.creator_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  draft_key text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, draft_key)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.creator_drafts TO authenticated;
GRANT ALL ON public.creator_drafts TO service_role;

ALTER TABLE public.creator_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own drafts"
  ON public.creator_drafts FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own drafts"
  ON public.creator_drafts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own drafts"
  ON public.creator_drafts FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own drafts"
  ON public.creator_drafts FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER creator_drafts_touch_updated_at
  BEFORE UPDATE ON public.creator_drafts
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();