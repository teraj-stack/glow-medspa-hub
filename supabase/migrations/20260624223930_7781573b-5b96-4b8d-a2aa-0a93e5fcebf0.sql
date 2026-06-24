REVOKE EXECUTE ON FUNCTION public.log_audit_event(TEXT, TEXT, TEXT, TEXT, public.audit_severity, BOOLEAN, TEXT, TEXT, JSONB) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.audit_admin_change() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.purge_old_audit_log() FROM PUBLIC, anon, authenticated;
