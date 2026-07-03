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
  facebook: { ok: boolean; status?: number; skipped?: boolean; error?: string; attempts?: number };
  linkedin: { ok: boolean; status?: number; error?: string; attempts?: number };
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

// ==================== Rate limiting + queue ====================
// Prosty token-bucket per usługa: nie więcej niż `minIntervalMs` między kolejnymi
// żądaniami do tego samego API. Chroni przed 429 / blokadą IP przy dużej sitemap.
// Wartości można nadpisać przez env (FB_MIN_INTERVAL_MS, LI_MIN_INTERVAL_MS).

interface RateLimiter {
  minIntervalMs: number;
  maxRetries: number;
  nextAvailableAt: number;
  queue: Array<() => void>;
  draining: boolean;
}

function makeLimiter(minIntervalMs: number, maxRetries: number): RateLimiter {
  return { minIntervalMs, maxRetries, nextAvailableAt: 0, queue: [], draining: false };
}

function envInt(name: string, fallback: number): number {
  const v = process.env[name];
  if (!v) return fallback;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

const FB_LIMITER = makeLimiter(envInt("FB_MIN_INTERVAL_MS", 1100), envInt("FB_MAX_RETRIES", 3));
const LI_LIMITER = makeLimiter(envInt("LI_MIN_INTERVAL_MS", 800), envInt("LI_MAX_RETRIES", 3));

function acquire(limiter: RateLimiter): Promise<void> {
  return new Promise<void>((resolve) => {
    limiter.queue.push(resolve);
    drain(limiter);
  });
}

function drain(limiter: RateLimiter) {
  if (limiter.draining) return;
  limiter.draining = true;
  const step = () => {
    const next = limiter.queue.shift();
    if (!next) {
      limiter.draining = false;
      return;
    }
    const now = Date.now();
    const wait = Math.max(0, limiter.nextAvailableAt - now);
    setTimeout(() => {
      limiter.nextAvailableAt = Date.now() + limiter.minIntervalMs;
      next();
      step();
    }, wait);
  };
  step();
}

function parseRetryAfter(res: Response): number | null {
  const h = res.headers.get("retry-after");
  if (!h) return null;
  const secs = Number.parseInt(h, 10);
  if (Number.isFinite(secs)) return secs * 1000;
  const dateMs = Date.parse(h);
  if (Number.isFinite(dateMs)) return Math.max(0, dateMs - Date.now());
  return null;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function withRateLimit(
  limiter: RateLimiter,
  fetcher: () => Promise<Response>,
): Promise<{ res: Response; attempts: number } | { error: string; attempts: number }> {
  let attempts = 0;
  let lastErr = "";
  const maxAttempts = limiter.maxRetries + 1;
  while (attempts < maxAttempts) {
    await acquire(limiter);
    attempts++;
    try {
      const res = await fetcher();
      if (res.status === 429 || res.status >= 500) {
        if (attempts < maxAttempts) {
          const retryAfter = parseRetryAfter(res) ?? Math.min(30000, 500 * 2 ** (attempts - 1));
          // Blokujemy limiter na czas backoff, żeby cała kolejka poczekała.
          limiter.nextAvailableAt = Math.max(limiter.nextAvailableAt, Date.now() + retryAfter);
          await sleep(retryAfter);
          continue;
        }
      }
      return { res, attempts };
    } catch (e) {
      lastErr = e instanceof Error ? e.message : String(e);
      if (attempts < maxAttempts) {
        const backoff = Math.min(30000, 500 * 2 ** (attempts - 1));
        await sleep(backoff);
        continue;
      }
    }
  }
  return { error: lastErr || "max retries exceeded", attempts };
}

async function scrapeFacebook(url: string, token: string): Promise<RescrapeResult["facebook"]> {
  const endpoint = `https://graph.facebook.com/v20.0/?id=${encodeURIComponent(url)}&scrape=true&access_token=${encodeURIComponent(token)}`;
  const out = await withRateLimit(FB_LIMITER, () => fetch(endpoint, { method: "POST" }));
  if ("error" in out) return { ok: false, error: out.error, attempts: out.attempts };
  const { res, attempts } = out;
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return { ok: false, status: res.status, error: body.slice(0, 500), attempts };
  }
  return { ok: true, status: res.status, attempts };
}

async function scrapeLinkedIn(url: string): Promise<RescrapeResult["linkedin"]> {
  const endpoint = `https://www.linkedin.com/post-inspector/inspect/${encodeURIComponent(url)}`;
  const out = await withRateLimit(LI_LIMITER, () =>
    fetch(endpoint, {
      method: "GET",
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; BMClinicsOGRescraper/1.0)" },
    }),
  );
  if ("error" in out) return { ok: false, error: out.error, attempts: out.attempts };
  return { ok: out.res.ok, status: out.res.status, attempts: out.attempts };
}

const CONCURRENCY = 4;

