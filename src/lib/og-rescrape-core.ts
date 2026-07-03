// Wymusza re-scrape kart OG / Twitter u głównych crawlerów sociali.
// Uruchamiane automatycznie po deployu (GitHub Actions post-deploy step)
// oraz jako cron backup i z panelu administratora.
//
// - Facebook: Graph API `?id={url}&scrape=true` — wymaga FACEBOOK_APP_ACCESS_TOKEN
//   (App Access Token: {app_id}|{app_secret}). Bez tokena krok jest pomijany.
// - LinkedIn: Post Inspector fetch — publiczne GET na inspect/{url} odświeża preview.
// - Twitter/X: brak publicznego API — pomijamy (crawler odświeża sam przy udostępnieniu).

import { SITEMAP_BASE_URL, buildSitemapEntries } from "./sitemap-entries";

export interface RescrapeResult {
  url: string;
  facebook: { ok: boolean; status?: number; skipped?: boolean; error?: string };
  linkedin: { ok: boolean; status?: number; error?: string };
}

export interface RescrapeSummary {
  ok: boolean;
  runId?: string;
  baseUrl: string;
  total: number;
  facebookOk: number;
  linkedinOk: number;
  facebookSkipped: boolean;
  durationMs: number;
  startedAt: string;
  finishedAt: string;
  triggeredBy: string;
  commitSha?: string;
  results: RescrapeResult[];
}

async function scrapeFacebook(url: string, token: string): Promise<RescrapeResult["facebook"]> {
  try {
    const endpoint = `https://graph.facebook.com/v20.0/?id=${encodeURIComponent(url)}&scrape=true&access_token=${encodeURIComponent(token)}`;
    const res = await fetch(endpoint, { method: "POST" });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, status: res.status, error: body.slice(0, 500) };
    }
    return { ok: true, status: res.status };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

async function scrapeLinkedIn(url: string): Promise<RescrapeResult["linkedin"]> {
  try {
    const endpoint = `https://www.linkedin.com/post-inspector/inspect/${encodeURIComponent(url)}`;
    const res = await fetch(endpoint, {
      method: "GET",
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; BMClinicsOGRescraper/1.0)" },
    });
    return { ok: res.ok, status: res.status };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

const CONCURRENCY = 4;

async function runPool<T, R>(items: T[], worker: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
    while (true) {
      const i = cursor++;
      if (i >= items.length) return;
      results[i] = await worker(items[i]);
    }
  });
  await Promise.all(workers);
  return results;
}

export interface RescrapeOptions {
  baseUrl?: string;
  paths?: string[];
  triggeredBy?: string;
  commitSha?: string;
  persist?: boolean;
}

export async function rescrapeAllOg(opts?: RescrapeOptions): Promise<RescrapeSummary> {
  const started = Date.now();
  const startedAt = new Date(started).toISOString();
  const baseUrl = (opts?.baseUrl ?? SITEMAP_BASE_URL).replace(/\/+$/, "");
  const triggeredBy = opts?.triggeredBy ?? "post-deploy";
  const paths = opts?.paths?.length ? opts.paths : buildSitemapEntries().map((e) => e.path);
  const urls = paths.map((p) => `${baseUrl}${p.startsWith("/") ? p : `/${p}`}`);

  const fbToken = process.env.FACEBOOK_APP_ACCESS_TOKEN;
  const facebookSkipped = !fbToken;

  const results = await runPool(urls, async (url) => {
    const [facebook, linkedin] = await Promise.all([
      fbToken
        ? scrapeFacebook(url, fbToken)
        : Promise.resolve<RescrapeResult["facebook"]>({ ok: false, skipped: true }),
      scrapeLinkedIn(url),
    ]);
    return { url, facebook, linkedin };
  });

  const facebookOk = results.filter((r) => r.facebook.ok).length;
  const linkedinOk = results.filter((r) => r.linkedin.ok).length;
  const finished = Date.now();
  const durationMs = finished - started;

  const summary: RescrapeSummary = {
    ok: true,
    baseUrl,
    total: urls.length,
    facebookOk,
    linkedinOk,
    facebookSkipped,
    durationMs,
    startedAt,
    finishedAt: new Date(finished).toISOString(),
    triggeredBy,
    commitSha: opts?.commitSha,
    results,
  };

  if (opts?.persist !== false) {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: runRow, error: runErr } = await supabaseAdmin
        .from("og_rescrape_runs")
        .insert({
          started_at: summary.startedAt,
          finished_at: summary.finishedAt,
          duration_ms: summary.durationMs,
          base_url: summary.baseUrl,
          triggered_by: summary.triggeredBy,
          commit_sha: summary.commitSha ?? null,
          total: summary.total,
          facebook_ok: summary.facebookOk,
          linkedin_ok: summary.linkedinOk,
          facebook_skipped: summary.facebookSkipped,
        })
        .select("id")
        .single();
      if (runErr) throw runErr;
      summary.runId = runRow.id;
      if (results.length > 0) {
        const rows = results.map((r) => ({
          run_id: runRow.id,
          url: r.url,
          facebook_ok: r.facebook.ok,
          facebook_status: r.facebook.status ?? null,
          facebook_skipped: r.facebook.skipped ?? false,
          facebook_error: r.facebook.error ?? null,
          linkedin_ok: r.linkedin.ok,
          linkedin_status: r.linkedin.status ?? null,
          linkedin_error: r.linkedin.error ?? null,
        }));
        const { error: resErr } = await supabaseAdmin.from("og_rescrape_results").insert(rows);
        if (resErr) throw resErr;
      }
    } catch (e) {
      // Persist niepowodzenie nie blokuje zwrócenia wyników wołającemu.
      console.error("[og-rescrape] persist failed", e);
    }
  }

  return summary;
}
