import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Sun } from "lucide-react";

const CANONICAL = "https://bmclinics.ai/wskazania";
const TITLE = "Wskazania — jakie problemy skóry leczymy w Warszawie | BMClinics";
const DESCRIPTION =
  "Diagnostyka i leczenie przebarwień skóry — dobór terapii lekarskiej do konkretnego wskazania. Konsultacje w Warszawie, ul. Branickiego 10 (klinika ginekologii). Kolejne wskazania w przygotowaniu.";

interface Indication {
  slug: string;
  title: string;
  short: string;
  icon: typeof Sun;
}

const INDICATIONS: Indication[] = [
  {
    slug: "przebarwienia-warszawa",
    title: "Przebarwienia",
    short: "Plamy posłoneczne, pozapalne i barwnikowe — diagnostyka i dobór lasera.",
    icon: Sun,
  },
];

export const Route = createFileRoute("/wskazania/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: CANONICAL },
      { name: "geo.region", content: "PL-MZ" },
      { name: "geo.placename", content: "Warszawa" },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          url: CANONICAL,
          name: TITLE,
          description: DESCRIPTION,
          about: INDICATIONS.map((i) => ({ "@type": "MedicalCondition", name: i.title })),
        }),
      },
    ],
  }),
  component: WskazaniaHub,
});

function WskazaniaHub() {
  return (
    <main className="bg-background">
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-16 md:pt-24">
        <span className="inline-flex items-center gap-2 rounded-full border border-champagne/40 bg-champagne/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-champagne">
          Warszawa · ul. Branickiego 10
        </span>
        <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-ink md:text-5xl">
          Wskazania — od problemu do właściwej technologii
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
          Nie zaczynamy od urządzenia — zaczynamy od Twojej skóry. Wybierz wskazanie, a pokażemy,
          które technologie zabiegowe realnie je adresują i jak wygląda plan leczenia w warunkach klinicznych.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {INDICATIONS.map(({ slug, title, short, icon: Icon }) => (
            <Link
              key={slug}
              to="/wskazania/$slug"
              params={{ slug }}
              className="group rounded-lg border border-border bg-card p-6 shadow-soft transition hover:border-champagne/60"
            >
              <Icon className="size-6 text-champagne" aria-hidden />
              <h2 className="mt-4 font-serif text-xl text-ink">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{short}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs uppercase tracking-[0.25em] text-champagne group-hover:underline">
                Zobacz plan leczenia →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-24">
        <SectionHeading
          eyebrow="Nie wiesz, od czego zacząć?"
          title="Najpierw badanie skóry, potem decyzja o zabiegu"
          description="Diagnostyka skóry twarzy w Warszawie pozwala precyzyjnie zakwalifikować wskazanie i zbudować kolejność zabiegów."
        />
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/diagnostyka-skory-warszawa"
            className="inline-flex h-11 items-center justify-center rounded-md bg-ink px-6 text-sm tracking-wide text-alabaster hover:bg-ink/90"
          >
            Diagnostyka skóry Warszawa
          </Link>
          <Link
            to="/konsultacja"
            className="inline-flex h-11 items-center justify-center rounded-md border border-border px-6 text-sm text-ink hover:bg-secondary"
          >
            Umów konsultację
          </Link>
        </div>
      </section>
    </main>
  );
}
