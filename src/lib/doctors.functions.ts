import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { logAuditEvent } from "@/lib/audit/log.server";
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
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) {
    console.error("[saveDoctorPortrait][assertAdmin] DB error", { userId, error });
    throw new Error("[DB] " + error.message);
  }
  if (!data) {
    console.warn("[saveDoctorPortrait][assertAdmin] forbidden", { userId });
    throw new Error("[FORBIDDEN] Wymagana rola admin.");
  }
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
    .select("id, slug, full_name, title, bio, photo_url, display_order, professional_title, experience_summary, specializations, education")
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
    display_order: number;
    professional_title: string | null;
    experience_summary: string | null;
    specializations: string[] | null;
    education: string[] | null;
  }>;
});

// ============================================================
// PUBLIC: read a single doctor profile by slug (for /lekarze/[slug])
// ============================================================
const SAFE_SLUG = /^[a-z0-9-]{1,80}$/;

function classifySlug(raw: string): { suspicious: boolean; reasons: string[] } {
  const reasons: string[] = [];
  if (raw.length > 80) reasons.push("length>80");
  if (!SAFE_SLUG.test(raw)) reasons.push("charset");
  if (/[%<>"'`;()]|--|\/\*|\\x|union\s+select|or\s+1=1/i.test(raw)) reasons.push("injection-pattern");
  if (/\.\.|\/|\\/.test(raw)) reasons.push("path-traversal");
  return { suspicious: reasons.length > 0, reasons };
}

export const getDoctorBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: z.string().min(1).max(120) }).parse(input))
  .handler(async ({ data }) => {
    const { getRequest } = await import("@tanstack/react-start/server");
    let request: Request | undefined;
    try { request = getRequest(); } catch { /* not in request scope */ }

    const verdict = classifySlug(data.slug);
    if (verdict.suspicious) {
      void logAuditEvent({
        event_type: "public.read",
        action: "READ_SUSPICIOUS",
        resource_type: "public_doctors",
        resource_id: data.slug.slice(0, 120),
        severity: "warning",
        success: false,
        metadata: { reasons: verdict.reasons, raw_slug: data.slug.slice(0, 200) },
      }, request);
      // Don't even hit the DB with suspicious input.
      return null;
    }

    const sb = publicSupabase();
    const { data: row, error } = await (sb as any)
      .from("public_doctors")
      .select("id, slug, full_name, title, bio, photo_url, display_order, professional_title, experience_summary, specializations, education, portrait_crop")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    void logAuditEvent({
      event_type: "public.read",
      action: "READ",
      resource_type: "public_doctors",
      resource_id: data.slug,
      severity: "info",
      success: !error,
      metadata: { found: !!row },
    }, request);
    return row as null | {
      id: string;
      slug: string;
      full_name: string;
      title: string | null;
      bio: string | null;
      photo_url: string | null;
      display_order: number;
      professional_title: string | null;
      experience_summary: string | null;
      specializations: string[] | null;
      education: string[] | null;
      portrait_crop: { shape: string; zoom: number; offsetX: number; offsetY: number } | null;
    };
  });

// ============================================================
// ADMIN: save portrait crop (and optionally upload a new photo) by slug
// ============================================================
const PortraitCropSchema = z.object({
  shape: z.enum(["circle", "square", "portrait45"]),
  zoom: z.number().min(1).max(4),
  offsetX: z.number().min(0).max(100),
  offsetY: z.number().min(0).max(100),
});

export const saveDoctorPortrait = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const schema = z.object({
      slug: z.string().min(1).max(120),
      crop: PortraitCropSchema,
      photoBase64: z.string().max(15_000_000).optional(),
      photoContentType: z.string().regex(/^image\/(png|jpe?g|webp|avif)$/).optional(),
    });
    const parsed = schema.safeParse(input);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
      console.warn("[saveDoctorPortrait] validation failed", issues);
      throw new Error(`[VALIDATION] ${issues}`);
    }
    return parsed.data;
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: doc, error: docErr } = await supabaseAdmin
      .from("doctors")
      .select("id, photo_url")
      .eq("slug", data.slug)
      .maybeSingle();
    if (docErr) {
      console.error("[saveDoctorPortrait] DB select error", { slug: data.slug, error: docErr });
      throw new Error(`[DB] ${docErr.message}`);
    }
    if (!doc) {
      console.warn("[saveDoctorPortrait] doctor not found", { slug: data.slug });
      throw new Error(`[NOT_FOUND] Nie znaleziono lekarki o slugu "${data.slug}".`);
    }

    const patch: Record<string, unknown> = { portrait_crop: data.crop };

    if (data.photoBase64 && data.photoContentType) {
      const ext = data.photoContentType.split("/")[1].replace("jpeg", "jpg");
      const path = `${data.slug}/${Date.now()}.${ext}`;
      const buf = Buffer.from(data.photoBase64, "base64");
      const { error: upErr } = await supabaseAdmin.storage
        .from("doctor-portraits")
        .upload(path, buf, { contentType: data.photoContentType, upsert: false });
      if (upErr) {
        console.error("[saveDoctorPortrait] storage upload failed", { path, error: upErr });
        throw new Error(`[UPLOAD] ${upErr.message}`);
      }
      const { data: signed, error: signErr } = await supabaseAdmin.storage
        .from("doctor-portraits")
        .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
      if (signErr || !signed) {
        console.error("[saveDoctorPortrait] sign url failed", { path, error: signErr });
        throw new Error(`[UPLOAD] Nie udało się wygenerować linku do zdjęcia.`);
      }
      patch.photo_url = signed.signedUrl;
    }

    const { data: updated, error: updErr } = await supabaseAdmin
      .from("doctors")
      .update(patch as never)
      .eq("id", doc.id)
      .select("photo_url, portrait_crop")
      .single();
    if (updErr) {
      console.error("[saveDoctorPortrait] DB update error", { id: doc.id, error: updErr });
      throw new Error(`[DB] ${updErr.message}`);
    }
    console.info("[saveDoctorPortrait] saved", { slug: data.slug, userId: context.userId, photoUpdated: !!patch.photo_url });
    return updated;
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
  professional_title: z.string().max(200).optional().nullable(),
  experience_summary: z.string().max(4000).optional().nullable(),
  specializations: z.array(z.string().min(1).max(300)).max(40).optional(),
  education: z.array(z.string().min(1).max(300)).max(40).optional(),
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
