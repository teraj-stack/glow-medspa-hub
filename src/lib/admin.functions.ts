import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/start-server-core";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { logAuditEvent } from "@/lib/audit/log.server";

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { isAdmin: !!data };
  });

/**
 * Admin OR Manager (moderator) access check used by /admin layout.
 * Logs denied attempts to audit_log at warning severity.
 */
export const checkAdminPanelAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .in("role", ["admin", "moderator"]);
    const role = (data?.[0]?.role ?? null) as "admin" | "moderator" | null;
    if (!role) {
      let request: Request | undefined;
      try { request = getRequest(); } catch { /* noop */ }
      await logAuditEvent(
        {
          event_type: "auth.event",
          action: "ADMIN_PANEL_ACCESS_DENIED",
          resource_type: "admin",
          severity: "warning",
          success: false,
          metadata: { user_id: context.userId, required_roles: ["admin", "moderator"] },
        },
        request,
      );
    }
    return { hasAccess: !!role, role, isAdmin: role === "admin" };
  });
