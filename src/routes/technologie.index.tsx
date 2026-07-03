import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { TechCard } from "@/components/site/TechCard";
import { TECHNOLOGIES, type Technology } from "@/data/technologies";
import konturyAsset from "@/assets/szkic-twarz-kontur.png.asset.json";
import teksturaAsset from "@/assets/tekstura-hd-clean.png.asset.json";
import dlonieAsset from "@/assets/dlonie-cialo-szkic.png.asset.json";
import okoAsset from "@/assets/oko-szkic-v2.webp";
import bodyContourAsset from "@/assets/sylwetka-body-contour-v2.png.asset.json";
import { withOgVersion } from "@/config/social-preview";
import ogCard from "@/assets/og/index.jpg";

export const Route = createFileRoute("/technologie/")({
  head: () => ({
    meta: [
      { title: "Technologie | BMClinics.ai Warszawa" },
      {
        name: "description",
        content:
          "Park technologii uporządkowany według potrzeb pacjenta — od liftingu, przez teksturę HD, po modelowanie sylwetki. Kontynuacja sekcji Rozwiązania.",
      },
      { property: "og:title", content: "Technologie — BMClinics.ai" },
      { property: "og:description", content: "Technologie dobrane do pięciu obszarów naszej praktyki." },
      { property: "og:url", content: "https://bmclinics.ai/technologie" },
      { property: "og:image", content: withOgVersion(`https://bmclinics.ai${ogCard}`) },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "BMClinics.ai — Warszawa (Wilanów), ul. Branickiego 10" },
      { name: "twitter:image", content: withOgVersion(`https://bmclinics.ai${ogCard}`) },
    ],
    links: [
      { rel: "canonical", href: "https://bmclinics.ai/technologie" },
      // Preload pierwszej ikony grupy — kandydat LCP po nagłówku H1
      {
        rel: "preload",
        as: "image",
        href: konturyAsset.url,
        fetchpriority: "high",
      },
    ],
  }),
  component: TechnologiesPage,
});


type NeedGroup = {
  nr: string;
  slug: string;
  tagline: string;
  title: string;
  icon: string;
  lead: string;
  // slugs w kolejności priorytetu klinicznego (pierwszy = najważniejszy)
  techSlugs: string[];
  highlight?: string; // wyróżniony slug — wyświetlany jako rekomendacja #1
};

const GROUPS: NeedGroup[] = [
  {
    nr: "01",
    slug: "przywrocenie-konturow",
    tagline: "LIFTING I OWAL",
    title: "Przywrócenie konturów",
    icon: konturyAsset.url,
    lead:
      "Najskuteczniejszym narzędziem nieoperacyjnego liftingu jest HIFU — dociera do warstwy SMAS i pracuje w tej samej płaszczyźnie co nici. Następnie pikosekundowy laser w trybach frakcyjnych przebudowuje kolagen powierzchowny i ujednolica koloryt.",
    highlight: "hifu",
    techSlugs: ["hifu", "picoking", "virtue-rf"],
  },
  {
    nr: "02",
    slug: "tekstura-hd",
    tagline: "REDUKCJA BLIZN I ZMARSZCZEK",
    title: "Tekstura « HD »",
    icon: teksturaAsset.url,
    lead:
      "Praca nad porami, bliznami i drobnymi zmarszczkami — łączymy frakcyjną fototermolizę z efektem fotoakustycznym i regeneracją w niskiej temperaturze fizjologicznej.",
    techSlugs: ["picoking", "fusion-plasma", "peeling-weglowy-laserowy", "ipl-bm14", "virtue-rf", "laser-tulowy"],
  },
  {
    nr: "03",
    slug: "rewitalizacja-dloni",
    tagline: "GĘSTOŚĆ, JĘDRNOŚĆ",
    title: "Rewitalizacja dłoni i ciała",
    icon: dlonieAsset.url,
    lead:
      "Dłonie, ramiona, wewnętrzna strona ud, brzuch — odbudowa gęstości skóry i jednolitego kolorytu. W tej strefie najskuteczniejszy jest laser pikosekundowy, następnie zimna plazma atmosferyczna, a na trzecim miejscu fototerapia LED. Pozostałe narzędzia nie przynoszą tu oczekiwanego efektu.",
    techSlugs: ["picoking", "fusion-plasma", "terapia-led"],
  },
  {
    nr: "04",
    slug: "okolica-oka",
    tagline: "KONTUR OKA · BLASK SPOJRZENIA",
    title: "Okolica oka",
    icon: okoAsset,
    lead:
      "Cienka skóra powieki wymaga technologii precyzyjnych i bezpiecznych. HIFU z dedykowaną sondą podnosi opadającą powiekę i pracuje na strukturze podporowej, a RF mikroigłowa z głowicą do okolicy oka zagęszcza skórę i redukuje « kurze łapki ».",
    highlight: "hifu",
    techSlugs: ["hifu", "virtue-rf"],
  },
  {
    nr: "05",
    slug: "modelowanie-sylwetki",
    tagline: "BODY CONTOUR",
    title: "Modelowanie sylwetki",
    icon: bodyContourAsset.url,
    lead:
      "Budowa gorsetu mięśniowego i redukcja niechcianej tkanki tłuszczowej w technologii EMS+RF, uzupełniona o regenerację LED i ujędrnienie głębokich warstw skóry.",
    techSlugs: ["renasculpt", "hifu", "terapia-led"],
  },
];

