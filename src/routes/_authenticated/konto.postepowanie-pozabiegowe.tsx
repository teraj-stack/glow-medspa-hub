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
  updatedAt?: string;
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

function formatStamp(d: Date | null): string {
  if (!d) return "—";
  return d.toLocaleString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}


const DRAFT_KEY = "postepowanie-pozabiegowe";

function PostTreatmentCreator() {
  const initial = useMemo(() => loadDraft(), []);
  const fetchDraft = useServerFn(getCreatorDraft);
  const persistDraft = useServerFn(saveCreatorDraft);
  const removeDraft = useServerFn(deleteCreatorDraft);

  const [step, setStep] = useState<Step>(initial.step);
  const [localSavedAt, setLocalSavedAt] = useState<Date | null>(
    initial.updatedAt ? new Date(initial.updatedAt) : null,
  );
  const [cloudSavedAt, setCloudSavedAt] = useState<Date | null>(null);
  const [syncState, setSyncState] = useState<"idle" | "syncing" | "synced" | "error">("idle");
  const [conflict, setConflict] = useState<{
    chosen: "local" | "cloud";
    other: SavedDraft;
    otherAt: Date;
  } | null>(null);

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
  const pendingDraftRef = useRef<SavedDraft | null>(null);

  const applyDraft = (d: SavedDraft) => {
    setStep(d.step);
    setSelected(d.selected);
    setOtherName(d.otherName);
    setRouteSlug(d.routeSlug);
    setAudience(d.audience);
    setContraindications(d.contraindications);
    setH48Goals(d.h48Goals);
    setH48Do(d.h48Do);
    setH48Dont(d.h48Dont);
    setH48Flags(d.h48Flags);
    setD14Phases(d.d14Phases);
    setD14Care(d.d14Care);
    setD14Checklist(d.d14Checklist);
    setPanelFeatures(d.panelFeatures);
    setPanelIntegrations(d.panelIntegrations);
  };

  // Hydrate from Supabase on mount — resolve conflicts by updatedAt.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetchDraft({ data: { draftKey: DRAFT_KEY } });
        if (cancelled) return;
        const cloudDraft = res?.data
          ? ({ ...defaultDraft, ...(res.data as Partial<SavedDraft>) } as SavedDraft)
          : null;
        const cloudAt = res?.updatedAt ? new Date(res.updatedAt) : null;
        const localAt = initial.updatedAt ? new Date(initial.updatedAt) : null;
        const hasLocal = Boolean(initial.updatedAt);

        if (cloudDraft && cloudAt) setCloudSavedAt(cloudAt);

        if (cloudDraft && cloudAt && hasLocal && localAt) {
          const diffMs = Math.abs(cloudAt.getTime() - localAt.getTime());
          if (diffMs > 2000) {
            // Conflict — pick newer, expose the other for one-click switch.
            if (cloudAt.getTime() > localAt.getTime()) {
              applyDraft(cloudDraft);
              setConflict({ chosen: "cloud", other: initial, otherAt: localAt });
            } else {
              // Local is newer; keep current state, surface cloud as alternative.
              setConflict({ chosen: "local", other: cloudDraft, otherAt: cloudAt });
            }
          } else if (cloudAt.getTime() >= localAt.getTime()) {
            applyDraft(cloudDraft);
          }
        } else if (cloudDraft) {
          applyDraft(cloudDraft);
        }
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

  const flushSave = async (draft: SavedDraft) => {
    setSyncState("syncing");
    try {
      const res = await persistDraft({
        data: { draftKey: DRAFT_KEY, data: draft as unknown as Record<string, never> },
      });
      setSyncState("synced");
      if (res?.savedAt) setCloudSavedAt(new Date(res.savedAt));
    } catch {
      setSyncState("error");
    }
  };

  useEffect(() => {
    const now = new Date();
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
      updatedAt: now.toISOString(),
    };
    saveDraft(draft);
    setLocalSavedAt(now);
    pendingDraftRef.current = draft;

    // Debounced cloud sync — only after we've hydrated from server.
    if (!hydratedRef.current) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setSyncState("syncing");
    saveTimerRef.current = setTimeout(() => {
      void flushSave(draft);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ]);

  const saveNow = async () => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    const draft = pendingDraftRef.current;
    if (!draft) return;
    await flushSave(draft);
  };

  const resetToDefaults = () => {
    applyDraft({ ...defaultDraft });
    setConflict(null);
  };

  const deleteEverywhere = async () => {
    if (typeof window !== "undefined") {
      const ok = window.confirm(
        "Usunąć zapisany draft z tego urządzenia i z konta? Tej operacji nie da się cofnąć.",
      );
      if (!ok) return;
    }
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    clearDraft();
    try {
      await removeDraft({ data: { draftKey: DRAFT_KEY } });
    } catch {
      // ignore
    }
    setCloudSavedAt(null);
    setLocalSavedAt(null);
    setSyncState("idle");
    resetToDefaults();
  };

  const switchToOtherVersion = async () => {
    if (!conflict) return;
    applyDraft(conflict.other);
    setConflict(null);
    // The effect above will autosave the newly-applied version to local + cloud.
  };

  const reset = deleteEverywhere;



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

          {conflict && (
            <div className="mt-6 rounded-md border border-amber-500/50 bg-amber-500/10 p-4 text-sm">
              <p className="font-medium text-foreground">
                Wykryto inną wersję draftu na {conflict.chosen === "cloud" ? "tym urządzeniu" : "Twoim koncie"}.
              </p>
              <p className="mt-1 text-muted-foreground">
                Aktualnie pokazujemy nowszą wersję ({conflict.chosen === "cloud" ? "z chmury" : "z tego urządzenia"})
                z {formatStamp(conflict.chosen === "cloud" ? cloudSavedAt : localSavedAt)}.
                Druga wersja pochodzi z {formatStamp(conflict.otherAt)}.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={switchToOtherVersion}
                  className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium"
                >
                  Załaduj wersję z {formatStamp(conflict.otherAt)}
                </button>
                <button
                  onClick={() => setConflict(null)}
                  className="rounded-md px-3 py-1.5 text-xs text-muted-foreground"
                >
                  Zachowaj obecną
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap justify-between gap-2 border-t border-border pt-4">
            <button
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1) as Step)}
              className="rounded-md border border-border px-4 py-2 text-sm disabled:opacity-40"
            >
              ← Wstecz
            </button>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={saveNow}
                disabled={syncState === "syncing"}
                className="rounded-md border border-border px-4 py-2 text-sm disabled:opacity-50"
                title="Wymuś natychmiastową synchronizację z kontem"
              >
                Zapisz teraz
              </button>
              <button
                onClick={deleteEverywhere}
                className="rounded-md border border-destructive/60 px-4 py-2 text-sm text-destructive"
                title="Usuń draft z tego urządzenia i z konta"
              >
                Usuń zapis
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
          </div>
          <div className="mt-2 flex flex-wrap justify-end gap-x-3 text-right text-xs text-muted-foreground">
            <span>Lokalnie: {formatStamp(localSavedAt)}</span>
            <span>·</span>
            <span>Na koncie: {formatStamp(cloudSavedAt)}</span>
            <span>·</span>
            <span>
              {syncState === "syncing" && "synchronizacja z chmurą…"}
              {syncState === "synced" && "zsynchronizowano"}
              {syncState === "error" && "błąd synchronizacji (zapisano lokalnie)"}
              {syncState === "idle" && (cloudSavedAt ? "w synchronizacji" : "tylko lokalnie")}
            </span>
          </div>

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
