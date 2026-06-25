/**
 * Test bezpieczeństwa RLS dla tabeli `visit_bookings` — role admin vs user.
 *
 * Weryfikuje, że:
 *  1. Admin (rola `admin` w `user_roles`) ma pełny dostęp:
 *     - SELECT wszystkich wierszy
 *     - UPDATE dowolnego wiersza
 *     - DELETE dowolnego wiersza
 *  2. Zwykły zalogowany user:
 *     - SELECT zwraca WYŁĄCZNIE wiersze gdzie user_id = auth.uid()
 *     - UPDATE cudzego wiersza nie ma efektu (0 rows affected)
 *     - DELETE cudzego wiersza nie ma efektu (0 rows affected)
 *
 * Test idzie przez PostgREST z prawdziwymi JWT użytkowników — weryfikuje
 * RZECZYWISTE polityki RLS na bazie, nie kod aplikacji.
 *
 * Wymagane env:
 *   VITE_SUPABASE_URL
 *   VITE_SUPABASE_PUBLISHABLE_KEY  (klucz roli anon — sign-in)
 *   SUPABASE_SERVICE_ROLE_KEY      (provisioning testowych userów + seed)
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const SR_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const TEST_DOCTOR_ID = "89f1ea32-15f1-4123-87bc-2ef3b9ff8ac2";

type ProvisionedUser = {
  id: string;
  email: string;
  password: string;
  accessToken: string;
};

function srHeaders(extra: Record<string, string> = {}) {
  return {
    apikey: SR_KEY!,
    Authorization: `Bearer ${SR_KEY}`,
    "Content-Type": "application/json",
    Accept: "application/json",
    ...extra,
  };
}

async function srFetch(method: string, path: string, body?: unknown, extra: Record<string, string> = {}) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    method,
    headers: srHeaders(extra),
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return { status: res.status, body: text };
}

async function createUser(email: string, password: string): Promise<string> {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: "POST",
    headers: srHeaders(),
    body: JSON.stringify({ email, password, email_confirm: true }),
  });
  if (!res.ok) {
    throw new Error(`createUser ${email} failed: ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as { id: string };
  return json.id;
}

async function deleteUser(userId: string): Promise<void> {
  await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
    method: "DELETE",
    headers: srHeaders(),
  });
}

async function signIn(email: string, password: string): Promise<string> {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: ANON_KEY!, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    throw new Error(`signIn ${email} failed: ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

async function provisionUser(role: "admin" | "user"): Promise<ProvisionedUser> {
  const suffix = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const email = `rls-test-${role}-${suffix}@example.test`;
  const password = `Test-${suffix}-${Math.random().toString(36).slice(2, 10)}!`;
  const id = await createUser(email, password);
  if (role === "admin") {
    const r = await srFetch("POST", "/rest/v1/user_roles", { user_id: id, role: "admin" });
    if (r.status >= 400) {
      throw new Error(`grant admin failed: ${r.status} ${r.body}`);
    }
  }
  const accessToken = await signIn(email, password);
  return { id, email, password, accessToken };
}

async function seedBooking(userId: string, suffix: string) {
  const starts = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const ends = new Date(starts.getTime() + 60 * 60 * 1000);
  const row = {
    doctor_id: TEST_DOCTOR_ID,
    patient_name: `RLS Test ${suffix}`,
    patient_email: `rls-${suffix}@example.test`,
    patient_phone: "+48500000000",
    starts_at: starts.toISOString(),
    ends_at: ends.toISOString(),
    rodo_consent: true,
    user_id: userId,
  };
  const res = await fetch(`${SUPABASE_URL}/rest/v1/visit_bookings`, {
    method: "POST",
    headers: srHeaders({ Prefer: "return=representation" }),
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    throw new Error(`seed booking failed: ${res.status} ${await res.text()}`);
  }
  const [inserted] = (await res.json()) as Array<{ id: string }>;
  return inserted.id;
}

async function userFetch(
  token: string,
  method: string,
  path: string,
  body?: unknown,
  extra: Record<string, string> = {},
) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: ANON_KEY!,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...extra,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, body: await res.text() };
}

const envReady = Boolean(SUPABASE_URL && ANON_KEY && SR_KEY);

describe.skipIf(!envReady)(
  "RLS: visit_bookings — admin pełny dostęp, user tylko swoje",
  () => {
    let admin: ProvisionedUser;
    let user: ProvisionedUser;
    let otherUser: ProvisionedUser;
    let userBookingId: string;
    let otherBookingId: string;
    const createdBookingIds: string[] = [];

    beforeAll(async () => {
      admin = await provisionUser("admin");
      user = await provisionUser("user");
      otherUser = await provisionUser("user");
      userBookingId = await seedBooking(user.id, `user-${user.id.slice(0, 8)}`);
      otherBookingId = await seedBooking(otherUser.id, `other-${otherUser.id.slice(0, 8)}`);
      createdBookingIds.push(userBookingId, otherBookingId);
    }, 60_000);

    afterAll(async () => {
      // Czyścimy ręcznie — visit_bookings nie kasuje się kaskadowo z auth.users.
      if (createdBookingIds.length > 0) {
        const ids = createdBookingIds.map((i) => `"${i}"`).join(",");
        await srFetch("DELETE", `/rest/v1/visit_bookings?id=in.(${ids})`);
      }
      for (const u of [admin, user, otherUser]) {
        if (u?.id) await deleteUser(u.id);
      }
    }, 60_000);

    it("admin SELECT * — widzi oba seed-owe wiersze", async () => {
      const { status, body } = await userFetch(
        admin.accessToken,
        "GET",
        `visit_bookings?select=id,user_id&id=in.("${userBookingId}","${otherBookingId}")`,
      );
      expect(status, body).toBe(200);
      const rows = JSON.parse(body) as Array<{ id: string }>;
      const ids = new Set(rows.map((r) => r.id));
      expect(ids.has(userBookingId)).toBe(true);
      expect(ids.has(otherBookingId)).toBe(true);
    });

    it("admin UPDATE cudzego wiersza — działa", async () => {
      const { status, body } = await userFetch(
        admin.accessToken,
        "PATCH",
        `visit_bookings?id=eq.${userBookingId}`,
        { notes: "touched-by-admin" },
        { Prefer: "return=representation" },
      );
      expect(status, body).toBe(200);
      const rows = JSON.parse(body) as Array<{ notes: string }>;
      expect(rows).toHaveLength(1);
      expect(rows[0].notes).toBe("touched-by-admin");
    });

    it("user SELECT — widzi tylko swój wiersz, nie cudzy", async () => {
      const { status, body } = await userFetch(
        user.accessToken,
        "GET",
        `visit_bookings?select=id,user_id&id=in.("${userBookingId}","${otherBookingId}")`,
      );
      expect(status, body).toBe(200);
      const rows = JSON.parse(body) as Array<{ id: string; user_id: string }>;
      expect(rows.map((r) => r.id)).toEqual([userBookingId]);
      expect(rows[0].user_id).toBe(user.id);
    });

    it("user SELECT * bez filtra — nie wycieka cudzych wierszy", async () => {
      const { status, body } = await userFetch(
        user.accessToken,
        "GET",
        "visit_bookings?select=id,user_id,cancel_token,patient_email&limit=100",
      );
      expect(status, body).toBe(200);
      const rows = JSON.parse(body) as Array<{ user_id: string | null }>;
      for (const r of rows) {
        expect(
          r.user_id,
          `user widzi wiersz nie-swój: ${JSON.stringify(r)}`,
        ).toBe(user.id);
      }
    });

    it("user UPDATE cudzego wiersza — 0 rows affected", async () => {
      const { status, body } = await userFetch(
        user.accessToken,
        "PATCH",
        `visit_bookings?id=eq.${otherBookingId}`,
        { notes: "should-not-apply" },
        { Prefer: "return=representation" },
      );
      // PostgREST: brak dopasowania RLS => 200 z pustą tablicą.
      expect([200, 401, 403, 404]).toContain(status);
      if (status === 200) {
        const rows = JSON.parse(body) as unknown[];
        expect(rows, `user zmodyfikował cudzy wiersz: ${body}`).toHaveLength(0);
      }
      // Sanity check — przez service role potwierdzamy że pole się nie zmieniło.
      const check = await srFetch(
        "GET",
        `/rest/v1/visit_bookings?id=eq.${otherBookingId}&select=notes`,
      );
      const [{ notes }] = JSON.parse(check.body) as Array<{ notes: string | null }>;
      expect(notes).not.toBe("should-not-apply");
    });

    it("user DELETE cudzego wiersza — 0 rows affected", async () => {
      const { status, body } = await userFetch(
        user.accessToken,
        "DELETE",
        `visit_bookings?id=eq.${otherBookingId}`,
        undefined,
        { Prefer: "return=representation" },
      );
      expect([200, 401, 403, 404]).toContain(status);
      if (status === 200) {
        const rows = JSON.parse(body) as unknown[];
        expect(rows, `user usunął cudzy wiersz: ${body}`).toHaveLength(0);
      }
      const check = await srFetch(
        "GET",
        `/rest/v1/visit_bookings?id=eq.${otherBookingId}&select=id`,
      );
      const rows = JSON.parse(check.body) as unknown[];
      expect(rows, "cudzy wiersz zniknął!").toHaveLength(1);
    });

    it("admin DELETE — kasuje seed-owy wiersz", async () => {
      const { status, body } = await userFetch(
        admin.accessToken,
        "DELETE",
        `visit_bookings?id=eq.${userBookingId}`,
        undefined,
        { Prefer: "return=representation" },
      );
      expect(status, body).toBe(200);
      const rows = JSON.parse(body) as Array<{ id: string }>;
      expect(rows).toHaveLength(1);
      expect(rows[0].id).toBe(userBookingId);
      // Już skasowane — wyrzucamy z listy cleanup.
      const idx = createdBookingIds.indexOf(userBookingId);
      if (idx >= 0) createdBookingIds.splice(idx, 1);
    });
  },
);
