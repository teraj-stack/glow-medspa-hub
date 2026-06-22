import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { TechCard } from "@/components/site/TechCard";
import { TECHNOLOGIES, type Technology } from "@/data/technologies";
import konturyAsset from "@/assets/szkic-twarz-kontur.png.asset.json";
import teksturaAsset from "@/assets/tekstura-hd-clean.png.asset.json";
import dlonieAsset from "@/assets/dlonie-cialo-szkic.png.asset.json";
import okoAsset from "@/assets/oko-szkic-v2.png.asset.json";
import bodyContourAsset from "@/assets/sylwetka-body-contour-v2.png.asset.json";

export const Route = createFileRoute("/technologie/")({
  head: () => ({
    meta: [
      { title: "Technologie | Beauty & Mind Clinic Siedlce" },
      {
        name: "description",
        content:
          "Park technologii uporządkowany według potrzeb pacjenta — od liftingu HIFU, przez teksturę HD, po modelowanie sylwetki. Kontynuacja sekcji Potrzeby i Rozwiązania.",
      },
      { property: "og:title", content: "Technologie — Beauty & Mind Clinic" },
      { property: "og:description", content: "Technologie dobrane do pięciu obszarów naszej praktyki." },
      { property: "og:url", content: "https://bmclinics.ai/technologie" },
    ],
    links: [{ rel: "canonical", href: "https://bmclinics.ai/technologie" }],
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
    techSlugs: ["hifu", "picoking", "virtue-rf", "laser-tulowy"],
  },
  {
    nr: "02",
    slug: "tekstura-hd",
    tagline: "REDUKCJA BLIZN I ZMARSZCZEK",
    title: "Tekstura « HD »",
    icon: teksturaAsset.url,
    lead:
      "Praca nad porami, bliznami i drobnymi liniami — łączymy frakcyjną fototermolizę z efektem fotoakustycznym i regeneracją w niskiej temperaturze fizjologicznej.",
    techSlugs: ["picoking", "laser-tulowy", "virtue-rf", "fusion-plasma", "peeling-weglowy-laserowy", "ipl-bm14"],
  },
  {
    nr: "03",
    slug: "rewitalizacja-dloni",
    tagline: "GĘSTOŚĆ, JĘDRNOŚĆ",
    title: "Rewitalizacja dłoni i ciała",
    icon: dlonieAsset.url,
    lead:
      "Dłonie, ramiona, wewnętrzna strona ud, brzuch — odbudowa gęstości skóry i napięcia powięziowego. HIFU pracuje głęboko, RF mikroigłowa i lasery przebudowują warstwę skórno-naskórkową.",
    techSlugs: ["hifu", "virtue-rf", "laser-tulowy", "picoking"],
  },
  {
    nr: "04",
    slug: "okolica-oka",
    tagline: "KONTUR OKA · BLASK SPOJRZENIA",
    title: "Okolica oka",
    icon: okoAsset.url,
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
      <section className="bg-secondary/40 py-16 md:py-24">
        <div className="container-luxury">
          <SectionHeading
            eyebrow="TECHNOLOGIE"
            title="Park technologii dobrany pod Państwa potrzeby"
            description="Kontynuacja sekcji Potrzeby i Rozwiązania — te same pięć obszarów, tym razem od strony narzędzi. Pierwsza pozycja na liście to nasza rekomendacja kliniczna nr 1 dla danego obszaru."
            as="h1"
          />
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
            <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
              <div
                className="flex h-[84px] w-[84px] shrink-0 items-center justify-center rounded-full border"
                style={{
                  background: "color-mix(in oklab, var(--champagne) 10%, transparent)",
                  borderColor: "color-mix(in oklab, var(--champagne) 30%, transparent)",
                }}
                aria-hidden="true"
              >
                <img
                  src={group.icon}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-contain p-2"
                />
              </div>
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
