import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { TECHNOLOGIES } from "@/data/technologies";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/technologie", changefreq: "monthly", priority: "0.9" },
          { path: "/cennik", changefreq: "monthly", priority: "0.8" },
          { path: "/auth", changefreq: "yearly", priority: "0.3" },
          { path: "/polityka-prywatnosci", changefreq: "yearly", priority: "0.3" },
          { path: "/regulamin", changefreq: "yearly", priority: "0.3" },
          ...TECHNOLOGIES.map((t) => ({
            path: `/technologie/${t.slug}`,
            changefreq: "monthly" as const,
            priority: "0.7",
          })),
        ];

        const urls = entries
          .map(
            (e) =>
              `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
          )
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
