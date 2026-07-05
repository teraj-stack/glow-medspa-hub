import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "get_clinic_info",
  title: "Get clinic info (NAP)",
  description:
    "Return BM Clinics contact details: name, address, phone, email, opening hours and geographic coordinates.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async () => {
    const clinic = await import("@/config/clinic");
    const info = {
      name: (clinic as any).CLINIC_NAME ?? "BM Clinics",
      address: (clinic as any).CLINIC_ADDRESS ?? null,
      phone: (clinic as any).CLINIC_PHONE ?? null,
      email: (clinic as any).CLINIC_EMAIL ?? null,
      hours: (clinic as any).CLINIC_HOURS ?? null,
      website: "https://bmclinics.ai",
    };
    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
      structuredContent: info,
    };
  },
});
