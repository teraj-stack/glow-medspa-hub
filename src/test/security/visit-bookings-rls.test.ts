/**
 * Test bezpieczeństwa RLS dla tabeli `visit_bookings`.
 *
 * Wymagania bezpieczeństwa:
 *  1. anon NIE może zrobić SELECT i odczytać jakiegokolwiek wiersza
 *     (w tym cancel_token, patient_email, stripe_*).
 *  2. anon NIE może zrobić UPDATE / DELETE na tabeli.
 *  3. anon NIE może odczytać wrażliwych kolumn osobno
 *     (cancel_token, patient_email, patient_phone, stripe_session_id,
 *      stripe_payment_intent_id).
 *  4. Każda przyszła polityka SELECT MUSI być scopowana po `user_id`
 *     — test próbuje wyciągnąć dowolny wiersz "bez właściciela" i wymaga
 *     pustej odpowiedzi (regresja: USING (true) by tu odpadło).
 *
 * Test idzie bezpośrednio przez PostgREST z anon-owym apikey, więc weryfikuje
 * RZECZYWISTE granty + RLS bazy, a nie kod aplikacji.
 *
 * Wymagane env:
 *   VITE_SUPABASE_URL
 *   VITE_SUPABASE_PUBLISHABLE_KEY  (klucz roli anon)
 */

import { describe, it, expect } from "vitest";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const SENSITIVE_COLUMNS = [
  "cancel_token",
  "patient_email",
  "patient_phone",
  "patient_name",
  "notes",
  "stripe_session_id",
  "stripe_payment_intent_id",
  "amount_cents",
  "payment_status",
  "status",
  "user_id",
];

function headers(extra: Record<string, string> = {}) {
  if (!SUPABASE_URL || !ANON_KEY) {
    throw new Error("Missing VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY env");
  }
  return {
    apikey: ANON_KEY,
    Authorization: `Bearer ${ANON_KEY}`,
    Accept: "application/json",
    "Content-Type": "application/json",
    ...extra,
  };
}

async function anonRequest(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  path: string,
  body?: unknown,
  extraHeaders: Record<string, string> = {},
) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: headers(),
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, body: await res.text() };
}

function expectBlockedOrEmpty(status: number, body: string, label: string) {
  // Akceptujemy: 401/403 (no grant / policy), 404 (relation not found via API).
  // 200 dopuszczalne TYLKO z pustą tablicą.
  if (status === 200) {
    const parsed = JSON.parse(body) as unknown[];
    expect(
      Array.isArray(parsed),
      `${label}: oczekiwana lista, otrzymano ${body.slice(0, 200)}`,
    ).toBe(true);
    expect(
      parsed,
      `${label}: anon dostał wiersze: ${body.slice(0, 300)}`,
    ).toHaveLength(0);
  } else {
    expect(
      [401, 403, 404],
      `${label}: nieoczekiwany status ${status}, body=${body.slice(0, 200)}`,
    ).toContain(status);
  }
}

function expectMutationBlocked(status: number, body: string, label: string) {
  // Mutacja anon-owa musi się rozjechać — PostgREST zwraca 401/403/404,
  // ewentualnie 405 jeśli metoda jest odcięta na poziomie GRANT.
  // 200/201/204 = wpis się udał = krytyczna regresja.
  expect(
    [401, 403, 404, 405],
    `${label}: nieoczekiwany status ${status}, body=${body.slice(0, 200)}`,
  ).toContain(status);
  expect(
    [200, 201, 204],
    `${label}: anon zmodyfikował wiersz (status ${status})`,
  ).not.toContain(status);
}

describe.skipIf(!SUPABASE_URL || !ANON_KEY)(
  "RLS: visit_bookings — anon nie ma żadnego dostępu",
  () => {
    it("anon SELECT * jest zablokowany lub pusty", async () => {
      const { status, body } = await anonRequest(
        "GET",
        "visit_bookings?select=*&limit=1",
      );
      expectBlockedOrEmpty(status, body, "SELECT *");
    });

    it("anon nie odczyta żadnej z wrażliwych kolumn osobno", async () => {
      for (const col of SENSITIVE_COLUMNS) {
        const { status, body } = await anonRequest(
          "GET",
          `visit_bookings?select=${col}&limit=1`,
        );
        expectBlockedOrEmpty(status, body, `SELECT ${col}`);
      }
    });

    it("anon próbuje obejść scope user_id (user_id=is.null) — pusty wynik", async () => {
      // Regresja, którą łapiemy: gdyby ktoś dodał politykę USING (true)
      // albo zapomniał o scope user_id, ten query zwróciłby publicznie
      // wszystkie nieprzypisane rezerwacje + ich cancel_tokeny.
      const { status, body } = await anonRequest(
        "GET",
        "visit_bookings?select=id,cancel_token,patient_email&user_id=is.null&limit=5",
      );
      expectBlockedOrEmpty(status, body, "SELECT user_id IS NULL");
    });

    it("anon próbuje UPDATE statusu/płatności — odrzucone", async () => {
      const { status, body } = await anonRequest(
        "PATCH",
        "visit_bookings?id=eq.00000000-0000-0000-0000-000000000000",
        { status: "confirmed", payment_status: "paid", amount_cents: 0 },
      );
      expectMutationBlocked(status, body, "PATCH status/payment");
    });

    it("anon próbuje DELETE — odrzucone", async () => {
      const { status, body } = await anonRequest(
        "DELETE",
        "visit_bookings?id=eq.00000000-0000-0000-0000-000000000000",
      );
      expectMutationBlocked(status, body, "DELETE");
    });
  },
);
