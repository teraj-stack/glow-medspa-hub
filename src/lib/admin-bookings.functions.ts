import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const BookingStatus = z.enum([
  "pending_payment",
  "confirmed",
  "cancelled",
  "completed",
  "no_show",
]);

async function assertAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

// ============================================================
// ADMIN: list bookings (with optional filters)
// ============================================================
export const listAdminBookings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { status?: string; doctorId?: string; range?: "upcoming" | "past" | "all" }) =>
    z
      .object({
        status: BookingStatus.optional(),
        doctorId: z.string().uuid().optional(),
        range: z.enum(["upcoming", "past", "all"]).optional().default("upcoming"),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let q = supabaseAdmin
      .from("visit_bookings")
      .select(
        "id, doctor_id, treatment_slug, patient_name, patient_email, patient_phone, notes, starts_at, ends_at, status, payment_status, amount_cents, currency, google_event_id, created_at, doctors(full_name, calendar_id)",
      )
      .order("starts_at", { ascending: data.range === "past" ? false : true })
      .limit(500);
    if (data.status) q = q.eq("status", data.status);
    if (data.doctorId) q = q.eq("doctor_id", data.doctorId);
    const nowIso = new Date().toISOString();
    if (data.range === "upcoming") q = q.gte("starts_at", nowIso);
    if (data.range === "past") q = q.lt("starts_at", nowIso);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

// ============================================================
// ADMIN: update booking status
// ============================================================
export const updateBookingStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; status: string }) =>
    z.object({ id: z.string().uuid(), status: BookingStatus }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Load booking to know if we need to remove a Google event
    const { data: booking, error: loadErr } = await supabaseAdmin
      .from("visit_bookings")
      .select("id, google_event_id, doctor_id, doctors(calendar_id)")
      .eq("id", data.id)
      .maybeSingle();
    if (loadErr) throw new Error(loadErr.message);
    if (!booking) throw new Error("Booking not found");

    // If cancelling and event exists → remove it from the doctor's calendar
    let calendarWarning: string | null = null;
    if (data.status === "cancelled" && booking.google_event_id) {
      const calId = (booking as any).doctors?.calendar_id as string | undefined;
      if (calId) {
        const { deleteEvent } = await import("@/lib/google-calendar.server");
        const res = await deleteEvent(calId, booking.google_event_id);
        if (!res.ok) calendarWarning = res.error;
      }
    }

    const patch: Record<string, unknown> = { status: data.status };
    if (data.status === "cancelled") patch.google_event_id = null;

    const { error: updErr } = await supabaseAdmin
      .from("visit_bookings")
      .update(patch)
      .eq("id", data.id);
    if (updErr) throw new Error(updErr.message);

    return { ok: true as const, calendarWarning };
  });
