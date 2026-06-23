import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

// Public, read-only Supabase client (anon key, respects RLS).
function publicSupabase() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

async function assertAdmin(supabase: any, userId: string) {
  // user_roles is locked; query via a security-definer helper isn't exposed,
  // so do an explicit check against has_role using a service-role round-trip.
  // We can't call private.has_role from anon/auth; instead, read user_roles
  // through service role.
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
// PUBLIC: list active doctors
// ============================================================
export const listActiveDoctors = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicSupabase();
  // Read from the public-safe view (excludes google_calendar_id and other
  // internal columns; security_invoker keeps RLS active=true policy in effect).
  const { data, error } = await (sb as any)
    .from("public_doctors")
    .select("id, slug, full_name, title, bio, photo_url, slot_minutes, buffer_minutes, default_price_cents, display_order")
    .order("display_order", { ascending: true })
    .order("full_name", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Array<{
    id: string;
    slug: string;
    full_name: string;
    title: string | null;
    bio: string | null;
    photo_url: string | null;
    slot_minutes: number;
    buffer_minutes: number;
    default_price_cents: number | null;
    display_order: number;
  }>;
});

// ============================================================
// ADMIN: list all doctors
// ============================================================
export const listAllDoctors = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("doctors")
      .select("*")
      .order("display_order", { ascending: true })
      .order("full_name", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

// ============================================================
// ADMIN: create / update / delete doctor
// ============================================================
const DoctorInput = z.object({
  slug: z.string().min(1).max(80).regex(/^[a-z0-9-]+$/),
  full_name: z.string().min(2).max(120),
  title: z.string().max(120).optional().nullable(),
  bio: z.string().max(2000).optional().nullable(),
  photo_url: z.string().url().max(500).optional().nullable(),
  google_calendar_id: z.string().max(200).optional().nullable(),
  slot_minutes: z.number().int().min(5).max(480).default(30),
  buffer_minutes: z.number().int().min(0).max(120).default(10),
  default_price_cents: z.number().int().min(0).max(10_000_000).optional().nullable(),
  active: z.boolean().default(true),
  display_order: z.number().int().default(0),
});

export const createDoctor = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => DoctorInput.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("doctors")
      .insert(data)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const updateDoctor = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).merge(DoctorInput.partial()).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { id, ...patch } = data;
    const { data: row, error } = await supabaseAdmin
      .from("doctors")
      .update(patch)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteDoctor = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("doctors").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============================================================
// ADMIN: test Google Calendar connection
// ============================================================
export const testDoctorCalendar = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ calendarId: z.string().min(3).max(200) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { freeBusy } = await import("./google-calendar.server");
    const now = new Date();
    const in7d = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const result = await freeBusy(data.calendarId, now.toISOString(), in7d.toISOString());
    if (!result.ok) return { ok: false as const, error: result.error };
    return { ok: true as const, busyCount: result.busy.length };
  });

// ============================================================
// ADMIN: working hours CRUD
// ============================================================
export const listWorkingHours = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ doctorId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("working_hours")
      .select("*")
      .eq("doctor_id", data.doctorId)
      .order("weekday")
      .order("start_time");
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

const WorkingHoursReplace = z.object({
  doctorId: z.string().uuid(),
  blocks: z
    .array(
      z.object({
        weekday: z.number().int().min(0).max(6),
        start_time: z.string().regex(/^\d{2}:\d{2}$/),
        end_time: z.string().regex(/^\d{2}:\d{2}$/),
      }),
    )
    .max(50),
});

export const replaceWorkingHours = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => WorkingHoursReplace.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("working_hours").delete().eq("doctor_id", data.doctorId);
    if (data.blocks.length) {
      const { error } = await supabaseAdmin.from("working_hours").insert(
        data.blocks.map((b) => ({
          doctor_id: data.doctorId,
          weekday: b.weekday,
          start_time: b.start_time,
          end_time: b.end_time,
        })),
      );
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });
