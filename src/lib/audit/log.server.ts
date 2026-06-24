/**
 * Server-only audit logger.
 *
 * Calls public.log_audit_event via the service-role client so it bypasses
 * any RLS / EXECUTE restriction on the RPC. Failures are swallowed — audit
 * logging must never break the user request.
 *
 * Use inside server function / server route handlers only.
 */
import type { Database } from "@/integrations/supabase/types";

type Severity = "info" | "warning" | "critical";

export type AuditEvent = {
  event_type: "admin.write" | "public.read" | "auth.event" | "webhook.hit";
  action: string;
  resource_type?: string | null;
  resource_id?: string | null;
  severity?: Severity;
  success?: boolean;
  actor_ip?: string | null;
  actor_ua?: string | null;
  metadata?: Record<string, unknown>;
};

function extractClientInfo(request?: Request): { ip: string | null; ua: string | null } {
  if (!request) return { ip: null, ua: null };
  const ua = request.headers.get("user-agent");
  const xff = request.headers.get("x-forwarded-for");
  const ip = xff ? xff.split(",")[0]!.trim() : request.headers.get("x-real-ip");
  return { ip: ip || null, ua: ua || null };
}

export async function logAuditEvent(event: AuditEvent, request?: Request): Promise<void> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const client = extractClientInfo(request);
    await (supabaseAdmin as ReturnType<typeof import("@supabase/supabase-js").createClient<Database>>).rpc(
      "log_audit_event" as never,
      {
        _event_type: event.event_type,
        _action: event.action,
        _resource_type: event.resource_type ?? null,
        _resource_id: event.resource_id ?? null,
        _severity: event.severity ?? "info",
        _success: event.success ?? true,
        _actor_ip: event.actor_ip ?? client.ip,
        _actor_ua: event.actor_ua ?? client.ua,
        _metadata: (event.metadata ?? {}) as never,
      } as never,
    );
  } catch (err) {
    console.warn("[audit] log failed", err);
  }
}
