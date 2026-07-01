
# Plan treści i struktura landingów — Warszawa (Bielany / Promedion)

Cel: realny ruch z Google w Warszawie na frazy związane z **technologiami zabiegowymi** („device settings" = konfiguracja/protokół urządzenia w kontekście SEO ≙ landing per-technologia) i **wskazaniami** (co problem klienta rozwiązuje). Zero nazw handlowych sprzętu w treści publicznej — używamy nazw generycznych (laser frakcyjny CO₂, laser pikosekundowy, laser tulowy 1927 nm, HIFU, IPL, RF mikroigłowe itd.).

Źródło volume/KDI: Semrush, baza `pl` (Polska).

---

## 1. Architektura tras (hub-and-spoke)

```text
/technologie                        (hub istniejący — link-hub)
  ├─ /technologie/laser-pikosekundowy-warszawa      [NEW]
  ├─ /technologie/laser-frakcyjny-co2-warszawa      [NEW]
  ├─ /technologie/laser-tulowy-1927-warszawa        [NEW]
  ├─ /technologie/hifu-warszawa                     [NEW]
  ├─ /technologie/ipl-fotoodmladzanie-warszawa      [NEW]
  └─ /technologie/rf-mikroiglowe-warszawa           [NEW]

/wskazania                          (hub NOWY — spis wskazań)
  ├─ /wskazania/przebarwienia-warszawa              [NEW, priorytet]
  ├─ /wskazania/melasma-ostuda-warszawa             [NEW]
  ├─ /wskazania/blizny-potradzikowe-warszawa        [NEW]
  ├─ /wskazania/naczynka-rumien-warszawa            [NEW]
  ├─ /wskazania/rozstepy-warszawa                   [NEW]
  ├─ /wskazania/tatuaz-usuwanie-warszawa            [NEW]
  └─ /wskazania/wiotkosc-lifting-bez-skalpela-wwa   [NEW]
```

Każdy landing „technologia" cross-linkuje ≥3 wskazania i odwrotnie. Hub `/wskazania` z krótkim opisem + tile grid — realny page (nie sam sitemap).

---

## 2. Priorytet frazowy (dane Semrush, baza PL)

| # | Fraza | Vol/mo | KDI | Typ | Landing |
|---|-------|-------:|----:|-----|---------|
| 1 | laser frakcyjny warszawa | 1 000 | 13 | technologia | /technologie/laser-frakcyjny-co2-warszawa |
| 2 | mezoterapia igłowa warszawa | 390 | 11 | technologia | (jeśli oferowana; poza planem) |
| 3 | hifu warszawa | 320 | 14 | technologia | /technologie/hifu-warszawa |
| 4 | laser co2 warszawa | 260 | 11 | technologia | (wariant #1, canonical → #1) |
| 5 | usuwanie przebarwień warszawa | 260 | 16 | wskazanie | /wskazania/przebarwienia-warszawa |
| 6 | laserowe usuwanie przebarwień warszawa | 210 | — | wskazanie | ↑ ta sama, sekcja + H2 |
| 7 | zamykanie naczynek warszawa | 140 | 17 | wskazanie | /wskazania/naczynka-rumien-warszawa |
| 8 | fotoodmładzanie warszawa | 140 | 13 | technologia | /technologie/ipl-fotoodmladzanie-warszawa |
| 9 | laser pikosekundowy warszawa | 110 | 11 | technologia | /technologie/laser-pikosekundowy-warszawa |

Wszystkie KDI 11–17 → **realne do wejścia w top 10 w 8–16 tyg.** przy AS domeny 20-40 i konsekwentnej publikacji. Sumaryczny „pool" ~2 830 wyszukiwań/mies. bez frazy „melasma" (4 400/mies., KDI wyższe — traktujemy jako aspirational).

Nie targetujemy: „laser frakcyjny cena", „laser co2 efekty" — ogólnopolskie, wchłonie je blog, nie landing lokalny.

---

## 3. Szablon landingu TECHNOLOGIA (H1–H3)

Tytuł: `Laser frakcyjny CO₂ Warszawa — protokół, wskazania, cena | BMClinics.ai` (≤60)
Meta: `Laser frakcyjny CO₂ w Warszawie (Bielany). Wskazania, przebieg, rekonwalescencja, cennik. Konsultacja lekarska w Klinice Promedion.` (≤160)

```text
H1  Laser frakcyjny CO₂ w Warszawie
  (eyebrow: „Bielany · Klinika Promedion, Wójcickiego 4")
  [Blok: krótki lead 2 zdania + primary CTA „Rezerwuj konsultację"]

H2  Dla kogo — wskazania
  H3  Blizny potrądzikowe i pozabiegowe
  H3  Zmarszczki okolic oczu i ust
  H3  Rozstępy, zmiany posłoneczne
  H3  Kiedy laser CO₂ NIE jest wskazany (przeciwwskazania)

H2  Jak wygląda zabieg krok po kroku
  H3  Konsultacja i kwalifikacja lekarska
  H3  Przebieg zabiegu (znieczulenie, czas, odczucia)
  H3  Rekonwalescencja dzień po dniu (D0-D14)

H2  Efekty i seria zabiegów
  H3  Kiedy widać efekt (before/after grid)
  H3  Rekomendowana seria i odstępy

H2  Bezpieczeństwo w Warszawie
  H3  Kwalifikacja pacjenta i badanie skóry
  H3  Ochrona przed powikłaniami — nasz protokół
  [link out → /bezpieczenstwo-zabiegow-laserowych]

H2  Cennik zabiegu w Warszawie
  H3  Cena za obszar
  H3  Pakiety serii
  [link out → /cennik]

H2  FAQ (5–7 pytań, JSON-LD FAQPage)

H2  Umów konsultację
  [Blok NAP + mapa Promedion + BookingFormLazy]
```

Wymagania techniczne per landing:
- JSON-LD `MedicalProcedure` + `MedicalClinic` (z `/#clinic`) + `FAQPage`.
- OG image = zdjęcie efektu / gabinetu (nie stock).
- Linki wewnętrzne: 3× do powiązanych `/wskazania/*`, 1× do `/lekarze`, 1× do `/diagnostyka-skory-warszawa`.
- Breadcrumb JSON-LD: `Strona główna › Technologie › [nazwa]`.
- Zero nazw handlowych sprzętu (zgodnie z memory rule).

---

## 4. Szablon landingu WSKAZANIE (H1–H3)

Tytuł: `Usuwanie przebarwień Warszawa — diagnostyka i leczenie | BMClinics.ai`
Meta: `Przebarwienia posłoneczne, hormonalne i pozapalne. Diagnostyka spektralna i dobór terapii lekarskiej w Warszawie (Bielany).`

```text
H1  Usuwanie przebarwień w Warszawie

H2  Rodzaje przebarwień i skąd się biorą
  H3  Posłoneczne (soczewicowate)
  H3  Melasma / ostuda (hormonalna)
  H3  Pozapalne (po trądziku, po zabiegach)
  H3  Barwnikowe zmiany naczyniowe (różnicowanie)

H2  Diagnostyka — dlaczego zaczynamy od badania skóry
  [link out → /diagnostyka-skory-warszawa]
  H3  Analiza spektralna i mapping barwnika
  H3  Klasyfikacja fototypu (Fitzpatrick)

H2  Metody leczenia dobierane w klinice
  H3  Laser pikosekundowy — dla trwałych, głębokich plam
  H3  Laser tulowy 1927 nm — dla powierzchownych, rozlanych
  H3  Kwasy medyczne i terapie łączone
  H3  Farmakoterapia miejscowa i domowa fotoprotekcja
  (każdy H3 linkuje do właściwej /technologie/*)

H2  Czego oczekiwać po serii — realne efekty
  H3  Kalendarz leczenia (rozłożenie w miesiące)
  H3  Ryzyko nawrotu i jak mu zapobiegamy

H2  Bezpieczeństwo i przeciwwskazania

H2  Cennik konsultacji i zabiegów w Warszawie

H2  FAQ (JSON-LD FAQPage; 6–8 pytań z People Also Ask)
  „Czy laser usuwa przebarwienia raz na zawsze?"
  „Ile kosztuje usuwanie przebarwień w Warszawie?"
  „Kiedy nie robić lasera na przebarwienia?"
  „Czy melasmę można wyleczyć?"
  „Ile trwa rekonwalescencja?"

H2  Umów diagnostykę skóry
  [NAP + BookingFormLazy]
```

---

## 5. Sekcja lokalna — powtarzalny blok „Warszawa"

Ten sam komponent na każdym landingu (spójność NAP, waga lokalna):

- H2 „Gdzie wykonujemy zabieg w Warszawie"
- Adres + dzielnica (Bielany) + dojazd (metro Młociny 8 min, parking Promedion)
- Osadzone Google Maps (lazy)
- Godziny (z `nap_settings`)
- Link do Google Business Profile
- Mikro-blok „Obsługujemy pacjentów z: Bielany, Bemowo, Żoliborz, Śródmieście, Łomianki"

---

## 6. Wsparcie blogiem (klaster tematyczny — 3 mies.)

Blog karmi landingi linkowaniem wewnętrznym (anchor = fraza lokalna).

Priorytet publikacji:
1. „Laser frakcyjny — dzień po dniu (D0-D14)" — vol 2 400, KDI niskie → link do `/technologie/laser-frakcyjny-co2-warszawa`
2. „Melasma vs przebarwienia posłoneczne — jak odróżnić" → `/wskazania/melasma-ostuda-warszawa`
3. „Ile trwa rekonwalescencja po laserze CO₂" → j.w.
4. „Czy laser pikosekundowy boli" (long tail informational) → `/technologie/laser-pikosekundowy-warszawa`
5. „Zamykanie naczynek — laser czy IPL" → `/wskazania/naczynka-rumien-warszawa`
6. „Fotoprotekcja po zabiegu — przewodnik" → link ze wszystkich landingów wskazań

---

## 7. Kolejność wdrożenia (co robię, gdy zaakceptujesz)

1. **Landing #1**: `/wskazania/przebarwienia-warszawa` — najwyższy stosunek volume/KDI + linkuje w 3 istniejące technologie.
2. **Landing #2**: `/technologie/laser-frakcyjny-co2-warszawa` — największy pojedynczy volume (1 000/mies.).
3. Hub `/wskazania` + shell komponentu `LocalWarsawSection` re-użyty w obu.
4. Sitemap + JSON-LD BreadcrumbList + wpięcie w `/technologie` i menu.
5. IndexNow ping po każdym z landingów (mamy już /admin/seo/indeksacja).
6. Kolejne 5 landingów w cyklu 1/tydzień, plus 2 posty blogowe/tydzień z klastra.

Prognoza: pierwsze pozycje 5–20 w 4–6 tyg. dla KDI ≤17; wejście top 10 dla ≥3 fraz w 12 tyg.

---

## 8. Czego celowo NIE robimy

- Nie tworzymy landingu per marka urządzenia (rule projektu).
- Nie duplikujemy „laser co2 warszawa" osobno od „laser frakcyjny warszawa" — jeden landing, canonical, dwa H2 w treści.
- Nie targetujemy fraz Siedlce (przekierowane, nie odpowiadają lokalizacji).
- Nie ścigamy „melasma" (4 400/mies., KDI wysokie, ogólnopolska) samodzielnie — wchodzimy long-tailem lokalnym „melasma leczenie warszawa".
