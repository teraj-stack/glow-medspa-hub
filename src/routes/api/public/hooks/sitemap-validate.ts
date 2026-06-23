import { createFileRoute } from "@tanstack/react-router";
import { runSitemapValidation, persistValidationResult } from "@/lib/sitemap-validate-core";
import { SITEMAP_BASE_URL, assertAllowedBaseUrl } from "@/lib/sitemap-entries";

let cachedSecret: { value: string; expiresAt: number } | null = null;

async function getExpectedSecret(): Promise<string | null> {
  const now = Date.now();
  if (cachedSecret && cachedSecret.expiresAt > now) return cachedSecret.value;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .schema("vault" as any)
    .from("decrypted_secrets" as any)
    .select("decrypted_secret")
    .eq("name", "cron_sitemap_validate_secret")
    .maybeSingle();
  if (error || !data) return null;
  const value = (data as any).decrypted_secret as string;
  cachedSecret = { value, expiresAt: now + 5 * 60_000 };
  return value;
}

export const Route = createFileRoute("/api/public/hooks/sitemap-validate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authHeader = request.headers.get("authorization") ?? "";
        const token = authHeader.replace(/^Bearer\s+/i, "").trim();
        const expected = await getExpectedSecret();
        if (!expected || !token || token !== expected) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        let body: { baseUrl?: string; checkUrls?: boolean; triggeredBy?: string } = {};
        try {
          body = (await request.json()) as typeof body;
        } catch {
          // empty body is fine
        }
        // SSRF guard: only accept allowlisted hosts; fall back to default.
        let baseUrl = SITEMAP_BASE_URL;
        if (body.baseUrl?.trim()) {
          const allowed = assertAllowedBaseUrl(body.baseUrl.trim());
          if (!allowed) {
            return new Response(
              JSON.stringify({ error: "baseUrl not allowed" }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }
          baseUrl = allowed;
        }
        const checkUrls = body.checkUrls ?? true;
        const triggeredBy = body.triggeredBy ?? "cron";

        try {
          const result = await runSitemapValidation({ baseUrl, checkUrls });
          await persistValidationResult({ result, baseUrl, triggeredBy });
          return new Response(
            JSON.stringify({
              ok: true,
              fetchOk: result.fetchOk,
              missing: result.missing.length,
              extras: result.extras.length,
              duplicates: result.duplicates.length,
              httpErrors: result.urlChecks.filter((c) => !c.ok).length,
              at: new Date().toISOString(),
            }),
            { headers: { "Content-Type": "application/json" } },
          );
        } catch (e: any) {
          return new Response(
            JSON.stringify({ ok: false, error: e?.message ?? "unknown" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
