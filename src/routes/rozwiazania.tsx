import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Sparkles, Wand2, Hand, Eye, HeartHandshake } from "lucide-react";

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
  { nr: "01", title: "Lifting i owal", subtitle: "Przywrócenie konturów", Icon: Sparkles },
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
    <main>
      {/* Hero */}
      <section className="border-b border-border bg-background">
        <div className="container-luxury py-16 md:py-24">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-champagne">Rozwiązania</p>
          <h1 className="gold-line font-serif text-foreground">
            Pięć obszarów, w których łączymy doświadczenie&nbsp;z technologią
          </h1>
          <p className="mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
            Każdy protokół zaczyna się od konsultacji i diagnozy — dobór metody zawsze pod
            Państwa skórę i oczekiwania.
          </p>
        </div>
      </section>

      {/* Tile grid */}
      <section className="bg-background py-16 md:py-24">
        <div className="container-luxury">
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {TILES.map((tile, i) => (
              <TileCard key={tile.nr} tile={tile} index={i} isFifth={i === 4} />
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-background">
        <div className="container-luxury py-16 text-center md:py-20">
          <h2 className="font-serif text-foreground">Porozmawiajmy o Państwa potrzebach</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Konsultacja to pierwszy krok — wspólnie dobierzemy najlepszą ścieżkę.
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
