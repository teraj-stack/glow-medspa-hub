/**
 * Cache-busting version tag for social share previews (Open Graph / Twitter).
 *
 * Social crawlers (Facebook, LinkedIn, X, Slack, iMessage, WhatsApp) cache
 * `og:image`, `og:title` i `og:description` po URL-u strony. Zmiana samego
 * meta-tagu nie odświeży karty — dopóki URL og:image jest ten sam, cache
 * podaje starą wersję. Doklejamy więc `?v=OG_VERSION` do każdego URL-a
 * obrazu podglądu, żeby crawler zobaczył „nowy" zasób i pobrał aktualne
 * metadane wraz z obrazem.
 *
 * KIEDY BUMPOWAĆ:
 * - zmieniły się dane NAP (adres, telefon) widoczne w opisach/podglądach
 * - podmieniono hero/portret/cover używany jako og:image
 * - zmieniono tytuł/opis strony w sposób istotny dla podglądu
 *
 * Format: `YYYYMMDD` lub `YYYYMMDD-N` przy kilku bumpach dziennie.
 * Ostatni bump: 2026-07-03 (v2) — nowe branded OG cards (hero + blog).
 */
export const OG_VERSION = "20260703-2";

/**
 * Doklej `?v=OG_VERSION` (lub `&v=...` jeśli URL już ma query) do URL-a
 * obrazu podglądu społecznościowego, żeby wymusić rescrape.
 * Bezpieczne dla absolutnych URL-i i ścieżek zwracanych przez bundler.
 */
export function withOgVersion(url: string): string {
  if (!url) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}v=${OG_VERSION}`;
}
