import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";


export type HiddenPricingItem = {
  slug: string;
  label: string;
  created_at: string;
};

export const listHiddenPricingItems = createServerFn({ method: "GET" }).handler(
  async (): Promise<HiddenPricingItem[]> => {
    // Table is admin-only at the RLS layer. The public pricing page still
    // needs to know which (slug,label) pairs to hide; the server reads them
    // with the service-role client and returns just the keys needed to
    // filter the static technologies catalog client-side.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
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

export const setPricingItemsHidden = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { items: { slug: string; label: string; hidden: boolean }[] }) => {
    const items = input?.items ?? [];
    if (!Array.isArray(items) || items.length === 0) throw new Error("items array is required");
    for (const item of items) {
      if (!item?.slug || !item?.label) throw new Error("each item needs slug and label");
    }
    return { items };
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const toHide = data.items.filter((i) => i.hidden);
    const toShow = data.items.filter((i) => !i.hidden);

    const results = await Promise.allSettled([
      toHide.length > 0
        ? supabaseAdmin
            .from("hidden_pricing_items")
            .upsert(
              toHide.map((i) => ({ slug: i.slug, label: i.label, hidden_by: context.userId })),
              { onConflict: "slug,label" },
            )
        : Promise.resolve({ error: null } as any),
      ...toShow.map((i) =>
        supabaseAdmin
          .from("hidden_pricing_items")
          .delete()
          .eq("slug", i.slug)
          .eq("label", i.label),
      ),
    ]);

    const errors = results
      .filter((r): r is PromiseRejectedResult => r.status === "rejected")
      .map((r) => r.reason?.message ?? String(r.reason));
    const fulfilledErrors = results
      .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled")
      .map((r) => r.value?.error?.message)
      .filter(Boolean);

    if (errors.length > 0 || fulfilledErrors.length > 0) {
      throw new Error([...errors, ...fulfilledErrors].join("; "));
    }

    return { ok: true, count: data.items.length, hidden: toHide.length > 0 };
  });
