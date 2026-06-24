import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  DEFAULT_THEME_PRESET,
  THEME_PRESETS,
  type ThemePresetId,
} from "@/config/theme-presets";
import {
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

function ThemePresetsPage() {
  const [active, setActive] = useState<ThemePresetId>(DEFAULT_THEME_PRESET);

  useEffect(() => {
    setActive(getStoredPreset());
  }, []);

  function choose(id: ThemePresetId) {
    setStoredPreset(id);
    setActive(id);
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="text-xs uppercase tracking-[0.3em] text-champagne">
        Panel deweloperski
      </div>
      <h1 className="mt-3 font-serif text-4xl text-ink">Presety tła</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Wybór zapisywany lokalnie w przeglądarce (localStorage:{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
          bm-theme-preset
        </code>
        ). Domyślny preset całej witryny ustaw w{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
          src/config/theme-presets.ts
        </code>
        .
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {Object.values(THEME_PRESETS).map((preset) => {
          const isActive = preset.id === active;
          return (
            <button
              key={preset.id}
              onClick={() => choose(preset.id)}
              className={`rounded-xl border p-5 text-left transition ${
                isActive
                  ? "border-champagne ring-2 ring-champagne/40 bg-card"
                  : "border-border bg-card hover:border-champagne/60"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-xl text-ink">
                  {preset.label}
                </span>
                {isActive && (
                  <span className="text-[10px] uppercase tracking-widest text-champagne">
                    Aktywny
                  </span>
                )}
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
            </button>
          );
        })}
      </div>

      <p className="mt-10 text-xs text-muted-foreground">
        Aktywny preset: <strong>{THEME_PRESETS[active].label}</strong>
      </p>
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
