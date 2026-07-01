import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

export type NapHours = { day: string; opens: string; closes: string };

export type NapSettings = {
  business_name: string;
  legal_name: string | null;
  street_address: string;
  postal_code: string;
  city: string;
  region: string;
  country_code: string;
  phone: string | null;
  phone_e164: string | null;
  email: string | null;
  website: string;
  hours_json: NapHours[];
  latitude: number | null;
  longitude: number | null;
  google_maps_url: string | null;
  google_business_profile_url: string | null;
  categories: string[];
  description: string | null;
  updated_at: string;
};

const COLUMNS =
  "business_name,legal_name,street_address,postal_code,city,region,country_code,phone,phone_e164,email,website,hours_json,latitude,longitude,google_maps_url,google_business_profile_url,categories,description,updated_at";

function serverPublicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

export const getNapSettings = createServerFn({ method: "GET" }).handler(
  async (): Promise<NapSettings> => {
    const supabase = serverPublicClient();
    const { data, error } = await supabase
      .from("nap_settings")
      .select(COLUMNS)
      .eq("id", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) throw new Error("NAP settings not initialized");
    return data as unknown as NapSettings;
  },
);

export const updateNapSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: Partial<NapSettings>) => {
    if (!input || typeof input !== "object") throw new Error("payload required");
    const trim = (v: unknown) => (typeof v === "string" ? v.trim() : v);
    const out: Record<string, unknown> = {};
    const stringFields = [
      "business_name",
      "legal_name",
      "street_address",
      "postal_code",
      "city",
      "region",
      "country_code",
      "phone",
      "phone_e164",
      "email",
      "website",
      "google_maps_url",
      "google_business_profile_url",
      "description",
    ] as const;
    for (const k of stringFields) {
      if (k in input) {
        const v = trim((input as Record<string, unknown>)[k]);
        out[k] = v === "" ? null : v;
      }
    }
    if (input.hours_json !== undefined) {
      if (!Array.isArray(input.hours_json)) throw new Error("hours_json must be array");
      out.hours_json = input.hours_json.map((h) => ({
        day: String(h.day ?? "").slice(0, 40),
        opens: String(h.opens ?? "").slice(0, 5),
        closes: String(h.closes ?? "").slice(0, 5),
      }));
    }
    if (input.categories !== undefined) {
      if (!Array.isArray(input.categories)) throw new Error("categories must be array");
      out.categories = input.categories.map((c) => String(c).slice(0, 80)).filter(Boolean);
    }
    if (input.latitude !== undefined) out.latitude = input.latitude === null ? null : Number(input.latitude);
    if (input.longitude !== undefined) out.longitude = input.longitude === null ? null : Number(input.longitude);
    // required non-null strings
    for (const req of ["business_name", "street_address", "postal_code", "city", "region", "country_code", "website"] as const) {
      if (req in out && (!out[req] || typeof out[req] !== "string")) {
        throw new Error(`${req} is required`);
      }
    }
    return out;
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("nap_settings")
      .update({ ...data, updated_by: userId })
      .eq("id", true);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
