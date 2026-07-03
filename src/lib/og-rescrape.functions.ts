import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

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

export interface OgRescrapeRunRow {
  id: string;
  started_at: string;
  finished_at: string;
  duration_ms: number;
  base_url: string;
  triggered_by: string;
  commit_sha: string | null;
  total: number;
  facebook_ok: number;
  linkedin_ok: number;
  facebook_skipped: boolean;
  error: string | null;
  status: string;
  processed: number;
  last_progress_at: string | null;
}

export interface OgRescrapeResultRow {
  id: number;
  url: string;
  facebook_ok: boolean;
  facebook_status: number | null;
  facebook_skipped: boolean;
  facebook_error: string | null;
  linkedin_ok: boolean;
  linkedin_status: number | null;
  linkedin_error: string | null;
  status: string;
  processed_at: string | null;
}

const RUN_COLUMNS =
  "id, started_at, finished_at, duration_ms, base_url, triggered_by, commit_sha, total, facebook_ok, linkedin_ok, facebook_skipped, error, status, processed, last_progress_at";

const RESULT_COLUMNS =
  "id, url, facebook_ok, facebook_status, facebook_skipped, facebook_error, linkedin_ok, linkedin_status, linkedin_error, status, processed_at";

export const listOgRescrapeRuns = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input?: { limit?: number }) => input ?? {})
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const limit = Math.min(Math.max(data.limit ?? 30, 1), 200);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("og_rescrape_runs")
      .select(RUN_COLUMNS)
      .order("started_at", { ascending: false })
      .limit(limit);
    if (error) throw new Error(error.message);
    return { rows: (rows ?? []) as OgRescrapeRunRow[] };
  });

export const getOgRescrapeRun = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { runId: string }) => {
    if (!input?.runId || typeof input.runId !== "string") throw new Error("runId required");
    return input;
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [runQ, resQ] = await Promise.all([
      supabaseAdmin.from("og_rescrape_runs").select(RUN_COLUMNS).eq("id", data.runId).maybeSingle(),
      supabaseAdmin
        .from("og_rescrape_results")
        .select(RESULT_COLUMNS)
        .eq("run_id", data.runId)
        .order("url", { ascending: true }),
    ]);
    if (runQ.error) throw new Error(runQ.error.message);
    if (resQ.error) throw new Error(resQ.error.message);
    if (!runQ.data) throw new Error("Run not found");
    return {
      run: runQ.data as OgRescrapeRunRow,
      results: (resQ.data ?? []) as OgRescrapeResultRow[],
    };
  });

// Ręczne uruchomienie rescrape z panelu — dla całej sitemap albo tylko wybranych URL-i/ścieżek.
export const startOgRescrape = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input?: { paths?: string[]; triggeredBy?: string }) => {
    const paths = Array.isArray(input?.paths)
      ? input!.paths
          .map((p) => (typeof p === "string" ? p.trim() : ""))
          .filter((p) => p.length > 0)
          .slice(0, 200)
      : undefined;
    return { paths, triggeredBy: input?.triggeredBy };
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { rescrapeAllOg } = await import("@/lib/og-rescrape-core");
    const { SITEMAP_BASE_URL, assertAllowedBaseUrl } = await import("@/lib/sitemap-entries");

    // Znormalizuj: przyjmuj pełne URL-e (wtedy wyciągamy pathname) i sprawdzaj host allowlist.
    let normalizedPaths: string[] | undefined;
    if (data.paths && data.paths.length > 0) {
      normalizedPaths = data.paths.map((p) => {
        if (/^https?:\/\//i.test(p)) {
          const allowed = assertAllowedBaseUrl(p);
          if (!allowed) throw new Error(`Nieautoryzowany host w URL: ${p}`);
          try {
            const u = new URL(p);
            return u.pathname + u.search;
          } catch {
            throw new Error(`Nieprawidłowy URL: ${p}`);
          }
        }
        return p.startsWith("/") ? p : `/${p}`;
      });
    }

    const summary = await rescrapeAllOg({
      baseUrl: SITEMAP_BASE_URL,
      paths: normalizedPaths,
      triggeredBy: data.triggeredBy || (normalizedPaths ? "manual-url" : "manual-full"),
      persist: true,
    });
    return {
      runId: summary.runId,
      total: summary.total,
      facebookOk: summary.facebookOk,
      linkedinOk: summary.linkedinOk,
      facebookSkipped: summary.facebookSkipped,
      durationMs: summary.durationMs,
    };
  });

// Zwraca listę ścieżek z sitemap — do podpowiedzi w panelu.
export const listSitemapPaths = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator(() => ({}))
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { buildSitemapEntries, SITEMAP_BASE_URL } = await import("@/lib/sitemap-entries");
    return {
      baseUrl: SITEMAP_BASE_URL,
      paths: buildSitemapEntries().map((e) => e.path),
    };
  });

