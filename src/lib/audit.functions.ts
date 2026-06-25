import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/start-server-core";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { logAuditEvent } from "@/lib/audit/log.server";

// Read-access to audit log is granted to admin OR moderator (a.k.a. Manager).
// Unauthorized attempts are logged to audit_log at `warning` severity.
async function assertAuditAccess(userId: string, resource: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .in("role", ["admin", "moderator"]);
  const role = data?.[0]?.role ?? null;
  if (!role) {
    let request: Request | undefined;
    try { request = getRequest(); } catch { /* not in request scope */ }
    await logAuditEvent(
      {
        event_type: "auth.event",
        action: "AUDIT_ACCESS_DENIED",
        resource_type: resource,
        severity: "warning",
        success: false,
        metadata: { user_id: userId, required_roles: ["admin", "moderator"] },
      },
      request,
    );
    throw new Error("[FORBIDDEN] Wymagana rola admin lub manager.");
  }
  return role as "admin" | "moderator";
}

export const checkAuditAccess = createServerFn({ method: "GET" })
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
          action: "AUDIT_ACCESS_DENIED",
          resource_type: "admin.audyt",
          severity: "warning",
          success: false,
          metadata: { user_id: context.userId, required_roles: ["admin", "moderator"] },
        },
        request,
      );
    }
    return { hasAccess: !!role, role };
  });

type JsonValue = string | number | boolean | null | { [k: string]: JsonValue } | JsonValue[];

export type AuditLogRow = {
  id: number;
  occurred_at: string;
  event_type: string;
  severity: "info" | "warning" | "critical";
  actor_user_id: string | null;
  actor_ip: string | null;
  actor_ua: string | null;
  resource_type: string | null;
  resource_id: string | null;
  action: string | null;
  success: boolean;
  metadata: JsonValue;
};

export type SuspiciousRow = {
  minute: string;
  event_type: string;
  actor_ip: string | null;
  actor_user_id: string | null;
  hits: number;
  failures: number;
  reason: string | null;
};

const ListInput = z
  .object({
    eventType: z.string().optional(),
    severity: z.enum(["info", "warning", "critical"]).optional(),
    success: z.enum(["ok", "fail"]).optional(),
    search: z.string().max(120).optional(),
    page: z.number().int().min(1).default(1),
    pageSize: z.number().int().min(10).max(200).default(50),
  })
  .partial({ page: true, pageSize: true });

function buildQuery(
  sb: any,
  data: {
    eventType?: string;
    severity?: "info" | "warning" | "critical";
    success?: "ok" | "fail";
    search?: string;
  },
) {
  let q = sb.from("audit_log").select("*", { count: "exact" }).order("occurred_at", { ascending: false });
  if (data.eventType) q = q.eq("event_type", data.eventType);
  if (data.severity) q = q.eq("severity", data.severity);
  if (data.success) q = q.eq("success", data.success === "ok");
  if (data.search) {
    const s = data.search.replace(/[%,]/g, "");
    q = q.or(
      `action.ilike.%${s}%,resource_type.ilike.%${s}%,resource_id.ilike.%${s}%,actor_ip.ilike.%${s}%`,
    );
  }
  return q;
}

export const listAuditLog = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => ListInput.parse(input ?? {}))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const page = data.page ?? 1;
    const pageSize = data.pageSize ?? 50;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data: rows, error, count } = await buildQuery(supabaseAdmin, data).range(from, to);
    if (error) throw new Error(error.message);
    return { rows: (rows ?? []) as AuditLogRow[], total: count ?? 0, page, pageSize };
  });

export const exportAuditLogCsv = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        eventType: z.string().optional(),
        severity: z.enum(["info", "warning", "critical"]).optional(),
        success: z.enum(["ok", "fail"]).optional(),
        search: z.string().max(120).optional(),
      })
      .parse(input ?? {}),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await buildQuery(supabaseAdmin, data).limit(10_000);
    if (error) throw new Error(error.message);
    return toCsv(
      (rows ?? []) as AuditLogRow[],
      ["id", "occurred_at", "event_type", "severity", "action", "resource_type", "resource_id", "actor_user_id", "actor_ip", "actor_ua", "success", "metadata"],
    );
  });

export const listSuspiciousActivity = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await (supabaseAdmin as any)
      .from("suspicious_activity")
      .select("*")
      .limit(500);
    if (error) throw new Error(error.message);
    return (data ?? []) as SuspiciousRow[];
  });

export const exportSuspiciousCsv = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await (supabaseAdmin as any)
      .from("suspicious_activity")
      .select("*")
      .limit(10_000);
    if (error) throw new Error(error.message);
    return toCsv(
      (data ?? []) as SuspiciousRow[],
      ["minute", "event_type", "reason", "actor_ip", "actor_user_id", "hits", "failures"],
    );
  });

function csvCell(v: unknown): string {
  if (v == null) return "";
  const s = typeof v === "object" ? JSON.stringify(v) : String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toCsv<T extends Record<string, unknown>>(rows: T[], cols: string[]): string {
  const head = cols.join(",");
  const body = rows.map((r) => cols.map((c) => csvCell((r as any)[c])).join(",")).join("\n");
  return `${head}\n${body}`;
}
