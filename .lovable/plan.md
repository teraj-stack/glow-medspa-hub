Cel: Dopasować odstępy i wysokość sekcji hero na stronie `/lekarze/halina-gabara` po usunięciu zdjęcia portretu, zachowując lewe wyrównanie treści i spójny wygląd na desktop oraz mobile.

## Obecny stan
- Sekcja hero zawiera tylko okruszki oraz blok tekstowy (bez zdjęcia).
- Paddingi: `pt-16 md:pt-24` oraz brak dolnego paddingu.
- Margines między okruszkami a tekstem: `mt-10`.
- Treść ograniczona do `max-w-3xl` i wyrównana do lewej.

## Plan zmian
1. Zwiększyć górny i dolny padding sekcji hero, aby wypełnić pustą przestrzeń po usuniętym zdjęciu:
   - mobile: `pt-20 pb-16`
   - tablet: `md:pt-32 md:pb-24`
   - desktop: `lg:pt-40 lg:pb-32`
2. Zwiększyć odstęp między okruszkami a nagłówkiem:
   - `mt-10` → `mt-12 md:mt-16`.
3. Zwiększyć odstęp między nagłówkiem H1 a opisem oraz podtytułem, aby zbalansować pionowy rytm:
   - `mt-3` pod etykietą i tytułem zawodowym → `mt-4 md:mt-5`
   - `mt-6` pod opisem głównym → `mt-8 md:mt-10`.
4. Rozważyć poszerzenie `max-w-3xl` do `max-w-4xl` lub zwiększenie interlinii opisu, by wykorzystać dostępną przestrzeń bez przesadzania.
5. Nie zmieniać wyrównania — treść pozostaje przy lewej krawędzi kontenera.
6. Nie dodawać z powrotem zdjęcia ani nowego elementu graficznego w hero.
7. Po edycji uruchomić build (`bun run build`) oraz wykonać smoke test wizualny na preview, by potwierdzić proporcję sekcji na desktop i mobile.

## Plik do edycji
- `src/routes/lekarze.halina-gabara.tsx` (linie 122–150, sekcja hero).