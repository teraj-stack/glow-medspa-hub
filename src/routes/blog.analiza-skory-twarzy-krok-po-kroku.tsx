import { createFileRoute, Link } from "@tanstack/react-router";
import { DiagnostykaInlineCTA } from "@/components/site/DiagnostykaInlineCTA";
import { ArrowLeft } from "lucide-react";
import ogCard from "@/assets/og/blog-analiza-skory-twarzy-krok-po-kroku.jpg";
import { withOgVersion } from "@/config/social-preview";

const FAQ = [
  {
    q: "Ile trwa pełna analiza skóry twarzy?",
    a: "Od 45 do 60 minut: 10 minut wywiadu, 15 minut obrazowania w kilku spektrach światła, 20–30 minut interpretacji i omówienia planu.",
  },
  {
    q: "Czy badanie boli lub jest inwazyjne?",
    a: "Nie. Jest w 100% bezkontaktowe — to obrazowanie kamerą wielospektralną i pomiar parametrów fizycznych skóry (nawilżenie, TEWL, elastyczność).",
  },
  {
    q: "Co dokładnie widzę na ekranie razem z lekarzem?",
    a: "Warstwy: powierzchnia, przebarwienia melaninowe, naczynia, pory, tekstura, UV-damage, symetria. Każdy problem oceniony liczbowo i porównany do normy wiekowej.",
  },
  {
    q: "Czy dostanę raport na e-mail?",
    a: "Tak. Pełny raport PDF z obrazami, wynikami liczbowymi i planem leczenia trafia na Twój e-mail w ciągu 24 godzin od wizyty.",
  },
];

export const Route = createFileRoute("/blog/analiza-skory-twarzy-krok-po-kroku")({
  head: () => ({
    meta: [
      { title: "Analiza skóry twarzy krok po kroku — jak wygląda badanie | BMClinics" },
      {
        name: "description",
        content:
          "Co dokładnie dzieje się podczas analizy skóry twarzy: wywiad, obrazowanie wielospektralne, pomiary fizyczne, interpretacja, raport. Etap po etapie.",
      },
      { property: "og:title", content: "Analiza skóry twarzy — krok po kroku" },
      { property: "og:description", content: "Jak wygląda profesjonalne badanie skóry — od wywiadu po raport." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://bmclinics.ai/blog/analiza-skory-twarzy-krok-po-kroku" },
      { property: "og:locale", content: "pl_PL" },
    ],
    links: [{ rel: "canonical", href: "https://bmclinics.ai/blog/analiza-skory-twarzy-krok-po-kroku" }],
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
          <h1 className="mt-6 font-serif text-ink">Analiza skóry twarzy krok po kroku</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Pacjenci pytają: „co konkretnie się dzieje przez tę godzinę?”. Poniżej mapa całego badania — od pierwszego pytania w gabinecie po
            PDF, który trafia do Ciebie następnego dnia.
          </p>
        </div>
      </section>

      <article className="container-luxury max-w-3xl space-y-8 py-16 md:py-24">
        <section>
          <h2 className="font-serif text-2xl text-ink">1. Wywiad (10 min)</h2>
          <p className="mt-3 text-muted-foreground">
            Pielęgnacja, historia zabiegów, leki, cykl hormonalny, styl życia, ekspozycja UV, dieta. Nie ma dobrych odpowiedzi — jest tylko obraz,
            który pozwala interpretować to, co pokaże kamera.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-ink">2. Obrazowanie wielospektralne (15 min)</h2>
          <p className="mt-3 text-muted-foreground">
            Kilka zdjęć w różnych spektrach światła: białe (powierzchnia), UV (uszkodzenia posłoneczne), spolaryzowane skrzyżowanie (naczynia,
            zaczerwienienia), spolaryzowane równoległe (tekstura, pory). Twoja twarz w 5 warstwach.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-ink">3. Pomiary fizyczne (10 min)</h2>
          <p className="mt-3 text-muted-foreground">
            Korneometr (nawilżenie), tewametr (utrata wody przez skórę), kutometr (elastyczność) — trzy liczby, które mówią, czy bariera skóry
            działa. To dane, nie odczucia.
          </p>
        </section>

        <DiagnostykaInlineCTA />

        <section>
          <h2 className="font-serif text-2xl text-ink">4. Interpretacja z lekarzem (15–20 min)</h2>
          <p className="mt-3 text-muted-foreground">
            Siadamy przed ekranem. Każdy problem zobaczysz w porównaniu do normy dla Twojego wieku i fototypu. To moment, w którym „coś mi się
            nie podoba" zamienia się w konkretne parametry.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-ink">5. Plan leczenia (5–10 min)</h2>
          <p className="mt-3 text-muted-foreground">
            Rekomendacje: pielęgnacja domowa, ewentualne zabiegi, kolejność, częstotliwość, orientacyjny koszt i horyzont czasowy. Bez presji
            na decyzję w gabinecie.
          </p>
        </section>

        <section aria-labelledby="faq" className="border-t border-border/60 pt-10">
          <h2 id="faq" className="font-serif text-2xl text-ink">Najczęstsze pytania o przebieg badania</h2>
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
