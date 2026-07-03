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
  facebook_attempts: number;
  linkedin_ok: boolean;
  linkedin_status: number | null;
  linkedin_error: string | null;
  linkedin_attempts: number;
  status: string;
  processed_at: string | null;
}

const RUN_COLUMNS =
  "id, started_at, finished_at, duration_ms, base_url, triggered_by, commit_sha, total, facebook_ok, linkedin_ok, facebook_skipped, error, status, processed, last_progress_at";

const RESULT_COLUMNS =
  "id, url, facebook_ok, facebook_status, facebook_skipped, facebook_error, facebook_attempts, linkedin_ok, linkedin_status, linkedin_error, linkedin_attempts, status, processed_at";


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

// Zwraca listę URL-i, które w ostatnich runach zakończyły się błędem
// (brak OG/Twitter, HTTP>=400, timeout, itp.). Domyślnie patrzy w ostatni skończony run;
// z `scope: "recent"` scala błędy z ostatnich N runów (deduplikacja po URL).
export const listFailedOgUrls = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input?: { runId?: string; scope?: "last-run" | "recent"; recentLimit?: number }) => ({
    runId: typeof input?.runId === "string" && input.runId.length > 0 ? input.runId : undefined,
    scope: input?.scope === "recent" ? "recent" : ("last-run" as "last-run" | "recent"),
    recentLimit: Math.min(Math.max(input?.recentLimit ?? 5, 1), 20),
  }))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Ustal zbiór run_id do przeszukania.
    let runIds: string[] = [];
    let sourceLabel = "";
    if (data.runId) {
      runIds = [data.runId];
      sourceLabel = `run ${data.runId.slice(0, 8)}`;
    } else if (data.scope === "recent") {
      const { data: runs, error } = await supabaseAdmin
        .from("og_rescrape_runs")
        .select("id")
        .in("status", ["done", "error"])
        .order("started_at", { ascending: false })
        .limit(data.recentLimit);
      if (error) throw new Error(error.message);
      runIds = (runs ?? []).map((r) => r.id as string);
      sourceLabel = `ostatnie ${runIds.length} runy`;
    } else {
      const { data: runs, error } = await supabaseAdmin
        .from("og_rescrape_runs")
        .select("id")
        .in("status", ["done", "error"])
        .order("started_at", { ascending: false })
        .limit(1);
      if (error) throw new Error(error.message);
      runIds = (runs ?? []).map((r) => r.id as string);
      sourceLabel = "ostatni zakończony run";
    }

    if (runIds.length === 0) {
      return { urls: [] as string[], sourceLabel, runIds };
    }

    // Pobierz wyniki z tych runów; filtruj URL-e z faktycznymi błędami.
    const { data: rows, error: resErr } = await supabaseAdmin
      .from("og_rescrape_results")
      .select("url, facebook_ok, facebook_status, facebook_skipped, linkedin_ok, linkedin_status, status")
      .in("run_id", runIds);
    if (resErr) throw new Error(resErr.message);

    const failed = new Set<string>();
    for (const r of rows ?? []) {
      const fbBad =
        !r.facebook_skipped &&
        (r.facebook_ok === false || (typeof r.facebook_status === "number" && r.facebook_status >= 400));
      const liBad =
        r.linkedin_ok === false || (typeof r.linkedin_status === "number" && r.linkedin_status >= 400);
      const statusBad = r.status === "error";
      if (fbBad || liBad || statusBad) failed.add(r.url as string);
    }

    return {
      urls: Array.from(failed).sort(),
      sourceLabel,
      runIds,
    };
  });


