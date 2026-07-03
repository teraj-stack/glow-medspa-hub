/**
 * Single source of truth for the clinic's physical address (NAP core).
 * Every static usage — schema.org JSON-LD, meta descriptions, footer,
 * map embeds, prose — MUST import from here instead of hardcoding literals.
 *
 * The dynamic DB-backed NAP (see `src/lib/nap.functions.ts`) is the editable
 * variant surfaced in the admin panel; this file is the compile-time fallback
 * / canonical value used in server-rendered head() blocks and route JSON-LD
 * where a DB call is unavailable or undesirable.
 *
 * Update this file to change the address project-wide.
 */

export const CLINIC_ADDRESS = {
  /** Klinika-goszcząca (host clinic) — pełna nazwa lokalizacji. */
  venueName: "Klinika Ginekologii",
  /** Sama ulica z numerem, bez dopisków. */
  street: "ul. Branickiego 10",
  /** Ulica + host clinic w nawiasie — kanoniczna forma dla schema.org. */
  streetWithVenue: "ul. Branickiego 10 (Klinika Ginekologii)",
  postalCode: "02-972",
  city: "Warszawa",
  district: "Wilanów",
  region: "mazowieckie",
  countryCode: "PL",
  country: "Polska",
  /** Współrzędne geograficzne (WGS84) — Wilanów, Branickiego 10. */
  latitude: 52.15515,
  longitude: 21.09006,
  /** Krótki label lokalizacji do prozy: "Warszawa (Wilanów)". */
  cityWithDistrict: "Warszawa (Wilanów)",
  /** Pełna linia adresowa w prozie: "ul. Branickiego 10, 02-972 Warszawa (Wilanów)". */
  fullLine: "ul. Branickiego 10, 02-972 Warszawa (Wilanów)",
  /** Wariant prozy z host clinic: "Klinika Ginekologii, ul. Branickiego 10, Warszawa (Wilanów)". */
  fullLineWithVenue:
    "Klinika Ginekologii, ul. Branickiego 10, 02-972 Warszawa (Wilanów)",
} as const;

export type ClinicAddress = typeof CLINIC_ADDRESS;

/**
 * Kanoniczny obiekt schema.org PostalAddress — do wstawiania w każdy
 * JSON-LD bez ryzyka rozjazdu wartości.
 */
export const CLINIC_POSTAL_ADDRESS_JSONLD = {
  "@type": "PostalAddress" as const,
  streetAddress: CLINIC_ADDRESS.streetWithVenue,
  addressLocality: CLINIC_ADDRESS.city,
  addressRegion: CLINIC_ADDRESS.region,
  postalCode: CLINIC_ADDRESS.postalCode,
  addressCountry: CLINIC_ADDRESS.countryCode,
} as const;

/**
 * Kanoniczny obiekt schema.org GeoCoordinates.
 */
export const CLINIC_GEO_JSONLD = {
  "@type": "GeoCoordinates" as const,
  latitude: CLINIC_ADDRESS.latitude,
  longitude: CLINIC_ADDRESS.longitude,
} as const;
