# Self-hosting na Cloudflare Workers (auto-deploy z GitHub)

Projekt to TanStack Start + Nitro. **Domyślny preset Nitro to `cloudflare`** — Cloudflare to natywny target Lovable Cloud, więc to najmniej ryzykowna ścieżka self-hostu.

Masz dwie drogi: **Workers** (rekomendowane, pełna kontrola, GitHub Actions) lub **Pages** (prostsze, wbudowany Git integration). Poniżej obie.

---

## Wariant A — Workers + GitHub Actions (rekomendowane)

Pliki w repo:
- `wrangler.toml` — konfiguracja Workera
- `.github/workflows/deploy-cloudflare.yml` — auto-deploy na push do `main`

### 1. Cloudflare — utwórz API token

1. Cloudflare Dashboard → **My Profile → API Tokens → Create Token**.
2. Template: **Edit Cloudflare Workers**. Account = twoje konto. Zone Resources = `bmclinics.ai` (jeśli będziesz mapować domenę).
3. Skopiuj token.
4. Skopiuj też **Account ID** z prawego sidebara dowolnej strony Workers.

### 2. GitHub Secrets

W repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Wartość |
|---|---|
| `CLOUDFLARE_API_TOKEN` | token z kroku 1 |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID z kroku 1 |
| `VITE_SUPABASE_URL` | z `.env` w Lovable |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | z `.env` w Lovable |
| `VITE_SUPABASE_PROJECT_ID` | z `.env` w Lovable |

### 3. Sekrety runtime w Cloudflare (Worker secrets)

Lokalnie albo w CI:

```bash
bunx wrangler secret put SUPABASE_URL --env production
bunx wrangler secret put SUPABASE_PUBLISHABLE_KEY --env production
bunx wrangler secret put SUPABASE_SERVICE_ROLE_KEY --env production
bunx wrangler secret put LOVABLE_API_KEY --env production
# Stripe / Google jeśli używasz:
bunx wrangler secret put STRIPE_LIVE_API_KEY --env production
bunx wrangler secret put PAYMENTS_LIVE_WEBHOOK_SECRET --env production
bunx wrangler secret put GOOGLE_CALENDAR_API_KEY --env production
bunx wrangler secret put GOOGLE_SEARCH_CONSOLE_API_KEY --env production
```

Sekretów Cloudflare **nie wrzucaj do `wrangler.toml`** — `[env.production.vars]` jest publiczne i bundlowane do Workera.

> **`SUPABASE_SERVICE_ROLE_KEY` nie jest udostępniany przez Lovable Cloud.** Self-host wymaga albo własnego projektu Supabase, albo refaktoru ścieżek używających `supabaseAdmin` na `requireSupabaseAuth` + RLS.

### 4. Domena

W `wrangler.toml` odkomentuj linię:

```toml
routes = [{ pattern = "bmclinics.ai/*", custom_domain = true }]
```

Cloudflare automatycznie utworzy rekordy DNS pod warunkiem, że strefa `bmclinics.ai` jest już w twoim koncie Cloudflare. Jeśli domena jest u innego rejestratora — przenieś nameservery do Cloudflare lub użyj CNAME do `<worker>.<account>.workers.dev`.

### 5. Auto-deploy

Każdy push na `main` → GitHub Actions → build → `wrangler deploy --env production`. Status zobaczysz w **Actions** w repo.

---

## Wariant B — Cloudflare Pages (bez GitHub Actions)

Pages ma wbudowaną integrację z GitHub — auto-deploy out of the box, bez workflow YAML.

### 1. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git

- Wybierz repo, branch `main`.
- **Build command**: `bun run build`
- **Build output directory**: `.output/public`
- **Root directory**: `/`

### 2. Environment Variables (Settings → Variables)

Dodaj wszystkie z tabeli powyżej (sekcja 2 + 3 z Wariantu A) jako **Environment Variables**. Pages traktuje wszystkie jako runtime secrets — bez rozróżnienia.

Dodatkowo: `NITRO_PRESET=cloudflare_pages`.

### 3. Domena

**Custom domains → Set up a custom domain** → `bmclinics.ai`. Cloudflare doda DNS automatycznie.

---

## Mapping zmiennych — szybka ściągawka

| Nazwa | Build (klient) | Worker secret (runtime) | Źródło |
|---|---|---|---|
| `VITE_SUPABASE_URL` | ✅ | — | `.env` Lovable |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | ✅ | — | `.env` Lovable |
| `VITE_SUPABASE_PROJECT_ID` | ✅ | — | `.env` Lovable |
| `SUPABASE_URL` | — | ✅ | = VITE_SUPABASE_URL |
| `SUPABASE_PUBLISHABLE_KEY` | — | ✅ | = VITE_SUPABASE_PUBLISHABLE_KEY |
| `SUPABASE_SERVICE_ROLE_KEY` | — | ✅ | **własny Supabase** |
| `LOVABLE_API_KEY` | — | ✅ (jeśli AI) | Lovable AI Gateway |
| `STRIPE_*_API_KEY` | — | ✅ (jeśli płatności) | Stripe Dashboard |
| `PAYMENTS_*_WEBHOOK_SECRET` | — | ✅ (jeśli webhooks) | Stripe Dashboard |
| `GOOGLE_CALENDAR_API_KEY` | — | ✅ (jeśli kalendarz) | Google Cloud Console |

## Webhooks po przeniesieniu

Zaktualizuj URL-e w Stripe / pg_cron / innych integracjach na nową domenę:
- `https://bmclinics.ai/api/public/webhooks/...`
- `https://bmclinics.ai/api/public/cron/...`

## Test lokalny przed deployem

```bash
NITRO_PRESET=cloudflare-module bun run build
bunx wrangler dev --env production    # uruchamia Workera lokalnie z miniflare
```

## Sprawdzenie po pierwszym deployu

- [ ] `/` ładuje się, hero widoczny
- [ ] `/lekarze` — publiczny SELECT na `public_doctors` działa
- [ ] `/auth` → Google OAuth → redirect z powrotem na `bmclinics.ai`
- [ ] `/konto/wizyty` — protected route, sesja Supabase aktywna
- [ ] Webhook Stripe (sandbox) — `stripe trigger payment_intent.succeeded` trafia do `/api/public/webhooks/...`
