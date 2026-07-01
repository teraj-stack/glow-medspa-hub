import { createFileRoute } from "@tanstack/react-router";

// IndexNow key verification file. Bing/IndexNow fetches
// https://bmclinics.ai/api/public/indexnow/<KEY>.txt and expects the body
// to be exactly <KEY>. We compare the requested key with the secret
// server-side so the key is only revealed to callers that already know it.
export const Route = createFileRoute("/api/public/indexnow/$key.txt")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const expected = process.env.INDEXNOW_KEY;
        if (!expected) return new Response("Not configured", { status: 503 });
        if (params.key !== expected) return new Response("Not found", { status: 404 });
        return new Response(expected, {
          status: 200,
          headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
