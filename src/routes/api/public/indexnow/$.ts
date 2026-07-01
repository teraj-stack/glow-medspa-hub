import { createFileRoute } from "@tanstack/react-router";

// IndexNow key verification file. Served from a splat route so the URL can
// end in "<KEY>.txt" (a hard requirement of the IndexNow spec) without
// hitting file-based-routing dot escaping issues. The key is only revealed
// to callers that already provided it in the URL.
export const Route = createFileRoute("/api/public/indexnow/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const expected = process.env.INDEXNOW_KEY;
        if (!expected) return new Response("Not configured", { status: 503 });
        const splat = (params as { _splat?: string })._splat ?? "";
        if (splat !== `${expected}.txt`) return new Response("Not found", { status: 404 });
        return new Response(expected, {
          status: 200,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
