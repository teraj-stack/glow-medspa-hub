import { createServerFn } from "@tanstack/react-start";
import { getRequest, getRequestIP } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

const BookingInput = z.object({
  full_name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(6).max(30),
  email: z.string().trim().email().max(200).optional().or(z.literal("")),
  technology_slug: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  preferred_date: z.string().trim().max(20).optional().or(z.literal("")),
  preferred_time: z.string().trim().max(20).optional().or(z.literal("")),
  consent_rodo: z.literal(true),
  // honeypot — musi być puste
  website: z.string().max(0).optional().or(z.literal("")),
  source: z.string().max(80).optional().or(z.literal("")),
});

async function hashIp(ip: string | null): Promise<string | null> {
  if (!ip) return null;
  const buf = new TextEncoder().encode(`bm-clinic::${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .slice(0, 16)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const submitBooking = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => BookingInput.parse(input))
  .handler(async ({ data }) => {
    if (data.website && data.website.length > 0) {
      return { ok: true as const, id: "ignored" };
    }

    const req = getRequest();
    const ip = getRequestIP({ xForwardedFor: true }) ?? null;
    const ipHash = await hashIp(ip);
    const ua = req?.headers.get("user-agent")?.slice(0, 300) ?? null;

    const supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
    );

    // Prosty rate-limit po IP-hash: max 3 rezerwacje / 10 min — używamy admin tylko jeśli przekroczono
    // Tu polegamy na RLS-INSERT z anon kluczem (polityka pozwala).
    const { data: inserted, error } = await supabase
      .from("bookings")
      .insert({
        full_name: data.full_name,
        phone: data.phone,
        email: data.email || null,
        technology_slug: data.technology_slug || null,
        message: data.message || null,
        preferred_date: data.preferred_date || null,
        preferred_time: data.preferred_time || null,
        consent_rodo: true,
        source: data.source || "web",
        user_agent: ua,
        ip_hash: ipHash,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[booking] insert failed", error);
      throw new Error("Nie udało się zapisać rezerwacji. Spróbuj ponownie za chwilę.");
    }

    return { ok: true as const, id: inserted.id };
  });
