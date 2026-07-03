import { createFileRoute, Link } from "@tanstack/react-router";
import { DiagnostykaInlineCTA } from "@/components/site/DiagnostykaInlineCTA";
import { ArrowLeft } from "lucide-react";
import ogCard from "@/assets/og/blog-diagnostyka-skory-a-plan-leczenia.jpg";
import { withOgVersion } from "@/config/social-preview";

const FAQ = [
  {
    q: "Dlaczego nie można od razu zapisać się na laser bez diagnostyki?",
    a: "Bo dwie skóry, które wyglądają identycznie, mogą wymagać różnych długości fali, mocy i liczby przejść. Dobór parametrów laserowych bez pomiaru melaniny i naczyń to zgadywanie.",
  },
  {
    q: "Czy plan leczenia można rozłożyć na raty finansowe?",
    a: "Tak — plan jest podzielony na etapy i moduły. Nie musisz decydować o całości od razu; kolejny zabieg umawiasz dopiero po ocenie efektów poprzedniego.",
  },
  {
    q: "Ile zabiegów zwykle jest w rocznym planie?",
    a: "Zależy od celu. Dla utrzymania i profilaktyki: 3–4 wizyty rocznie. Dla korekcji przebarwień lub ptozy: 6–10 wizyt w ciągu 6–9 miesięcy, potem faza podtrzymania.",
  },
  {
    q: "Czy plan uwzględnia moje realne możliwości czasowe?",
    a: "Tak — rekonwalescencja i dojazdy są elementem planu, nie osobnym problemem pacjenta. Zabiegi z widocznym zejściem planujemy pod urlop lub weekend.",
  },
];

export const Route = createFileRoute("/blog/diagnostyka-skory-a-plan-leczenia")({
  head: () => ({
    meta: [
      { title: "Diagnostyka skóry a plan leczenia — dlaczego nie można ich rozdzielić | BMClinics" },
      {
        name: "description",
        content:
          "Jak wyniki analizy skóry przekładają się na konkretny plan zabiegów: dobór technologii, kolejność, częstotliwość, cele. Bez diagnostyki to loteria.",
      },
      { property: "og:title", content: "Diagnostyka skóry a plan leczenia" },
      { property: "og:description", content: "Od danych do zabiegów — jak powstaje spersonalizowany plan." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://bmclinics.ai/blog/diagnostyka-skory-a-plan-leczenia" },
      { property: "og:locale", content: "pl_PL" },
    ],
    links: [{ rel: "canonical", href: "https://bmclinics.ai/blog/diagnostyka-skory-a-plan-leczenia" }],
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
          <h1 className="mt-6 font-serif text-ink">Diagnostyka skóry a plan leczenia — dlaczego nie można ich rozdzielić</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            „Zrobię sobie laser na przebarwienia” to zdanie, po którym w klinice zawsze pytamy: jaką melaniną? Powierzchowną, głęboką,
            melasmowatą? Bez diagnostyki wybór technologii jest przypadkiem.
          </p>
        </div>
      </section>

      <article className="container-luxury max-w-3xl space-y-8 py-16 md:py-24">
        <section>
          <h2 className="font-serif text-2xl text-ink">Od parametru do technologii</h2>
          <p className="mt-3 text-muted-foreground">
            Wysokie UV-damage → lasery frakcyjne nieablacyjne. Melasma → laser pikosekundowy w niskiej energii + tranexamowy protokół pielęgnacji.
            Naczynia + rumień → długość fali 532 nm. Każdemu parametrowi odpowiada inne narzędzie.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-ink">Kolejność ma znaczenie</h2>
          <p className="mt-3 text-muted-foreground">
            Nie zaczyna się od najsilniejszej technologii. Najpierw stabilizujemy skórę (bariera, nawilżenie), potem pracujemy nad problemami
            powierzchownymi, na końcu głębokie modelowanie i biostymulacja. Odwrócona kolejność często oznacza powikłania.
          </p>
        </section>

        <DiagnostykaInlineCTA />

        <section>
          <h2 className="font-serif text-2xl text-ink">Częstotliwość i sezonowość</h2>
          <p className="mt-3 text-muted-foreground">
            Lasery na przebarwienia — jesień/zima. Biostymulatory kolagenu — dowolna pora, ale z 6-tygodniowym odstępem. Peelingi medyczne —
            seria 3–4 zabiegów co 3 tygodnie. Plan uwzględnia kalendarz słoneczny, nie tylko Twój kalendarz.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-ink">Mierzalne cele</h2>
          <p className="mt-3 text-muted-foreground">
            „Chcę wyglądać świeżo” to intencja, nie cel. Cel to np. „redukcja przebarwień o 30% w skali melaniny w 4 miesiące”. Diagnostyka
            daje punkt odniesienia, bez którego nie ma sposobu ocenić skuteczności.
          </p>
        </section>

        <section aria-labelledby="faq" className="border-t border-border/60 pt-10">
          <h2 id="faq" className="font-serif text-2xl text-ink">Pytania o plan leczenia</h2>
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
