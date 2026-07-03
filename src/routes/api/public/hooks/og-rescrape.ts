import { createFileRoute } from "@tanstack/react-router";

// Hook: wymusza re-scrape kart OG/Twitter u crawlerów sociali dla wszystkich
// publikowanych podstron (na podstawie sitemap).
// Wywoływany po deployu z GitHub Actions oraz z cron/panelu administratora.
// Autoryzacja: apikey = SUPABASE_PUBLISHABLE_KEY (spójna z pozostałymi hookami).
export const Route = createFileRoute("/api/public/hooks/og-rescrape")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apikey = request.headers.get("apikey");
        const expected = process.env.SUPABASE_PUBLISHABLE_KEY;
        if (!expected || apikey !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }
        try {
          let body: { baseUrl?: string; paths?: string[] } = {};
          try {
            body = (await request.json()) as typeof body;
          } catch {
            /* body opcjonalny */
          }
          const { rescrapeAllOg } = await import("@/lib/og-rescrape-core");
          const summary = await rescrapeAllOg(body);
          return Response.json(summary);
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e);
          return Response.json({ ok: false, error: msg }, { status: 500 });
        }
      },
    },
  },
});
