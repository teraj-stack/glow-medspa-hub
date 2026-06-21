-- Lock down user_roles writes with restrictive policies to prevent privilege escalation
CREATE POLICY "deny all inserts on user_roles" ON public.user_roles
  AS RESTRICTIVE FOR INSERT TO anon, authenticated WITH CHECK (false);

CREATE POLICY "deny all updates on user_roles" ON public.user_roles
  AS RESTRICTIVE FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);

CREATE POLICY "deny all deletes on user_roles" ON public.user_roles
  AS RESTRICTIVE FOR DELETE TO anon, authenticated USING (false);

-- Revoke direct table writes from anon/authenticated (only service_role / admin migrations should write)
REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM anon, authenticated;