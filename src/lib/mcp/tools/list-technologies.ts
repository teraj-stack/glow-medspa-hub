import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "list_technologies",
  title: "List treatment technologies",
  description:
    "List all aesthetic-medicine technologies offered at BM Clinics with short technical descriptions, category and indications. Optionally filter by category.",
  inputSchema: {
    category: z
      .enum(["twarz", "ciało", "intymność", "skóra", "modelowanie"])
      .optional()
      .describe("Optional category filter."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ category }) => {
    const { TECHNOLOGIES } = await import("@/data/technologies");
    const filtered = (category ? TECHNOLOGIES.filter((t) => t.category === category) : TECHNOLOGIES).map(
      (t) => ({
        slug: t.slug,
        name: t.name,
        category: t.category,
        shortDesc: t.shortDesc,
        indications: t.indications,
        url: `https://bmclinics.ai/technologie/${t.slug}`,
      }),
    );
    return {
      content: [{ type: "text", text: JSON.stringify(filtered, null, 2) }],
      structuredContent: { technologies: filtered },
    };
  },
});