// Technologie poza pięcioma kafelkami potrzeb — np. trwała redukcja owłosienia, naczynka
const STANDALONE_SLUGS = ["alexpulse-cl300"];

function getTech(slug: string): Technology | undefined {
  return TECHNOLOGIES.find((t) => t.slug === slug);
}

function TechnologiesPage() {
  const usedSlugs = new Set<string>([
    ...GROUPS.flatMap((g) => g.techSlugs),
    ...STANDALONE_SLUGS,
  ]);
  const otherTechs = TECHNOLOGIES.filter((t) => !usedSlugs.has(t.slug));
  const standalone = STANDALONE_SLUGS.map(getTech).filter(Boolean) as Technology[];

  return (
    <>
      <section className="bg-secondary/40 py-10 md:py-24">
        <div className="container-luxury">
          <SectionHeading
            eyebrow="TECHNOLOGIE"
            title="Park technologii dobrany pod Państwa potrzeby"
            description="Kontynuacja sekcji Potrzeby i Rozwiązania — te same pięć obszarów, tym razem od strony narzędzi. Pierwsza pozycja na liście to nasza rekomendacja kliniczna nr 1 dla danego obszaru."
            as="h1"
          />
        </div>
      </section>

      {/* MySkinCode.ai — silnik AI koordynujący opiekę */}
      <section className="container-luxury py-12 md:py-16">
        <div className="rounded-lg border border-champagne/40 bg-secondary/30 p-6 md:p-10">
          <span className="text-xs uppercase tracking-[0.3em] text-champagne whitespace-pre-line">
            {"MySkinCode.ai\n"}
          </span>
          <h2 className="gold-line mt-2 font-serif text-2xl text-ink md:text-3xl">
            Trzy technologie, które łączymy w większości przypadków
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Z mojego doświadczenia kolejność zimna plazma → laser pikosekundowy → fototerapia LED to podstawowe, uniwersalne rozwiązanie dla większości pacjentek. Łączenie tych trzech narzędzi pozwala uzyskać efekt, który wcześniej wymagał dwukrotnie dłuższego czasu rekonwalescencji. Całą sekwencję planuje i koordynuje MySkinCode.ai — silnik AI, który umożliwia zespołowi wspólną opiekę nad pacjentem.
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Dzięki MySkinCode.ai buduję zespół, który szybko zdobywa wiedzę i umiejętności, ujednolica poziom biegłości w najnowszych technologiach laserowych oraz hi-tech, a jednocześnie daje pacjentowi i każdemu członkowi zespołu poczucie bezpieczeństwa. Narzędzie, które miało wyjściowo zastępować 10-letnie doświadczenie zawodowe, stało się systemem, który kształci i rozwija — umożliwiając ustalenie planu zabiegowego nawet na 3–6 miesięcy.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Zimna plazma",
                desc: "Co drugi dzień. Indukuje procesy regeneracyjne i aktywuje komórki macierzyste skóry.",
              },
              {
                step: "02",
                title: "Laser pikosekundowy",
                desc: "Co 10 dni. Po 2 sesjach pracuje na pełnej, przygotowanej skórze — bez ryzyka odczynu zapalnego.",
              },
              {
                step: "03",
                title: "Fototerapia LED",
                desc: "Co drugi dzień. Pobudza regenerację i aktywuje układ STEM — skraca okres gojenia o około 40%.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-lg border border-border bg-card p-5 shadow-soft"
              >
                <div className="text-xs uppercase tracking-[0.3em] text-champagne">
                  Krok {item.step}
                </div>
                <h3 className="mt-2 font-serif text-xl text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/75">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-lg border border-champagne/30 bg-ink p-6 text-alabaster md:p-8">
            <div className="text-xs uppercase tracking-[0.3em] text-champagne">
              Efekt łączenia
            </div>
            <p className="mt-3 text-sm leading-relaxed text-alabaster/85 md:text-base">
              Po 2 zabiegach laserem pikosekundowym (około 3 tygodniach) uzyskujemy efekt porównywalny z 6 tygodniami klasycznego czasu rekonwalescencji przy zabiegach wyłącznie laserowych. Już po 3 tygodniach pracy w bazowym modelu opieki widoczny rezultat jest lepszy niż przy zabiegach prowadzonych pojedynczo, bez łączenia technologii.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-alabaster/85 md:text-base">
              Dla pacjenta to krótszy, bardziej komfortowy i ekonomicznie korzystniejszy proces. Po zakończeniu fazy wstępnej przechodzimy do zabiegów podtrzymujących i utrwalających rezultat.
            </p>
          </div>
        </div>
      </section>

      {GROUPS.map((group) => {
        const techs = group.techSlugs.map(getTech).filter(Boolean) as Technology[];
        if (!techs.length) return null;
        return (
          <section
            key={group.slug}
            id={group.slug}
            className="container-luxury py-12 md:py-16"
          >
            <div className="group mb-8 flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
              <a
                href={`/rozwiazania#${group.slug}`}
                aria-label={`Zobacz rozwiązania: ${group.title}`}
                title={`Przejdź do rozwiązań: ${group.title}`}
                className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
              >
                <div
                  className="flex h-[84px] w-[84px] shrink-0 items-center justify-center rounded-full border transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg"
                  style={{
                    background: "color-mix(in oklab, var(--champagne) 10%, transparent)",
                    borderColor: "color-mix(in oklab, var(--champagne) 30%, transparent)",
                  }}
                >
                  <img
                    src={group.icon}
                    alt=""
                    loading="lazy"
                    fetchPriority="low"
                    decoding="async"
                    width={84}
                    height={84}
                    className="h-full w-full object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-110 motion-safe:animate-[float_6s_ease-in-out_infinite]"
                  />
                </div>
              </a>

              <div className="flex-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-xs uppercase tracking-[0.3em] text-champagne">
                    {group.nr} · {group.tagline}
                  </span>
                </div>
                <h2 className="gold-line mt-2 font-serif text-2xl text-ink md:text-3xl">
                  {group.title}
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                  {group.lead}
                </p>
              </div>
            </div>

            <div className="tile-grid">
              {techs.map((t, i) => (
                <div key={t.slug} className="relative">
                  {(group.highlight ? t.slug === group.highlight : i === 0) && (
                    <span className="absolute -top-3 left-4 z-10 rounded-sm bg-champagne px-2 py-0.5 text-[10px] uppercase tracking-[0.25em] text-accent-foreground">
                      Rekomendacja #1
                    </span>
                  )}
                  <TechCard tech={t} />
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {standalone.length > 0 && (
        <section className="container-luxury py-12 md:py-16">
          <div className="mb-8">
            <span className="text-xs uppercase tracking-[0.3em] text-champagne">
              Pozostałe wskazania
            </span>
            <h2 className="gold-line mt-2 font-serif text-2xl text-ink md:text-3xl">
              Trwała redukcja owłosienia i zmiany naczyniowe
            </h2>
          </div>
          <div className="tile-grid">
            {standalone.map((t) => <TechCard key={t.slug} tech={t} />)}
          </div>
        </section>
      )}

      {otherTechs.length > 0 && (
        <section className="container-luxury py-12 md:py-16">
          <div className="mb-8">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Pełny katalog
            </span>
            <h2 className="gold-line mt-2 font-serif text-2xl text-ink md:text-3xl">
              Pozostałe technologie
            </h2>
          </div>
          <div className="tile-grid">
            {otherTechs.map((t) => <TechCard key={t.slug} tech={t} />)}
          </div>
        </section>
      )}
    </>
  );
}
