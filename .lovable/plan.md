## Cel

Dodać treść opisową w formie punktów listy pod tytułem kafelka 04 « Okolica oka », analogicznie do kafelków 01–03.

## Zmiana

W pliku `src/routes/potrzeby.tsx`, w definicji kafelka `nr: "04"` (tile ze slugiem `okolica-oka`), dodać nowy klucz `bullets` z tablicą obiektów `BulletItem`. Struktura i styl renderowania są już gotowe w komponencie — wystarczy uzupełnić dane.

## Treść punktów (do wstawienia jako `bullets`)

```
[
  { title: "Otwarcie spojrzenia", text: "Zagęszczenie i lifting opadającej powieki górnej." }
  { title: "plastyka powieki górnej." },
  { title: "Redukcja obrzęku", text: "Zagęszczenie i poprawa jędrności wiotkiej skóry pod oczami niwelujemy zastoinowe sińce i obrzęki." },
  { title: "Wygładzenie « kurzych łapek »", text: "Stymulacja kolagenu w cienkiej skórze wokół oczu." },
]
```

## Weryfikacja

- Kafelek 04 wyświetla listę punktów pod tytułem.
- Styl (znaczki, typografia, odstępy) jest spójny z kafelkami 01–03.
- Podgląd w przeglądarce nie zgłasza błędów.