// Shared logic for submitting sitemap + URLs to Google Search Console and Bing IndexNow.
// Used by manual admin actions and the daily cron.

const SITE_URL = "https://bmclinics.ai/";
const SITE_ENC = encodeURIComponent(SITE_URL);
const SITEMAP_URL = "https://bmclinics.ai/sitemap.xml";
const GSC_GATEWAY = "https://connector-gateway.lovable.dev/google_search_console";

export type SubmissionRow = {
  provider: "google" | "bing_indexnow";
  kind: "sitemap" | "url" | "inspect";
  target: string;
  status: "ok" | "error";
  http_status: number | null;
  response: string | null;
  triggered_by: string;
};

async function log(rows: SubmissionRow[]) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  if (rows.length === 0) return;
  await supabaseAdmin.from("seo_indexation_submissions").insert(rows);
}

function gscHeaders() {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const connKey = process.env.GOOGLE_SEARCH_CONSOLE_API_KEY;
  if (!lovableKey || !connKey) throw new Error("Brak połączenia z Google Search Console.");
  return {
    Authorization: `Bearer ${lovableKey}`,
    "X-Connection-Api-Key": connKey,
    "Content-Type": "application/json",
  } as Record<string, string>;
}

export async function submitSitemapToGoogle(feed = SITEMAP_URL) {
  const feedEnc = encodeURIComponent(feed);
  const res = await fetch(`${GSC_GATEWAY}/webmasters/v3/sites/${SITE_ENC}/sitemaps/${feedEnc}`, {
    method: "PUT",
    headers: gscHeaders(),
  });
  const text = await res.text();
  return { ok: res.ok, status: res.status, body: text.slice(0, 500) };
}

export async function submitIndexNow(urls: string[]) {
  const key = process.env.INDEXNOW_KEY;
  if (!key) throw new Error("Brak INDEXNOW_KEY.");
  const host = "bmclinics.ai";
  const body = {
    host,
    key,
    keyLocation: `https://${host}/api/public/indexnow/${key}.txt`,
    urlList: urls,
  };
  const res = await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  return { ok: res.ok, status: res.status, body: text.slice(0, 500) };
}

export async function inspectUrlGoogle(url: string) {
  const res = await fetch(`${GSC_GATEWAY}/v1/urlInspection/index:inspect`, {
    method: "POST",
    headers: gscHeaders(),
    body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE_URL, languageCode: "pl-PL" }),
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  return { ok: res.ok, status: res.status, json, body: text.slice(0, 500) };
}

export async function runFullSubmission(triggeredBy: string, urls: string[] = []) {
  const rows: SubmissionRow[] = [];

  // 1. Google sitemap
  try {
    const g = await submitSitemapToGoogle();
    rows.push({
      provider: "google",
      kind: "sitemap",
      target: SITEMAP_URL,
      status: g.ok ? "ok" : "error",
      http_status: g.status,
      response: g.body || null,
      triggered_by: triggeredBy,
    });
  } catch (e: unknown) {
    rows.push({
      provider: "google", kind: "sitemap", target: SITEMAP_URL,
      status: "error", http_status: null,
      response: e instanceof Error ? e.message : String(e),
      triggered_by: triggeredBy,
    });
  }

  // 2. Bing IndexNow — submit sitemap URL and any explicit URLs
  const indexNowUrls = urls.length > 0 ? urls : [SITEMAP_URL];
  try {
    const b = await submitIndexNow(indexNowUrls);
    rows.push({
      provider: "bing_indexnow",
      kind: urls.length > 0 ? "url" : "sitemap",
      target: indexNowUrls.join(", ").slice(0, 500),
      status: b.ok ? "ok" : "error",
      http_status: b.status,
      response: b.body || null,
      triggered_by: triggeredBy,
    });
  } catch (e: unknown) {
    rows.push({
      provider: "bing_indexnow", kind: "url", target: indexNowUrls.join(", ").slice(0, 500),
      status: "error", http_status: null,
      response: e instanceof Error ? e.message : String(e),
      triggered_by: triggeredBy,
    });
  }

  await log(rows);
  return rows;
}

export const SEO_INDEXATION_CONFIG = { SITE_URL, SITEMAP_URL };
