import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getDoctorBySlug } from "@/lib/doctors.functions";
import halinaPortrait from "@/assets/halina-portrait.png.asset.json";

type PortraitShape = "circle" | "square" | "portrait45";

type PortraitCrop = {
  shape: PortraitShape;
  zoom: number; // 1 = fit, >1 = zoomed in
  offsetX: number; // 0-100 (object-position x %)
  offsetY: number; // 0-100 (object-position y %)
};

const CROP_STORAGE_KEY = "halina-portrait-crop";
const DEFAULT_CROP: PortraitCrop = { shape: "circle", zoom: 1, offsetX: 50, offsetY: 15 };
const SHAPE_OPTIONS: Array<{ id: PortraitShape; label: string }> = [
  { id: "circle", label: "Okrąg" },
  { id: "square", label: "Kwadrat" },
  { id: "portrait45", label: "4:5" },
];

function shapeClasses(shape: PortraitShape): string {
  switch (shape) {
    case "square":
      return "aspect-square rounded-none";
    case "portrait45":
      return "aspect-[4/5] rounded-xl";
    case "circle":
    default:
      return "aspect-square rounded-full";
  }
}

function cropsEqual(a: PortraitCrop, b: PortraitCrop): boolean {
  return a.shape === b.shape && a.zoom === b.zoom && a.offsetX === b.offsetX && a.offsetY === b.offsetY;
}

