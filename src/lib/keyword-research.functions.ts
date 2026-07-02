import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { fetchKeywordMetrics, fetchKeywordSerp } from "@/lib/semrush.server";

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
    }),
  )
  .handler(async ({ data, context }) => {
    await requireAdminOrManager(context.userId);
    const suffix = data.appendLocation ? ` ${data.appendLocation.toLowerCase().trim()}` : "";
    const finalPhrases = data.phrases.map((p) => `${p.toLowerCase().trim()}${suffix}`);
    const metrics = await fetchKeywordMetrics(finalPhrases, data.database);
    return {
      database: data.database,
      appendLocation: data.appendLocation || null,
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
