import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { LocalWarsawSection } from "@/components/site/LocalWarsawSection";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CheckCircle2, AlertTriangle, Clock, CalendarCheck, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IndicationContent {
  slug: string;
  title: string;
  short: string;
  h1: string;
  metaTitle: string;
  metaDesc: string;
  keyword: string;
  intro: string;
  types: { h3: string; text: string }[];
  methods: { h3: string; text: string; to?: string }[];
  timeline: string;
  contraindications: string[];
  priceNote: string;
  faq: { q: string; a: string }[];
}

export const CONTENT: Record<string, IndicationContent> = {
  "przebarwienia-warszawa": {
    slug: "przebarwienia-warszawa",
    title: "Przebarwienia",
    short: "Plamy posłoneczne, pozapalne i barwnikowe — diagnostyka i dobór lasera.",
    h1: "Usuwanie przebarwień w Warszawie",
    metaTitle: "Usuwanie przebarwień Warszawa — diagnostyka i leczenie | BMClinics",
    metaDesc:
      "Przebarwienia posłoneczne, hormonalne i pozapalne. Diagnostyka spektralna i dobór terapii lekarskiej w Warszawie — ul. Branickiego 10 (klinika ginekologii).",
    keyword: "usuwanie przebarwień Warszawa",
    intro:
      "Przebarwienia to nie jedna choroba — to kilka różnych mechanizmów, które wymagają różnych terapii. Zaczynamy od diagnostyki, dobieramy technologię, planujemy sezonowo.",
    types: [
      {
        h3: "Posłoneczne (soczewicowate)",
        text: "Skupiska melaniny w naskórku po latach ekspozycji na UV. Dobrze reagują na laser pikosekundowy i fotoodmładzanie.",
      },
      {
        h3: "Melasma / ostuda (hormonalna)",
        text: "Symetryczne plamy na policzkach i czole, często u kobiet w ciąży lub przyjmujących antykoncepcję. Wymagają ostrożnej, wielomiesięcznej strategii.",
      },
      {
        h3: "Pozapalne (po trądziku, po zabiegach)",
        text: "Ślady po stanach zapalnych skóry. Redukujemy stopniowo, chroniąc barierę hydrolipidową.",
      },
      {
        h3: "Różnicowanie ze zmianami barwnikowymi",
        text: "Znamiona i plamy soczewicowate wymagają wcześniejszej oceny dermatoskopowej — bezpieczeństwo przed skutecznością.",
      },
    ],
    methods: [
      {
        h3: "Laser pikosekundowy",
        text: "Rozbija głęboko osadzony pigment ultrakrótkimi impulsami — dla trwałych, ograniczonych plam.",
      },
      {
        h3: "Laser tulowy 1927 nm",
        text: "Płytka penetracja 0,1 mm — dla powierzchownych, rozlanych przebarwień i melasmy.",
        to: "/technologie/laser-tulowy",
      },
      {
        h3: "Terapie łączone i kwasy medyczne",
        text: "Peelingi zawodowe, mezoterapia rozjaśniająca, farmakoterapia miejscowa — jako uzupełnienie lasera.",
      },
      {
        h3: "Fotoprotekcja i pielęgnacja domowa",
        text: "SPF 50+ codziennie i aktywne składniki rozjaśniające — bez tego efekt lasera nie utrzyma się.",
      },
    ],
    timeline:
      "Standardowa seria: 3–5 sesji lasera co 4–6 tygodni + pielęgnacja domowa. Pełne efekty widoczne po 3–6 miesiącach. Zabiegi planujemy poza sezonem letnim, aby zminimalizować ryzyko nawrotu.",
    contraindications: [
      "aktywna opalenizna lub świeża ekspozycja na UV",
      "ciąża i karmienie (dla wybranych metod)",
      "izotretynoina doustna w ostatnich 6 miesiącach",
      "aktywne infekcje skóry w obszarze zabiegu",
      "fotodermatozy i niezdiagnozowane zmiany barwnikowe",
    ],
    priceNote:
      "Konsultacja z diagnostyką skóry: od 300 zł (odliczana od zabiegu). Sesja lasera pikosekundowego na przebarwienia twarzy: od 900 zł. Pakiety serii z rabatem.",
    faq: [
      {
        q: "Czy laser usuwa przebarwienia raz na zawsze?",
        a: "Laser trwale rozbija konkretny pigment, ale nowe przebarwienia mogą pojawić się przy braku fotoprotekcji lub zaburzeniach hormonalnych. Regularne SPF 50+ i badania kontrolne są kluczowe.",
      },
      {
        q: "Ile kosztuje usuwanie przebarwień w Warszawie?",
        a: "Sesja lasera pikosekundowego na twarz to koszt od 900 zł, seria 3–5 zabiegów mieści się w widełkach 2 700–5 500 zł. Ostateczna wycena po diagnostyce.",
      },
      {
        q: "Kiedy nie robić lasera na przebarwienia?",
        a: "Nie wykonujemy zabiegu na skórze świeżo opalonej, przy izotretynoinie doustnej w ostatnich 6 miesiącach, w ciąży i przy aktywnych infekcjach skóry.",
      },
      {
        q: "Czy melasmę można wyleczyć?",
        a: "Melasma jest przewlekła i skłonna do nawrotów. Skutecznie ją kontrolujemy — wielomiesięcznym połączeniem lasera tulowego, farmakoterapii i bezwzględnej fotoprotekcji.",
      },
      {
        q: "Ile trwa rekonwalescencja?",
        a: "Po laserze pikosekundowym: rumień do 24 h, drobne strupki 5–7 dni. Po laserze tulowym: łuszczenie 3–5 dni. Powrót do pracy zwykle następnego dnia.",
      },
    ],
  },
};

