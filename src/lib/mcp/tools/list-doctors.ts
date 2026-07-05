import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "list_doctors",
  title: "List doctors",
  description:
    "List active doctors at BM Clinics with their public profile: name, professional title, specializations, and short bio.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async () => {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      return { content: [{ type: "text", text: "Backend not configured" }], isError: true };
    }
    const { createClient } = await import("@supabase/supabase-js");
    const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await sb
      .from("doctors")
      .select("slug, full_name, professional_title, specializations, experience_summary, bio")
      .eq("active", true)
      .order("display_order", { ascending: true });
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const doctors = (data ?? []).map((d) => ({
      ...d,
      profile_url: `https://bmclinics.ai/lekarze/${d.slug}`,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(doctors, null, 2) }],
      structuredContent: { doctors },
    };
  },
});
