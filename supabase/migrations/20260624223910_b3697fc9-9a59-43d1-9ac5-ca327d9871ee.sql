CREATE TYPE public.audit_severity AS ENUM ('info', 'warning', 'critical');

CREATE TABLE public.audit_log (
  id BIGSERIAL PRIMARY KEY,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  event_type TEXT NOT NULL,
  severity public.audit_severity NOT NULL DEFAULT 'info',
  actor_user_id UUID,
  actor_ip INET,
  actor_ua TEXT,
  resource_type TEXT,
  resource_id TEXT,
  action TEXT,
  success BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX audit_log_occurred_at_idx ON public.audit_log (occurred_at DESC);
CREATE INDEX audit_log_event_type_idx ON public.audit_log (event_type, occurred_at DESC);
CREATE INDEX audit_log_actor_user_id_idx ON public.audit_log (actor_user_id, occurred_at DESC);
CREATE INDEX audit_log_actor_ip_idx ON public.audit_log (actor_ip, occurred_at DESC);
CREATE INDEX audit_log_resource_idx ON public.audit_log (resource_type, resource_id);

GRANT SELECT ON public.audit_log TO authenticated;
GRANT ALL ON public.audit_log TO service_role;

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit log"
  ON public.audit_log FOR SELECT
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE OR REPLACE FUNCTION public.log_audit_event(
  _event_type TEXT,
  _action TEXT,
  _resource_type TEXT DEFAULT NULL,
  _resource_id TEXT DEFAULT NULL,
  _severity public.audit_severity DEFAULT 'info',
  _success BOOLEAN DEFAULT true,
  _actor_ip TEXT DEFAULT NULL,
  _actor_ua TEXT DEFAULT NULL,
  _metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _id BIGINT;
BEGIN
  INSERT INTO public.audit_log (
    event_type, action, resource_type, resource_id,
    severity, success, actor_user_id, actor_ip, actor_ua, metadata
  ) VALUES (
    _event_type, _action, _resource_type, _resource_id,
    _severity, _success, auth.uid(),
    NULLIF(_actor_ip, '')::INET, _actor_ua, COALESCE(_metadata, '{}'::jsonb)
  )
  RETURNING id INTO _id;
  RETURN _id;
EXCEPTION WHEN OTHERS THEN
  RETURN NULL;
END;
$$;

GRANT EXECUTE ON FUNCTION public.log_audit_event(
  TEXT, TEXT, TEXT, TEXT, public.audit_severity, BOOLEAN, TEXT, TEXT, JSONB
) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.audit_admin_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _diff JSONB;
  _rid TEXT;
  _severity public.audit_severity := 'info';
BEGIN
  IF TG_TABLE_NAME = 'user_roles' THEN
    _severity := 'critical';
  END IF;

  IF (TG_OP = 'DELETE') THEN
    _diff := jsonb_build_object('old', to_jsonb(OLD));
    _rid := (to_jsonb(OLD)->>'id');
  ELSIF (TG_OP = 'INSERT') THEN
    _diff := jsonb_build_object('new', to_jsonb(NEW));
    _rid := (to_jsonb(NEW)->>'id');
  ELSE
    _diff := jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW));
    _rid := (to_jsonb(NEW)->>'id');
  END IF;

  INSERT INTO public.audit_log (
    event_type, severity, actor_user_id, resource_type, resource_id, action, metadata
  ) VALUES (
    'admin.write', _severity, auth.uid(), TG_TABLE_NAME, _rid, TG_OP, _diff
  );

  RETURN COALESCE(NEW, OLD);
EXCEPTION WHEN OTHERS THEN
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER audit_doctors_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.doctors
  FOR EACH ROW EXECUTE FUNCTION public.audit_admin_change();

CREATE TRIGGER audit_treatment_catalog_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.treatment_catalog
  FOR EACH ROW EXECUTE FUNCTION public.audit_admin_change();

CREATE TRIGGER audit_hidden_pricing_items_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.hidden_pricing_items
  FOR EACH ROW EXECUTE FUNCTION public.audit_admin_change();

CREATE TRIGGER audit_time_off_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.time_off
  FOR EACH ROW EXECUTE FUNCTION public.audit_admin_change();

CREATE TRIGGER audit_working_hours_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.working_hours
  FOR EACH ROW EXECUTE FUNCTION public.audit_admin_change();

CREATE TRIGGER audit_user_roles_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.audit_admin_change();

CREATE OR REPLACE VIEW public.suspicious_activity
WITH (security_invoker = true) AS
WITH per_minute AS (
  SELECT
    date_trunc('minute', occurred_at) AS minute,
    event_type,
    actor_ip,
    actor_user_id,
    COUNT(*) AS hits,
    COUNT(*) FILTER (WHERE success = false) AS failures
  FROM public.audit_log
  WHERE occurred_at > now() - INTERVAL '24 hours'
  GROUP BY 1, 2, 3, 4
)
SELECT
  minute,
  event_type,
  actor_ip,
  actor_user_id,
  hits,
  failures,
  CASE
    WHEN event_type = 'auth.event' AND failures >= 5 THEN 'auth_brute_force'
    WHEN event_type = 'public.read' AND hits >= 100 THEN 'public_read_flood'
    WHEN event_type = 'admin.write' AND hits >= 30 THEN 'admin_burst'
    WHEN event_type = 'webhook.hit' AND failures >= 3 THEN 'webhook_signature_failures'
    ELSE NULL
  END AS reason
FROM per_minute
WHERE
  (event_type = 'auth.event' AND failures >= 5)
  OR (event_type = 'public.read' AND hits >= 100)
  OR (event_type = 'admin.write' AND hits >= 30)
  OR (event_type = 'webhook.hit' AND failures >= 3)
ORDER BY minute DESC;

GRANT SELECT ON public.suspicious_activity TO authenticated;

CREATE EXTENSION IF NOT EXISTS pg_cron;

CREATE OR REPLACE FUNCTION public.purge_old_audit_log()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.audit_log WHERE occurred_at < now() - INTERVAL '90 days';
$$;

SELECT cron.schedule(
  'purge-audit-log-daily',
  '0 2 * * *',
  $$ SELECT public.purge_old_audit_log(); $$
);
