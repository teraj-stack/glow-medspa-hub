import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const GATEWAY = "https://connector-gateway.lovable.dev/google_search_console";
const SITE_URL = "https://bmclinics.ai/";
const SITE_ENC = encodeURIComponent(SITE_URL);

async function assertAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden");
}

function gscHeaders() {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const connKey = process.env.GOOGLE_SEARCH_CONSOLE_API_KEY;
  if (!lovableKey || !connKey) {
    throw new Error("Brak skonfigurowanego połączenia Google Search Console.");
  }
  return {
    Authorization: `Bearer ${lovableKey}`,
    "X-Connection-Api-Key": connKey,
    "Content-Type": "application/json",
  };
}

async function gscFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${GATEWAY}${path}`, {
    ...init,
    headers: { ...gscHeaders(), ...(init?.headers as Record<string, string> | undefined) },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`GSC ${res.status}: ${text.slice(0, 300)}`);
  }
  return text ? JSON.parse(text) : {};
}

function isoDaysAgo(days: number) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

export const gscOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const endDate = isoDaysAgo(2);
    const startDate = isoDaysAgo(30);
    const prevEnd = isoDaysAgo(31);
    const prevStart = isoDaysAgo(60);

    const [totals, prevTotals, byDate, topQueries, topPages] = await Promise.all([
      gscFetch(`/webmasters/v3/sites/${SITE_ENC}/searchAnalytics/query`, {
        method: "POST",
        body: JSON.stringify({ startDate, endDate, dimensions: [] }),
      }),
      gscFetch(`/webmasters/v3/sites/${SITE_ENC}/searchAnalytics/query`, {
        method: "POST",
        body: JSON.stringify({ startDate: prevStart, endDate: prevEnd, dimensions: [] }),
      }),
      gscFetch(`/webmasters/v3/sites/${SITE_ENC}/searchAnalytics/query`, {
        method: "POST",
        body: JSON.stringify({ startDate, endDate, dimensions: ["date"], rowLimit: 90 }),
      }),
      gscFetch(`/webmasters/v3/sites/${SITE_ENC}/searchAnalytics/query`, {
        method: "POST",
        body: JSON.stringify({ startDate, endDate, dimensions: ["query"], rowLimit: 25 }),
      }),
      gscFetch(`/webmasters/v3/sites/${SITE_ENC}/searchAnalytics/query`, {
        method: "POST",
        body: JSON.stringify({ startDate, endDate, dimensions: ["page"], rowLimit: 25 }),
      }),
    ]);

    return {
      range: { startDate, endDate },
      totals: totals.rows?.[0] ?? null,
      previous: prevTotals.rows?.[0] ?? null,
      byDate: byDate.rows ?? [],
      topQueries: topQueries.rows ?? [],
      topPages: topPages.rows ?? [],
    };
  });

export const gscListSitemaps = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const data = await gscFetch(`/webmasters/v3/sites/${SITE_ENC}/sitemaps`);
    return { sitemaps: data.sitemap ?? [] };
  });

export const gscSubmitSitemap = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { path: string }) => d)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const feed = encodeURIComponent(
      data.path.startsWith("http") ? data.path : `https://bmclinics.ai${data.path.startsWith("/") ? "" : "/"}${data.path}`,
    );
    await gscFetch(`/webmasters/v3/sites/${SITE_ENC}/sitemaps/${feed}`, { method: "PUT" });
    return { ok: true };
  });

export const gscDeleteSitemap = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { feedpath: string }) => d)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    await gscFetch(`/webmasters/v3/sites/${SITE_ENC}/sitemaps/${encodeURIComponent(data.feedpath)}`, {
      method: "DELETE",
    });
    return { ok: true };
  });

export const gscInspectUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { url: string }) => d)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const inspectionUrl = data.url.startsWith("http")
      ? data.url
      : `https://bmclinics.ai${data.url.startsWith("/") ? "" : "/"}${data.url}`;
    const result = await gscFetch(`/v1/urlInspection/index:inspect`, {
      method: "POST",
      body: JSON.stringify({
        inspectionUrl,
        siteUrl: SITE_URL,
        languageCode: "pl-PL",
      }),
    });
    return result;
  });
