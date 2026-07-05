import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "get_clinic_info",
  title: "Get clinic info",
  description:
    "Return BM Clinics public contact details: name, address in Warsaw, and website URL.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async () => {
    const { CLINIC_ADDRESS } = await import("@/config/clinic");
    const info = {
      name: "BM Clinics",
      address: CLINIC_ADDRESS,
      website: "https://bmclinics.ai",
      booking_url: "https://bmclinics.ai/konsultacja",
    };
    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
      structuredContent: info,
    };
  },
});
