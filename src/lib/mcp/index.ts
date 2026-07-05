import { defineMcp } from "@lovable.dev/mcp-js";
import listDoctors from "./tools/list-doctors";
import listTechnologies from "./tools/list-technologies";
import listBlogPosts from "./tools/list-blog-posts";
import getClinicInfo from "./tools/get-clinic-info";

export default defineMcp({
  name: "bmclinics-mcp",
  title: "BMClinics.ai",
  version: "0.1.0",
  instructions:
    "Public MCP server for BMClinics.ai (aesthetic-medicine clinic in Warsaw). Use these tools to look up doctors, treatment technologies, blog posts and clinic contact details. All data is public and read-only.",
  tools: [listDoctors, listTechnologies, listBlogPosts, getClinicInfo],
});
