/**
 * Tło i kolory tła w wersjach presetowych.
 * Aktywny preset zapisywany w localStorage pod kluczem THEME_PRESET_STORAGE_KEY.
 * Domyślnym presetem (bazą motywu) jest DEFAULT_THEME_PRESET — używany przy SSR
 * i przed nawodnieniem klienta. Aby zmienić domyślne tło dla wszystkich
 * odwiedzających, podmień DEFAULT_THEME_PRESET na inny identyfikator.
 */

export type ThemePresetId = "cichy-luksus" | "bezowo-zlote";

export interface ThemePreset {
  id: ThemePresetId;
  label: string;
  description: string;
  /** Mapa nadpisań zmiennych CSS aplikowanych na <html>. */
  variables: Record<string, string>;
}

export const THEME_PRESETS: Record<ThemePresetId, ThemePreset> = {
  "cichy-luksus": {
    id: "cichy-luksus",
    label: "Cichy luksus",
    description:
      "Alabaster, czerń i bronz — chłodna, minimalistyczna baza zdefiniowana w styles.css.",
    // Pusta mapa = używamy wartości bazowych z :root w src/styles.css.
    variables: {},
  },
  "bezowo-zlote": {
    id: "bezowo-zlote",
    label: "Beżowo‑złote",
    description:
      "Ciepła, kremowa baza z mocniejszym szampańskim akcentem — bliżej poprzedniej wersji deseni i tła.",
    variables: {
      "--background": "oklch(0.965 0.018 80)", // kremowy beż
      "--card": "oklch(0.985 0.012 80)",
      "--secondary": "oklch(0.93 0.022 78)",
      "--muted": "oklch(0.93 0.022 78)",
      "--border": "oklch(0.86 0.025 75)",
      "--input": "oklch(0.9 0.022 75)",
      "--champagne": "oklch(0.62 0.09 68)", // bogatszy bronz
      "--champagne-light": "oklch(0.88 0.06 78)",
      "--gold": "oklch(0.84 0.11 82)",
    },
  },
};

export const DEFAULT_THEME_PRESET: ThemePresetId = "cichy-luksus";
export const THEME_PRESET_STORAGE_KEY = "bm-theme-preset";

export function isThemePresetId(value: unknown): value is ThemePresetId {
  return typeof value === "string" && value in THEME_PRESETS;
}
