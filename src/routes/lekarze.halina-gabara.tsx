import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { getDoctorBySlug, saveDoctorPortrait } from "@/lib/doctors.functions";
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

type PortraitPickerProps = {
  slug: string;
  initialPhotoUrl: string;
  initialCrop: PortraitCrop | null;
};

function PortraitShapePicker({ slug, initialPhotoUrl, initialCrop }: PortraitPickerProps) {
  const queryClient = useQueryClient();
  const savePortrait = useServerFn(saveDoctorPortrait);

  const startingCrop: PortraitCrop = initialCrop
    ? {
        shape: SHAPE_OPTIONS.some((o) => o.id === initialCrop.shape) ? initialCrop.shape : DEFAULT_CROP.shape,
        zoom: Math.min(4, Math.max(1, initialCrop.zoom)),
        offsetX: Math.min(100, Math.max(0, initialCrop.offsetX)),
        offsetY: Math.min(100, Math.max(0, initialCrop.offsetY)),
      }
    : DEFAULT_CROP;

  const [savedCrop, setSavedCrop] = useState<PortraitCrop>(startingCrop);
  const [draftCrop, setDraftCrop] = useState<PortraitCrop>(startingCrop);
  const [savedPhotoUrl, setSavedPhotoUrl] = useState<string>(initialPhotoUrl);
  const [draftPhotoUrl, setDraftPhotoUrl] = useState<string>(initialPhotoUrl);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CROP_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<PortraitCrop>;
      // Only use localStorage if server has no saved crop yet
      if (initialCrop) return;
      const next: PortraitCrop = {
        shape: SHAPE_OPTIONS.some((o) => o.id === parsed.shape) ? (parsed.shape as PortraitShape) : DEFAULT_CROP.shape,
        zoom: typeof parsed.zoom === "number" ? Math.min(2, Math.max(1, parsed.zoom)) : DEFAULT_CROP.zoom,
        offsetX: typeof parsed.offsetX === "number" ? Math.min(100, Math.max(0, parsed.offsetX)) : DEFAULT_CROP.offsetX,
        offsetY: typeof parsed.offsetY === "number" ? Math.min(100, Math.max(0, parsed.offsetY)) : DEFAULT_CROP.offsetY,
      };
      setDraftCrop(next);
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync state when server data arrives/changes (only if user hasn't made unsaved edits)
  useEffect(() => {
    if (!initialCrop) return;
    const normalized: PortraitCrop = {
      shape: SHAPE_OPTIONS.some((o) => o.id === initialCrop.shape) ? initialCrop.shape : DEFAULT_CROP.shape,
      zoom: Math.min(4, Math.max(1, initialCrop.zoom)),
      offsetX: Math.min(100, Math.max(0, initialCrop.offsetX)),
      offsetY: Math.min(100, Math.max(0, initialCrop.offsetY)),
    };
    setSavedCrop((prev) => (cropsEqual(prev, normalized) ? prev : normalized));
    setDraftCrop((prev) => (cropsEqual(prev, savedCrop) ? normalized : prev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCrop?.shape, initialCrop?.zoom, initialCrop?.offsetX, initialCrop?.offsetY]);

  useEffect(() => {
    if (!initialPhotoUrl) return;
    setSavedPhotoUrl((prev) => {
      // If draft is currently mirroring saved (no unsaved photo change), update both
      setDraftPhotoUrl((d) => (d === prev && !pendingFile ? initialPhotoUrl : d));
      return initialPhotoUrl;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPhotoUrl]);


  const dirty = !cropsEqual(draftCrop, savedCrop) || draftPhotoUrl !== savedPhotoUrl || pendingFile !== null;

  const mutation = useMutation({
    mutationFn: async () => {
      let photoBase64: string | undefined;
      let photoContentType: string | undefined;
      if (pendingFile) {
        photoContentType = pendingFile.type;
        const buf = await pendingFile.arrayBuffer();
        const bytes = new Uint8Array(buf);
        let binary = "";
        const chunk = 0x8000;
        for (let i = 0; i < bytes.length; i += chunk) {
          binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
        }
        photoBase64 = btoa(binary);
      }
      return savePortrait({
        data: { slug, crop: draftCrop, photoBase64, photoContentType },
      });
    },
    onSuccess: (result) => {
      setSavedCrop(draftCrop);
      const newUrl = (result as { photo_url?: string | null } | null)?.photo_url ?? draftPhotoUrl;
      setSavedPhotoUrl(newUrl);
      setDraftPhotoUrl(newUrl);
      setPendingFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setStatus("Zapisano w bazie.");
      try {
        window.localStorage.setItem(CROP_STORAGE_KEY, JSON.stringify(draftCrop));
      } catch {
        /* ignore */
      }
      queryClient.invalidateQueries({ queryKey: ["doctor", slug] });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : String(err);
      setStatus(`Błąd zapisu: ${msg}`);
    },
  });

  function save() {
    setStatus(null);
    mutation.mutate();
  }

  function reset() {
    setDraftCrop(savedCrop);
    setDraftPhotoUrl(savedPhotoUrl);
    setPendingFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setStatus(null);
  }

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setStatus("Plik za duży (max 10 MB).");
      return;
    }
    setPendingFile(file);
    const url = URL.createObjectURL(file);
    setDraftPhotoUrl(url);
    setStatus(null);
  }

  const update = <K extends keyof PortraitCrop>(key: K, value: PortraitCrop[K]) =>
    setDraftCrop((c) => ({ ...c, [key]: value }));

  return (
    <figure className="flex flex-col items-center gap-4 md:items-end">
      <div className={`relative w-48 overflow-hidden shadow-sm md:w-56 ${shapeClasses(draftCrop.shape)}`}>
        <img
          src={draftPhotoUrl}
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

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            onChange={onPickFile}
            className="block w-full text-xs text-muted-foreground file:mr-3 file:rounded-full file:border file:border-border file:bg-background file:px-3 file:py-1 file:text-xs file:uppercase file:tracking-[0.15em] file:text-foreground hover:file:bg-muted"
            aria-label="Nowe zdjęcie portretowe"
          />
          {pendingFile ? (
            <p className="mt-1 text-[11px] text-muted-foreground">Wybrano: {pendingFile.name}</p>
          ) : null}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={reset}
            disabled={!dirty || mutation.isPending}
            className="flex-1 rounded-full border border-border px-3 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-opacity hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            Cofnij
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!dirty || mutation.isPending}
            className="flex-1 rounded-full border border-foreground/80 bg-foreground px-3 py-2 text-xs uppercase tracking-[0.2em] text-background transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          >
            {mutation.isPending ? "Zapisuję…" : dirty ? "Zapisz kadr" : "Zapisano"}
          </button>
        </div>

        {status ? (
          <p
            role="status"
            className={`text-[11px] ${status.startsWith("Błąd") ? "text-destructive" : "text-muted-foreground"}`}
          >
            {status}
          </p>
        ) : null}
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
              <PortraitShapePicker
                slug="halina-gabara"
                initialPhotoUrl={doctor?.photo_url || halinaPortrait.url}
                initialCrop={(doctor?.portrait_crop as PortraitCrop | null) ?? null}
              />
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
