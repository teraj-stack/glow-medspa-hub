import { createFileRoute } from "@tanstack/react-router";

// Hook: wymusza re-scrape kart OG/Twitter dla wszystkich publikowanych podstron.
// Wywoływany po deployu z GitHub Actions oraz z panelu administratora.
// Autoryzacja: apikey = SUPABASE_PUBLISHABLE_KEY (spójne z innymi hookami).
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
          let body: {
            baseUrl?: string;
            paths?: string[];
            triggeredBy?: string;
            commitSha?: string;
          } = {};
          try {
            body = (await request.json()) as typeof body;
          } catch {
            /* body opcjonalny */
          }
          const { rescrapeAllOg } = await import("@/lib/og-rescrape-core");
          const summary = await rescrapeAllOg({
            baseUrl: body.baseUrl,
            paths: body.paths,
            triggeredBy: body.triggeredBy ?? "post-deploy",
            commitSha: body.commitSha,
            persist: true,
          });
          return Response.json(summary);
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e);
          return Response.json({ ok: false, error: msg }, { status: 500 });
        }
      },
    },
  },
});
