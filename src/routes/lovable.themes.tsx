import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  DEFAULT_THEME_PRESET,
  THEME_PRESETS,
  type ThemePresetId,
} from "@/config/theme-presets";
import {
  applyPreset,
  getStoredPreset,
  setStoredPreset,
} from "@/components/ThemePresetApplier";

export const Route = createFileRoute("/lovable/themes")({
  head: () => ({
    meta: [
      { title: "Presety tła — panel deweloperski" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ThemePresetsPage,
});

type Mode = "light" | "dark";

function ThemePresetsPage() {
  const [active, setActive] = useState<ThemePresetId>(DEFAULT_THEME_PRESET);
  const [preview, setPreview] = useState<ThemePresetId | null>(null);
  const [mode, setMode] = useState<Mode>("light");
  const [originalDark, setOriginalDark] = useState(false);

  useEffect(() => {
    setActive(getStoredPreset());
    const isDark = document.documentElement.classList.contains("dark");
    setOriginalDark(isDark);
    setMode(isDark ? "dark" : "light");
    return () => {
      // Restore original mode on unmount.
      document.documentElement.classList.toggle("dark", isDark);
    };
  }, []);

  // Apply preview preset live.
  useEffect(() => {
    applyPreset(preview ?? active);
  }, [preview, active]);

  // Apply preview mode (light/dark) live.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode]);

  function commit(id: ThemePresetId) {
    setStoredPreset(id);
    setActive(id);
    setPreview(null);
    // Restore the user's original mode after committing the preset.
    document.documentElement.classList.toggle("dark", originalDark);
    setMode(originalDark ? "dark" : "light");
  }

  const shown = preview ?? active;

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-champagne">
            Panel deweloperski
          </div>
          <h1 className="mt-3 font-serif text-4xl text-ink">Presety tła</h1>
        </div>
        <div
          role="group"
          aria-label="Tryb podglądu"
          className="flex shrink-0 rounded-md border border-border bg-card p-1"
        >
          {(["light", "dark"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded px-3 py-1.5 text-[11px] uppercase tracking-widest transition ${
                mode === m
                  ? "bg-champagne/15 text-ink"
                  : "text-muted-foreground hover:text-ink"
              }`}
            >
              {m === "light" ? "Jasny" : "Ciemny"}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        Najedź na kafelek, aby zobaczyć preset na żywo na tej stronie. Kliknij
        „Zastosuj”, aby zapisać wybór (localStorage:{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
          bm-theme-preset
        </code>
        ).
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {Object.values(THEME_PRESETS).map((preset) => {
          const isActive = preset.id === active;
          const isPreviewing = preview === preset.id;
          return (
            <div
              key={preset.id}
              onMouseEnter={() => setPreview(preset.id)}
              onMouseLeave={() => setPreview(null)}
              onFocus={() => setPreview(preset.id)}
              onBlur={() => setPreview(null)}
              className={`rounded-xl border p-5 transition ${
                isActive
                  ? "border-champagne ring-2 ring-champagne/40 bg-card"
                  : isPreviewing
                    ? "border-champagne/70 bg-card"
                    : "border-border bg-card hover:border-champagne/60"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-xl text-ink">
                  {preset.label}
                </span>
                <div className="flex items-center gap-2">
                  {isPreviewing && !isActive && (
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      Podgląd
                    </span>
                  )}
                  {isActive && (
                    <span className="text-[10px] uppercase tracking-widest text-champagne">
                      Aktywny
                    </span>
                  )}
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {preset.description}
              </p>
              <div className="mt-4 flex gap-2">
                <Swatch varName="--background" fallback="#f9f8f6" preset={preset.variables} />
                <Swatch varName="--card" fallback="#ffffff" preset={preset.variables} />
                <Swatch varName="--champagne" fallback="#a07a55" preset={preset.variables} />
                <Swatch varName="--gold" fallback="#d4b896" preset={preset.variables} />
              </div>
              <div className="mt-5 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => commit(preset.id)}
                  disabled={isActive}
                  className="rounded-md border border-champagne/60 px-3 py-1.5 text-xs uppercase tracking-widest text-ink transition hover:bg-champagne/10 disabled:opacity-40"
                >
                  {isActive ? "Zastosowany" : "Zastosuj"}
                </button>
                <button
                  type="button"
                  onMouseEnter={() => setPreview(preset.id)}
                  onFocus={() => setPreview(preset.id)}
                  className="text-xs uppercase tracking-widest text-muted-foreground hover:text-ink"
                >
                  Podgląd
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 rounded-xl border border-border bg-card p-6">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
          Podgląd na żywo
        </div>
        <div className="mt-3 text-sm text-muted-foreground">
          Aktualnie widzisz:{" "}
          <strong className="text-ink">{THEME_PRESETS[shown].label}</strong>
          {preview && preview !== active && (
            <span> (niezapisany podgląd — kliknij „Zastosuj”, aby utrwalić)</span>
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to="/"
            className="rounded-md border border-champagne/60 px-3 py-1.5 text-xs uppercase tracking-widest text-ink hover:bg-champagne/10"
          >
            Zobacz stronę główną
          </Link>
          <Link
            to="/lekarze"
            className="rounded-md border border-border px-3 py-1.5 text-xs uppercase tracking-widest text-ink hover:border-champagne/60"
          >
            Lekarze
          </Link>
          <Link
            to="/cennik"
            className="rounded-md border border-border px-3 py-1.5 text-xs uppercase tracking-widest text-ink hover:border-champagne/60"
          >
            Cennik
          </Link>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Podgląd wpływa na nagłówek i stopkę tej strony — kolory tła i akcenty
          aktualizują się od razu.
        </p>
      </div>
    </div>
  );
}

function Swatch({
  varName,
  fallback,
  preset,
}: {
  varName: string;
  fallback: string;
  preset: Record<string, string>;
}) {
  const color = preset[varName] ?? `var(${varName}, ${fallback})`;
  return (
    <span
      className="h-8 w-8 rounded-full border border-border"
      style={{ background: color }}
      aria-hidden
    />
  );
}
