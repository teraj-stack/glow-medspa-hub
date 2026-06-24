import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getDoctorBySlug } from "@/lib/doctors.functions";
import { Watermark } from "@/components/site/Watermark";
import halinaPortrait from "@/assets/halina-portrait.png.asset.json";
import geometria640Avif from "@/assets/halina-geometria-640.avif.asset.json";
import geometria960Avif from "@/assets/halina-geometria-960.avif.asset.json";
import geometria1280Avif from "@/assets/halina-geometria-1280.avif.asset.json";
import geometria1600Avif from "@/assets/halina-geometria-1600.avif.asset.json";
import geometria640Webp from "@/assets/halina-geometria-640.webp.asset.json";
import geometria960Webp from "@/assets/halina-geometria-960.webp.asset.json";
import geometria1280Webp from "@/assets/halina-geometria-1280.webp.asset.json";
import geometria1600Webp from "@/assets/halina-geometria-1600.webp.asset.json";

const GEOMETRIA_ALT =
  "Trójwymiarowy szkic kobiecej twarzy z naniesionymi punktami pomiarowymi (landmarks), liniami proporcji i płaszczyznami anatomicznymi — narzędzie planowania zabiegów medycyny estetycznej u lek. Haliny Gabary.";
const GEOMETRIA_AVIF_SRCSET = [
  `${geometria640Avif.url} 640w`,
  `${geometria960Avif.url} 960w`,
  `${geometria1280Avif.url} 1280w`,
  `${geometria1600Avif.url} 1600w`,
].join(", ");
const GEOMETRIA_WEBP_SRCSET = [
  `${geometria640Webp.url} 640w`,
  `${geometria960Webp.url} 960w`,
  `${geometria1280Webp.url} 1280w`,
  `${geometria1600Webp.url} 1600w`,
].join(", ");
const GEOMETRIA_SIZES =
  "(min-width: 1024px) 640px, (min-width: 768px) 60vw, 92vw";

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
      { property: "og:image", content: halinaPortrait.url },
      { name: "twitter:title", content: "lek. Halina Gabara — Beauty & Mind Clinic" },
      { name: "twitter:description", content: "Profil lekarza prowadzącego w Beauty & Mind Clinic Siedlce — specjalizacje, podejście do pacjenta i ścieżka kliniczna." },
      { name: "twitter:image", content: halinaPortrait.url },
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
      <section className="container-luxury pt-20 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32">
        <nav aria-label="Okruszki" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Link to="/lekarze" className="transition-colors hover:text-foreground">
            Zespół kliniki
          </Link>
          <span aria-hidden className="mx-2">/</span>
          <span className="text-foreground/70">lek. Halina Gabara</span>
        </nav>

        <div className="mt-12 max-w-4xl md:mt-16">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Lekarz prowadzący
            </p>
            <h1 className="mt-4 font-serif text-4xl tracking-tight text-foreground md:mt-5 md:text-5xl">
              lek. Halina Gabara
            </h1>
            <p className="mt-4 text-sm text-muted-foreground md:mt-5">
              {professionalTitle}
            </p>
            <p className="mt-8 max-w-2xl text-balance text-base leading-relaxed text-foreground/85 md:mt-10 md:text-lg">
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
            <figure className="mt-8 overflow-hidden rounded-lg border border-border/60 bg-secondary/30">
              <div className="relative">
                <picture>
                  <source type="image/avif" srcSet={GEOMETRIA_AVIF_SRCSET} sizes={GEOMETRIA_SIZES} />
                  <source type="image/webp" srcSet={GEOMETRIA_WEBP_SRCSET} sizes={GEOMETRIA_SIZES} />
                  <img
                    src={geometria960Webp.url}
                    alt={GEOMETRIA_ALT}
                    width={1844}
                    height={1920}
                    loading="lazy"
                    decoding="async"
                    className="block h-auto w-full"
                  />
                </picture>
                <Watermark size="md" />
              </div>
              <figcaption className="border-t border-border/60 px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:px-5 sm:py-4 sm:text-sm">
                <span className="block font-serif text-sm tracking-tight text-foreground sm:text-base">
                  Geometria trójwymiarowa twarzy
                </span>
                <span className="mt-1 block text-muted-foreground">
                  Landmarks, proporcje i płaszczyzny anatomiczne wykorzystywane
                  w planowaniu terapii — fundament analitycznego podejścia
                  w gabinecie lek. Haliny Gabary.
                </span>
              </figcaption>
            </figure>
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
              {specializations.map((s) => (
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
            {experienceParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
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
              {education.map((w) => (
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
