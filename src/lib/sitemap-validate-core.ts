import { SITEMAP_BASE_URL, buildSitemapEntries } from "@/lib/sitemap-entries";

export interface SitemapValidationResult {
  fetchedFrom: string;
  fetchedAt: string;
  fetchOk: boolean;
  fetchError?: string;
  expectedCount: number;
  liveCount: number;
  duplicates: string[];
  missing: { path: string; reason: string }[];
  extras: string[];
  urlChecks: { path: string; status: number | null; ok: boolean; error?: string }[];
}

async function probe(url: string): Promise<{ status: number | null; ok: boolean; error?: string }> {
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: { "User-Agent": "BMC-Sitemap-Validator/1.0" },
    });
    await res.body?.cancel();
    return { status: res.status, ok: res.ok };
  } catch (e) {
    return { status: null, ok: false, error: (e as Error).message };
  }
}

export async function runSitemapValidation(opts?: {
  baseUrl?: string;
  checkUrls?: boolean;
}): Promise<SitemapValidationResult> {
  const baseUrl = (opts?.baseUrl?.replace(/\/$/, "") || SITEMAP_BASE_URL).trim();
  const checkUrls = opts?.checkUrls ?? false;
  const sitemapUrl = `${baseUrl}/sitemap.xml`;

  const expected = buildSitemapEntries();
  const expectedPaths = new Set(expected.map((e) => e.path));

  const result: SitemapValidationResult = {
    fetchedFrom: sitemapUrl,
    fetchedAt: new Date().toISOString(),
    fetchOk: false,
    expectedCount: expected.length,
    liveCount: 0,
    duplicates: [],
    missing: [],
    extras: [],
    urlChecks: [],
  };

  let xml = "";
  try {
    const res = await fetch(sitemapUrl, {
      headers: { "User-Agent": "BMC-Sitemap-Validator/1.0" },
    });
    if (!res.ok) {
      result.fetchError = `HTTP ${res.status}`;
      return result;
    }
    xml = await res.text();
    result.fetchOk = true;
  } catch (e) {
    result.fetchError = (e as Error).message;
    return result;
  }

  const locRegex = /<loc>\s*([^<\s]+)\s*<\/loc>/g;
  const liveUrls: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = locRegex.exec(xml)) !== null) liveUrls.push(m[1]);
  result.liveCount = liveUrls.length;

  const livePaths: string[] = [];
  for (const u of liveUrls) {
    try {
      const url = new URL(u);
      livePaths.push(url.pathname);
    } catch {
      livePaths.push(u);
    }
  }

  const counts = new Map<string, number>();
  for (const p of livePaths) counts.set(p, (counts.get(p) ?? 0) + 1);
  result.duplicates = [...counts.entries()].filter(([, c]) => c > 1).map(([p]) => p);

  const liveSet = new Set(livePaths);

  for (const e of expected) {
    if (!liveSet.has(e.path)) {
      result.missing.push({ path: e.path, reason: "Oczekiwana w sitemap, brak w live" });
    }
  }
  for (const p of liveSet) {
    if (!expectedPaths.has(p)) result.extras.push(p);
  }

  if (checkUrls) {
    const sampled = [...liveSet];
    const concurrency = 6;
    const checks: typeof result.urlChecks = [];
    let i = 0;
    async function worker() {
      while (i < sampled.length) {
        const idx = i++;
        const path = sampled[idx];
        const r = await probe(`${baseUrl}${path}`);
        checks.push({ path, ...r });
      }
    }
    await Promise.all(Array.from({ length: concurrency }, worker));
    checks.sort((a, b) => a.path.localeCompare(b.path));
    result.urlChecks = checks;
  }

  return result;
}

export async function persistValidationResult(args: {
  result: SitemapValidationResult;
  baseUrl: string;
  triggeredBy: string;
}) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { result, baseUrl, triggeredBy } = args;
  const httpErrorCount = result.urlChecks.filter((c) => !c.ok).length;
  const { error } = await supabaseAdmin.from("sitemap_validation_history").insert({
    base_url: baseUrl,
    fetch_ok: result.fetchOk,
    fetch_error: result.fetchError ?? null,
    expected_count: result.expectedCount,
    live_count: result.liveCount,
    missing_count: result.missing.length,
    extras_count: result.extras.length,
    duplicates_count: result.duplicates.length,
    http_error_count: httpErrorCount,
    triggered_by: triggeredBy,
    details: {
      missing: result.missing,
      extras: result.extras,
      duplicates: result.duplicates,
      urlChecks: result.urlChecks,
      fetchedAt: result.fetchedAt,
      fetchedFrom: result.fetchedFrom,
    },
  });
  if (error) throw new Error(error.message);
}
