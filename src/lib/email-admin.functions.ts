import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdminOrManager(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .in("role", ["admin", "moderator"]);
  if (!data?.length) throw new Error("[FORBIDDEN] Wymagana rola admin lub manager.");
}

export type EmailStats = {
  total: number;
  sent: number;
  failed: number;
  suppressed: number;
  pending: number;
  recent: Array<{
    message_id: string | null;
    template_name: string | null;
    recipient_email: string | null;
    status: string | null;
    error_message: string | null;
    created_at: string | null;
  }>;
  suppressedCount: number;
};

export const getEmailOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<EmailStats> => {
    await assertAdminOrManager(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: rows } = await supabaseAdmin
      .from("email_send_log")
      .select("message_id,template_name,recipient_email,status,error_message,created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(2000);

    // Dedup by message_id (latest row wins because ordered desc)
    const latest = new Map<string, any>();
    for (const r of rows ?? []) {
      const key = r.message_id ?? `${r.recipient_email}-${r.created_at}`;
      if (!latest.has(key)) latest.set(key, r);
    }
    const dedup = Array.from(latest.values());

    const stats = { total: dedup.length, sent: 0, failed: 0, suppressed: 0, pending: 0 };
    for (const r of dedup) {
      if (r.status === "sent") stats.sent++;
      else if (r.status === "dlq" || r.status === "failed" || r.status === "bounced" || r.status === "complained") stats.failed++;
      else if (r.status === "suppressed") stats.suppressed++;
      else if (r.status === "pending") stats.pending++;
    }

    const { count: suppressedCount } = await supabaseAdmin
      .from("suppressed_emails")
      .select("id", { count: "exact", head: true });

    return {
      ...stats,
      recent: dedup.slice(0, 15),
      suppressedCount: suppressedCount ?? 0,
    };
  });
