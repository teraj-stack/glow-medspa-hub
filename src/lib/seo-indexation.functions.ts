import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdminOrManager(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .in("role", ["admin", "moderator"]);
  if (!data?.length) throw new Error("Brak uprawnień");
}

export const submitIndexationNow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ urls: z.array(z.string().url()).max(50).optional() }))
  .handler(async ({ data, context }) => {
    await assertAdminOrManager(context.userId);
    const { runFullSubmission } = await import("./seo-indexation-core");
    const rows = await runFullSubmission(`manual:${context.userId.slice(0, 8)}`, data.urls ?? []);
    return { rows };
  });

export const listIndexationSubmissions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdminOrManager(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("seo_indexation_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return { rows: data ?? [] };
  });

export const inspectIndexation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ url: z.string().url() }))
  .handler(async ({ data, context }) => {
    await assertAdminOrManager(context.userId);
    const { inspectUrlGoogle } = await import("./seo-indexation-core");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const r = await inspectUrlGoogle(data.url);
    const idx = r.json?.inspectionResult?.indexStatusResult;
    await supabaseAdmin.from("seo_indexation_submissions").insert({
      provider: "google",
      kind: "inspect",
      target: data.url,
      status: r.ok ? "ok" : "error",
      http_status: r.status,
      response: idx ? `${idx.verdict ?? ""} / ${idx.coverageState ?? ""}` : r.body,
      triggered_by: `manual:${context.userId.slice(0, 8)}`,
    });
    return r.json;
  });

export const bulkInspectIndexation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ urls: z.array(z.string().url()).min(1).max(25) }))
  .handler(async ({ data, context }) => {
    await assertAdminOrManager(context.userId);
    const { inspectUrlGoogle } = await import("./seo-indexation-core");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const triggeredBy = `bulk:${context.userId.slice(0, 8)}`;
    const results: Array<{
      url: string;
      ok: boolean;
      verdict: string | null;
      coverageState: string | null;
      indexingState: string | null;
      robotsTxtState: string | null;
      lastCrawlTime: string | null;
      googleCanonical: string | null;
      error: string | null;
    }> = [];

    // Concurrency 3 to be gentle with GSC quota
    const queue = [...data.urls];
    const workers = Array.from({ length: Math.min(3, queue.length) }, async () => {
      while (queue.length) {
        const url = queue.shift()!;
        try {
          const r = await inspectUrlGoogle(url);
          const idx = r.json?.inspectionResult?.indexStatusResult;
          results.push({
            url,
            ok: r.ok,
            verdict: idx?.verdict ?? null,
            coverageState: idx?.coverageState ?? null,
            indexingState: idx?.indexingState ?? null,
            robotsTxtState: idx?.robotsTxtState ?? null,
            lastCrawlTime: idx?.lastCrawlTime ?? null,
            googleCanonical: idx?.googleCanonical ?? null,
            error: r.ok ? null : (r.body ?? "").slice(0, 200),
          });
          await supabaseAdmin.from("seo_indexation_submissions").insert({
            provider: "google",
            kind: "inspect",
            target: url,
            status: r.ok ? "ok" : "error",
            http_status: r.status,
            response: idx ? `${idx.verdict ?? ""} / ${idx.coverageState ?? ""}` : (r.body ?? "").slice(0, 500),
            triggered_by: triggeredBy,
          });
        } catch (e) {
          results.push({
            url,
            ok: false,
            verdict: null,
            coverageState: null,
            indexingState: null,
            robotsTxtState: null,
            lastCrawlTime: null,
            googleCanonical: null,
            error: e instanceof Error ? e.message : String(e),
          });
        }
      }
    });
    await Promise.all(workers);

    // Preserve original order
    const order = new Map(data.urls.map((u, i) => [u, i]));
    results.sort((a, b) => (order.get(a.url) ?? 0) - (order.get(b.url) ?? 0));

    const summary = {
      total: results.length,
      passing: results.filter((r) => r.verdict === "PASS").length,
      neutral: results.filter((r) => r.verdict === "NEUTRAL").length,
      failing: results.filter((r) => r.verdict === "FAIL").length,
      errors: results.filter((r) => !r.ok).length,
    };

    let reportId: string | null = null;
    try {
      const { data: saved } = await supabaseAdmin
        .from("seo_bulk_inspection_reports")
        .insert({
          created_by: context.userId,
          triggered_by: triggeredBy,
          url_count: results.length,
          summary,
          results,
        })
        .select("id")
        .single();
      reportId = saved?.id ?? null;
    } catch {
      // logging failure of the report should not break the response
    }

    return { results, summary, reportId };
  });

export const listBulkInspectionReports = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator(
    z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      limit: z.number().int().min(1).max(200).optional(),
    }).optional(),
  )
  .handler(async ({ data, context }) => {
    await assertAdminOrManager(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let q = supabaseAdmin
      .from("seo_bulk_inspection_reports")
      .select("id, created_at, triggered_by, url_count, summary")
      .order("created_at", { ascending: false })
      .limit(data?.limit ?? 100);
    if (data?.from) q = q.gte("created_at", data.from);
    if (data?.to) q = q.lte("created_at", data.to);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return { rows: rows ?? [] };
  });

export const getBulkInspectionReport = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    await assertAdminOrManager(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("seo_bulk_inspection_reports")
      .select("*")
      .eq("id", data.id)
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const indexNowStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdminOrManager(context.userId);
    const key = process.env.INDEXNOW_KEY;
    if (!key) return { configured: false, keyLocation: null, keyPrefix: null };
    return {
      configured: true,
      keyLocation: `https://bmclinics.ai/api/public/indexnow/${key}.txt`,
      keyPrefix: `${key.slice(0, 6)}…`,
    };
  });
