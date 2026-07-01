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