export const Route = createFileRoute("/wskazania/$slug")({
  loader: ({ params }) => {
    const data = CONTENT[params.slug];
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const canonical = `https://bmclinics.ai/wskazania/${loaderData.slug}`;
    return {
      meta: [
        { title: loaderData.metaTitle },
        { name: "description", content: loaderData.metaDesc },
        { name: "keywords", content: `${loaderData.keyword}, ${loaderData.title} Warszawa, Branickiego, klinika ginekologii` },
        { property: "og:title", content: loaderData.metaTitle },
        { property: "og:description", content: loaderData.metaDesc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: canonical },
        { name: "geo.region", content: "PL-MZ" },
        { name: "geo.placename", content: "Warszawa" },
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            url: canonical,
            name: loaderData.h1,
            about: { "@type": "MedicalCondition", name: loaderData.title },
            mainContentOfPage: loaderData.metaDesc,
            audience: { "@type": "MedicalAudience", geographicArea: { "@type": "City", name: "Warszawa" } },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: loaderData.faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Strona główna", item: "https://bmclinics.ai/" },
              { "@type": "ListItem", position: 2, name: "Wskazania", item: "https://bmclinics.ai/wskazania" },
              { "@type": "ListItem", position: 3, name: loaderData.title, item: canonical },
            ],
          }),
        },
      ],
    };
  },
  notFoundComponent: ComingSoonIndication,
  errorComponent: ({ error }) => (
    <main className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="font-serif text-3xl text-ink">Wystąpił błąd</h1>
      <p className="mt-3 text-sm text-muted-foreground">{error?.message ?? "Spróbuj ponownie."}</p>
    </main>
  ),
  component: IndicationPage,
});

