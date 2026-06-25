# Self-hosting na Vercel (Edge Runtime)

Projekt to TanStack Start v1 + Vite 7 + Nitro. Domyślny preset Nitro to `cloudflare`. Na Vercel używamy presetu **`vercel-edge`** (workerd-zgodny runtime, ten sam Web API co Cloudflare Workers — minimalne ryzyko regresji vs. Lovable Cloud preview).

## 1. Połącz repo

1. Lovable → **+ → GitHub → Connect project**.
2. W Vercel: **Add New… → Project → Import** z GitHub.
3. **Framework Preset**: `Other` (Vercel sam wykryje `vercel.json`).
4. **Root Directory**: `./`.

Build/install komendy są w `vercel.json` (`bun run build`, `bun install`, output `.output/public`). Nie nadpisuj ich w UI.

## 2. Zmienne środowiskowe

Ustaw w **Vercel → Project → Settings → Environment Variables** (Production + Preview + Development).

### Wymagane — klient (VITE_*, prefix wymagany przez Vite)

| Nazwa | Źródło | Opis |
|---|---|---|
| `VITE_SUPABASE_URL` | `.env` w Lovable | URL projektu Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `.env` w Lovable | Publishable / anon key |
| `VITE_SUPABASE_PROJECT_ID` | `.env` w Lovable | ID projektu (ref) |

### Wymagane — serwer (server functions / SSR)

| Nazwa | Źródło | Uwagi |
|---|---|---|
| `SUPABASE_URL` | = `VITE_SUPABASE_URL` | Czytane przez `requireSupabaseAuth` i `client.server.ts` |
| `SUPABASE_PUBLISHABLE_KEY` | = `VITE_SUPABASE_PUBLISHABLE_KEY` | Middleware auth + server publishable client |
| `SUPABASE_SERVICE_ROLE_KEY` | **Niedostępny w Lovable Cloud** — wymaga przejścia na własny projekt Supabase albo eksportu klucza service role przez supportwhen | Bypassuje RLS, używany przez `supabaseAdmin` (webhooki, role grants) |
| `NITRO_PRESET` | `vercel-edge` | Już ustawione w `vercel.json` |

### Opcjonalne (jeśli używasz danej funkcji)

| Nazwa | Funkcja |
|---|---|
| `LOVABLE_API_KEY` | Lovable AI Gateway (chat, image, embeddings) |
| `STRIPE_SANDBOX_API_KEY` / `STRIPE_LIVE_API_KEY` | Płatności |
| `PAYMENTS_SANDBOX_WEBHOOK_SECRET` / `PAYMENTS_LIVE_WEBHOOK_SECRET` | Weryfikacja webhooków Stripe |
| `GOOGLE_CALENDAR_API_KEY` | Synchronizacja kalendarza |
| `GOOGLE_SEARCH_CONSOLE_API_KEY` | SEO insights |

> **Uwaga o `SUPABASE_SERVICE_ROLE_KEY`**: Lovable Cloud go nie ujawnia. Jeśli kod produkcyjny używa `supabaseAdmin` (sprawdź `rg "supabaseAdmin" src`), self-host na Vercel wymaga albo:
> 1. własnego projektu Supabase (gdzie sam zarządzasz service role key), albo
> 2. refaktoru tych ścieżek na `requireSupabaseAuth` + RLS.

## 3. Webhooki Stripe (jeśli używasz)

Po pierwszym deployu zaktualizuj endpoint webhook w Stripe Dashboard:

- **Sandbox**: `https://<twoja-domena>/api/public/webhooks/stripe-sandbox`
- **Live**: `https://<twoja-domena>/api/public/webhooks/stripe-live`

(Dostosuj ścieżki do tych w `src/routes/api/public/`.)

## 4. Domena

W Vercel → **Settings → Domains** dodaj `bmclinics.ai`. Vercel pokaże rekordy DNS (A `76.76.21.21` lub CNAME). Zaktualizuj DNS u rejestratora — dotychczasowe rekordy Lovable (A → `185.158.133.1`) usuń.

## 5. Pierwszy deploy — checklist

- [ ] `vercel.json` w repo (jest)
- [ ] Wszystkie wymagane env vars dodane (Production + Preview)
- [ ] `NITRO_PRESET=vercel-edge` jest w `vercel.json` (jest)
- [ ] `bun install` przechodzi lokalnie
- [ ] `bun run build` produkuje `.output/public` + `.output/server`
- [ ] Po deployu: sprawdź `/lekarze` (publiczny read), `/auth` (sign-in), `/konto/wizyty` (protected route)

## 6. Cron jobs (jeśli masz pg_cron wskazujący na Lovable URL)

Po przeniesieniu na Vercel zaktualizuj URL-e w `pg_cron` (Supabase) — wskaż na nową domenę (np. `https://bmclinics.ai/api/public/cron/...`).

## Różnice vs. Lovable preview

| Co | Lovable Cloud | Vercel Edge |
|---|---|---|
| Runtime | Cloudflare Workers (workerd) | Vercel Edge (V8 isolates, web standard) |
| `nodejs_compat` | Tak | Tak (subset Node API) |
| Auto-deploy | Manualne „Update" | Automatyczne po pushu na `main` |
| Service role key | Ukryty | Musisz wstawić sam |
