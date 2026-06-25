/**
 * Test bezpieczeństwa: anonimowy klient (anon key) NIE może czytać tabeli
 * `doctors` ani widoku `public_doctors`, a publiczny endpoint server-fn
 * `/_serverFn/...listActiveDoctors` zwraca wyłącznie biały zestaw pól.
 *
 * Test idzie bezpośrednio przez Supabase REST (PostgREST) z anon-owym
 * apikey + Authorization, więc weryfikuje rzeczywiste granty/RLS bazy,
 * a nie kod aplikacji.
 *
 * Wymagane env:
 *   VITE_SUPABASE_URL
 *   VITE_SUPABASE_PUBLISHABLE_KEY  (klucz roli anon)
 * Opcjonalne:
 *   PUBLIC_DOCTORS_ENDPOINT  (pełny URL do server-fn listActiveDoctors;
 *                             jeżeli ustawiony — uruchamia trzeci test).
 */

import { describe, it, expect } from "vitest";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Pola, które WOLNO ujawniać publicznie. Każde inne pole w odpowiedzi
// publicznego endpointu = regresja bezpieczeństwa.
const ALLOWED_PUBLIC_FIELDS = new Set([
  "id",
  "slug",
  "full_name",
  "title",
  "bio",
  "photo_url",
  "display_order",
  "professional_title",
  "experience_summary",
  "specializations",
  "education",
  "portrait_crop",
]);

// Pola, które MUSZĄ być ukryte przed anon.
const FORBIDDEN_FIELDS = [
  "google_calendar_id",
  "default_price_cents",
  "slot_minutes",
  "buffer_minutes",
  "active",
  "created_at",
  "updated_at",
];

async function anonSelect(table: string, query = "select=*&limit=1") {
  if (!SUPABASE_URL || !ANON_KEY) {
    throw new Error("Missing VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY env");
  }
  const url = `${SUPABASE_URL}/rest/v1/${table}?${query}`;
  const res = await fetch(url, {
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
      Accept: "application/json",
    },
  });
  return { status: res.status, body: await res.text() };
}

describe.skipIf(!SUPABASE_URL || !ANON_KEY)(
  "RLS: anon nie ma dostępu do danych lekarzy",
  () => {
    it("anon SELECT * na public.doctors jest zablokowany (401/403/404/empty)", async () => {
      const { status, body } = await anonSelect("doctors", "select=*&limit=1");
      // PostgREST przy braku GRANT/POLICY zwraca:
      //   401 (no api key access), 403 (permission denied) lub 404 (relation not found via API).
      // Tolerujemy te statusy. NIE wolno: 200 z jakimkolwiek wierszem.
      if (status === 200) {
        const parsed = JSON.parse(body) as unknown[];
        expect(
          parsed,
          `anon dostał wiersze z public.doctors: ${body.slice(0, 300)}`,
        ).toHaveLength(0);
      } else {
        expect([401, 403, 404]).toContain(status);
      }
    });

    it("anon SELECT * na public.public_doctors jest zablokowany", async () => {
      const { status, body } = await anonSelect("public_doctors", "select=*&limit=1");
      if (status === 200) {
        const parsed = JSON.parse(body) as unknown[];
        expect(
          parsed,
          `anon dostał wiersze z public_doctors: ${body.slice(0, 300)}`,
        ).toHaveLength(0);
      } else {
        expect([401, 403, 404]).toContain(status);
      }
    });

    it("anon nie może zażądać wrażliwych kolumn z public.doctors", async () => {
      for (const col of FORBIDDEN_FIELDS) {
        const { status, body } = await anonSelect("doctors", `select=${col}&limit=1`);
        if (status === 200) {
          const parsed = JSON.parse(body) as unknown[];
          expect(
            parsed,
            `anon odczytał kolumnę ${col}: ${body.slice(0, 200)}`,
          ).toHaveLength(0);
        } else {
          expect([401, 403, 404]).toContain(status);
        }
      }
    });
  },
);

const PUBLIC_ENDPOINT = process.env.PUBLIC_DOCTORS_ENDPOINT;

describe.skipIf(!PUBLIC_ENDPOINT)(
  "Publiczny endpoint /lekarze zwraca tylko dozwolone pola",
  () => {
    it("każdy zwrócony obiekt ma wyłącznie pola z białej listy", async () => {
      const res = await fetch(PUBLIC_ENDPOINT!, { headers: { Accept: "application/json" } });
      expect(res.status, `endpoint zwrócił ${res.status}`).toBe(200);
      const json = (await res.json()) as { result?: unknown } | unknown;
      // TanStack server-fn pakuje wynik w { result: ... } albo zwraca surowo.
      const list = Array.isArray(json) ? json : (json as any)?.result;
      expect(Array.isArray(list), "odpowiedź musi być listą").toBe(true);

      for (const item of list as Record<string, unknown>[]) {
        const keys = Object.keys(item);
        const leaked = keys.filter((k) => !ALLOWED_PUBLIC_FIELDS.has(k));
        expect(
          leaked,
          `endpoint wyciekł pola spoza białej listy: ${leaked.join(", ")}`,
        ).toEqual([]);
        for (const forbidden of FORBIDDEN_FIELDS) {
          expect(item, `endpoint zawiera zabronione pole ${forbidden}`).not.toHaveProperty(
            forbidden,
          );
        }
      }
    });
  },
);
