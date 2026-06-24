import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("[FORBIDDEN] Wymagana rola admin.");
}

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
  metadata: unknown;
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

export const listAuditLog = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        eventType: z.string().optional(),
        severity: z.enum(["info", "warning", "critical"]).optional(),
        limit: z.number().int().min(1).max(500).default(200),
      })
      .parse(input ?? {}),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let q = (supabaseAdmin as any)
      .from("audit_log")
      .select("*")
      .order("occurred_at", { ascending: false })
      .limit(data.limit);
    if (data.eventType) q = q.eq("event_type", data.eventType);
    if (data.severity) q = q.eq("severity", data.severity);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return (rows ?? []) as AuditLogRow[];
  });

export const listSuspiciousActivity = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await (supabaseAdmin as any)
      .from("suspicious_activity")
      .select("*")
      .limit(200);
    if (error) throw new Error(error.message);
    return (data ?? []) as SuspiciousRow[];
  });
