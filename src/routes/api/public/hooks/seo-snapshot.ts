import { createFileRoute } from "@tanstack/react-router";
import { captureSeoSnapshot, getReportRecipients } from "@/lib/seo-snapshot-core";
import { internalSendEmail } from "@/lib/email/internal-send.server";

let cachedSecret: { value: string; expiresAt: number } | null = null;

async function getExpectedSecret(): Promise<string | null> {
  const now = Date.now();
  if (cachedSecret && cachedSecret.expiresAt > now) return cachedSecret.value;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .schema("vault" as any)
    .from("decrypted_secrets" as any)
    .select("decrypted_secret")
    .eq("name", "cron_seo_snapshot_secret")
    .maybeSingle();
  if (error || !data) return null;
  const value = (data as any).decrypted_secret as string;
  cachedSecret = { value, expiresAt: now + 5 * 60_000 };
  return value;
}

const DEFAULT_DOMAIN = "bmclinics.ai";
const DEFAULT_DATABASE = "pl";

export const Route = createFileRoute("/api/public/hooks/seo-snapshot")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authHeader = request.headers.get("authorization") ?? "";
        const token = authHeader.replace(/^Bearer\s+/i, "").trim();
        const expected = await getExpectedSecret();
        if (!expected || !token || token !== expected) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        let body: {
          domain?: string;
          database?: string;
          triggeredBy?: string;
          notify?: boolean;
        } = {};
        try {
          body = (await request.json()) as typeof body;
        } catch {
          // empty body is fine
        }

        const domain = (body.domain ?? DEFAULT_DOMAIN).toLowerCase();
        const database = body.database ?? DEFAULT_DATABASE;
        const triggeredBy = body.triggeredBy ?? "cron";
        const notify = body.notify !== false;

        try {
          const snap = await captureSeoSnapshot({ domain, database, triggeredBy });

          let notifications = 0;
          if (notify) {
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
                    organicCost: null,
                    keywords: keywords ?? [],
                    competitors: competitors ?? [],
                    gapKeywordsCount: snap.gapKeywordsCount,
                    reportUrl: `https://bmclinics.ai/admin/seo/raporty?id=${snap.snapshotId}`,
                  },
                });
                notifications += 1;
              } catch {
                // Continue — one recipient must not block others.
              }
            }
          }

          return new Response(
            JSON.stringify({
              ok: true,
              snapshotId: snap.snapshotId,
              domain,
              organicKeywords: snap.organicKeywords,
              organicTraffic: snap.organicTraffic,
              competitorsCount: snap.competitorsCount,
              gapKeywordsCount: snap.gapKeywordsCount,
              notifications,
              at: new Date().toISOString(),
            }),
            { headers: { "Content-Type": "application/json" } },
          );
        } catch (e: any) {
          return new Response(
            JSON.stringify({ ok: false, error: e?.message ?? "unknown" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
