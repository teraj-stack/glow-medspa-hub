import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

export type HiddenPricingItem = {
  slug: string;
  label: string;
  created_at: string;
};

function publicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

export const listHiddenPricingItems = createServerFn({ method: "GET" }).handler(
  async (): Promise<HiddenPricingItem[]> => {
    const supabase = publicClient();
    const { data, error } = await supabase
      .from("hidden_pricing_items")
      .select("slug,label,created_at");
    if (error) throw new Error(error.message);
    return (data ?? []) as HiddenPricingItem[];
  },
);

async function assertAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden");
}

export const setPricingItemHidden = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { slug: string; label: string; hidden: boolean }) => {
    if (!input?.slug || !input?.label) throw new Error("slug and label are required");
    return input;
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.hidden) {
      const { error } = await supabaseAdmin
        .from("hidden_pricing_items")
        .upsert(
          { slug: data.slug, label: data.label, hidden_by: context.userId },
          { onConflict: "slug,label" },
        );
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin
        .from("hidden_pricing_items")
        .delete()
        .eq("slug", data.slug)
        .eq("label", data.label);
      if (error) throw new Error(error.message);
    }
    return { ok: true, hidden: data.hidden };
  });
