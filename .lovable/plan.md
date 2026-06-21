## Plan: Rozdzielenie tekstu "Lifting i owal" i numeru "01" w kaflu

### Problem
Obecnie w pierwszym kaflu (`przywrocenie-konturow`) pole `nr` zawiera `"LIFTING I OWAL 01"`, a cały ten tekst jest wyświetlany w prawym górnym rogu kafla. Użytkownik chce:
1. **"Lifting i owal"** po prawej stronie ikony (na wysokości ikony)
2. **"01"** pozostaje w prawym górnym rogu kafla

### Zmiany w kodzie

**1. Dane (`src/routes/potrzeby.tsx`)**
- Zmiana `nr: "LIFTING I OWAL 01"` → `nr: "01"`
- Dodanie nowego pola `tagline: "LIFTING I OWAL"` do typu `Tile` i do pierwszego elementu tablicy `TILES`

**2. Layout kafla**
- Opakowanie ikony i tagline w kontener flex-row (`flex items-center gap-4`)
- Tagline renderowany jako tekst po prawej stronie ikony ze stylami `text-xs uppercase tracking-[0.3em] text-champagne`
- Numer `nr` ("01") pozostaje jako `absolute right-6 top-6` (bez zmian)

### Plik do edycji
- `src/routes/potrzeby.tsx`