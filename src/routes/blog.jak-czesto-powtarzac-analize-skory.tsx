import { createFileRoute, Link } from "@tanstack/react-router";
import { DiagnostykaInlineCTA } from "@/components/site/DiagnostykaInlineCTA";
import { ArrowLeft } from "lucide-react";

const FAQ = [
  {
    q: "Czy powtarzać badanie po każdym zabiegu?",
    a: "Nie — po pojedynczym zabiegu efekt jest częściowy. Sensowna kontrola to 3 miesiące po zakończeniu serii, wtedy widać skumulowaną odpowiedź skóry.",
  },
  {
    q: "Ile kosztuje kontrolna diagnostyka w porównaniu do pierwszej?",
    a: "Zwykle 40–60% ceny pierwszej wizyty — bo skracamy wywiad i skupiamy się na porównaniu obrazów. Cel to dane, nie ponowne opisywanie tego samego.",
  },
  {
    q: "Czy sezon roku wpływa na porównywalność wyników?",
    a: "Tak. Lato — więcej melaniny i naczyń rozszerzonych, zima — sucha skóra i cieńsza bariera. Optymalnie porównujemy badania z tej samej pory roku, żeby izolować wpływ zabiegów od naturalnych wahań.",
  },
  {
    q: "Czy urządzenie diagnostyczne w każdej klinice daje ten sam wynik?",
    a: "Nowoczesne systemy wielospektralne (VISIA, Observ, Antera) są zestandaryzowane i wyniki są porównywalne. Ważne, żeby porównywać dane z tego samego typu urządzenia i w tych samych warunkach oświetleniowych.",
  },
];

export const Route = createFileRoute("/blog/jak-czesto-powtarzac-analize-skory")({
  head: () => ({
    meta: [
      { title: "Jak często powtarzać analizę skóry — 3, 6 czy 12 miesięcy? | BMClinics" },
      {
        name: "description",
        content:
          "Ile czasu między badaniami, żeby dane były porównywalne i miały sens diagnostyczny. Kiedy 3 miesiące, kiedy pół roku, a kiedy rok wystarczy.",
      },
      { property: "og:title", content: "Jak często powtarzać analizę skóry" },
      { property: "og:description", content: "Interwały kontrolne, które mają sens." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://bmclinics.ai/blog/jak-czesto-powtarzac-analize-skory" },
      { property: "og:locale", content: "pl_PL" },
    ],
    links: [{ rel: "canonical", href: "https://bmclinics.ai/blog/jak-czesto-powtarzac-analize-skory" }],
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
          <h1 className="mt-6 font-serif text-ink">Jak często powtarzać analizę skóry — 3, 6 czy 12 miesięcy?</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Diagnostyka nie jest jednorazowym wydarzeniem. Cykl kontrolny decyduje o tym, czy plan leczenia jest korygowany na podstawie danych,
            czy tylko wyobrażeń pacjenta i lekarza.
          </p>
        </div>
      </section>

      <article className="container-luxury max-w-3xl space-y-8 py-16 md:py-24">
        <section>
          <h2 className="font-serif text-2xl text-ink">3 miesiące — kontrola pośrednia</h2>
          <p className="mt-3 text-muted-foreground">
            Po serii zabiegów peelingujących, mezoterapii lub laserowej terapii przebarwień. Wystarczająco długo, żeby zobaczyć realną odpowiedź
            skóry; wystarczająco krótko, żeby zmodyfikować plan bez straty czasu.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-ink">6 miesięcy — kontrola po biostymulatorach</h2>
          <p className="mt-3 text-muted-foreground">
            Biostymulatory kolagenu (kwas polimlekowy, hydroksyapatyt wapnia) osiągają szczyt efektu po 3–6 miesiącach. Wcześniejsza ocena
            pokazuje niedoszacowany rezultat.
          </p>
        </section>

        <DiagnostykaInlineCTA />

        <section>
          <h2 className="font-serif text-2xl text-ink">12 miesięcy — pełny przegląd roczny</h2>
          <p className="mt-3 text-muted-foreground">
            Nawet bez aktywnego planu zabiegowego, roczna kontrola daje krzywą wieloletnią. To dane, które w wieku 40+ decydują o tym, kiedy
            wprowadzić bardziej intensywne interwencje — zanim ptoza lub przebarwienia staną się widoczne.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-ink">Zdarzenia, po których warto powtórzyć wcześniej</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
            <li>Ciąża i poród (hormony + melasma).</li>
            <li>Menopauza i zmiana napięcia skóry.</li>
            <li>Znaczna utrata masy ciała.</li>
            <li>Długa podróż z intensywną ekspozycją słoneczną.</li>
            <li>Przewlekły stres lub choroba, która „zestarzyła” skórę.</li>
          </ul>
        </section>

        <section aria-labelledby="faq" className="border-t border-border/60 pt-10">
          <h2 id="faq" className="font-serif text-2xl text-ink">Pytania o częstotliwość diagnostyki</h2>
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
