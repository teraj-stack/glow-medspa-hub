import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function requireAdminOrManager(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .in("role", ["admin", "moderator"]);
  if (!data?.length) throw new Error("Brak uprawnień");
}

export const listSeoSnapshots = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ limit: z.number().min(1).max(90).optional() }))
  .handler(async ({ data, context }) => {
    await requireAdminOrManager(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("seo_snapshots")
      .select("id, captured_at, domain, database, organic_keywords, organic_traffic, organic_cost, competitors_count, gap_keywords_count, triggered_by, error")
      .order("captured_at", { ascending: false })
      .limit(data.limit ?? 30);
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const getSeoSnapshot = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    await requireAdminOrManager(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [snapRes, kwRes, compRes, gapRes] = await Promise.all([
      supabaseAdmin.from("seo_snapshots").select("*").eq("id", data.id).maybeSingle(),
      supabaseAdmin
        .from("seo_snapshot_keywords")
        .select("*")
        .eq("snapshot_id", data.id)
        .order("position_index", { ascending: true }),
      supabaseAdmin
        .from("seo_snapshot_competitors")
        .select("*")
        .eq("snapshot_id", data.id)
        .order("rank_position", { ascending: true }),
      supabaseAdmin
        .from("seo_snapshot_gap_keywords")
        .select("*")
        .eq("snapshot_id", data.id)
        .order("position_index", { ascending: true }),
    ]);
    if (snapRes.error) throw new Error(snapRes.error.message);
    return {
      snapshot: snapRes.data,
      keywords: kwRes.data ?? [],
      competitors: compRes.data ?? [],
      gapKeywords: gapRes.data ?? [],
    };
  });

export const runSeoSnapshotNow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ domain: z.string().min(3).optional(), notify: z.boolean().optional() }))
  .handler(async ({ data, context }) => {
    await requireAdminOrManager(context.userId);
    const { captureSeoSnapshot, getAdminManagerEmails } = await import("@/lib/seo-snapshot-core");
    const domain = (data.domain ?? "bmclinics.ai").toLowerCase();
    const snap = await captureSeoSnapshot({ domain, triggeredBy: `manual:${context.userId}` });
    if (data.notify) {
      const { internalSendEmail } = await import("@/lib/email/internal-send.server");
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const [{ data: keywords }, { data: competitors }] = await Promise.all([
        supabaseAdmin
          .from("seo_snapshot_keywords")
          .select("phrase, position, previous_position, search_volume, url")
          .eq("snapshot_id", snap.snapshotId)
          .order("position_index", { ascending: true })
          .limit(10),
        supabaseAdmin
          .from("seo_snapshot_competitors")
          .select("competitor_domain, competitor_keywords, common_keywords")
          .eq("snapshot_id", snap.snapshotId)
          .order("rank_position", { ascending: true })
          .limit(5),
      ]);
      const emails = await getAdminManagerEmails();
      for (const email of emails) {
        try {
          await internalSendEmail({
            templateName: "seo-daily-report",
            recipientEmail: email,
            idempotencyKey: `seo-${snap.snapshotId}-${email}`,
            templateData: {
              domain,
              capturedAt: snap.captured_at,
              organicKeywords: snap.organicKeywords,
              organicTraffic: snap.organicTraffic,
              keywords: keywords ?? [],
              competitors: competitors ?? [],
              gapKeywordsCount: snap.gapKeywordsCount,
              reportUrl: `https://bmclinics.ai/admin/seo/raporty?id=${snap.snapshotId}`,
            },
          });
        } catch { /* one recipient must not block others */ }
      }
    }
    return snap;
  });
