import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { formatCena } from "@/lib/format";

/**
 * Interaktywny konfigurator wariantu neuromodulacji mimicznej.
 * Pacjent wybiera zakres, okolicę oraz częstotliwość, a moduł dopasowuje
 * cenę orientacyjną i krótki opis technologiczno-medyczny.
 * Wszystkie ceny w PLN; brak nazw handlowych preparatów.
 */

type AreaOption = {
  id: string;
  label: string;
  price: number;
  units: string;
  description: string;
  scope: "pojedyncza" | "pakiet" | "specjalna";
};

const AREAS: AreaOption[] = [
  {
    id: "czolo",
    label: "Czoło (m. czołowy)",
    price: 700,
    units: "8–16 U",
    scope: "pojedyncza",
    description:
      "Wygładzenie zmarszczek poprzecznych czoła przez zmniejszenie napięcia mięśnia czołowego. Dawka dobierana tak, by zachować naturalny ruch brwi.",
  },
  {
    id: "lwia",
    label: "Lwia zmarszczka (gładzizna)",
    price: 700,
    units: "18–25 U",
    scope: "pojedyncza",
    description:
      "Neuromodulacja mięśni marszczących i podłużnego nosa. Redukcja zmarszczki pionowej między brwiami; efekt „wygaszenia napięcia” między okiem a czołem.",
  },
  {
    id: "kurze",
    label: "Kurze łapki (m. okrężny oka)",
    price: 700,
    units: "8–14 U na stronę",
    scope: "pojedyncza",
    description:
      "Wygładzenie promienistych zmarszczek bocznych oka bez wpływu na mimikę uśmiechu. Bardzo płytkie iniekcje śródskórne.",
  },
  {
    id: "bunny",
    label: "Bunny lines (grzbiet nosa)",
    price: 400,
    units: "4–8 U",
    scope: "pojedyncza",
    description:
      "Skośne zmarszczki grzbietu nosa powstające podczas uśmiechu i marszczenia nosa. Zwykle dopełnienie po pracy nad lwią zmarszczką.",
  },
  {
    id: "dao",
    label: "Opadające kąciki ust (DAO)",
    price: 500,
    units: "4–6 U",
    scope: "pojedyncza",
    description:
      "Osłabienie mięśnia obniżacza kąta ust — kącik ust unosi się delikatnie, twarz traci wyraz „smutku”.",
  },
  {
    id: "gummy",
    label: "Gummy smile (dźwigacz wargi)",
    price: 500,
    units: "2–4 U",
    scope: "pojedyncza",
    description:
      "Redukcja nadmiernego odsłaniania dziąseł przy uśmiechu poprzez punktowe osłabienie dźwigacza wargi górnej i skrzydła nosa.",
  },
  {
    id: "broda",
    label: "Broda — „pomarańczowa skórka”",
    price: 500,
    units: "4–8 U",
    scope: "pojedyncza",
    description:
      "Wygładzenie mięśnia bródkowego, eliminacja fakturowania skóry brody widocznego podczas mówienia.",
  },
  {
    id: "gorna-2",
    label: "Górna twarz — 2 okolice",
    price: 1200,
    units: "24–40 U",
    scope: "pakiet",
    description:
      "Pakiet dwóch okolic górnej twarzy (dowolne 2 z: czoło, lwia, kurze łapki) rozliczany łącznie — dawki i punkty planowane jako spójny protokół.",
  },
  {
    id: "gorna-3",
    label: "Górna twarz — pełny protokół (3 okolice)",
    price: 1500,
    units: "40–60 U",
    scope: "pakiet",
    description:
      "Pełna neuromodulacja czoła, lwiej zmarszczki i kurzych łapek jako jeden protokół. Najczęściej wybierany wariant przy pierwszym zabiegu w profilaktyce.",
  },
  {
    id: "nefertiti",
    label: "Lifting mimiczny „Nefertiti” (platyzma)",
    price: 1400,
    units: "20–40 U",
    scope: "specjalna",
    description:
      "Iniekcje wzdłuż pasm mięśnia szerokiego szyi — poprawa linii żuchwy, uniesienie owalu twarzy, złagodzenie „pasm szyi”.",
  },
  {
    id: "bruksizm",
    label: "Bruksizm / modelowanie żwaczy",
    price: 1400,
    units: "20–40 U na stronę",
    scope: "specjalna",
    description:
      "Osłabienie przerośniętych mięśni żwaczy — redukcja zaciskania zębów i bólu głowy porannego, dodatkowo zwężenie linii żuchwy.",
  },
  {
    id: "hiperhydroza-pachy",
    label: "Hiperhydroza pach",
    price: 1800,
    units: "50 U na pachę",
    scope: "specjalna",
    description:
      "Zablokowanie neuroprzekaźnictwa do gruczołów potowych ekrynowych. Efekt utrzymuje się 6–9 miesięcy — najdłużej ze wszystkich okolic.",
  },
  {
    id: "hiperhydroza-dlonie",
    label: "Hiperhydroza dłoni lub stóp",
    price: 2200,
    units: "100 U łącznie",
    scope: "specjalna",
    description:
      "Zabieg wymaga znieczulenia przewodowego. Efekt 4–6 miesięcy; istotna poprawa komfortu funkcjonalnego.",
  },
];

const SCOPES = [
  { id: "pojedyncza", label: "Pojedyncza okolica" },
  { id: "pakiet", label: "Pakiet górnej twarzy" },
  { id: "specjalna", label: "Wskazanie specjalne" },
] as const;

