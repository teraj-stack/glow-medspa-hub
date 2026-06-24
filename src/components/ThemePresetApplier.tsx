import { useEffect } from "react";
import {
  DEFAULT_THEME_PRESET,
  THEME_PRESETS,
  THEME_PRESET_STORAGE_KEY,
  isThemePresetId,
  type ThemePresetId,
} from "@/config/theme-presets";

function applyPreset(id: ThemePresetId) {
  const root = document.documentElement;
  // Czyścimy wszystkie zmienne ze wszystkich presetów, żeby przełączanie
  // nie zostawiało starych nadpisań.
  for (const preset of Object.values(THEME_PRESETS)) {
    for (const key of Object.keys(preset.variables)) {
      root.style.removeProperty(key);
    }
  }
  const next = THEME_PRESETS[id];
  for (const [key, value] of Object.entries(next.variables)) {
    root.style.setProperty(key, value);
  }
  root.dataset.themePreset = id;
}

export function getStoredPreset(): ThemePresetId {
  if (typeof window === "undefined") return DEFAULT_THEME_PRESET;
  const raw = window.localStorage.getItem(THEME_PRESET_STORAGE_KEY);
  return isThemePresetId(raw) ? raw : DEFAULT_THEME_PRESET;
}

export function setStoredPreset(id: ThemePresetId) {
  window.localStorage.setItem(THEME_PRESET_STORAGE_KEY, id);
  applyPreset(id);
  window.dispatchEvent(new CustomEvent("bm:theme-preset", { detail: id }));
}

export function ThemePresetApplier() {
  useEffect(() => {
    applyPreset(getStoredPreset());
  }, []);
  return null;
}
