import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/consultation-questions")({
  server: { handlers: { POST: async ({ request }) => {
    try {
      const { handleQuestions } = await import("@/lib/consultation-ai/questions.server");
      return await handleQuestions(request);
    } catch (error) {
      if (request.signal.aborted) return new Response(null, { status: 499 });
      return Response.json({ error: "Nie udało się przygotować pytań. Spróbuj ponownie później." }, { status: 500, headers: { "Cache-Control": "no-store" } });
    }
  } } },
});