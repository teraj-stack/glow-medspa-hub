import { createFileRoute, Link } from "@tanstack/react-router";

const CANONICAL = "https://bmclinics.ai/lekarze/halina-gabara";

export const Route = createFileRoute("/lekarze/halina-gabara")({
  head: () => ({
    meta: [
      { title: "lek. Halina Gabara — Beauty & Mind Clinic Siedlce" },
      {
        name: "description",
        content:
          "lek. Halina Gabara — medycyna estetyczna w Siedlcach. Doświadczenie z warszawskich klinik premium, indywidualnie planowane terapie, bezpieczeństwo i przewidywalny efekt.",
      },
      { property: "og:title", content: "lek. Halina Gabara — Beauty & Mind Clinic" },
      {
        property: "og:description",
        content:
          "Profil lekarza prowadzącego w Beauty & Mind Clinic Siedlce — specjalizacje, podejście do pacjenta i ścieżka kliniczna.",
      },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: CANONICAL },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Physician",
          name: "lek. Halina Gabara",
          medicalSpecialty: "Aesthetic Medicine",
          worksFor: {
            "@type": "MedicalClinic",
            name: "Beauty & Mind Clinic",
            address: { "@type": "PostalAddress", addressLocality: "Siedlce", addressCountry: "PL" },
          },
          url: CANONICAL,
        }),
      },
    ],
  }),
  component: HalinaGabaraPage,
});

const SPECJALIZACJE = [
  "Konsultacje medycyny estetycznej i planowanie terapii",
  "Toksyna botulinowa — leczenie mimicznych zmarszczek",
  "Wolumetria i modelowanie konturu twarzy kwasem hialuronowym",
  "Mezoterapia rewitalizacyjna i biostymulatory tkankowe",
  "Terapie przebarwień i melasmy",
  "Programy poprawy jakości i napięcia skóry",
];

const WYKSZTALCENIE = [
  "Dyplom lekarza, Uniwersytet Medyczny",
  "Szkolenia certyfikowane z toksyny botulinowej i wypełniaczy HA",
  "Kursy zaawansowanej wolumetrii i pełnotwarzowego modelowania",
  "Cykliczne szkolenia z zakresu bezpieczeństwa zabiegów iniekcyjnych",
];

