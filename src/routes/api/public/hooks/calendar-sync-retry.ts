import { createFileRoute } from "@tanstack/react-router";
import { processDueCalendarRetries } from "@/lib/admin-bookings.functions";

// Cron-invoked endpoint. Picks up bookings whose calendar sync is in `error`
// state and whose backoff window has elapsed, then retries each one.
// Auth: server-only CRON_SECRET sent as `Authorization: Bearer <secret>`.
// The previous anon-key check was insufficient because the anon key is
// embedded in the public JS bundle and anyone could trigger calendar work.
export const Route = createFileRoute("/api/public/hooks/calendar-sync-retry")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env.CRON_SECRET;
        const authHeader = request.headers.get("authorization") ?? "";
        const token = authHeader.replace(/^Bearer\s+/i, "").trim();
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
