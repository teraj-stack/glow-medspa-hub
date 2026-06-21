import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Sparkles, Wand2, Hand, Eye, HeartHandshake } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import PakietCard from "@/components/PakietCard";


export const Route = createFileRoute("/rozwiazania")({
  head: () => ({
    meta: [
      { title: "Rozwiązania — Beauty & Mind Clinic" },
      {
        name: "description",
        content:
          "Pięć obszarów naszej praktyki: lifting i owal, tekstura HD, rewitalizacja dłoni, okolica oka oraz komfort i pewność siebie.",
      },
      { property: "og:title", content: "Rozwiązania — Beauty & Mind Clinic" },
      { property: "og:description", content: "Pięć obszarów naszej praktyki w estetyce «cichego luksusu»." },
      { property: "og:url", content: "/rozwiazania" },
    ],
    links: [{ rel: "canonical", href: "/rozwiazania" }],
  }),
  component: RozwiazaniaPage,
});

type Tile = {
  nr: string;
  title: string;
  subtitle: string;
  Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
};

const TILES: Tile[] = [
  { nr: "02", title: "Redukcja blizn, zmarszczek", subtitle: "Tekstura « HD »", Icon: Wand2 },
  { nr: "03", title: "Gęstość, jędrność", subtitle: "Rewitalizacja dłoni i ciała", Icon: Hand },
  { nr: "04", title: "Spojrzenie i powieki", subtitle: "Okolica oka", Icon: Eye },
  { nr: "05", title: "Dyskretne rozwiązania", subtitle: "Komfort i pewność siebie", Icon: HeartHandshake },
];

function useInView<T extends Element>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, ...options },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [options]);
  return { ref, inView };
}

function RozwiazaniaPage() {
  return (
    <main className="min-h-screen bg-background pt-28 md:pt-36 pb-20">
      {/* HERO — Inteligentny Dobór Terapii */}
      <section>
        <div className="container">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-sm border border-champagne/30 bg-gradient-to-b from-background via-card to-background p-8 md:p-16">
              {/* Subtelny gradient radialny w prawym górnym rogu */}
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  background:
                    "radial-gradient(circle at top right, color-mix(in oklab, var(--champagne) 25%, transparent), transparent 60%)",
                }}
                aria-hidden
              />

              <div className="relative">
                {/* Etykieta nadtytułowa z ikoną Sparkles */}
                <p className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-champagne font-body">
                  <Sparkles className="size-4" aria-hidden />
                  Body Longevity · Inteligentny Dobór Terapii
                </p>

                {/* Główny nagłówek serif */}
                <h1 className="font-serif text-4xl md:text-6xl text-foreground leading-tight text-balance">
                  Twój personalny plan «&nbsp;Body Longevity&nbsp;» w 60 sekund
                </h1>

                {/* Akapit body */}
                <p className="mt-6 max-w-2xl text-muted-foreground text-lg font-body leading-relaxed">
                  Autorska metoda lek. Jana Bujok komponuje optymalne sekwencje «&nbsp;Body Longevity&nbsp;»
                  z naszego parku technologii na podstawie dokładnej diagnozy w gabinecie.
                  Koniec z metodą prób i błędów — Twój plan terapeutyczny jest
                  oparty na faktach, precyzyjnych danych i wieloletnim doświadczeniu klinicznym.
                </p>

                {/* Przycisk CTA */}
                <Link
                  to="/"
                  hash="rezerwacja"
                  className="mt-10 inline-flex items-center gap-3 bg-champagne text-accent-foreground rounded-sm px-8 py-4 hover:bg-champagne-light transition-colors duration-500 tracking-wide font-body"
                >
                  Nasz sekret — lek. Jan Bujok
                  <ArrowRight size={16} aria-hidden />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Filozofia Body Longevity */}
      <section className="container mt-20 md:mt-28">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-xs tracking-[0.3em] uppercase text-champagne mb-4 font-body">
              Filozofia « Body Longevity »
            </div>
            <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-6 leading-tight">
              Dlaczego łączymy technologie w sekwencje?
            </h2>
            <p className="text-muted-foreground text-lg font-body leading-relaxed">
              Ciało to wielowarstwowa struktura — a piękno to harmonia jego warstw.
              Lasery pracują nad skórą, HIFU zagęszcza i wzmacnia skórę głęboką
              i powięź SMAS nad, a HIFEM nad mięśniami pod obszarem. Aplikacja « MySkinCode »
              komponuje te elementy w autorskie sekwencje&nbsp;« Body Longevity »,
              które pracują razem na Twój wynik równocześnie.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Tile grid */}

      <section className="bg-background py-16 md:py-24">
        <div className="container-luxury">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            <PakietCard
              subtitle="Pakiet A — Lifting & kontur"
              title="Architektura twarzy"
              protocol={"«\u00A0Głęboki lifting 4D\u00A0»"}
              protocolDescription="Połączenie stymulacji mięśniowej (HIFEM+MSF+RH) z przebudową struktur skóry (HIFU). Działamy jednocześnie nad mięśniami, powięzią i kolagenem — efekt liftingu bez efektu maski."
              technologies={["Laser tulowy", "Ultradźwięki zogniskowane (HIFU)", "Laser pikosekundowy", "RF Mikroigłowa"]}
            />

            <ul className="contents">
              {TILES.map((tile, i) => (
                <TileCard key={tile.nr} tile={tile} index={i} isFifth={false} />
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-background">
        <div className="container-luxury py-16 text-center md:py-20">
          <h2 className="font-serif text-foreground">Porozmawiajmy o Państwa potrzebach</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Konsultacja to pierwszy krok — wspólnie dobierzemy najlepsze rozwiązania.
          </p>
          <Link
            to="/"
            hash="rezerwacja"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-md bg-champagne px-8 text-sm tracking-wide text-accent-foreground transition hover:bg-champagne-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2"
          >
            Umów konsultację
          </Link>
        </div>
      </section>
    </main>
  );
}

function TileCard({ tile, index, isFifth }: { tile: Tile; index: number; isFifth: boolean }) {
  const { ref, inView } = useInView<HTMLLIElement>();
  const { Icon } = tile;
  return (
    <li
      ref={ref}
      className={`${isFifth ? "lg:col-start-2" : ""} group relative flex flex-col rounded-2xl border border-border bg-card p-8 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-champagne/50 hover:shadow-xl focus-within:ring-2 focus-within:ring-champagne focus-within:ring-offset-2`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(2rem)",
        transition: `opacity 700ms ease-out ${index * 100}ms, transform 700ms ease-out ${index * 100}ms, border-color 300ms, box-shadow 300ms`,
      }}
      aria-labelledby={`tile-${tile.nr}-title`}
    >
      <span aria-hidden className="absolute right-6 top-6 font-serif text-5xl text-champagne/40">
        {tile.nr}
      </span>
      <span className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full border border-champagne/30 bg-champagne/5 text-champagne transition-transform duration-500 group-hover:scale-110">
        <Icon className="size-7" aria-hidden />
      </span>
      <h2 id={`tile-${tile.nr}-title`} className="mb-2 font-serif text-2xl text-foreground">
        {tile.title}
      </h2>
      <p className="text-sm leading-relaxed text-muted-foreground">{tile.subtitle}</p>
    </li>
  );
}
