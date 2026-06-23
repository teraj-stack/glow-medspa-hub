import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

// Public endpoint for patients to cancel their own visit booking using the
// cancel_token delivered out-of-band (e.g. confirmation email). The token is
// only accepted in the POST body — never as a query string — so it does not
// leak into access logs, browser history, or referer headers. All validation
// runs server-side with the service role; the client bundle never sees the
// token comparison logic nor any other booking's data.
//
// CORS: same-origin only. No `Access-Control-Allow-Origin` is set, so
// browsers on third-party sites cannot read responses.
export const Route = createFileRoute("/api/public/bookings/cancel")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const json = (await request.json().catch(() => null)) as unknown;
        const parsed = z
          .object({ cancel_token: z.string().uuid() })
          .safeParse(json);

        // Generic response shape — never reveal whether a token exists, is
        // expired, or matches a non-cancellable booking. Always returns
        // { ok: true } on any non-server-error path to prevent token probing.
        const ok = () =>
          new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });

        if (!parsed.success) return ok();

        try {
          const { supabaseAdmin } = await import(
            "@/integrations/supabase/client.server"
          );

          const { data: booking } = await supabaseAdmin
            .from("visit_bookings")
            .select("id, status, starts_at")
            .eq("cancel_token", parsed.data.cancel_token)
            .maybeSingle();

          if (!booking) return ok();

          // Only future, non-terminal bookings can be cancelled by the
          // patient. Admin actions go through the admin server function.
          const startsAt = new Date(booking.starts_at as unknown as string);
          if (Number.isNaN(startsAt.getTime()) || startsAt <= new Date()) {
            return ok();
          }
          if (
            booking.status !== "pending_payment" &&
            booking.status !== "confirmed"
          ) {
            return ok();
          }

          const { error: updErr } = await supabaseAdmin
            .from("visit_bookings")
            .update({ status: "cancelled" })
            .eq("id", booking.id);
          if (updErr) throw new Error(updErr.message);

          // Best-effort calendar cleanup; do not block the response on it.
          try {
            const { processDueCalendarRetries } = await import(
              "@/lib/admin-bookings.functions"
            );
            // Trigger sync for this specific booking via the existing
            // persistence path by calling the internal helper indirectly.
            // We can't call persistSyncOutcome from here without exporting it,
            // so rely on the cron retry job + a direct admin update marker.
            await supabaseAdmin
              .from("visit_bookings")
              .update({
                calendar_sync_status: "pending",
                calendar_sync_next_at: new Date().toISOString(),
                calendar_sync_attempts: 0,
              })
              .eq("id", booking.id);
            void processDueCalendarRetries; // referenced to keep import tree-shake-safe if needed later
          } catch {
            // swallow — cron will pick it up
          }

          return ok();
        } catch (e: any) {
          return new Response(
            JSON.stringify({ ok: false, error: "server_error" }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      },
    },
  },
});
