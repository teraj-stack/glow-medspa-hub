import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/start-server-core";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { logAuditEvent } from "@/lib/audit/log.server";

type AppRole = "admin" | "moderator" | "user";

async function assertAdmin(userId: string, action: string): Promise<void> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) {
    let request: Request | undefined;
    try { request = getRequest(); } catch { /* noop */ }
    await logAuditEvent(
      {
        event_type: "auth.event",
        action: "ROLE_MGMT_ACCESS_DENIED",
        resource_type: "user_roles",
        severity: "warning",
        success: false,
        metadata: { user_id: userId, attempted_action: action },
      },
      request,
    );
    throw new Error("Forbidden");
  }
}

export type UserWithRoles = {
  user_id: string;
  email: string | null;
  full_name: string | null;
  created_at: string | null;
  last_sign_in_at: string | null;
  roles: AppRole[];
};

export const listUsersWithRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { search?: string } | undefined) => d ?? {})
  .handler(async ({ context, data }): Promise<UserWithRoles[]> => {
    await assertAdmin(context.userId, "LIST_USERS");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: usersPage, error: usersErr } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    if (usersErr) throw new Error(usersErr.message);

    const { data: roleRows, error: rolesErr } = await supabaseAdmin
      .from("user_roles")
      .select("user_id, role");
    if (rolesErr) throw new Error(rolesErr.message);

    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name");

    const profileMap = new Map((profiles ?? []).map((p) => [p.id, p.full_name]));
    const rolesByUser = new Map<string, AppRole[]>();
    for (const r of roleRows ?? []) {
      const list = rolesByUser.get(r.user_id) ?? [];
      list.push(r.role as AppRole);
      rolesByUser.set(r.user_id, list);
    }

    const search = (data.search ?? "").trim().toLowerCase();
    return usersPage.users
      .map((u) => ({
        user_id: u.id,
        email: u.email ?? null,
        full_name: profileMap.get(u.id) ?? null,
        created_at: u.created_at ?? null,
        last_sign_in_at: u.last_sign_in_at ?? null,
        roles: rolesByUser.get(u.id) ?? [],
      }))
      .filter((u) => {
        if (!search) return true;
        return (
          (u.email ?? "").toLowerCase().includes(search) ||
          (u.full_name ?? "").toLowerCase().includes(search)
        );
      })
      .sort((a, b) => (a.email ?? "").localeCompare(b.email ?? ""));
  });

const roleSchema = z.enum(["admin", "moderator"]);
const mutationInput = z.object({
  target_user_id: z.string().uuid(),
  role: roleSchema,
});

export const grantRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => mutationInput.parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId, "GRANT_ROLE");
    if (data.target_user_id === context.userId && data.role === "admin") {
      // No-op safety; you already have it.
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: data.target_user_id, role: data.role })
      .select()
      .maybeSingle();
    // Unique violation = already has the role; treat as success
    if (error && !/duplicate key|unique/i.test(error.message)) {
      throw new Error(error.message);
    }
    let request: Request | undefined;
    try { request = getRequest(); } catch { /* noop */ }
    await logAuditEvent(
      {
        event_type: "admin.write",
        action: "ROLE_GRANTED",
        resource_type: "user_roles",
        resource_id: data.target_user_id,
        severity: "critical",
        success: true,
        metadata: { granted_role: data.role, granted_by: context.userId },
      },
      request,
    );
    return { ok: true };
  });

export const revokeRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => mutationInput.parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId, "REVOKE_ROLE");

    // Safety: prevent removing the last admin
    if (data.role === "admin") {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { count } = await supabaseAdmin
        .from("user_roles")
        .select("user_id", { count: "exact", head: true })
        .eq("role", "admin");
      if ((count ?? 0) <= 1) {
        let request: Request | undefined;
        try { request = getRequest(); } catch { /* noop */ }
        await logAuditEvent(
          {
            event_type: "admin.write",
            action: "ROLE_REVOKE_BLOCKED",
            resource_type: "user_roles",
            resource_id: data.target_user_id,
            severity: "warning",
            success: false,
            metadata: { reason: "last_admin", role: data.role, actor: context.userId },
          },
          request,
        );
        throw new Error("Nie można odebrać uprawnień ostatniemu administratorowi.");
      }
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", data.target_user_id)
      .eq("role", data.role);
    if (error) throw new Error(error.message);

    let request: Request | undefined;
    try { request = getRequest(); } catch { /* noop */ }
    await logAuditEvent(
      {
        event_type: "admin.write",
        action: "ROLE_REVOKED",
        resource_type: "user_roles",
        resource_id: data.target_user_id,
        severity: "critical",
        success: true,
        metadata: { revoked_role: data.role, revoked_by: context.userId },
      },
      request,
    );
    return { ok: true };
  });
