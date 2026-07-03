import { createFileRoute, Link } from "@tanstack/react-router";
import { DiagnostykaInlineCTA } from "@/components/site/DiagnostykaInlineCTA";
import { ArrowLeft } from "lucide-react";
import ogCard from "@/assets/og/blog-najczestsze-wyniki-analizy-skory.jpg";
import { withOgVersion } from "@/config/social-preview";

const FAQ = [
  {
    q: "Czy wysoki wynik przebarwień oznacza melasmę?",
    a: "Nie zawsze. Kamera pokazuje sumę melaniny — melasma, przebarwienia posłoneczne i pozapalne wyglądają podobnie na pojedynczym zdjęciu. Diagnozę stawiamy dopiero po ocenie wzorca, wywiadu i lampy Wooda.",
  },
  {
    q: "Co to jest UV-damage i czy zawsze rośnie z wiekiem?",
    a: "To ilość melaniny zdeponowanej pod powierzchnią skóry w wyniku ekspozycji na słońce. Rośnie z wiekiem, ale można go „zatrzymać” dobrą fotoprotekcją — kolejne badanie za rok to potwierdzi.",
  },
  {
    q: "Elastyczność 68% — dużo czy mało?",
    a: "Dla 45-latki to wynik przeciętny, dla 30-latki — sygnał ostrzegawczy. Kontekst wieku i fototypu decyduje o interpretacji, dlatego surowa liczba w internecie nic nie mówi.",
  },
  {
    q: "Naczynia widoczne w spolaryzowanym świetle to rumień naczyniowy?",
    a: "Nie każde. Rozproszone naczynia w policzkach są normą; skupiska w centrum twarzy, teleangiektazje i tło zaczerwienienia sugerują trądzik różowaty lub reaktywność naczyniową. Wzorzec ma znaczenie.",
  },
];

export const Route = createFileRoute("/blog/najczestsze-wyniki-analizy-skory")({
  head: () => ({
    meta: [
      { title: "Najczęstsze wyniki analizy skóry — co oznaczają liczby | BMClinics" },
      {
        name: "description",
        content:
          "Przebarwienia, UV-damage, naczynia, elastyczność, pory — co realnie oznaczają wyniki analizy skóry twarzy i kiedy są powodem do niepokoju.",
      },
      { property: "og:title", content: "Najczęstsze wyniki analizy skóry — jak je czytać" },
      { property: "og:description", content: "Interpretacja liczb z raportu diagnostycznego." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://bmclinics.ai/blog/najczestsze-wyniki-analizy-skory" },
      { property: "og:image", content: withOgVersion(`https://bmclinics.ai${ogCard}`) },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "BMClinics.ai — Warszawa (Wilanów), ul. Branickiego 10" },
      { name: "twitter:image", content: withOgVersion(`https://bmclinics.ai${ogCard}`) },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:locale", content: "pl_PL" },
    ],
    links: [{ rel: "canonical", href: "https://bmclinics.ai/blog/najczestsze-wyniki-analizy-skory" }],
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
          <h1 className="mt-6 font-serif text-ink">Najczęstsze wyniki analizy skóry — jak czytać liczby w raporcie</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Otwierasz PDF, widzisz osiem parametrów i słupki. Który wynik naprawdę wymaga uwagi, a który jest w normie dla Twojego wieku?
            Przewodnik po pięciu wskaźnikach, które pojawiają się w każdym raporcie.
          </p>
        </div>
      </section>

      <article className="container-luxury max-w-3xl space-y-8 py-16 md:py-24">
        <section>
          <h2 className="font-serif text-2xl text-ink">Przebarwienia — płytka melanina</h2>
          <p className="mt-3 text-muted-foreground">
            Skala 0–100 vs. norma wiekowa. Wynik +20% ponad normę to sygnał do fotoprotekcji SPF 50 codziennie i rozważenia serii zabiegów na
            przebarwienia. Ważny jest wzorzec: rozsiane plamy vs. „mapa” na policzkach (podejrzenie melasmy).
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-ink">UV-damage — głęboka melanina</h2>
          <p className="mt-3 text-muted-foreground">
            Warstwa, której nie widać gołym okiem — to Twoja „historia słońca”. Wysoki wynik u 30-latki oznacza wysokie ryzyko przyszłych
            plam i fotostarzenia, ale też potencjał ich zapobiegania.
          </p>
        </section>

        <DiagnostykaInlineCTA />

        <section>
          <h2 className="font-serif text-2xl text-ink">Naczynia i rumień</h2>
          <p className="mt-3 text-muted-foreground">
            Interpretujemy trzy rzeczy: gęstość, koncentrację (policzki vs. centrum twarzy) i tło. Skupienie w strefie T + wzmożone tło =
            wysokie prawdopodobieństwo trądziku różowatego.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-ink">Elastyczność i sprężystość</h2>
          <p className="mt-3 text-muted-foreground">
            Kutometr mierzy, jak skóra „wraca” po odkształceniu. Spadek 10–15% w ciągu 5 lat — norma. Spadek 25%+ — sygnał do zabiegów
            biostymulacyjnych, zanim ptoza stanie się widoczna.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-ink">Pory i tekstura</h2>
          <p className="mt-3 text-muted-foreground">
            Liczba widocznych porów rośnie z upływem lat wraz ze spadkiem napięcia okalającej je skóry. To parametr, który świetnie odpowiada
            na frakcyjne lasery i mikronakłuwanie — kolejne badanie za 3 miesiące pokaże realny efekt.
          </p>
        </section>

        <section aria-labelledby="faq" className="border-t border-border/60 pt-10">
          <h2 id="faq" className="font-serif text-2xl text-ink">Najczęstsze pytania o wyniki</h2>
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