export interface RescrapeOptions {
  baseUrl?: string;
  paths?: string[];
  triggeredBy?: string;
  commitSha?: string;
  persist?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Admin = any;

async function createRunRow(
  admin: Admin,
  summary: Pick<RescrapeSummary, "startedAt" | "baseUrl" | "triggeredBy" | "commitSha" | "total" | "facebookSkipped">,
): Promise<string | null> {
  const { data, error } = await admin
    .from("og_rescrape_runs")
    .insert({
      started_at: summary.startedAt,
      finished_at: summary.startedAt,
      duration_ms: 0,
      base_url: summary.baseUrl,
      triggered_by: summary.triggeredBy,
      commit_sha: summary.commitSha ?? null,
      total: summary.total,
      facebook_ok: 0,
      linkedin_ok: 0,
      facebook_skipped: summary.facebookSkipped,
      status: "running",
      processed: 0,
      last_progress_at: summary.startedAt,
    })
    .select("id")
    .single();
  if (error) {
    console.error("[og-rescrape] failed to create run row", error);
    return null;
  }
  return data.id as string;
}

async function seedResultRows(admin: Admin, runId: string, urls: string[]) {
  const rows = urls.map((url) => ({
    run_id: runId,
    url,
    status: "pending" as const,
  }));
  const { error } = await admin.from("og_rescrape_results").insert(rows);
  if (error) console.error("[og-rescrape] failed to seed result rows", error);
}

async function persistPerUrl(admin: Admin, runId: string, r: RescrapeResult) {
  const anyError = (!r.facebook.ok && !r.facebook.skipped) || !r.linkedin.ok;
  const { error } = await admin
    .from("og_rescrape_results")
    .update({
      facebook_ok: r.facebook.ok,
      facebook_status: r.facebook.status ?? null,
      facebook_skipped: r.facebook.skipped ?? false,
      facebook_error: r.facebook.error ?? null,
      linkedin_ok: r.linkedin.ok,
      linkedin_status: r.linkedin.status ?? null,
      linkedin_error: r.linkedin.error ?? null,
      status: anyError ? "error" : "done",
      processed_at: new Date().toISOString(),
    })
    .eq("run_id", runId)
    .eq("url", r.url);
  if (error) console.error("[og-rescrape] failed to update result row", r.url, error);
}

async function bumpProgress(admin: Admin, runId: string, processed: number, fbOk: number, liOk: number) {
  const { error } = await admin
    .from("og_rescrape_runs")
    .update({
      processed,
      facebook_ok: fbOk,
      linkedin_ok: liOk,
      last_progress_at: new Date().toISOString(),
    })
    .eq("id", runId);
  if (error) console.error("[og-rescrape] failed to bump progress", error);
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
  const persist = opts?.persist !== false;

  // Seed run + pending result rows przed pierwszym fetch-em, żeby panel widział postęp od razu.
  let admin: Admin | null = null;
  let runId: string | null = null;
  if (persist) {
    try {
      const mod = await import("@/integrations/supabase/client.server");
      admin = mod.supabaseAdmin;
      runId = await createRunRow(admin, {
        startedAt,
        baseUrl,
        triggeredBy,
        commitSha: opts?.commitSha,
        total: urls.length,
        facebookSkipped,
      });
      if (runId && urls.length > 0) await seedResultRows(admin, runId, urls);
    } catch (e) {
      console.error("[og-rescrape] persist init failed", e);
      admin = null;
      runId = null;
    }
  }

  const results: RescrapeResult[] = new Array(urls.length);
  let cursor = 0;
  let processed = 0;
  let facebookOk = 0;
  let linkedinOk = 0;

  const workers = Array.from({ length: Math.min(CONCURRENCY, urls.length) }, async () => {
    while (true) {
      const i = cursor++;
      if (i >= urls.length) return;
      const url = urls[i];
      const [facebook, linkedin] = await Promise.all([
        fbToken
          ? scrapeFacebook(url, fbToken)
          : Promise.resolve<RescrapeResult["facebook"]>({ ok: false, skipped: true }),
        scrapeLinkedIn(url),
      ]);
      const r: RescrapeResult = { url, facebook, linkedin };
      results[i] = r;
      if (facebook.ok) facebookOk++;
      if (linkedin.ok) linkedinOk++;
      processed++;

      if (admin && runId) {
        // Nieblokujące — nie chcemy, żeby update DB opóźniał kolejne fetch-e.
        void persistPerUrl(admin, runId, r).then(() =>
          bumpProgress(admin!, runId!, processed, facebookOk, linkedinOk),
        );
      }
    }
  });
  await Promise.all(workers);

  const finished = Date.now();
  const durationMs = finished - started;
  const summary: RescrapeSummary = {
    ok: true,
    runId: runId ?? undefined,
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

  if (admin && runId) {
    try {
      await admin
        .from("og_rescrape_runs")
        .update({
          finished_at: summary.finishedAt,
          duration_ms: summary.durationMs,
          facebook_ok: summary.facebookOk,
          linkedin_ok: summary.linkedinOk,
          processed: summary.total,
          status: "done",
          last_progress_at: summary.finishedAt,
        })
        .eq("id", runId);
    } catch (e) {
      console.error("[og-rescrape] finalize failed", e);
    }
  }

  return summary;
}
