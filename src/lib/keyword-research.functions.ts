import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { fetchKeywordMetrics, fetchKeywordSerp, type KeywordMetric } from "@/lib/semrush.server";

async function requireAdminOrManager(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .in("role", ["admin", "moderator"]);
  if (!data?.length) throw new Error("Brak uprawnień");
}

export const researchKeywords = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    z.object({
      phrases: z.array(z.string().trim().min(1).max(120)).min(1).max(50),
      database: z.string().min(2).max(5).default("pl"),
      appendLocation: z.string().trim().max(40).optional(),
      label: z.string().trim().max(120).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    await requireAdminOrManager(context.userId);
    const suffix = data.appendLocation ? ` ${data.appendLocation.toLowerCase().trim()}` : "";
    const finalPhrases = data.phrases.map((p) => `${p.toLowerCase().trim()}${suffix}`);
    const metrics = await fetchKeywordMetrics(finalPhrases, data.database);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: saved, error } = await supabaseAdmin
      .from("seo_keyword_research_reports")
      .insert({
        created_by: context.userId,
        triggered_by: "manual",
        database: data.database,
        append_location: data.appendLocation || null,
        phrase_count: metrics.length,
        label: data.label ?? null,
        rows: metrics as unknown as any,
      })
      .select("id, created_at")
      .single();
    if (error) throw new Error(error.message);

    return {
      id: saved.id,
      createdAt: saved.created_at,
      database: data.database,
      appendLocation: data.appendLocation || null,
      label: data.label ?? null,
      rows: metrics,
    };
  });

export const researchKeywordSerp = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    z.object({
      phrase: z.string().trim().min(1).max(160),
      database: z.string().min(2).max(5).default("pl"),
    }),
  )
  .handler(async ({ data, context }) => {
    await requireAdminOrManager(context.userId);
    const serp = await fetchKeywordSerp(data.phrase, data.database, 10);
    return { phrase: data.phrase, database: data.database, results: serp };
  });

export const listKeywordResearchReports = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    z.object({
      from: z.string().datetime().optional(),
      to: z.string().datetime().optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    await requireAdminOrManager(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let q = supabaseAdmin
      .from("seo_keyword_research_reports")
      .select("id, created_at, triggered_by, database, append_location, phrase_count, label")
      .order("created_at", { ascending: false })
      .limit(200);
    if (data.from) q = q.gte("created_at", data.from);
    if (data.to) q = q.lte("created_at", data.to);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return { rows: rows ?? [] };
  });

export const getKeywordResearchReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    await requireAdminOrManager(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("seo_keyword_research_reports")
      .select("id, created_at, database, append_location, label, rows")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("Raport nie znaleziony");
    return {
      id: row.id,
      createdAt: row.created_at,
      database: row.database,
      appendLocation: row.append_location,
      label: row.label,
      rows: (row.rows ?? []) as unknown as KeywordMetric[],
    };
  });

export const deleteKeywordResearchReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    await requireAdminOrManager(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("seo_keyword_research_reports")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
