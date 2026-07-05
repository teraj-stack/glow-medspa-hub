import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "list_blog_posts",
  title: "List blog posts",
  description:
    "List all published blog posts on BMClinics.ai: title, excerpt, category, reading time and URL.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async () => {
    const { BLOG_POSTS_META } = await import("@/lib/blog-posts");
    const posts = BLOG_POSTS_META.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
      readingTime: p.readingTime,
      publishedAt: p.publishedAt,
      url: `https://bmclinics.ai${p.path}`,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(posts, null, 2) }],
      structuredContent: { posts },
    };
  },
});
