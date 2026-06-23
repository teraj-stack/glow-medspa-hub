import { createFileRoute } from "@tanstack/react-router";
import { processDueCalendarRetries } from "@/lib/admin-bookings.functions";

// Cron-invoked endpoint. Picks up bookings whose calendar sync is in `error`
// state and whose backoff window has elapsed, then retries each one.
//
// Auth: caller must send `Authorization: Bearer <secret>` matching the value
// stored in Supabase Vault under `cron_calendar_sync_secret`. The previous
// anon-key check was insufficient because the anon key is embedded in the
// public JS bundle and could be used by anyone to burn Google API quota.
let cachedSecret: { value: string; expiresAt: number } | null = null;

async function getExpectedSecret(): Promise<string | null> {
  const now = Date.now();
  if (cachedSecret && cachedSecret.expiresAt > now) return cachedSecret.value;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .schema("vault" as any)
    .from("decrypted_secrets" as any)
    .select("decrypted_secret")
    .eq("name", "cron_calendar_sync_secret")
    .maybeSingle();
  if (error || !data) return null;
  const value = (data as any).decrypted_secret as string;
  cachedSecret = { value, expiresAt: now + 5 * 60_000 };
  return value;
}

export const Route = createFileRoute("/api/public/hooks/calendar-sync-retry")({
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

        try {
          const summary = await processDueCalendarRetries(25);
          return new Response(
            JSON.stringify({ ok: true, ...summary, at: new Date().toISOString() }),
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