function HalinaGabaraPage() {
  return (
    <main className="bg-background">
      {/* Hero */}
      <section className="container-luxury pt-16 md:pt-24">
        <nav aria-label="Okruszki" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Link to="/lekarze" className="transition-colors hover:text-foreground">
            Zespół kliniki
          </Link>
          <span aria-hidden className="mx-2">/</span>
          <span className="text-foreground/70">lek. Halina Gabara</span>
        </nav>

        <div className="mt-10 grid gap-12 md:mt-14 md:grid-cols-[auto,1fr] md:items-start md:gap-16">
          <div
            aria-hidden
            className="mx-auto flex size-40 items-center justify-center rounded-full bg-secondary font-serif text-4xl text-muted-foreground md:mx-0 md:size-48"
          >
            hG
          </div>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Lekarz prowadzący
            </p>
            <h1 className="mt-3 font-serif text-4xl tracking-tight text-foreground md:text-5xl">
              lek. Halina Gabara
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Lekarz medycyny estetycznej
            </p>
            <p className="mt-6 max-w-xl text-balance text-base leading-relaxed text-foreground/85 md:text-lg">
              Pracuję tak, jak nauczyłam się w warszawskich klinikach premium —
              z uważnością na proporcje twarzy, bezpieczeństwo pacjenta i wynik,
              który nie zdradza, że był efektem zabiegu.
            </p>
          </div>
        </div>
      </section>

      {/* Filozofia pracy */}
      <section className="container-luxury py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-[1fr,2fr] md:gap-16">
          <h2 className="font-serif text-2xl tracking-tight text-foreground md:text-3xl">
            Filozofia pracy
          </h2>
          <div className="space-y-5 text-base leading-relaxed text-foreground/85">
            <p>
              Medycyna estetyczna jest dla mnie procesem, a nie pojedynczym
              zabiegiem. Każdą terapię zaczynam od pełnej konsultacji, w której
              rozumiemy, co rzeczywiście jest celem pacjenta — często okazuje
              się, że jest to coś innego niż początkowa prośba o konkretny
              zabieg.
            </p>
            <p>
              Plan układam stopniowo, w horyzoncie miesięcy, łącząc techniki,
              które wspierają się nawzajem. Zależy mi na efekcie spójnym
              z twarzą pacjenta — dyskretnym, naturalnym i powtarzalnym
              w czasie.
            </p>
            <p>
              Nie pracuję z nazwami handlowymi urządzeń jako argumentem
              marketingowym. Liczy się dobrze postawiona diagnoza, technika
              wykonania i opieka pozabiegowa — to one decydują o jakości.
            </p>
          </div>
        </div>
      </section>

      {/* Specjalizacje */}
      <section className="border-t border-border/60 bg-card/40">
        <div className="container-luxury py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-[1fr,2fr] md:gap-16">
            <h2 className="font-serif text-2xl tracking-tight text-foreground md:text-3xl">
              Specjalizacje
            </h2>
            <ul className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
              {SPECJALIZACJE.map((s) => (
                <li
                  key={s}
                  className="flex gap-3 text-sm leading-relaxed text-foreground/85"
                >
                  <span
                    aria-hidden
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground/40"
                  />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Doświadczenie */}
      <section className="container-luxury py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-[1fr,2fr] md:gap-16">
          <h2 className="font-serif text-2xl tracking-tight text-foreground md:text-3xl">
            Doświadczenie
          </h2>
          <div className="space-y-5 text-base leading-relaxed text-foreground/85">
            <p>
              Ścieżkę zawodową budowałam przez lata pracy w klinikach
              warszawskich, gdzie standard opieki i tempo wprowadzania nowych
              technik wyznaczają poziom polskiej medycyny estetycznej.
            </p>
            <p>
              W Beauty &amp; Mind Clinic w Siedlcach prowadzę pacjentów
              w identycznym standardzie — od konsultacji, przez plan terapii,
              po opiekę pozabiegową i wizyty kontrolne.
            </p>
          </div>
        </div>
      </section>

      {/* Wykształcenie i certyfikaty */}
      <section className="border-t border-border/60 bg-card/40">
        <div className="container-luxury py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-[1fr,2fr] md:gap-16">
            <h2 className="font-serif text-2xl tracking-tight text-foreground md:text-3xl">
              Wykształcenie i certyfikaty
            </h2>
            <ul className="space-y-4">
              {WYKSZTALCENIE.map((w) => (
                <li
                  key={w}
                  className="border-l border-border/70 pl-5 text-sm leading-relaxed text-foreground/85"
                >
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-luxury py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Konsultacja
          </p>
          <h2 className="mt-4 font-serif text-3xl tracking-tight text-foreground md:text-4xl">
            Umów wizytę u lek. Haliny Gabary
          </h2>
          <p className="mt-5 text-balance text-base leading-relaxed text-muted-foreground md:text-lg">
            Spotkanie konsultacyjne to pełna analiza twarzy, omówienie potrzeb
            i propozycja planu terapii rozłożonego w czasie — bez presji
            i bez konieczności podejmowania decyzji tego samego dnia.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/konsultacja"
              className="inline-flex h-12 items-center justify-center rounded-md bg-ink px-8 text-sm tracking-wide text-alabaster transition hover:bg-ink/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne"
            >
              Umów konsultację
            </Link>
            <Link
              to="/lekarze"
              className="inline-flex h-12 items-center justify-center rounded-md border border-border px-8 text-sm tracking-wide text-foreground transition hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne"
            >
              Wróć do zespołu
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
