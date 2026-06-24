import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/konsultacja-dziekujemy")({
  validateSearch: (search: Record<string, unknown>) => ({
    session_id: typeof search.session_id === "string" ? search.session_id : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Dziękujemy za rezerwację | BMClinics.ai" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ThankYou,
});

function ThankYou() {
  const { session_id } = Route.useSearch();
  return (
    <section className="container-luxury py-20">
      <div className="mx-auto max-w-xl rounded-lg border border-border bg-card p-8 text-center">
        <h1 className="font-serif text-3xl text-ink">Dziękujemy za rezerwację</h1>
        <p className="mt-4 text-foreground/80">
          {session_id
            ? "Płatność została przyjęta. Na podany adres e-mail wysłaliśmy formularz wstępnej diagnostyki — wypełnij go najpóźniej 24 godziny przed wizytą."
            : "Twoja rezerwacja jest przetwarzana."}
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-md bg-ink px-5 py-3 text-sm font-medium text-background hover:opacity-90"
        >
          Wróć na stronę główną
        </Link>
      </div>
    </section>
  );
}