function IndicationPage() {
  const data = Route.useLoaderData();

  return (
    <main className="bg-background">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-16 md:pt-24">
        <nav aria-label="Ścieżka" className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          <Link to="/" className="hover:text-ink">Start</Link> ·{" "}
          <Link to="/wskazania" className="hover:text-ink">Wskazania</Link> · {data.title}
        </nav>
        <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-ink md:text-5xl">{data.h1}</h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">{data.intro}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/konsultacja"
            className="inline-flex h-11 items-center justify-center rounded-md bg-ink px-6 text-sm tracking-wide text-alabaster hover:bg-ink/90"
          >
            Umów konsultację
          </Link>
          <Link
            to="/diagnostyka-skory-warszawa"
            className="inline-flex h-11 items-center justify-center rounded-md border border-border px-6 text-sm text-ink hover:bg-secondary"
          >
            Zacznij od diagnostyki
          </Link>
        </div>
      </section>

      {/* Rodzaje */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading eyebrow="Typologia" title="Rodzaje i skąd się biorą" />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {data.types.map((t: { h3: string; text: string }) => (
            <div key={t.h3} className="rounded-lg border border-border bg-card p-6 shadow-soft">
              <h3 className="font-serif text-lg text-ink">{t.h3}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Metody */}
      <section className="bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <SectionHeading
            eyebrow="Leczenie"
            title="Metody dobierane w klinice"
            description="Terapię projektujemy indywidualnie — poniższe metody łączymy w plan dopasowany do skóry i trybu życia."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {data.methods.map((m: { h3: string; text: string; to?: string }) => (
              <div key={m.h3} className="rounded-lg border border-border bg-card p-6 shadow-soft">
                <h3 className="font-serif text-lg text-ink">{m.h3}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{m.text}</p>
                {m.to && (
                  <Link to={m.to} className="mt-3 inline-block text-xs uppercase tracking-[0.25em] text-champagne hover:underline">
                    Poznaj technologię →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-4xl px-4 py-16">
        <SectionHeading eyebrow="Realne efekty" title="Czego oczekiwać po serii" />
        <p className="mt-6 text-base text-foreground/90">{data.timeline}</p>
      </section>

      {/* Przeciwwskazania */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <SectionHeading eyebrow="Bezpieczeństwo" title="Przeciwwskazania" />
        <ul className="mt-8 grid gap-2">
          {data.contraindications.map((c: string) => (
            <li key={c} className="flex items-start gap-3 rounded-md border border-border bg-card p-4 text-sm">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-champagne" aria-hidden />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Cennik note */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <SectionHeading eyebrow="Cennik" title="Koszt konsultacji i zabiegów w Warszawie" />
        <p className="mt-6 text-base text-foreground/90">{data.priceNote}</p>
        <Link to="/cennik" className="mt-4 inline-block text-sm text-champagne hover:underline">
          Pełny cennik →
        </Link>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <SectionHeading eyebrow="FAQ" title="Najczęstsze pytania" />
        <div className="mt-8 space-y-4">
          {data.faq.map((f: { q: string; a: string }) => (
            <details key={f.q} className="group rounded-lg border border-border bg-card p-5 shadow-soft">
              <summary className="cursor-pointer list-none font-serif text-lg text-ink">
                {f.q}
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Local */}
      <LocalWarsawSection procedureLabel={`terapię — ${data.title.toLowerCase()}`} />

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 py-24 text-center">
        <div className="rounded-lg border border-champagne/40 bg-card p-8 shadow-soft md:p-12">
          <div className="text-xs uppercase tracking-[0.3em] text-champagne">Umów wizytę</div>
          <h2 className="mt-3 font-serif text-2xl text-ink md:text-3xl">
            Zacznij od rozmowy — plan jest ważniejszy niż pojedynczy zabieg
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/konsultacja" className="inline-flex h-11 items-center justify-center rounded-md bg-ink px-6 text-sm text-alabaster hover:bg-ink/90">
              Umów konsultację
            </Link>
            <Link to="/lekarze" className="inline-flex h-11 items-center justify-center rounded-md border border-border px-6 text-sm text-ink hover:bg-secondary">
              Poznaj zespół
            </Link>
          </div>
          <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="size-4 text-champagne" aria-hidden />
            ul. Branickiego 10, Warszawa (klinika ginekologii)
          </p>
        </div>
      </section>
    </main>
  );
}
