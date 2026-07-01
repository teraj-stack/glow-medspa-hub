# Automatyzacja raportów SEO

Codzienny cron pobiera dane z konektora Semrush, zapisuje migawkę w bazie, wysyła e-mail do admina i wystawia widok w panelu.

## Zakres (potwierdzony)

- Widoczność domeny `bmclinics.ai` (baza `pl`): liczba fraz + estymowany ruch organiczny.
- Top 25 rankujących fraz (pozycja, wolumen, URL).
- Top 3 konkurentów + luka słów kluczowych (limit 25).
- Uruchomienie: codziennie **06:00 (Europe/Warsaw)** = 04:00 UTC (cron `0 4 * * *`).
- Powiadomienie: **e-mail (Lovable Emails)** + **badge „nowe" w panelu /admin/seo/raporty**.

## Architektura

```text
pg_cron 04:00 UTC
      │
      ▼
POST /api/public/hooks/seo-snapshot        (apikey = anon)
      │  1) Semrush przez connector-gateway (3 wywołania)
      │  2) INSERT do public.seo_snapshots + seo_snapshot_keywords + seo_snapshot_competitors
      │  3) enqueue_email → template seo-daily-report
      ▼
Panel /admin/seo/raporty (Admin/Manager)
  ├─ lista migawek + trendline
  └─ szczegół migawki: KPI, top 25 fraz, konkurenci, gap
```

## Nowe tabele (migracja z GRANT + RLS)

- `seo_snapshots` — `id, captured_at, domain, database, organic_keywords, organic_traffic, organic_cost, error, seen_at`.
- `seo_snapshot_keywords` — `snapshot_id → seo_snapshots(id) on delete cascade`, `phrase, position, previous_position, search_volume, cpc, url, traffic_percent, position_index`.
- `seo_snapshot_competitors` — `snapshot_id, competitor_domain, common_keywords, authority_score, rank_position`.
- `seo_snapshot_gap_keywords` — `snapshot_id, competitor_domain, phrase, competitor_position, search_volume, cpc`.

RLS: SELECT tylko dla `Admin`/`Manager` (`has_role`). `service_role` pełny dostęp (dla crona).

## Konektor i sekrety

1. `standard_connectors--connect` z `connector_id: semrush` — użytkownik autoryzuje swoje konto Semrush (jednorazowo). Bez tego cron zapisze migawkę z `error = "connector_not_linked"`.
2. Do wysyłki e-maila potrzebna **domena e-mail w Lovable Cloud** (setup_email_infra). Jeśli jest już `notify.bmclinics.ai` — używamy. Jeśli nie — wyświetlę przycisk konfiguracji.
3. Adres odbiorcy: będę pobierał wszystkich użytkowników z rolą `admin` z `user_roles` + `profiles.email`.

## Endpoint crona

`src/routes/api/public/hooks/seo-snapshot.ts` (POST, `apikey` = anon publishable):

- Waliduje nagłówek `apikey`.
- Woła gateway: `GET /semrush/domains/domain_ranks`, `GET /semrush/domains/domain_organic` (limit 25), `GET /semrush/domains/domain_domains` (competitors + gap; ograniczenie kredytów).
- Kwoty/błędy 403 (`TOTAL LIMIT EXCEEDED`) → zapisuje wiersz z `error`, wysyła e-mail „quota exceeded", cron nie faila.
- Insert przez `supabaseAdmin` (import w handlerze).
- Enqueue e-maila `seo-daily-report` dla każdego admina (idempotency key: `seo-report-{YYYY-MM-DD}-{userId}`).

## Cron

Osobna migracja (nie `db--migration`, tylko `supabase--insert` — dane specyficzne dla projektu):

```sql
SELECT cron.schedule(
  'seo-daily-snapshot',
  '0 4 * * *',
  $$
  SELECT net.http_post(
    url := 'https://project--7c40afc9-5d62-4e26-8703-fb0c05436327.lovable.app/api/public/hooks/seo-snapshot',
    headers := '{"Content-Type":"application/json","apikey":"<ANON>"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);
```

Dodatkowo przycisk **„Uruchom teraz"** w panelu → serwerowa funkcja `runSeoSnapshotNow` wołająca ten sam handler wewnętrznie (dla Admina, z audit_log).

## Panel `/admin/seo/raporty`

- Route pod `_authenticated/admin/seo.raporty.tsx` (Admin/Manager, log w audit_log przy odmowie).
- Karty KPI: aktualna liczba fraz, ruch, delta d/d.
- Sparkline 30 dni (rekurencyjne odczyty z `seo_snapshots`).
- Tabela: 25 rankujących fraz z kolumną Δ pozycji (join do wczorajszej migawki).
- Sekcja konkurencji + gap keywords.
- Przycisk „Pobierz Markdown" — generuje raport w formacie identycznym z dzisiejszym.

## Szablon e-maila

`src/lib/email-templates/seo-daily-report.tsx` (React Email, spójny z motywem):

- Nagłówek z datą i domeną.
- 3 kafle KPI (frazy / ruch / delta).
- Top 5 rankujących fraz.
- CTA „Zobacz pełny raport w panelu" → `/admin/seo/raporty/{id}`.
- Sekcja „quota exceeded" gdy migawka nie wyszła.

## Kolejność wdrożenia (pojedyncze PR-y w jednym turcie, jeśli quota Semrush pozwoli)

1. Migracja: 4 tabele + RLS + GRANT.
2. `standard_connectors--connect` (Semrush) — otwiera modal użytkownikowi.
3. Weryfikacja domeny e-mail (`check_email_domain_status`) → jeśli brak, przycisk setup przed dalszymi krokami.
4. Scaffold `email_domain--scaffold_transactional_email` + szablon `seo-daily-report`.
5. Endpoint `/api/public/hooks/seo-snapshot`.
6. Cron przez `supabase--insert`.
7. Panel `/admin/seo/raporty` + link w sidebarze admina.
8. Test manualny (przycisk „Uruchom teraz") → weryfikacja migawki w bazie + odebranie e-maila.

## Kwestie do świadomej akceptacji

- **Quota Semrush**: dzienna migawka kosztuje ~3 wywołania API (5 z listą fraz). Konto darmowe ma bardzo niski limit — może wystarczyć, ale przy błędach 403 dostaniesz e-mail z komunikatem. Rekomendacja: konto Guru/Business, jeśli chcesz stabilnie historię dzienną.
- **Domena `bmclinics.ai`** dziś ma **0 rankujących fraz** w Semrush (raport z dziś). Migawki będą pokazywać zera, dopóki Google nie zaindeksuje — automatyzacja i tak się przyda, żeby wyłapać moment pierwszego rankingu.
- **Kwestia Warszawa/Siedlce** wciąż otwarta — dopóki nie zdecydujesz, cron będzie mierzył `bmclinics.ai` w bazie `pl` bez zmian geo.

Zatwierdź, żebym zaczął implementację.
