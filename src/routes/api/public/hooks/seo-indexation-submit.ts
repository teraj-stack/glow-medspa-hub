import { createFileRoute } from "@tanstack/react-router";

// Cron hook: daily submission of the sitemap to Google Search Console and Bing IndexNow.
// Authenticated by Supabase publishable/anon key (apikey header), same pattern as other hooks.
export const Route = createFileRoute("/api/public/hooks/seo-indexation-submit")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apikey = request.headers.get("apikey");
        const expected = process.env.SUPABASE_PUBLISHABLE_KEY;
        if (!expected || apikey !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }
        try {
          const { runFullSubmission } = await import("@/lib/seo-indexation-core");
          const rows = await runFullSubmission("cron:daily");
          return Response.json({ ok: true, submitted: rows.length, rows });
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e);
          return Response.json({ ok: false, error: msg }, { status: 500 });
        }
      },
    },
  },
});
