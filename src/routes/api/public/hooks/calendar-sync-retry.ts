import { createFileRoute } from "@tanstack/react-router";
import { processDueCalendarRetries } from "@/lib/admin-bookings.functions";

// Cron-invoked endpoint. Picks up bookings whose calendar sync is in `error`
// state and whose backoff window has elapsed, then retries each one.
// Triggered by pg_cron; auth is via the Supabase anon key in the `apikey` header.
export const Route = createFileRoute("/api/public/hooks/calendar-sync-retry")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = request.headers.get("apikey");
        const expected = process.env.SUPABASE_PUBLISHABLE_KEY;
        if (!expected || apiKey !== expected) {
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
