import { createFileRoute, Link } from "@tanstack/react-router";
import { DiagnostykaInlineCTA } from "@/components/site/DiagnostykaInlineCTA";
import { ArrowLeft } from "lucide-react";

const FAQ = [
  {
    q: "Czy muszę zacząć zabiegi od razu po diagnostyce?",
    a: "Nie. Diagnostyka nie zobowiązuje do niczego. Możesz zacząć od zmiany pielęgnacji domowej i wrócić za 3 miesiące na kontrolę — czasem to wystarcza.",
  },
  {
    q: "Kiedy pierwszy zabieg po badaniu?",
    a: "Zwykle 7–14 dni po diagnostyce, żeby zamówić preparaty i zaplanować rekonwalescencję pod Twój kalendarz. W przypadkach pilnych (np. wesele za 3 tygodnie) — szybciej.",
  },
  {
    q: "Czy raport jest ważny bezterminowo?",
    a: "Nie. Skóra zmienia się dynamicznie — sensowny horyzont to 6–12 miesięcy. Po tym czasie warto powtórzyć badanie, żeby ocenić, co działa i skorygować plan.",
  },
  {
    q: "Co jeśli chcę drugą opinię?",
    a: "Raport jest Twój — możesz zabrać PDF do innego lekarza. Obrazowanie wielospektralne jest zestandaryzowane, więc dane są porównywalne między klinikami korzystającymi z tego samego typu urządzenia.",
  },
];

export const Route = createFileRoute("/blog/co-dalej-po-badaniu-skory")({
  head: () => ({
    meta: [
      { title: "Co dalej po badaniu skóry — od raportu do pierwszego zabiegu | BMClinics" },
      {
        name: "description",
        content:
          "Masz raport z analizy skóry. Co teraz? Jak zaplanować pielęgnację, zabiegi i kolejne kontrole. Realistyczna oś czasu na pierwsze 6 miesięcy.",
      },
      { property: "og:title", content: "Co dalej po badaniu skóry" },
      { property: "og:description", content: "Od raportu do konkretnych decyzji." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://bmclinics.ai/blog/co-dalej-po-badaniu-skory" },
      { property: "og:locale", content: "pl_PL" },
    ],
    links: [{ rel: "canonical", href: "https://bmclinics.ai/blog/co-dalej-po-badaniu-skory" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: Article,
});

function Article() {
  return (
    <>
      <section className="bg-secondary/40 py-12 md:py-20">
        <div className="container-luxury max-w-3xl">
          <Link to="/diagnostyka-skory-warszawa" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Diagnostyka skóry
          </Link>
          <h1 className="mt-6 font-serif text-ink">Co dalej po badaniu skóry — od raportu do pierwszego zabiegu</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Diagnostyka to punkt startu, nie koniec. Poniżej realistyczna oś czasu: co robić w tygodniu 1, miesiącu 1, kwartale 1 i po pół roku.
          </p>
        </div>
      </section>

      <article className="container-luxury max-w-3xl space-y-8 py-16 md:py-24">
        <section>
          <h2 className="font-serif text-2xl text-ink">Tydzień 1: pielęgnacja domowa</h2>
          <p className="mt-3 text-muted-foreground">
            Zmiana kremów SPF, wprowadzenie/wycofanie retinoidów, dobór serum na deficyt widoczny w raporcie. To najtańsza i najskuteczniejsza
            zmiana — w 60% przypadków sama daje mierzalną poprawę parametrów w 3 miesiące.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-ink">Miesiąc 1: pierwszy zabieg (jeśli w planie)</h2>
          <p className="mt-3 text-muted-foreground">
            Zwykle zaczynamy od zabiegu o krótkiej rekonwalescencji: mezoterapia igłowa, peeling medyczny, biostymulator. Ciężkie technologie
            (fototermoliza frakcyjna, laser pikosekundowy) planujemy dalej, po ocenie odpowiedzi skóry.
          </p>
        </section>

        <DiagnostykaInlineCTA />

        <section>
          <h2 className="font-serif text-2xl text-ink">Kwartał 1: kontrola pośrednia</h2>
          <p className="mt-3 text-muted-foreground">
            Krótkie badanie (30 min) porównujące te same obrazy w tych samych warunkach. Widzimy, co odpowiedziało na pielęgnację i zabiegi,
            i decydujemy o kontynuacji lub zmianie strategii.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-ink">Miesiąc 6: pełne badanie kontrolne</h2>
          <p className="mt-3 text-muted-foreground">
            Ponowne obrazowanie wielospektralne i pomiary fizyczne. To moment na trudne pytanie: co realnie się zmieniło, a co nie odpowiedziało?
            Bez porównania „przed–po” na twardych danych ocena jest tylko subiektywna.
          </p>
        </section>

        <section aria-labelledby="faq" className="border-t border-border/60 pt-10">
          <h2 id="faq" className="font-serif text-2xl text-ink">Najczęstsze pytania po diagnostyce</h2>
          <div className="mt-6 space-y-6">
            {FAQ.map((f) => (
              <div key={f.q}>
                <h3 className="font-medium text-ink">{f.q}</h3>
                <p className="mt-2 text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <DiagnostykaInlineCTA variant="safety" />
      </article>
    </>
  );
}
