import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type JsonValue = string | number | boolean | null | JsonValue[] | { [k: string]: JsonValue };


export const getCreatorDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { draftKey: string }) => input)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("creator_drafts")
      .select("data, updated_at")
      .eq("user_id", userId)
      .eq("draft_key", data.draftKey)
      .maybeSingle();
    if (error) throw error;
    return row
      ? { data: row.data as Record<string, unknown>, updatedAt: row.updated_at }
      : null;
  });

export const saveCreatorDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { draftKey: string; data: Record<string, unknown> }) => input)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("creator_drafts")
      .upsert(
        { user_id: userId, draft_key: data.draftKey, data: data.data },
        { onConflict: "user_id,draft_key" },
      );
    if (error) throw error;
    return { ok: true, savedAt: new Date().toISOString() };
  });

export const deleteCreatorDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { draftKey: string }) => input)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("creator_drafts")
      .delete()
      .eq("user_id", userId)
      .eq("draft_key", data.draftKey);
    if (error) throw error;
    return { ok: true };
  });