type FrequencyId = "raz" | "dwa" | "trzy";
const FREQUENCIES: Array<{
  id: FrequencyId;
  label: string;
  multiplier: number;
  note: string;
}> = [
  { id: "raz", label: "1× w roku", multiplier: 1, note: "Efekt utrzymuje się 3–5 miesięcy — jednorazowa neuromodulacja." },
  { id: "dwa", label: "2× w roku", multiplier: 2, note: "Zalecany rytm podtrzymujący — mięśnie stopniowo pracują słabiej, dawka bywa niższa." },
  { id: "trzy", label: "3× w roku", multiplier: 3, note: "Protokół intensywny (np. bruksizm, hiperhydroza) — najdłuższy horyzont profilaktyki zmarszczek utrwalonych." },
];

export function BotoxVariantConfigurator() {
  const [scope, setScope] = useState<(typeof SCOPES)[number]["id"]>("pojedyncza");
  const [areaId, setAreaId] = useState<string>(() =>
    AREAS.find((a) => a.scope === "pojedyncza")!.id,
  );
  const [frequency, setFrequency] = useState<FrequencyId>("dwa");

  const availableAreas = useMemo(
    () => AREAS.filter((a) => a.scope === scope),
    [scope],
  );

  const selectedArea = useMemo(
    () => availableAreas.find((a) => a.id === areaId) ?? availableAreas[0],
    [availableAreas, areaId],
  );

  const freq = FREQUENCIES.find((f) => f.id === frequency)!;
  const perVisit = selectedArea.price;
  const yearlyTotal = perVisit * freq.multiplier;

  const handleScope = (next: (typeof SCOPES)[number]["id"]) => {
    setScope(next);
    const first = AREAS.find((a) => a.scope === next);
    if (first) setAreaId(first.id);
  };

  return (
    <section aria-labelledby="botox-konfigurator" className="scroll-mt-24">
      <SectionHeading
        eyebrow="Konfigurator zabiegu"
        title="Dopasuj wariant do swojego wskazania"
      />
      <p className="mt-4 max-w-2xl text-foreground/80">
        Wybierz zakres, okolicę i preferowaną częstotliwość. Wycena orientacyjna
        (PLN) — ostateczny protokół i dawka w jednostkach biologicznych (U)
        ustalane są na konsultacji.
      </p>

      <div id="botox-konfigurator" className="mt-8 rounded-lg border border-border bg-card p-6 shadow-soft md:p-8">
        <div className="grid gap-8 md:grid-cols-[1.1fr_1fr]">
          <div className="space-y-6">
            <fieldset>
              <legend className="text-xs uppercase tracking-[0.3em] text-champagne">
                Zakres
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {SCOPES.map((s) => {
                  const active = s.id === scope;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleScope(s.id)}
                      aria-pressed={active}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        active
                          ? "border-ink bg-ink text-alabaster"
                          : "border-border bg-transparent text-foreground/80 hover:border-champagne"
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-xs uppercase tracking-[0.3em] text-champagne">
                Okolica
              </legend>
              <label className="sr-only" htmlFor="botox-area">Okolica zabiegu</label>
              <select
                id="botox-area"
                value={selectedArea.id}
                onChange={(e) => setAreaId(e.target.value)}
                className="mt-3 w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-ink focus:border-ink focus:outline-none"
              >
                {availableAreas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label} — {formatCena(a.price)}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-muted-foreground">
                Dawka orientacyjna: {selectedArea.units}
              </p>
            </fieldset>

            <fieldset>
              <legend className="text-xs uppercase tracking-[0.3em] text-champagne">
                Częstotliwość w roku
              </legend>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {FREQUENCIES.map((f) => {
                  const active = f.id === frequency;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFrequency(f.id)}
                      aria-pressed={active}
                      className={`rounded-md border px-3 py-3 text-sm transition ${
                        active
                          ? "border-ink bg-ink text-alabaster"
                          : "border-border bg-transparent text-foreground/80 hover:border-champagne"
                      }`}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{freq.note}</p>
            </fieldset>
          </div>

          <div className="rounded-md border border-champagne/40 bg-secondary/40 p-6">
            <div className="text-xs uppercase tracking-[0.3em] text-champagne">
              Podsumowanie
            </div>
            <h3 className="mt-2 font-serif text-2xl text-ink">
              {selectedArea.label}
            </h3>
            <p className="mt-3 text-sm text-foreground/80">
              {selectedArea.description}
            </p>

            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-foreground/70">Cena za wizytę</dt>
                <dd className="font-medium text-ink">{formatCena(perVisit)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-foreground/70">Rytm</dt>
                <dd className="text-ink">{freq.label}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3">
                <dt className="font-serif text-base text-ink">Rocznie orientacyjnie</dt>
                <dd className="font-serif text-xl text-ink">
                  {formatCena(yearlyTotal, { prefix: "od" })}
                </dd>
              </div>
            </dl>

            <Link
              to="/technologie/$slug"
              params={{ slug: "toksyna-botulinowa" }}
              hash="rezerwacja"
              className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-md bg-ink px-5 text-sm tracking-wide text-alabaster"
            >
              Umów konsultację
            </Link>
            <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
              Konsultacja kwalifikacyjna {formatCena(200)} — rozliczana przy zabiegu.
              Dawki dobierane indywidualnie na podstawie mapowania mięśni.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
