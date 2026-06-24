import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getDoctorBySlug } from "@/lib/doctors.functions";

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

// TODO: uzupełnić faktyczne uczelnię, dyplom i certyfikaty lek. Haliny Gabary
const WYKSZTALCENIE = [
  "Dyplom lekarza, Uniwersytet Medyczny",
  "Szkolenia certyfikowane z toksyny botulinowej i wypełniaczy HA",
  "Kursy zaawansowanej wolumetrii i pełnotwarzowego modelowania",
  "Cykliczne szkolenia z zakresu bezpieczeństwa zabiegów iniekcyjnych",
];

const SPECJALIZACJE = [
  "Konsultacje i analityczne planowanie terapii",
  "Toksyna botulinowa — leczenie mimicznych zmarszczek",
  "Wolumetria i modelowanie konturu twarzy kwasem hialuronowym",
  "Pikosekundowy laser — terapie pigmentacyjne i poprawa tekstury skóry",
  "Fuzja plazmy — resurfacing i regeneracja",
  "Fototerapia i fotobiomodulacja LED",
  "HiFu — lifting i remodeling tkanek bezinwazyjny",
];

function HalinaGabaraPage() {
  const fetchDoctor = useServerFn(getDoctorBySlug);
  const { data: doctor } = useQuery({
    queryKey: ["doctor", "halina-gabara"],
    queryFn: () => fetchDoctor({ data: { slug: "halina-gabara" } }),
    staleTime: 60_000,
  });

  const professionalTitle = doctor?.professional_title?.trim()
    || "lekarz medycyny estetycznej · ortodonta";
  const experienceParagraphs = (doctor?.experience_summary?.trim()
    ? doctor!.experience_summary!.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    : [
        "Ścieżkę zawodową budowałam przez kilkanaście lat, łącząc praktykę w warszawskich klinikach premium z ortodontycznym, analitycznym spojrzeniem na twarz.",
        "W Beauty & Mind Clinic w Siedlcach prowadzę pacjentów w identycznym standardzie — od konsultacji i diagnostyki, przez plan terapii, po opiekę pozabiegową i wizyty kontrolne.",
      ]);
  const specializations = (doctor?.specializations && doctor.specializations.length)
    ? doctor.specializations
    : SPECJALIZACJE;
  const education = (doctor?.education && doctor.education.length)
    ? doctor.education
    : WYKSZTALCENIE;
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
            HG
          </div>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Lekarz prowadzący
            </p>
            <h1 className="mt-3 font-serif text-4xl tracking-tight text-foreground md:text-5xl">
              lek. Halina Gabara
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              lekarz medycyny estetycznej · ortodonta
            </p>
            <p className="mt-6 max-w-xl text-balance text-base leading-relaxed text-foreground/85 md:text-lg">
              Patrzę na twarz analitycznie — jako układ punktów odniesienia,
              odległości i kątów, w których klasyczna harmonia łączy się
              z indywidualną anatomią pacjenta. Planuję terapie, które
              wyglądają naturalnie i są bezpieczne w długim horyzoncie.
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
              Moim fundamentem jest twarde, analityczne spojrzenie na twarz.
              Zajmuję się oznaczaniem stałych, powtarzalnych punktów
              pomiarowych — landmarks — oraz analizą odległości, kątów i osi
              między strukturami głębokimi twarzy a jej powierzchnią.
            </p>
            <p>
              Ta wiedza, łącząca cefalometrię, antropometrię i geometrię
              proporcji, pozwala budować plany zabiegowe na indywidualnej
              anatomii, a nie na gotowych wzorach. W Beauty &amp; Mind Clinic
              tworzymy na tej bazie nowy standard opieki: od precyzyjnej
              diagnostyki, przez dobór technik, po opiekę okołozabiegową.
            </p>
            <p>
              Nie pracuję z nazwami handlowymi urządzeń jako argumentem
              marketingowym. Liczy się dobrze postawiona diagnoza, technika
              wykonania i przewidywalny efekt w czasie.
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
              Ścieżkę zawodową budowałam przez kilkanaście lat, łącząc
              praktykę w warszawskich klinikach premium z ortodontycznym,
              analitycznym spojrzeniem na twarz.
            </p>
            <p>
              W Beauty &amp; Mind Clinic w Siedlcach prowadzę pacjentów
              w identycznym standardzie — od konsultacji i diagnostyki, przez
              plan terapii, po opiekę pozabiegową i wizyty kontrolne.
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
