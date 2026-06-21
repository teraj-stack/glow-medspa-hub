W zaznaczonym elemencie tekstowym (pierwszy punkt w kafelku "Przywrócenie konturów") pogrubić zwrot "z wiekiem" w linii "Wyostrzenie linii żuchwy, która z wiekiem traci swój zarys.".

Zmiana obejmuje:
1. Modyfikację renderowania `b.text` w komponencie `src/routes/potrzeby.tsx`, aby podzielić tekst na fragmenty i opakować zwrot "z wiekiem" w `<strong>` z odpowiednią klasą stylistyczną.
2. Zachowanie istniejącego układu dwuliniowego (`whitespace-pre-line`) i reszty stylów.