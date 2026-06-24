import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/regulamin")({
  head: () => ({
    meta: [
      { title: "Regulamin | BMClinics.ai" },
      { name: "description", content: "Regulamin świadczenia usług BMClinics.ai — zasady rezerwacji, odwołań i reklamacji wizyt." },
      { property: "og:title", content: "Regulamin | BMClinics.ai" },
      { property: "og:description", content: "Warunki rezerwacji, odwołań i reklamacji wizyt w BMClinics.ai." },
      { property: "og:url", content: "https://bmclinics.ai/regulamin" },
    ],
    links: [{ rel: "canonical", href: "https://bmclinics.ai/regulamin" }],
  }),
  component: () => (
    <section className="container-luxury py-20">
      <h1 className="font-serif text-ink">Regulamin</h1>
      <div className="prose prose-neutral mt-8 max-w-3xl text-foreground/85">
        <p>
          Niniejszy regulamin określa zasady korzystania z usług kliniki BM Clinics w Siedlcach,
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
