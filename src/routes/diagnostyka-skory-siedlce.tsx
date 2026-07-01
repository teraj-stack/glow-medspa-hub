import { createFileRoute, redirect } from "@tanstack/react-router";

// Trwałe przekierowanie 301 — konsultacje odbywają się w Warszawie
// (Klinika Promedion, ul. Wójcickiego 4). Zachowujemy stary URL wyłącznie
// po to, by nie tracić linków zewnętrznych i wyników wyszukiwarek.
export const Route = createFileRoute("/diagnostyka-skory-siedlce")({
  beforeLoad: () => {
    throw redirect({
      to: "/diagnostyka-skory-warszawa",
      statusCode: 301,
      replace: true,
    });
  },
  server: {
    handlers: {
      GET: () => {
        return new Response(null, {
          status: 301,
          headers: { Location: "/diagnostyka-skory-warszawa" },
        });
      },
    },
  },
  component: () => null,
});
