import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  runSitemapValidation,
  persistValidationResult,
  type SitemapValidationResult,
} from "@/lib/sitemap-validate-core";
import { SITEMAP_BASE_URL } from "@/lib/sitemap-entries";

export type { SitemapValidationResult } from "@/lib/sitemap-validate-core";

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

export const validateSitemap = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input?: { baseUrl?: string; checkUrls?: boolean; persist?: boolean }) => input ?? {})
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);

    const baseUrl = (data.baseUrl?.replace(/\/$/, "") || SITEMAP_BASE_URL).trim();
    const result: SitemapValidationResult = await runSitemapValidation({
      baseUrl,
      checkUrls: data.checkUrls ?? false,
    });

    if (data.persist) {
      await persistValidationResult({ result, baseUrl, triggeredBy: "admin" });
    }
    return result;
  });

export interface SitemapValidationHistoryRow {
  id: string;
  checked_at: string;
  base_url: string;
  fetch_ok: boolean;
  fetch_error: string | null;
  expected_count: number;
  live_count: number;
  missing_count: number;
  extras_count: number;
  duplicates_count: number;
  http_error_count: number;
  triggered_by: string;
}

export const listSitemapValidationHistory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input?: { limit?: number }) => input ?? {})
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const limit = Math.min(Math.max(data.limit ?? 30, 1), 200);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("sitemap_validation_history")
      .select(
        "id, checked_at, base_url, fetch_ok, fetch_error, expected_count, live_count, missing_count, extras_count, duplicates_count, http_error_count, triggered_by",
      )
      .order("checked_at", { ascending: false })
      .limit(limit);
    if (error) throw new Error(error.message);
    return { rows: (rows ?? []) as SitemapValidationHistoryRow[] };
  });
