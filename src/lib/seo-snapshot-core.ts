// Server-only: orchestrates a daily SEO snapshot for a domain and persists it
// to public.seo_snapshots + child tables via the service-role client.
import { createClient } from "@supabase/supabase-js";
import {
  fetchDomainOverview,
  fetchDomainOrganic,
  fetchCompetitors,
} from "@/lib/semrush.server";

export interface CaptureInput {
  domain: string;
  database?: string;
  triggeredBy?: string;
  keywordLimit?: number;
  competitorLimit?: number;
  gapLimit?: number;
}

export interface CaptureResult {
  snapshotId: string;
  organicKeywords: number | null;
  organicTraffic: number | null;
  competitorsCount: number;
  gapKeywordsCount: number;
  captured_at: string;
}

function admin() {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!supabaseUrl || !key) throw new Error("Supabase service credentials missing");
  return createClient(supabaseUrl, key);
}

export async function captureSeoSnapshot(input: CaptureInput): Promise<CaptureResult> {
  const supabase = admin();
  const database = input.database ?? "pl";
  const domain = input.domain;
  const keywordLimit = input.keywordLimit ?? 25;
  const competitorLimit = input.competitorLimit ?? 3;
  const gapLimit = input.gapLimit ?? 25;

  let overview = { rank: null, organicKeywords: null, organicTraffic: null, organicCost: null } as
    Awaited<ReturnType<typeof fetchDomainOverview>>;
  let keywords: Awaited<ReturnType<typeof fetchDomainOrganic>> = [];
  let competitors: Awaited<ReturnType<typeof fetchCompetitors>> = [];
  let gap: { competitorDomain: string; phrase: string; position: number | null; volume: number | null; cpc: number | null }[] = [];
  let errorMessage: string | null = null;

  try {
    [overview, keywords, competitors] = await Promise.all([
      fetchDomainOverview(domain, database),
      fetchDomainOrganic(domain, keywordLimit, database),
      fetchCompetitors(domain, competitorLimit, database),
    ]);

    const ownPhrases = new Set(keywords.map((k) => k.phrase.toLowerCase()));
    if (competitors[0]) {
      const compKw = await fetchDomainOrganic(competitors[0].domain, gapLimit + 10, database);
      gap = compKw
        .filter((k) => k.phrase && !ownPhrases.has(k.phrase.toLowerCase()))
        .slice(0, gapLimit)
        .map((k) => ({
          competitorDomain: competitors[0].domain,
          phrase: k.phrase,
          position: k.position,
          volume: k.searchVolume,
          cpc: k.cpc,
        }));
    }
  } catch (e: any) {
    errorMessage = e?.message ?? String(e);
  }

  const { data: snapshot, error: snapErr } = await supabase
    .from("seo_snapshots")
    .insert({
      domain,
      database,
      organic_keywords: overview.organicKeywords,
      organic_traffic: overview.organicTraffic,
      organic_cost: overview.organicCost,
      competitors_count: competitors.length,
      gap_keywords_count: gap.length,
      triggered_by: input.triggeredBy ?? "cron",
      error: errorMessage,
      raw_debug: errorMessage ? { rank: overview.rank } : null,
    })
    .select("id, captured_at")
    .single();
  if (snapErr || !snapshot) throw new Error(`snapshot insert failed: ${snapErr?.message}`);

  const snapshotId = snapshot.id as string;

  if (keywords.length) {
    await supabase.from("seo_snapshot_keywords").insert(
      keywords.map((k, i) => ({
        snapshot_id: snapshotId,
        phrase: k.phrase,
        position: k.position,
        previous_position: k.previousPosition,
        search_volume: k.searchVolume,
        cpc: k.cpc,
        url: k.url,
        traffic_percent: k.trafficPercent,
        position_index: i + 1,
      })),
    );
  }

  if (competitors.length) {
    await supabase.from("seo_snapshot_competitors").insert(
      competitors.map((c, i) => ({
        snapshot_id: snapshotId,
        competitor_domain: c.domain,
        common_keywords: c.commonKeywords,
        competitor_keywords: c.competitorKeywords,
        competitor_traffic: c.competitorTraffic,
        competition_level: c.competitionLevel,
        rank_position: i + 1,
      })),
    );
  }

  if (gap.length) {
    await supabase.from("seo_snapshot_gap_keywords").insert(
      gap.map((g, i) => ({
        snapshot_id: snapshotId,
        competitor_domain: g.competitorDomain,
        phrase: g.phrase,
        competitor_position: g.position,
        search_volume: g.volume,
        cpc: g.cpc,
        position_index: i + 1,
      })),
    );
  }

  return {
    snapshotId,
    organicKeywords: overview.organicKeywords,
    organicTraffic: overview.organicTraffic,
    competitorsCount: competitors.length,
    gapKeywordsCount: gap.length,
    captured_at: snapshot.captured_at as string,
  };
}

export async function getReportRecipients(): Promise<{ emails: string[]; enabled: boolean }> {
  const supabase = admin();
  const { data: settings } = await supabase
    .from("seo_report_settings")
    .select("enabled, channel, notification_emails, fallback_to_admins")
    .eq("id", true)
    .maybeSingle();

  const enabled = settings?.enabled ?? true;
  const channel = settings?.channel ?? "email";
  if (!enabled || channel !== "email") return { emails: [], enabled: false };

  const configured = (settings?.notification_emails ?? [])
    .map((e: string) => e.trim())
    .filter(Boolean);
  if (configured.length) return { emails: configured, enabled: true };

  if (settings && settings.fallback_to_admins === false) return { emails: [], enabled: true };

  // Fallback: all admins/managers with a confirmed e-mail.
  const { data: roles } = await supabase
    .from("user_roles")
    .select("user_id, role")
    .in("role", ["admin", "moderator"]);
  if (!roles?.length) return { emails: [], enabled: true };
  const ids = Array.from(new Set(roles.map((r: any) => r.user_id as string)));
  const emails: string[] = [];
  for (const id of ids) {
    const { data } = await supabase.auth.admin.getUserById(id);
    const email = data?.user?.email;
    if (email && data?.user?.email_confirmed_at) emails.push(email);
  }
  return { emails, enabled: true };
}

/** @deprecated use getReportRecipients() */
export async function getAdminManagerEmails(): Promise<string[]> {
  const { emails } = await getReportRecipients();
  return emails;
}
