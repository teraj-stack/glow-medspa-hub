// Pure helpers — generate citation payloads for local directories and schema.org
// from a NapSettings object. No I/O, safe to import client- or server-side.
import type { NapSettings } from "./nap.functions";

export function napToJsonLd(nap: NapSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": `${nap.website.replace(/\/$/, "")}/#clinic`,
    name: nap.business_name,
    legalName: nap.legal_name ?? undefined,
    description: nap.description ?? undefined,
    url: nap.website,
    telephone: nap.phone_e164 ?? nap.phone ?? undefined,
    email: nap.email ?? undefined,
    hasMap: nap.google_maps_url ?? undefined,
    sameAs: [nap.google_business_profile_url].filter(Boolean),
    address: {
      "@type": "PostalAddress",
      streetAddress: nap.street_address,
      postalCode: nap.postal_code,
      addressLocality: nap.city,
      addressRegion: nap.region,
      addressCountry: nap.country_code,
    },
    geo:
      nap.latitude != null && nap.longitude != null
        ? { "@type": "GeoCoordinates", latitude: nap.latitude, longitude: nap.longitude }
        : undefined,
    openingHoursSpecification: nap.hours_json.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.day,
      opens: h.opens,
      closes: h.closes,
    })),
    medicalSpecialty: nap.categories,
  };
}

export function napToPlainText(nap: NapSettings) {
  const lines = [
    nap.business_name,
    nap.legal_name && nap.legal_name !== nap.business_name ? nap.legal_name : null,
    nap.street_address,
    `${nap.postal_code} ${nap.city}, ${nap.region}`,
    nap.country_code === "PL" ? "Polska" : nap.country_code,
    nap.phone ? `tel. ${nap.phone}` : null,
    nap.email ? `e-mail: ${nap.email}` : null,
    `www: ${nap.website}`,
    "",
    "Godziny otwarcia:",
    ...nap.hours_json.map((h) => `  ${h.day}: ${h.opens}–${h.closes}`),
  ].filter(Boolean);
  return lines.join("\n");
}

export function napToCsv(nap: NapSettings) {
  const rows: [string, string][] = [
    ["business_name", nap.business_name],
    ["legal_name", nap.legal_name ?? ""],
    ["street_address", nap.street_address],
    ["postal_code", nap.postal_code],
    ["city", nap.city],
    ["region", nap.region],
    ["country_code", nap.country_code],
    ["phone", nap.phone ?? ""],
    ["phone_e164", nap.phone_e164 ?? ""],
    ["email", nap.email ?? ""],
    ["website", nap.website],
    ["latitude", nap.latitude != null ? String(nap.latitude) : ""],
    ["longitude", nap.longitude != null ? String(nap.longitude) : ""],
    ["google_maps_url", nap.google_maps_url ?? ""],
    ["google_business_profile_url", nap.google_business_profile_url ?? ""],
    ["categories", nap.categories.join("; ")],
    ["hours", nap.hours_json.map((h) => `${h.day} ${h.opens}-${h.closes}`).join("; ")],
    ["description", nap.description ?? ""],
  ];
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  return ["field,value", ...rows.map(([k, v]) => `${esc(k)},${esc(v)}`)].join("\n");
}

export type CitationTarget = {
  id: string;
  name: string;
  url: string;
  category: "map" | "pl-directory" | "medical" | "global";
  note: string;
};

// Curated list of Polish + global local citation directories for a medical /
// aesthetic-medicine clinic. URLs point to the "add my business" flow.
export const CITATION_TARGETS: CitationTarget[] = [
  { id: "gbp", name: "Google Business Profile", url: "https://business.google.com/create", category: "map", note: "Kluczowa wizytówka do Google Maps. Weryfikacja pocztą, wideo lub telefonicznie." },
  { id: "bing", name: "Bing Places for Business", url: "https://www.bingplaces.com/", category: "map", note: "Odpowiednik GBP dla Bing / Ecosia. Można zaimportować z Google." },
  { id: "apple", name: "Apple Business Connect", url: "https://businessconnect.apple.com/", category: "map", note: "Widoczność w Apple Maps na iPhone/iPad/Mac." },
  { id: "pkt", name: "PKT.pl", url: "https://www.pkt.pl/dodaj-firme", category: "pl-directory", note: "Polska katalogowa baza firm — bezpłatny wpis podstawowy." },
  { id: "panorama", name: "Panorama Firm", url: "https://panoramafirm.pl/dodaj_firme", category: "pl-directory", note: "Katalog firm, mocne linki i widoczność w SERP-ach lokalnych." },
  { id: "aleo", name: "Aleo", url: "https://aleo.com/pl/dodaj-firme", category: "pl-directory", note: "Baza B2B z profilami firm — dobre backlinki." },
  { id: "gowork", name: "GoWork", url: "https://www.gowork.pl/dodaj-firme", category: "pl-directory", note: "Katalog + opinie pracownicze i klienckie." },
  { id: "trojmiasto", name: "PF.pl / Firmy w Polsce", url: "https://pf.pl/dodaj-firme", category: "pl-directory", note: "Ogólny katalog firm PL." },
  { id: "znanylekarz", name: "ZnanyLekarz.pl", url: "https://www.znanylekarz.pl/reklama", category: "medical", note: "Największy w PL katalog lekarzy — kluczowy dla medycyny estetycznej." },
  { id: "medicover", name: "LekarzeBezKolejki / Doctor.pl", url: "https://www.lekarzebezkolejki.pl/", category: "medical", note: "Wyszukiwarki lekarzy i placówek medycznych." },
  { id: "wizaz", name: "Wizaz.pl (katalog gabinetów)", url: "https://wizaz.pl/gabinety-kosmetyczne", category: "medical", note: "Katalog gabinetów kosmetycznych/estetycznych z opiniami." },
  { id: "facebook", name: "Facebook Business Page", url: "https://www.facebook.com/pages/create", category: "global", note: "Uzupełnij zakładkę „Informacje” dokładnie tym samym NAP." },
  { id: "yelp", name: "Yelp for Business", url: "https://business.yelp.com/", category: "global", note: "Globalny katalog opinii — konsekwentny NAP." },
  { id: "foursquare", name: "Foursquare / Factual", url: "https://foursquare.com/venue/claim", category: "global", note: "Bazę Foursquare wykorzystują dziesiątki aplikacji nawigacyjnych." },
  { id: "tripadvisor", name: "TripAdvisor (Spa & Wellness)", url: "https://www.tripadvisor.com/GetListedNew", category: "global", note: "Kategoria Spa/Wellness dla klinik z ofertą pobytową/relaksacyjną." },
];

export function citationRowForTarget(target: CitationTarget, nap: NapSettings) {
  return {
    directory: target.name,
    add_url: target.url,
    name: nap.business_name,
    street: nap.street_address,
    postal_code: nap.postal_code,
    city: nap.city,
    region: nap.region,
    country: nap.country_code,
    phone: nap.phone_e164 ?? nap.phone ?? "",
    email: nap.email ?? "",
    website: nap.website,
    categories: nap.categories.join(" · "),
    hours: nap.hours_json.map((h) => `${h.day} ${h.opens}-${h.closes}`).join(" · "),
    description: nap.description ?? "",
  };
}

export function citationsCsv(nap: NapSettings) {
  const rows = CITATION_TARGETS.map((t) => citationRowForTarget(t, nap));
  const headers = Object.keys(rows[0]) as (keyof (typeof rows)[number])[];
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => esc(r[h])).join(",")),
  ].join("\n");
}
