import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import konturyAsset from "@/assets/kontury-lifting.png.asset.json";
import teksturaAsset from "@/assets/tekstura-hd.png.asset.json";
import dlonieAsset from "@/assets/dlonie-cialo.avif.asset.json";
import okoAsset from "@/assets/okolica-oka.avif.asset.json";
import komfortAsset from "@/assets/komfort.avif.asset.json";

export const Route = createFileRoute("/potrzeby")({
  head: () => ({
    meta: [
      { title: "Potrzeby — na czym się skupiamy | Beauty & Mind Clinic Siedlce" },
      {
        name: "description",
        content:
          "Pięć obszarów, w których pomagamy: kontury twarzy, tekstura skóry, rewitalizacja dłoni i ciała, okolica oka oraz komfort i pewność siebie.",
      },
      { property: "og:title", content: "Potrzeby — Beauty & Mind Clinic" },
      { property: "og:description", content: "Na czym się skupiamy — pięć obszarów naszej praktyki." },
      { property: "og:url", content: "/potrzeby" },
    ],
    links: [{ rel: "canonical", href: "/potrzeby" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Strona główna", item: "/" },
            { "@type": "ListItem", position: 2, name: "Potrzeby", item: "/potrzeby" },
          ],
        }),
      },
    ],
  }),
  component: PotrzebyPage,
});

type BulletItem = { title?: string; text: string };
type Tile = {
  nr: string;
  slug: string;
  title: string;
  lead: string;
  icon: string;
  
  bullets?: BulletItem[];
};

const TILES: Tile[] = [
  {
    nr: "01",
    slug: "przywrocenie-konturow",
    title: "Przywrócenie konturów",
    lead: "Lifting i owal",
    tagline: "LIFTING I OWAL",
    icon: konturyAsset.url,
    bullets: [
      { title: "Nieoperacyjny lifting", text: "redukcja « chomików »." },
      {
        title: "Bruzdy nosowo-wargowe i linie marionetki",
        text: "powstają, gdy opadają policzki (zanika owal i słabnie kolagen).",
      },
      {
        title: "Szyja i dekolt",
        text: "to niezwykle delikatna okolica, gdzie cienka, wiotka skóra pokryta przebarwieniami posłonecznymi najszybciej zdradza wiek kobiety.",
      },
    ],
  },
  { nr: "02", slug: "tekstura-hd", title: "Tekstura « HD »", lead: "Redukcja blizn i zmarszczek", icon: teksturaAsset.url },
  { nr: "03", slug: "rewitalizacja-dloni-i-ciala", title: "Rewitalizacja dłoni i ciała", lead: "Gęstość, jędrność", icon: dlonieAsset.url },
  { nr: "04", slug: "okolica-oka", title: "Okolica oka", lead: "Spojrzenie i powieki", icon: okoAsset.url },
  { nr: "05", slug: "komfort-i-pewnosc-siebie", title: "Komfort i pewność siebie", lead: "Dyskretne rozwiązania", icon: komfortAsset.url },
];

function PotrzebyPage() {
  return (
    <main>
      <section className="bg-secondary/50 py-16 md:py-24">
        <div className="container-luxury">
          <SectionHeading
            eyebrow="Zastosowania"
            title="Na czym się skupiamy?"
            description="Pięć obszarów, w których łączymy doświadczenie medyczne z technologią. Każdy protokół zaczyna się od konsultacji i diagnozy — dobór metody zawsze pod Państwa skórę i oczekiwania."
          />
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="container-luxury">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            {TILES.map((t, i) => (
              <article
                key={t.slug}
                id={t.slug}
                className={
                  "group rise-in tile-card relative p-6 transition-all duration-300 hover:bg-secondary/40 focus-within:ring-2 focus-within:ring-champagne/60 md:p-8 " +
                  (i === TILES.length - 1 && TILES.length % 2 === 1
                    ? "md:col-span-2 md:mx-auto md:w-1/2"
                    : "")
                }
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-[84px] w-[84px] shrink-0 items-center justify-center rounded-full border transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg"
                    style={{
                      background: "color-mix(in oklab, var(--champagne) 10%, transparent)",
                      borderColor: "color-mix(in oklab, var(--champagne) 30%, transparent)",
                    }}
                    aria-hidden="true"
                  >
                    <img
                      src={t.icon}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-110 motion-safe:animate-[float_6s_ease-in-out_infinite]"
                      style={{ animationDelay: `${i * 0.4}s` }}
                    />
                  </div>
                  {t.tagline && (
                    <span className="text-xs uppercase tracking-[0.3em] text-champagne">
                      {t.tagline}
                    </span>
                  )}
                </div>

                <div className="absolute right-6 top-6 text-xs uppercase tracking-[0.3em] text-champagne md:right-8 md:top-8">{t.nr}</div>

                <h2 className="gold-line mt-7 font-serif text-2xl text-foreground md:text-3xl">
                  {t.title}
                </h2>

                <p className="mt-3 font-sans text-sm tracking-wide text-muted-foreground">
                  {t.lead}
                </p>

                {t.bullets && (
                  <ul className="mt-4 space-y-2 font-sans text-sm leading-relaxed text-muted-foreground">
                    {t.bullets.map((b, bi) => (
                      <li key={bi} className="flex gap-2">
                        <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-champagne" aria-hidden="true" />
                        <span>
                          {b.title && <strong className="font-medium text-foreground">{b.title}</strong>}
                          {b.title && " — "}
                          {b.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
