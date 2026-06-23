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

const BOOKING_SELECT =
  "id, doctor_id, treatment_slug, patient_name, patient_email, patient_phone, notes, starts_at, ends_at, status, payment_status, amount_cents, currency, google_event_id, calendar_sync_status, calendar_sync_error, calendar_sync_at, created_at, doctors(full_name, calendar_id)";

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
      .select(BOOKING_SELECT)
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

// ----------------------------------------------------------------
// Internal: synchronize the booking with Google Calendar.
// Returns the sync state to persist on the booking row.
// ----------------------------------------------------------------
type SyncOutcome = {
  calendar_sync_status: "synced" | "error" | "skipped" | "not_required";
  calendar_sync_error: string | null;
  calendar_sync_at: string;
  google_event_id?: string | null;
  warning?: string;
};

async function syncWithCalendar(bookingId: string): Promise<SyncOutcome> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const nowIso = new Date().toISOString();

  const { data: b, error } = await supabaseAdmin
    .from("visit_bookings")
    .select(
      "id, status, starts_at, ends_at, patient_name, patient_email, treatment_slug, google_event_id, doctors(full_name, calendar_id)",
    )
    .eq("id", bookingId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!b) throw new Error("Booking not found");

  const calId = (b as any).doctors?.calendar_id as string | undefined;
  const status = b.status as string;

  // CANCELLED → ensure the event is removed
  if (status === "cancelled") {
    if (!b.google_event_id) {
      return {
        calendar_sync_status: "not_required",
        calendar_sync_error: null,
        calendar_sync_at: nowIso,
        google_event_id: null,
      };
    }
    if (!calId) {
      return {
        calendar_sync_status: "error",
        calendar_sync_error: "Lekarz nie ma przypisanego kalendarza.",
        calendar_sync_at: nowIso,
      };
    }
    const { deleteEvent } = await import("@/lib/google-calendar.server");
    const res = await deleteEvent(calId, b.google_event_id);
    if (!res.ok) {
      return {
        calendar_sync_status: "error",
        calendar_sync_error: res.error,
        calendar_sync_at: nowIso,
      };
    }
    return {
      calendar_sync_status: "synced",
      calendar_sync_error: null,
      calendar_sync_at: nowIso,
      google_event_id: null,
    };
  }

  // CONFIRMED → ensure an event exists
  if (status === "confirmed") {
    if (b.google_event_id) {
      return {
        calendar_sync_status: "synced",
        calendar_sync_error: null,
        calendar_sync_at: nowIso,
      };
    }
    if (!calId) {
      return {
        calendar_sync_status: "error",
        calendar_sync_error: "Lekarz nie ma przypisanego kalendarza.",
        calendar_sync_at: nowIso,
      };
    }
    const { insertEvent } = await import("@/lib/google-calendar.server");
    const res = await insertEvent(calId, {
      summary: `Wizyta: ${b.patient_name}${b.treatment_slug ? ` · ${b.treatment_slug}` : ""}`,
      description: `Pacjent: ${b.patient_name}\nE-mail: ${b.patient_email}`,
      startISO: b.starts_at as unknown as string,
      endISO: b.ends_at as unknown as string,
      attendeeEmail: b.patient_email ?? undefined,
      attendeeName: b.patient_name ?? undefined,
    });
    if (!res.ok) {
      return {
        calendar_sync_status: "error",
        calendar_sync_error: res.error,
        calendar_sync_at: nowIso,
      };
    }
    return {
      calendar_sync_status: "synced",
      calendar_sync_error: null,
      calendar_sync_at: nowIso,
      google_event_id: res.eventId,
    };
  }

  // completed / no_show / pending_payment → no calendar action required
  return {
    calendar_sync_status: "not_required",
    calendar_sync_error: null,
    calendar_sync_at: nowIso,
  };
}

// ============================================================
// ADMIN: update booking status (+ trigger calendar sync)
// ============================================================
export const updateBookingStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; status: string }) =>
    z.object({ id: z.string().uuid(), status: BookingStatus }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error: updErr } = await supabaseAdmin
      .from("visit_bookings")
      .update({ status: data.status })
      .eq("id", data.id);
    if (updErr) throw new Error(updErr.message);

    const sync = await syncWithCalendar(data.id);

    const patch = {
      calendar_sync_status: sync.calendar_sync_status,
      calendar_sync_error: sync.calendar_sync_error,
      calendar_sync_at: sync.calendar_sync_at,
      ...(sync.google_event_id !== undefined
        ? { google_event_id: sync.google_event_id }
        : {}),
    };
    const { error: syncErr } = await supabaseAdmin
      .from("visit_bookings")
      .update(patch)
      .eq("id", data.id);
    if (syncErr) throw new Error(syncErr.message);

    const { data: row } = await supabaseAdmin
      .from("visit_bookings")
      .select(BOOKING_SELECT)
      .eq("id", data.id)
      .maybeSingle();

    return { ok: true as const, booking: row, sync };
  });

// ============================================================
// ADMIN: retry calendar sync only (no status change)
// ============================================================
export const retryCalendarSync = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) =>
    z.object({ id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const sync = await syncWithCalendar(data.id);

    const patch = {
      calendar_sync_status: sync.calendar_sync_status,
      calendar_sync_error: sync.calendar_sync_error,
      calendar_sync_at: sync.calendar_sync_at,
      ...(sync.google_event_id !== undefined
        ? { google_event_id: sync.google_event_id }
        : {}),
    };
    const { error } = await supabaseAdmin
      .from("visit_bookings")
      .update(patch)
      .eq("id", data.id);
    if (error) throw new Error(error.message);

    const { data: row } = await supabaseAdmin
      .from("visit_bookings")
      .select(BOOKING_SELECT)
      .eq("id", data.id)
      .maybeSingle();

    return { ok: true as const, booking: row, sync };
  });