function PortraitShapePicker() {
  const [savedCrop, setSavedCrop] = useState<PortraitCrop>(DEFAULT_CROP);
  const [draftCrop, setDraftCrop] = useState<PortraitCrop>(DEFAULT_CROP);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CROP_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<PortraitCrop>;
      const next: PortraitCrop = {
        shape: SHAPE_OPTIONS.some((o) => o.id === parsed.shape) ? (parsed.shape as PortraitShape) : DEFAULT_CROP.shape,
        zoom: typeof parsed.zoom === "number" ? Math.min(2, Math.max(1, parsed.zoom)) : DEFAULT_CROP.zoom,
        offsetX: typeof parsed.offsetX === "number" ? Math.min(100, Math.max(0, parsed.offsetX)) : DEFAULT_CROP.offsetX,
        offsetY: typeof parsed.offsetY === "number" ? Math.min(100, Math.max(0, parsed.offsetY)) : DEFAULT_CROP.offsetY,
      };
      setSavedCrop(next);
      setDraftCrop(next);
    } catch {
      /* ignore */
    }
  }, []);

  const dirty = !cropsEqual(draftCrop, savedCrop);

  function save() {
    try {
      window.localStorage.setItem(CROP_STORAGE_KEY, JSON.stringify(draftCrop));
    } catch {
      /* ignore */
    }
    setSavedCrop(draftCrop);
  }

  function reset() {
    setDraftCrop(savedCrop);
  }

  const update = <K extends keyof PortraitCrop>(key: K, value: PortraitCrop[K]) =>
    setDraftCrop((c) => ({ ...c, [key]: value }));

  return (
    <figure className="flex flex-col items-center gap-4 md:items-end">
      <div className={`relative w-48 overflow-hidden shadow-sm md:w-56 ${shapeClasses(draftCrop.shape)}`}>
        <img
          src={halinaPortrait.url}
          alt="lek. Halina Gabara — podgląd kadru"
          className="absolute inset-0 size-full object-cover"
          style={{
            objectPosition: `${draftCrop.offsetX}% ${draftCrop.offsetY}%`,
            transform: `scale(${draftCrop.zoom})`,
            transformOrigin: `${draftCrop.offsetX}% ${draftCrop.offsetY}%`,
          }}
          loading="eager"
        />
      </div>
      <figcaption className="w-full max-w-[14rem] space-y-3 md:max-w-[16rem]">
        <div
          role="radiogroup"
          aria-label="Kształt zdjęcia"
          className="flex items-center justify-center gap-1 rounded-full border border-border bg-muted/40 p-1 md:justify-end"
        >
          {SHAPE_OPTIONS.map((opt) => {
            const active = draftCrop.shape === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => update("shape", opt.id)}
                className={`flex-1 rounded-full px-3 py-1 text-xs uppercase tracking-[0.15em] transition-colors ${
                  active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <div className="space-y-2 text-xs text-muted-foreground">
          <label className="flex items-center justify-between gap-2">
            <span className="uppercase tracking-[0.15em]">Zoom</span>
            <input
              type="range"
              min={1}
              max={2}
              step={0.05}
              value={draftCrop.zoom}
              onChange={(e) => update("zoom", Number(e.target.value))}
              className="flex-1 accent-foreground"
              aria-label="Powiększenie kadru"
            />
          </label>
          <label className="flex items-center justify-between gap-2">
            <span className="uppercase tracking-[0.15em]">Poz. X</span>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={draftCrop.offsetX}
              onChange={(e) => update("offsetX", Number(e.target.value))}
              className="flex-1 accent-foreground"
              aria-label="Pozycja pozioma kadru"
            />
          </label>
          <label className="flex items-center justify-between gap-2">
            <span className="uppercase tracking-[0.15em]">Poz. Y</span>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={draftCrop.offsetY}
              onChange={(e) => update("offsetY", Number(e.target.value))}
              className="flex-1 accent-foreground"
              aria-label="Pozycja pionowa kadru"
            />
          </label>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={reset}
            disabled={!dirty}
            className="flex-1 rounded-full border border-border px-3 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-opacity hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            Cofnij
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!dirty}
            className="flex-1 rounded-full border border-foreground/80 bg-foreground px-3 py-2 text-xs uppercase tracking-[0.2em] text-background transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          >
            {dirty ? "Zapisz kadr" : "Zapisano"}
          </button>
        </div>
      </figcaption>
    </figure>
  );
}

const CANONICAL = "https://bmclinics.ai/lekarze/halina-gabara";

export const Route = createFileRoute("/lekarze/halina-gabara")({
  head: () => ({
    meta: [
      { title: "lek. Halina Gabara — BM Clinics Siedlce" },
      {
        name: "description",
        content:
          "lek. Halina Gabara — medycyna estetyczna w Siedlcach. Doświadczenie z warszawskich klinik premium, indywidualnie planowane terapie, bezpieczeństwo i przewidywalny efekt.",
      },
      { property: "og:title", content: "lek. Halina Gabara — BM Clinics" },
      {
        property: "og:description",
        content:
          "Profil lekarza prowadzącego w BM Clinics Siedlce — specjalizacje, podejście do pacjenta i ścieżka kliniczna.",
      },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: CANONICAL },
      { property: "og:image", content: halinaPortrait.url },
      { name: "twitter:title", content: "lek. Halina Gabara — BM Clinics" },
      { name: "twitter:description", content: "Profil lekarza prowadzącego w BM Clinics Siedlce — specjalizacje, podejście do pacjenta i ścieżka kliniczna." },
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
            name: "BM Clinics",
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
        "W BM Clinics w Siedlcach prowadzę pacjentów w identycznym standardzie — od konsultacji i diagnostyki, przez plan terapii, po opiekę pozabiegową i wizyty kontrolne.",
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
      <section className="container-luxury pt-16 pb-12 md:pt-24 md:pb-20 lg:pt-28 lg:pb-24">
        <nav aria-label="Okruszki" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Link to="/lekarze" className="transition-colors hover:text-foreground">
            Zespół kliniki
          </Link>
          <span aria-hidden className="mx-2">/</span>
          <span className="text-foreground/70">lek. Halina Gabara</span>
        </nav>

        <div className="mt-10 md:mt-12">
          <div className="min-w-0">
            <div className="grid gap-10 md:grid-cols-[minmax(0,1fr),auto] md:items-center md:gap-12 lg:gap-16">
              <div>
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
              <PortraitShapePicker />
            </div>
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
              anatomii, a nie na gotowych wzorach. W BM Clinics
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
