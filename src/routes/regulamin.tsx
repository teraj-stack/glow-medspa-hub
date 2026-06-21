import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/regulamin")({
  head: () => ({
    meta: [
      { title: "Regulamin | Beauty & Mind Clinic" },
      { name: "description", content: "Regulamin świadczenia usług kliniki Beauty & Mind Clinic w Siedlcach." },
    ],
    links: [{ rel: "canonical", href: "https://glow-medspa-hub.lovable.app/regulamin" }],
  }),
  component: () => (
    <section className="container-luxury py-20">
      <h1 className="font-serif text-ink">Regulamin</h1>
      <div className="prose prose-neutral mt-8 max-w-3xl text-foreground/85">
        <p>
          Niniejszy regulamin określa zasady korzystania z usług kliniki Beauty &amp; Mind Clinic w Siedlcach,
          w tym warunki rezerwacji wizyt, odwołań i reklamacji.
        </p>
        <p>
          Rezerwacja wizyty następuje poprzez formularz na stronie lub kontakt telefoniczny. Anulowanie
          wizyty na mniej niż 24 godziny przed terminem może wiązać się z opłatą rezerwacyjną.
        </p>
      </div>
    </section>
  ),
});
