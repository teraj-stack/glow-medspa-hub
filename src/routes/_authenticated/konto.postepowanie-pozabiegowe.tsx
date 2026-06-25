import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  getCreatorDraft,
  saveCreatorDraft,
  deleteCreatorDraft,
} from "@/lib/creator-drafts.functions";


export const Route = createFileRoute("/_authenticated/konto/postepowanie-pozabiegowe")({
  component: PostTreatmentCreator,
  head: () => ({
    meta: [
      { title: "Postępowanie pozabiegowe | Panel pacjenta BMClinics.ai" },
      {
        name: "description",
        content:
          "Krok po kroku zbuduj indywidualny protokół pozabiegowy: pierwsze 48h, 14 dni oraz panel pacjenta dla wybranych technologii laserowych.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

type LaserKey =
  | "pico"
  | "tattoo"
  | "thulium"
  | "erglass"
  | "co2"
  | "nd-yag"
  | "alex"
  | "ipl"
  | "diode"
  | "other";

const LASERS: { key: LaserKey; label: string; hint: string }[] = [
  { key: "pico", label: "Laser pikosekundowy", hint: "przebarwienia, rewitalizacja" },
  { key: "tattoo", label: "Usuwanie tatuażu", hint: "pigment egzogenny" },
  { key: "thulium", label: "Laser tulowy 1927 nm", hint: "przebarwienia, melasma" },
  { key: "erglass", label: "Er:Glass 1550 nm", hint: "frakcyjny nieablacyjny" },
  { key: "co2", label: "CO2 frakcyjny 10600 nm", hint: "ablacyjny — silne gojenie" },
  { key: "nd-yag", label: "Nd:YAG 1064 nm", hint: "naczynka, depilacja" },
  { key: "alex", label: "Aleksandryt 755 nm", hint: "depilacja, plamy" },
  { key: "ipl", label: "IPL", hint: "fotoodmładzanie, naczynka" },
  { key: "diode", label: "Diodowy 808 nm", hint: "depilacja" },
  { key: "other", label: "Inne urządzenie", hint: "wpisz nazwę poniżej" },
];

type Step = 0 | 1 | 2 | 3 | 4 | 5;

const STEP_LABELS = [
  "Wybór technologii",
  "Kontekst kliniczny",
  "Sekcja 48h",
  "Sekcja 14 dni",
  "Panel pacjenta",
  "Podgląd protokołu",
];

const STORAGE_KEY = "postepowanie-pozabiegowe-draft";

type SavedDraft = {
  step: Step;
  selected: LaserKey[];
  otherName: string;
  routeSlug: string;
  audience: string;
  contraindications: string;
  h48Goals: string;
  h48Do: string;
  h48Dont: string;
  h48Flags: string;
  d14Phases: string;
  d14Care: string;
  d14Checklist: string;
  panelFeatures: string;
  panelIntegrations: string;
};

const defaultDraft: SavedDraft = {
  step: 0,
  selected: [],
  otherName: "",
  routeSlug: "laser/postepowanie-pozabiegowe",
  audience: "pacjent po zabiegu, język PL, ton spokojny, klinicystyczny",
  contraindications:
    "ciąża, aktywna infekcja skóry, opalenizna <4 tyg., izotretynoina <6 mies., choroby autoimmunologiczne w fazie zaostrzenia",
  h48Goals: "redukcja rumienia i obrzęku, ochrona bariery, profilaktyka infekcji, brak PIH",
  h48Do:
    "zimne okłady 10 min co 2h (pierwsze 6h), emolient barierowy 4-6×/dobę, sen na plecach z uniesioną głową, SPF 50+ mineralny od 24h",
  h48Dont: "makijaż, sauna, basen, alkohol, intensywny wysiłek, retinoidy, kwasy AHA/BHA, peelingi mechaniczne",
  h48Flags:
    "ból >6/10 mimo paracetamolu, pęcherze, sączenie ropne, gorączka >38°C, rozprzestrzeniający się rumień",
  d14Phases:
    "Dni 1-3: gojenie naskórka. Dni 4-7: złuszczanie fizjologiczne. Dni 8-14: remodeling, powrót do pielęgnacji aktywnej.",
  d14Care:
    "delikatne mycie syndetem, ceramidy + pantenol 2×/d, SPF 50+ codziennie, od dnia 8 niacynamid 5%, od dnia 14 retinal w małym stężeniu",
  d14Checklist:
    "checklista dzienna z polem 'zrobione', przypomnienia e-mail/SMS, eksport do .ics, zdjęcia kontrolne dzień 1/3/7/14",
  panelFeatures:
    "logowanie magic-link, kalendarz zaleceń, biblioteka PDF (karta zabiegu, zgody, faktura), formularz objawów z eskalacją do kliniki, galeria zdjęć przed/po z timestampem",
  panelIntegrations: "ICS export, e-mail, SMS opcjonalnie, webhook do CRM kliniki",
};

function loadDraft(): SavedDraft {
  if (typeof window === "undefined") return defaultDraft;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultDraft;
    const parsed = JSON.parse(raw) as Partial<SavedDraft>;
    return { ...defaultDraft, ...parsed };
  } catch {
    return defaultDraft;
  }
}

function saveDraft(draft: SavedDraft) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // ignore quota errors
  }
}

function clearDraft() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

const DRAFT_KEY = "postepowanie-pozabiegowe";

function PostTreatmentCreator() {
  const initial = useMemo(() => loadDraft(), []);
  const fetchDraft = useServerFn(getCreatorDraft);
  const persistDraft = useServerFn(saveCreatorDraft);
  const removeDraft = useServerFn(deleteCreatorDraft);

  const [step, setStep] = useState<Step>(initial.step);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [syncState, setSyncState] = useState<"idle" | "syncing" | "synced" | "error">("idle");

  const [selected, setSelected] = useState<LaserKey[]>(initial.selected);
  const [otherName, setOtherName] = useState(initial.otherName);

  const [routeSlug, setRouteSlug] = useState(initial.routeSlug);
  const [audience, setAudience] = useState(initial.audience);
  const [contraindications, setContraindications] = useState(initial.contraindications);

  const [h48Goals, setH48Goals] = useState(initial.h48Goals);
  const [h48Do, setH48Do] = useState(initial.h48Do);
  const [h48Dont, setH48Dont] = useState(initial.h48Dont);
  const [h48Flags, setH48Flags] = useState(initial.h48Flags);

  const [d14Phases, setD14Phases] = useState(initial.d14Phases);
  const [d14Care, setD14Care] = useState(initial.d14Care);
  const [d14Checklist, setD14Checklist] = useState(initial.d14Checklist);

  const [panelFeatures, setPanelFeatures] = useState(initial.panelFeatures);
  const [panelIntegrations, setPanelIntegrations] = useState(initial.panelIntegrations);

  const hydratedRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate from Supabase on mount — server wins (cross-device).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetchDraft({ data: { draftKey: DRAFT_KEY } });
        if (cancelled || !res?.data) {
          hydratedRef.current = true;
          return;
        }
        const r = res.data as Partial<SavedDraft>;
        const merged: SavedDraft = { ...defaultDraft, ...r };
        setStep(merged.step);
        setSelected(merged.selected);
        setOtherName(merged.otherName);
        setRouteSlug(merged.routeSlug);
        setAudience(merged.audience);
        setContraindications(merged.contraindications);
        setH48Goals(merged.h48Goals);
        setH48Do(merged.h48Do);
        setH48Dont(merged.h48Dont);
        setH48Flags(merged.h48Flags);
        setD14Phases(merged.d14Phases);
        setD14Care(merged.d14Care);
        setD14Checklist(merged.d14Checklist);
        setPanelFeatures(merged.panelFeatures);
        setPanelIntegrations(merged.panelIntegrations);
        if (res.updatedAt) setSavedAt(new Date(res.updatedAt));
      } catch {
        // ignore — fallback to local draft
      } finally {
        hydratedRef.current = true;
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const draft: SavedDraft = {
      step,
      selected,
      otherName,
      routeSlug,
      audience,
      contraindications,
      h48Goals,
      h48Do,
      h48Dont,
      h48Flags,
      d14Phases,
      d14Care,
      d14Checklist,
      panelFeatures,
      panelIntegrations,
    };
    saveDraft(draft);
    setSavedAt(new Date());

    // Debounced cloud sync — only after we've hydrated from server.
    if (!hydratedRef.current) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setSyncState("syncing");
    saveTimerRef.current = setTimeout(async () => {
      try {
        await persistDraft({
          data: { draftKey: DRAFT_KEY, data: draft as unknown as Record<string, never> },
        });
        setSyncState("synced");
      } catch {
        setSyncState("error");
      }
    }, 800);
  }, [
    step,
    selected,
    otherName,
    routeSlug,
    audience,
    contraindications,
    h48Goals,
    h48Do,
    h48Dont,
    h48Flags,
    d14Phases,
    d14Care,
    d14Checklist,
    panelFeatures,
    panelIntegrations,
    persistDraft,
  ]);

  const reset = async () => {
    clearDraft();
    try {
      await removeDraft({ data: { draftKey: DRAFT_KEY } });
    } catch {
      // ignore
    }
    setStep(0);
    setSelected([]);
    setOtherName("");
    setRouteSlug(defaultDraft.routeSlug);
    setAudience(defaultDraft.audience);
    setContraindications(defaultDraft.contraindications);
    setH48Goals(defaultDraft.h48Goals);
    setH48Do(defaultDraft.h48Do);
    setH48Dont(defaultDraft.h48Dont);
    setH48Flags(defaultDraft.h48Flags);
    setD14Phases(defaultDraft.d14Phases);
    setD14Care(defaultDraft.d14Care);
    setD14Checklist(defaultDraft.d14Checklist);
    setPanelFeatures(defaultDraft.panelFeatures);
    setPanelIntegrations(defaultDraft.panelIntegrations);
  };


  const laserList = useMemo(() => {
    return selected
      .map((k) => {
        const l = LASERS.find((x) => x.key === k)!;
        return k === "other" && otherName ? `- ${otherName}` : `- ${l.label} (${l.hint})`;
      })
      .join("\n");
  }, [selected, otherName]);

  const prompt = useMemo(() => {
    return `Protokół pozabiegowy — ${routeSlug}

TECHNOLOGIE OBJĘTE PROTOKOŁEM
${laserList || "- (brak — uzupełnij)"}

ODBIORCA I TON
${audience}

PRZECIWWSKAZANIA
${contraindications}

============================================================
SEKCJA 1 — PIERWSZE 48 GODZIN
============================================================
Cele kliniczne: ${h48Goals}
RÓB:
${h48Do}
NIE RÓB:
${h48Dont}
CZERWONE FLAGI (kontakt z kliniką):
${h48Flags}

============================================================
SEKCJA 2 — PIERWSZE 14 DNI
============================================================
Fazy gojenia:
${d14Phases}
Pielęgnacja domowa:
${d14Care}
Funkcje checklisty:
${d14Checklist}

============================================================
SEKCJA 3 — PANEL PACJENTA
============================================================
Funkcje:
${panelFeatures}
Integracje:
${panelIntegrations}
`;
  }, [
    routeSlug,
    laserList,
    audience,
    contraindications,
    h48Goals,
    h48Do,
    h48Dont,
    h48Flags,
    d14Phases,
    d14Care,
    d14Checklist,
    panelFeatures,
    panelIntegrations,
  ]);

  const toggleLaser = (k: LaserKey) => {
    setSelected((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
  };

  const canNext = () => {
    if (step === 0) return selected.length > 0;
    return true;
  };

  const copy = async () => {
    await navigator.clipboard.writeText(prompt);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <header className="mb-8">
          <Link to="/konto/wizyty" className="text-sm text-muted-foreground hover:text-foreground">
            ← Powrót do panelu
          </Link>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Postępowanie pozabiegowe
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Krok po kroku zbuduj indywidualny protokół: pierwsze 48h, 14 dni oraz panel pacjenta dla wybranych technologii.
          </p>
        </header>

        <ol className="mb-8 flex flex-wrap gap-2 text-xs">
          {STEP_LABELS.map((label, i) => (
            <li
              key={label}
              className={`rounded-full border px-3 py-1 ${
                i === step
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground"
              }`}
            >
              {i + 1}. {label}
            </li>
          ))}
        </ol>

        <div className="rounded-lg border border-border bg-card p-6">
          {step === 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">1. Wybierz technologie</h2>
              <p className="text-sm text-muted-foreground">
                Zaznacz wszystkie urządzenia, dla których chcesz wygenerować wspólny protokół.
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {LASERS.map((l) => (
                  <label
                    key={l.key}
                    className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-3 hover:bg-accent"
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(l.key)}
                      onChange={() => toggleLaser(l.key)}
                      className="mt-1"
                    />
                    <span className="text-sm">
                      <span className="block font-medium text-foreground">{l.label}</span>
                      <span className="block text-xs text-muted-foreground">{l.hint}</span>
                    </span>
                  </label>
                ))}
              </div>
              {selected.includes("other") && (
                <input
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  placeholder="Nazwa urządzenia"
                  value={otherName}
                  onChange={(e) => setOtherName(e.target.value)}
                />
              )}
            </section>
          )}

          {step === 1 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">2. Kontekst kliniczny</h2>
              <Field label="Slug protokołu" value={routeSlug} onChange={setRouteSlug} />
              <Field label="Odbiorca i ton" value={audience} onChange={setAudience} multiline />
              <Field
                label="Przeciwwskazania"
                value={contraindications}
                onChange={setContraindications}
                multiline
              />
            </section>
          )}

          {step === 2 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">3. Pierwsze 48 godzin</h2>
              <Field label="Cele kliniczne" value={h48Goals} onChange={setH48Goals} multiline />
              <Field label="Zalecenia — RÓB" value={h48Do} onChange={setH48Do} multiline />
              <Field label="Zalecenia — NIE RÓB" value={h48Dont} onChange={setH48Dont} multiline />
              <Field label="Czerwone flagi" value={h48Flags} onChange={setH48Flags} multiline />
            </section>
          )}

          {step === 3 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">4. Pierwsze 14 dni</h2>
              <Field label="Fazy gojenia" value={d14Phases} onChange={setD14Phases} multiline />
              <Field label="Pielęgnacja domowa" value={d14Care} onChange={setD14Care} multiline />
              <Field
                label="Funkcje checklisty"
                value={d14Checklist}
                onChange={setD14Checklist}
                multiline
              />
            </section>
          )}

          {step === 4 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">5. Panel pacjenta</h2>
              <Field
                label="Funkcje"
                value={panelFeatures}
                onChange={setPanelFeatures}
                multiline
              />
              <Field
                label="Integracje"
                value={panelIntegrations}
                onChange={setPanelIntegrations}
                multiline
              />
            </section>
          )}

          {step === 5 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">6. Gotowy protokół</h2>
                <button
                  onClick={copy}
                  className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
                >
                  Skopiuj
                </button>
              </div>
              <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap rounded-md border border-border bg-muted p-4 text-xs text-foreground">
                {prompt}
              </pre>
              <p className="text-xs text-muted-foreground">
                Skopiuj treść protokołu, aby przesłać ją pacjentowi lub zapisać w jego karcie.
              </p>
            </section>
          )}

          <div className="mt-8 flex justify-between border-t border-border pt-4">
            <button
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1) as Step)}
              className="rounded-md border border-border px-4 py-2 text-sm disabled:opacity-40"
            >
              ← Wstecz
            </button>
            {step < 5 ? (
              <button
                disabled={!canNext()}
                onClick={() => setStep((s) => Math.min(5, s + 1) as Step)}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40"
              >
                Dalej →
              </button>
            ) : (
              <button
                onClick={reset}
                className="rounded-md border border-border px-4 py-2 text-sm"
              >
                Zacznij od nowa
              </button>
            )}
          </div>
          <p className="mt-2 text-right text-xs text-muted-foreground">
            {savedAt ? `Ostatni autosave: ${savedAt.toLocaleTimeString("pl-PL")}` : "Autosave włączony"}
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  hint,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  multiline?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-foreground">{label}</span>
      {multiline ? (
        <textarea
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}
