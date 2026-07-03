## Problem (potwierdzony)

Na `/wskazania` jest 7 kafelków, ale `src/routes/wskazania.$slug.tsx` zawiera treść tylko dla `przebarwienia-warszawa`. Pozostałe 6 (`melasma-ostuda-warszawa`, `blizny-potradzikowe-warszawa`, `naczynka-rumien-warszawa`, `rozstepy-warszawa`, `tatuaz-usuwanie-warszawa`, `wiotkosc-lifting-bez-skalpela-wwa`) wpadają w `throw notFound()` → strona „Nie znaleziono wskazania". Dodatkowo istniejąca treść `Przebarwienia` odwołuje się jeszcze do starego adresu (Bielany / Promedion), który zgodnie z pamięcią projektu jest nieaktualny — nowy adres to **ul. Branickiego 10 (klinika ginekologii)**.

Do wyboru masz dwie ścieżki — proszę o decyzję, którą wdrażam.

## Opcja A — Szybka naprawa (dziś, ~5 min pracy)

Zostawiamy tylko działający kafelek. Usuwamy 6 pozostałych z tablicy `INDICATIONS`, dopóki nie mamy treści. Efekt: hub przestaje kłamać, brak martwych linków, żaden ruch nie trafia w ślepy zaułek.

Zmiany:
- `src/routes/wskazania.index.tsx` — `INDICATIONS` zredukowane do 1 pozycji (Przebarwienia).
- `src/routes/wskazania.$slug.tsx` — aktualizacja treści `przebarwienia-warszawa`: „Bielany / Klinika Promedion" → „Branickiego 10 (klinika ginekologii)" w intro, meta, keywords.
- `src/routes/wskazania.index.tsx` — analogiczna aktualizacja DESCRIPTION.

## Opcja B — Pełne wskazania (rekomendowana docelowo)

Dopisujemy 6 brakujących wpisów `IndicationContent` w tym samym schemacie co `przebarwienia-warszawa` (intro, 3–4 `types`, 3–4 `methods`, `timeline`, `contraindications`, `priceNote`, 4–5 pytań FAQ). Aby uniknąć zmyślonych obietnic klinicznych i cen, potrzebuję od Ciebie:

1. Dla każdego z 6 wskazań: **potwierdzenie technologii**, które oferujesz (np. Melasma → laser tulowy 1927 nm + farmakoterapia; Blizny potrądzikowe → laser frakcyjny CO2 + mikroigłowe RF; Naczynka → laser naczyniowy 532/1064 nm; Rozstępy → laser frakcyjny + biostymulator; Tatuaż → laser pikosekundowy; Wiotkość → HIFU / RF mikroigłowe / biostymulatory).
2. **Ceny od** dla każdego wskazania (sesja + orientacyjna seria).
3. **Zakres skuteczności / limitacji**, który chcesz komunikować (np. „melasma jest przewlekła, kontrolujemy nie leczymy").
4. Zgodę na standardową listę przeciwwskazań (ciąża/karmienie tam gdzie zasadne, izotretynoina 6 mies., aktywne infekcje, opalenizna, fotodermatozy) lub Twoje modyfikacje.

Po otrzymaniu punktów 1–4 generuję 6 wpisów bez nazw handlowych urządzeń, z adresem Branickiego 10, i dopisuję je równocześnie do `src/lib/sitemap-entries.ts` (żeby wszystkie 7 stron trafiły do sitemapy).

## Techniczne szczegóły

- Struktura `IndicationContent` już istnieje — nie ruszam schematu ani routingu.
- Sitemapa: obecnie `src/lib/sitemap-entries.ts` ma tylko `/wskazania/przebarwienia-warszawa`. W Opcji A zostaje jak jest. W Opcji B dopisuję 6 pozostałych URL-i.
- Route dynamiczny `/wskazania/$slug` z `notFound()` zostaje bez zmian — to prawidłowe zabezpieczenie na literówki w URL.
- Nie ruszam `notFoundComponent` — ma sensowną treść, po prostu przestanie się pojawiać przy klikaniu z huba.

## Rekomendacja

**Wdrażam Opcję A od razu**, żeby zatrzymać krwotok martwych linków, a Opcję B robimy jak prześlesz dane kliniczne (pkt 1–4). Napisz „A", „B" albo „A + zbieram dane do B".