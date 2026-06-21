Dodać tablicę `bullets` do kafelka 03 ("Rewitalizacja dłoni") w pliku `src/routes/potrzeby.tsx`.

Zmiana dotyczy obiektu w tablicy `TILES` (nr: "03"). Obecnie kafelek ma tylko `nr`, `slug`, `title`, `tagline` i `icon`. Należy dodać do niego właściwość `bullets` z trzema elementami `BulletItem` — każdy z samym polem `text`, bez `title` (zgodnie ze stylem kafelka 02). Treść bulletów:

1. **Dłonie** są wizytówką każdego z nas
2. Przywrócenie gęstości skórze dłoni, by odzyskały młody wygląd i nie zdradzały **wieku**. 
3. Usunięcie **plam starczych**
  Redukcja przebarwień i plam pigmentacyjnych na dłoniach i przedramionach — przywracamy jednolity koloryt skóry.

Komponent `PotrzebyPage` automatycznie wyrenderuje nowe bullets, ponieważ warunkowo renderuje `t.bullets` dla każdego kafelka.