const NBSP = "\u00A0";

/**
 * Kanoniczny format ceny PLN: « 1 200 zł »
 * Spacja niełamliwa między liczbą a « zł », małe litery.
 */
export function formatCena(
  value: number | null | undefined,
  opts?: { prefix?: "od" | "za" | "do" | null; label?: string | null },
): string {
  if (value == null || Number.isNaN(value)) return opts?.label ?? "wycena indywidualna";
  const rounded = Math.round(value);
  const withSpaces = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
  const base = `${withSpaces}${NBSP}zł`;
  return opts?.prefix ? `${opts.prefix}${NBSP}${base}` : base;
}
