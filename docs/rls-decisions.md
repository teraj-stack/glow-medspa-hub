# Decyzje RLS — dokumentacja

Ten dokument opisuje świadome decyzje dotyczące polityk Row-Level Security (RLS)
w bazie projektu. Służy jako odniesienie dla zespołu oraz dla automatycznych
skanerów bezpieczeństwa, aby nie zgłaszały fałszywych alarmów dla wzorców,
które są zamierzone.

Ostatnia aktualizacja: 2026-06-23

---

## Model dostępu w skrócie

- Aplikacja jest publiczną stroną kliniki + panelem admina chronionym logowaniem.
- Pacjenci **nie logują się** w aplikacji. Rezerwacje, formularze konsultacji i
  płatności realizowane są przez server functions (TanStack `createServerFn`)
  oraz publiczne endpointy `/api/public/*` (webhooki).
- Rola `admin` (`public.user_roles` + funkcja `has_role`) ma pełny dostęp do
  danych operacyjnych. Wszystkie inne odczyty wrażliwych tabel idą wyłącznie
  przez kod serwerowy z `service_role`.

---

## Tabele z publicznym SELECT (`USING (true)` lub `TO anon`)

Wszystkie poniższe polityki są **tylko SELECT** i zwracają dane, które celowo
są publiczne (treści marketingowe / konfiguracja prezentacji).

### `treatment_catalog`
- **Polityka:** SELECT dla `anon` + `authenticated`.
- **Dlaczego:** katalog zabiegów i cen pokazywany na stronach `/cennik` oraz
  `/technologie/*`. Brak danych osobowych.
- **Co nie jest publiczne:** kolumny wrażliwe (np. marże, notatki wewnętrzne)
  — jeśli kiedykolwiek się pojawią, muszą być wyłączone na poziomie widoku.

### `doctors` (przez widok `public_doctors`)
- **Polityka:** SELECT dla `anon` ograniczone do `is_active = true` i
  bezpiecznego zestawu kolumn (imię, specjalizacja, bio, zdjęcie).
- **Dlaczego:** strona `/lekarze` wyświetla profile.
- **Co nie jest publiczne:** `calendar_id`, `email`, ustawienia kalendarza —
  tylko admin.

### `working_hours`
- **Polityka:** SELECT `USING (true)`.
- **Dlaczego:** formularz rezerwacji oblicza dostępne sloty po stronie klienta,
  potrzebuje godzin pracy lekarzy. Brak PII.
- **Modyfikacje:** wyłącznie admin (`has_role(..., 'admin')`).

### `time_off`
- **Polityka:** SELECT `USING (true)`.
- **Dlaczego:** widoczność „lekarz nieobecny” w kalendarzu rezerwacji.
  Tabela zawiera tylko zakresy dat + `doctor_id`, brak danych pacjentów.
- **Modyfikacje:** wyłącznie admin.

### `hidden_pricing_items`
- **Polityka:** SELECT `USING (true)`.
- **Dlaczego:** lista ID pozycji cennika ukrytych dla publiczności — strona
  potrzebuje jej, żeby je odfiltrować. Sama lista identyfikatorów nie jest
  tajna; tajne byłyby ceny tych pozycji, których po prostu nie pokazujemy.
- **Modyfikacje:** wyłącznie admin.

---

## Tabele bez SELECT dla `anon` / non-admin (zamierzone)

Te tabele zawierają PII lub dane operacyjne. **Brak polityki SELECT poza
adminem jest celowy.** Cały dostęp odbywa się przez server functions z
`service_role` (token w URL przy anulowaniu, weryfikacja podpisu webhooka itd.).

- **`visit_bookings`** — rezerwacje wizyt (imię, email, telefon, notatki,
  `cancel_token`, identyfikatory Stripe). Brak kolumny `user_id` — pacjenci nie
  mają konta. Jeśli kiedyś dodamy self-service pacjenta, trzeba dodać `user_id`
  i politykę `USING (user_id = auth.uid())`.
- **`bookings`** — wewnętrzny model rezerwacji (lekarz, slot, status).
- **`consultation_orders`** — formularze konsultacji + dane płatności Stripe.
- **`profiles`** — profile zalogowanych adminów. Polityka SELECT zawęża do
  `auth.uid() = id`.
- **`user_roles`** — role przypisane userom. SELECT tylko dla `authenticated`
  (czytane przez `has_role`, funkcja `SECURITY DEFINER`).
- **`email_send_log`, `email_send_state`, `email_unsubscribe_tokens`,
  `suppressed_emails`** — operacyjne dane wysyłki maili. Admin + service_role.
- **`sitemap_validation_history`** — wewnętrzny log walidacji sitemap. Admin.

---

## Polityki INSERT / UPDATE / DELETE z `WITH CHECK (true)`

**Nie istnieją** w tym projekcie. Każda mutacja wymaga albo `has_role(...,
'admin')`, albo idzie z `service_role` (z pominięciem RLS) z zweryfikowanym
kontekstem (token, podpis webhooka, autentykowana sesja admina).

---

## Wzorce, które skaner może oznaczyć — i dlaczego są OK

| Sygnał skanera | Status | Uzasadnienie |
|---|---|---|
| `RLS Policy Always True` na SELECT | False positive | `USING (true)` jest dozwolone dla publicznych danych marketingowych/konfiguracyjnych (`working_hours`, `time_off`, `hidden_pricing_items`). Lint Supabase 0024 explicite wyklucza SELECT z tej reguły. |
| `Missing SELECT policy for non-admins` na `visit_bookings`, `bookings`, `consultation_orders` | Intentional | Pacjenci nie mają konta; dostęp wyłącznie przez server functions z `service_role`. |
| `Sensitive columns exposed` na `doctors` | False positive | Publiczne odczyty idą przez widok `public_doctors`, który nie eksponuje `calendar_id`/`email`. |

---

## Stały audyt RLS w CI

Projekt uruchamia automatyczny audyt RLS w GitHub Actions (`.github/workflows/rls-audit.yml`):

- **Co sprawdza:**
  - czy RLS jest włącony na każdej tabeli w schemacie `public`,
  - czy dla każdej tabeli istnieją polityki SELECT / INSERT / UPDATE / DELETE,
  - czy polityki INSERT / UPDATE / DELETE nie używają wyrażenia `true` (zbyt permisywne).
- **Kiedy się uruchamia:** przy każdej zmianie w `supabase/migrations/`, `scripts/audit-rls.mjs`, `docs/rls-audit-allowlist.json` lub samym workflow, na pushu do `main` oraz codziennie o 07:00 UTC.
- **Wyniki:** raport JSON + HTML w artifactach joba. Przy nowych findingach job failuje, tworząc alert.
- **Allowlista:** celowe braki polityk (np. brak DELETE, bo usuwanie odbywa się wyłącznie przez `service_role`) są dokumentowane w `docs/rls-audit-allowlist.json` i nie powodują faila.

Kiedy dodajesz nową tabelę lub zmieniasz jej polityki, upewnij się że audyt pozostaje zielony — albo zaktualizuj allowlistę z uzasadnieniem.

---

## Kiedy zaktualizować ten dokument

- Dodanie nowej tabeli w schemacie `public`.
- Zmiana polityki RLS (dodanie/usunięcie/poszerzenie).
- Wprowadzenie self-service dla pacjentów (wymaga `user_id` + polityk
  scoped do `auth.uid()`).
- Oznaczenie kolejnego findingu skanera jako „intentional/false positive”.
