import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Minimum hours before the visit that a patient can self-cancel from the portal.
// Stricter cancellations (under this window) must go through reception.
export const CANCEL_MIN_HOURS = 48;

export type PortalVisitBooking = {
  id: string;
  doctor_id: string | null;
  treatment_slug: string | null;
  starts_at: string;
  ends_at: string;
  status: string;
  payment_status: string | null;
  amount_cents: number | null;
  currency: string | null;
  patient_name: string | null;
  cancel_token: string | null;
  created_at: string;
};

/**
 * List the signed-in patient's own visit bookings.
 * RLS scopes to user_id = auth.uid(); no service role needed.
 */
export const listMyVisitBookings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PortalVisitBooking[]> => {
    const { data, error } = await context.supabase
      .from("visit_bookings")
      .select(
        "id, doctor_id, treatment_slug, starts_at, ends_at, status, payment_status, amount_cents, currency, patient_name, cancel_token, created_at",
      )
      .order("starts_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as PortalVisitBooking[];
  });

/**
 * Auto-claim: link any visit_bookings whose patient_email matches the signed-in
 * user's verified email and that has no user_id yet. Runs on portal open so the
 * patient sees historical bookings created before the account existed.
 */
export const claimMyVisitBookingsByEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ claimed: number }> => {
    const claims = context.claims as
      | { email?: string; email_confirmed_at?: string | null }
      | null;
    const claimEmail = claims?.email;
    if (!claimEmail) return { claimed: 0 };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // SECURITY: trust only emails that Supabase Auth has actually verified.
    // The JWT `email` claim is set even for unconfirmed signups, so an
    // attacker could register with a victim's address and claim their
    // bookings. Re-read the authoritative user row from auth.users and
    // require email_confirmed_at to be present, and the address to match.
    const { data: userRes, error: userErr } = await supabaseAdmin.auth.admin.getUserById(
      context.userId,
    );
    if (userErr || !userRes?.user) return { claimed: 0 };
    const verifiedEmail = userRes.user.email;
    const confirmedAt =
      (userRes.user as { email_confirmed_at?: string | null }).email_confirmed_at ?? null;
    if (!verifiedEmail || !confirmedAt) return { claimed: 0 };
    if (verifiedEmail.toLowerCase() !== claimEmail.toLowerCase()) return { claimed: 0 };

    const { data, error } = await supabaseAdmin
      .from("visit_bookings")
      .update({ user_id: context.userId })
      .is("user_id", null)
      .ilike("patient_email", verifiedEmail)
      .select("id");
    if (error) throw new Error(error.message);
    return { claimed: data?.length ?? 0 };
  });


/**
 * Manual claim by cancel_token (from the confirmation email). Lets a patient
 * attach a booking made with a different email to their account.
 */
export const claimVisitBookingByToken = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ cancel_token: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }): Promise<{ ok: true } | { ok: false; error: string }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: booking, error } = await supabaseAdmin
      .from("visit_bookings")
      .select("id, user_id")
      .eq("cancel_token", data.cancel_token)
      .maybeSingle();
    if (error) throw new Error(error.message);
    // Generic response to avoid token probing.
    if (!booking) return { ok: false, error: "not_found" };
    if (booking.user_id && booking.user_id !== context.userId) {
      return { ok: false, error: "not_found" };
    }
    if (!booking.user_id) {
      const { error: updErr } = await supabaseAdmin
        .from("visit_bookings")
        .update({ user_id: context.userId })
        .eq("id", booking.id);
      if (updErr) throw new Error(updErr.message);
    }
    return { ok: true };
  });

/**
 * Cancel one of the signed-in patient's own visits. Enforces:
 *  - ownership (user_id = auth.uid()) via the cancel_token + user_id match,
 *  - 48h minimum lead time,
 *  - status is cancellable (pending_payment | confirmed).
 */
export const cancelMyVisitBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ booking_id: z.string().uuid(), cancel_token: z.string().uuid() }).parse(input),
  )
  .handler(
    async ({
      data,
      context,
    }): Promise<
      | { ok: true }
      | { ok: false; error: "not_found" | "too_late" | "not_cancellable" | "server_error" }
    > => {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

      const { data: booking, error } = await supabaseAdmin
        .from("visit_bookings")
        .select("id, user_id, status, starts_at, cancel_token")
        .eq("id", data.booking_id)
        .maybeSingle();
      if (error) return { ok: false, error: "server_error" };
      if (!booking) return { ok: false, error: "not_found" };
      if (booking.user_id !== context.userId) return { ok: false, error: "not_found" };
      if (booking.cancel_token !== data.cancel_token) return { ok: false, error: "not_found" };

      const startsAt = new Date(booking.starts_at as unknown as string);
      const msUntil = startsAt.getTime() - Date.now();
      if (Number.isNaN(startsAt.getTime()) || msUntil <= 0) {
        return { ok: false, error: "too_late" };
      }
      if (msUntil < CANCEL_MIN_HOURS * 60 * 60 * 1000) {
        return { ok: false, error: "too_late" };
      }
      if (booking.status !== "pending_payment" && booking.status !== "confirmed") {
        return { ok: false, error: "not_cancellable" };
      }

      const { error: updErr } = await supabaseAdmin
        .from("visit_bookings")
        .update({
          status: "cancelled",
          calendar_sync_status: "pending",
          calendar_sync_next_at: new Date().toISOString(),
          calendar_sync_attempts: 0,
        })
        .eq("id", booking.id);
      if (updErr) return { ok: false, error: "server_error" };

      return { ok: true };
    },
  );
