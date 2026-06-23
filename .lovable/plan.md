# System rezerwacji online — Google Calendar per lekarz

Konektor **Google Calendar** jest już podłączony do projektu (sekret `GOOGLE_CALENDAR_API_KEY`). Wszystkie kalendarze, które mają być używane, muszą być udostępnione (Settings → Share) na konto Google, którym podłączono konektor — z uprawnieniem **„Make changes to events"**.

---

## Etap 1 — Fundament (proponuję zacząć teraz)

### 1.1. Schemat bazy (migracja)

```text
doctors
  id (uuid, pk)
  slug (text, unique)            -- np. "anna-kowalska"
  full_name, title, bio, photo_url
  google_calendar_id (text)      -- np. "anna@bmclinics.pl"
  slot_minutes (int, default 30)
  buffer_minutes (int, default 15)
  active (bool, default true)
  created_at, updated_at

working_hours
  id, doctor_id (fk),
  weekday (0–6),                 -- 0 = niedziela
  start_time, end_time           -- np. 09:00 – 17:00
  (jeden lekarz może mieć kilka bloków dziennie: 9–13, 14–18)

time_off
  id, doctor_id (fk),
  starts_at, ends_at, reason

bookings
  id (uuid),
  doctor_id (fk),
  treatment_id (fk → treatment_catalog, nullable na start)
  patient_name, patient_email, patient_phone, notes
  starts_at, ends_at (timestamptz)
  status: pending | confirmed | cancelled | completed | no_show
  google_event_id (text, nullable)
  cancel_token (uuid, unique)    -- link cancel/reschedule w mailu
  rodo_consent (bool)
  created_at, updated_at
  UNIQUE (doctor_id, starts_at) WHERE status IN ('pending','confirmed')
```

RLS: pacjent widzi własne (po `cancel_token`), admin widzi wszystko, anon może `INSERT` do `bookings` (publiczny formularz). `working_hours` i `doctors` — publiczny SELECT (tylko `active=true`, bezpieczne kolumny).

### 1.2. Panel admin do zarządzania lekarzami i godzinami

Pod `/_authenticated/admin/lekarze` (rola `admin`):
- dodawanie lekarza + wklejenie `google_calendar_id`
- przycisk **„Testuj kalendarz"** — wywołuje gateway `freebusy.query` na ten kalendarz na najbliższe 7 dni; pokazuje OK / błąd (brak udostępnienia, błędny ID)
- edycja godzin pracy (tabela tygodniowa) i urlopów

### 1.3. Endpoint wolnych terminów

`getAvailableSlots({ doctorId, dateFrom, dateTo, durationMinutes })` — server fn:

```text
1. Pobierz doctor + working_hours + time_off
2. Wygeneruj sloty co `slot_minutes` w godzinach pracy w zakresie dat
3. Odetnij time_off
4. Odetnij bookings (pending/confirmed) z bufforem
5. Wywołaj Google Calendar freebusy.query dla doctor.google_calendar_id
6. Odetnij busy intervals z Google
7. Zwróć dostępne sloty (ISO timestamps)
```

---

## Etap 2 — Rezerwacja przez pacjenta

`/rezerwacja` → wybór lekarza → kalendarz → slot → formularz (imię, email, telefon, notatki, RODO) → potwierdzenie.

Server fn `createBooking`:
1. Walidacja Zod
2. Re-check slotu (atomowo — UNIQUE constraint zabezpiecza race)
3. INSERT do `bookings` (status `pending`)
4. Google Calendar `events.insert` na kalendarz lekarza → zapisz `google_event_id`
5. Email do pacjenta (potwierdzenie + link cancel) i do kliniki — przez istniejący Resend
6. Zwróć `{ id, cancel_token }`

Strona `/rezerwacja/{cancel_token}` — pacjent może anulować/przełożyć; backend usuwa/aktualizuje event w Google.

---

## Etap 3 — Płatność (opcjonalna, później)

Jeśli zechcesz wymagać przedpłaty (np. konsultacja 200 zł), wpinamy istniejący Stripe Checkout między krok 3 a 4: rezerwacja staje się `confirmed` dopiero po webhooku `checkout.session.completed`. Bez tego — sloty mogą być blokowane przez „no-show". Decyzja na etap 2/3.

---

## Etap 4 — Panel kliniki

Pod `/_authenticated/admin/rezerwacje`:
- lista wszystkich rezerwacji (filtry: lekarz, status, zakres dat)
- ręczne tworzenie/anulowanie (z synchronizacją Google)
- blokowanie godzin (time_off) bez tworzenia bookingu

---

## Bezpieczeństwo
- RLS na każdej tabeli
- Rate limit po hashed IP na `createBooking` (jak w `submitBooking`)
- `events.insert` wywoływane tylko z server fn — `GOOGLE_CALENDAR_API_KEY` nigdy nie trafia do przeglądarki
- Walidacja, że wybrany slot mieści się w `working_hours` i nie koliduje z `time_off`

---

## Co potrzebuję od Ciebie do startu Etapu 1

1. **Lista lekarzy** — imię, nazwisko + adres kalendarza Google (np. `anna.kowalska@bmclinics.pl`) **lub** „zaczynamy z jednym, dodam resztę później".
2. **Domyślna długość wizyty + bufor** (np. konsultacja 60 min, bufor 15 min między pacjentami).
3. **Potwierdzenie**: czy chcesz teraz wymagać przedpłaty Stripe na rezerwację, czy zostawiamy to na później (rekomendacja: później — najpierw uruchommy sam mechanizm, prepay dodamy gdy zobaczysz no-show).

Po Twojej odpowiedzi tworzę migrację bazy + panel admina do zarządzania lekarzami + endpoint `getAvailableSlots` z testem na żywym kalendarzu.
