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
}

export const listOgRescrapeRuns = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input?: { limit?: number }) => input ?? {})
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const limit = Math.min(Math.max(data.limit ?? 30, 1), 200);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("og_rescrape_runs")
      .select(
        "id, started_at, finished_at, duration_ms, base_url, triggered_by, commit_sha, total, facebook_ok, linkedin_ok, facebook_skipped, error",
      )
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
      supabaseAdmin
        .from("og_rescrape_runs")
        .select(
          "id, started_at, finished_at, duration_ms, base_url, triggered_by, commit_sha, total, facebook_ok, linkedin_ok, facebook_skipped, error",
        )
        .eq("id", data.runId)
        .maybeSingle(),
      supabaseAdmin
        .from("og_rescrape_results")
        .select(
          "id, url, facebook_ok, facebook_status, facebook_skipped, facebook_error, linkedin_ok, linkedin_status, linkedin_error",
        )
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
