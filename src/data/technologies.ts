/**
 * Katalog technologii — opisy WYŁĄCZNIE techniczne (zgodność z prawem reklamy
 * wyrobów medycznych). Nie używamy nazw handlowych urządzeń w treści publicznej.
 */
export type PricingItem = { label: string; price: number | null; note?: string };
export type FaqItem = { q: string; a: string };

export type Technology = {
  slug: string;
  name: string;            // techniczna nazwa publiczna
  category: "twarz" | "ciało" | "intymność" | "skóra" | "modelowanie";
  shortDesc: string;
  mechanism: string;       // jak działa
  applicators?: string[];  // głowice / tryby
  indications: string[];
  contraindications?: string[];
  pricing: PricingItem[];
  faq: FaqItem[];
};

export const TECHNOLOGIES: Technology[] = [
  {
    slug: "virtue-rf",
    name: "Radiofrekwencja mikroigłowa",
    category: "twarz",
    shortDesc: "Frakcyjna stymulacja kolagenu energią RF z precyzyjnie sterowanymi mikroigłami.",
    mechanism:
      "Izolowane mikroigły dostarczają energię o częstotliwości radiowej na zadaną głębokość (0,5–3,5 mm), inicjując kontrolowaną neokolagenezę bez naruszenia naskórka.",
    applicators: ["głowica 36-igłowa", "głowica 12-igłowa do okolicy oka"],
    indications: ["wiotkość owalu twarzy", "blizny potrądzikowe", "rozszerzone pory", "rozstępy"],
    contraindications: ["ciąża", "rozrusznik serca", "aktywne stany zapalne skóry"],
    pricing: [
      { label: "Twarz", price: 2400 },
      { label: "Twarz + szyja", price: 3200 },
      { label: "Szyja + dekolt", price: 2200 },
    ],
    faq: [
      { q: "Ile zabiegów potrzeba?", a: "Najczęściej rekomendujemy serię 3 zabiegów w odstępach 4–6 tygodni." },
      { q: "Kiedy widać efekty?", a: "Pierwsze efekty po 3–4 tygodniach, pełna przebudowa do 6 miesięcy." },
    ],
  },
  {
    slug: "laser-tulowy",
    name: "Laser tulowy 1927 nm",
    category: "skóra",
    shortDesc: "Frakcyjna fototermoliza ułamkowa do regeneracji warstwy naskórkowej.",
    mechanism:
      "Wiązka 1927 nm absorbowana jest selektywnie przez wodę w naskórku, tworząc mikrokolumny koagulacji, które przyspieszają wymianę komórkową.",
    indications: ["przebarwienia posłoneczne", "melasma", "fotostarzenie", "drobne zmarszczki"],
    pricing: [
      { label: "Twarz", price: 1400 },
      { label: "Twarz + szyja", price: 1900 },
    ],
    faq: [
      { q: "Czy zabieg boli?", a: "Stosujemy znieczulenie miejscowe — odczucie ciepła i mrowienia jest do zaakceptowania." },
    ],
  },
  {
    slug: "fusion-plasma",
    name: "Zimna plazma fuzyjna",
    category: "twarz",
    shortDesc: "Niskotemperaturowa plazma do nieablacyjnej regeneracji skóry powiek.",
    mechanism:
      "Strumień zjonizowanego gazu inicjuje natychmiastową sublimację powierzchniowych komórek przy zachowaniu integralności warstw głębszych.",
    indications: ["opadająca powieka górna", "kurze łapki", "drobne zmarszczki wokół ust"],
    pricing: [{ label: "Powieka górna", price: 1200 }, { label: "Okolica oczu", price: 1600 }],
    faq: [{ q: "Czas rekonwalescencji?", a: "Drobne strupki do 5–7 dni. Powrót do aktywności zawodowej zwykle następnego dnia." }],
  },
  {
    slug: "hifu",
    name: "HIFU 6w1 — skupiona ultradźwiękowa stymulacja",
    category: "twarz",
    shortDesc: "Liftingujące działanie ultradźwięków skupionych dostarczanych na 6 głębokościach.",
    mechanism:
      "Skupione fale ultradźwiękowe (HIFU) generują punktowe ogniska koagulacji termicznej na głębokościach od 1,5 do 13 mm, inicjując obkurczanie SMAS i nową syntezę kolagenu.",
    applicators: ["1,5 mm", "3,0 mm", "4,5 mm", "6 mm", "9 mm", "13 mm"],
    indications: ["wiotkość owalu", "lifting bezoperacyjny", "modelowanie linii żuchwy", "modelowanie ciała"],
    pricing: [
      { label: "Owal twarzy", price: 2800 },
      { label: "Twarz + szyja", price: 3600 },
      { label: "Brzuch", price: 2400 },
    ],
    faq: [{ q: "Ile trwa efekt?", a: "Do 12–18 miesięcy w zależności od wieku i stylu życia." }],
  },
  {
    slug: "ipl-bm14",
    name: "System IPL — światło intensywnie pulsacyjne",
    category: "skóra",
    shortDesc: "Selektywna fototermoliza dla zmian naczyniowych i barwnikowych.",
    mechanism: "Szerokopasmowe światło 500–1200 nm absorbowane jest przez hemoglobinę i melaninę.",
    indications: ["rumień", "teleangiektazje", "plamy soczewicowate", "fotoodmładzanie"],
    pricing: [{ label: "Twarz", price: 900 }, { label: "Dłonie", price: 600 }],
    faq: [],
  },
  {
    slug: "alexpulse-cl300",
    name: "Laser Nd:YAG / aleksandrytowy długi impuls",
    category: "skóra",
    shortDesc: "Dwie długości fali do trwałej redukcji owłosienia i zmian naczyniowych.",
    mechanism: "Selektywna absorpcja przez melaninę mieszka włosowego (755 nm) lub hemoglobinę (1064 nm).",
    indications: ["trwała redukcja owłosienia", "naczynka twarzy", "naczynka kończyn dolnych"],
    pricing: [
      { label: "Pachy", price: 250 },
      { label: "Bikini głębokie", price: 450 },
      { label: "Całe nogi", price: 850 },
    ],
    faq: [],
  },
  {
    slug: "peeling-weglowy-laserowy",
    name: "Peeling węglowy laserowy",
    category: "skóra",
    shortDesc: "Laserowa fototermoliza pasty węglowej dla efektu « lunchtime ».",
    mechanism: "Pasta węglowa wnika w pory i staje się chromoforem dla wiązki laserowej, oczyszczając i zwężając ujścia gruczołów.",
    indications: ["rozszerzone pory", "skóra mieszana i tłusta", "matowość"],
    pricing: [{ label: "Twarz", price: 600 }],
    faq: [],
  },
  {
    slug: "picoking",
    name: "Laser pikosekundowy",
    category: "skóra",
    shortDesc:
      "Impulsy 350 pikosekund w trzech długościach fali (1064 / 755 / 532 nm) — efekt fotoakustyczny zamiast termicznego. Jedyne takie urządzenie w promieniu 120 km od Siedlec.",
    mechanism:
      "Ultrakrótkie impulsy (350 ps) rozbijają pigment falą uderzeniową ciśnienia, a nie ciepłem. Otaczające tkanki pozostają chłodne — bezpieczne dla fototypów III–V, niemal bez ryzyka przebarwień pozapalnych (PIH).",
    applicators: [
      "1064 nm — jednorodna plamka + rękojeść frakcyjna (tekstura, rewitalizacja)",
      "755 nm — jednorodna plamka + rękojeść frakcyjna Honeycomb (blizny, melasma)",
      "532 nm — jednorodna plamka + rękojeść frakcyjna (przebarwienia, rumień — najskuteczniejsza długość fali do usuwania rumienia)",
      "Rękojeść 650 nm — Green tattoo (zielone tatuaże)",
      "Rękojeść 585 nm — Hemangioma treatment (naczyniaki)",
    ],
    indications: [
      "melasma i przebarwienia oporne na leczenie",
      "plamy soczewicowate i posłoneczne",
      "blizny potrądzikowe",
      "tatuaże wielokolorowe (każdy odcień)",
      "rozszerzone pory i nierówna tekstura",
      "fotoodmładzanie i drobne zmarszczki",
      "znamię Oty i Ito",
    ],
    contraindications: ["ciąża i karmienie piersią", "aktywna opryszczka", "świeża opalenizna", "leki światłouczulające", "choroby autoimmunologiczne w fazie zaostrzenia"],
    pricing: [
      { label: "Toning twarzy (pikosekundowy)", price: 900 },
      { label: "Pakiet 4× toning twarzy", price: 3200 },
      { label: "Melasma — twarz (1 sesja)", price: 1400 },
      { label: "Blizny potrądzikowe — twarz", price: 1800 },
      { label: "Hollywood Peel (carbon)", price: 700 },
      { label: "Usuwanie tatuażu — do 5 cm²", price: 500 },
      { label: "Przebarwienia — dłonie / dekolt", price: 1200 },
    ],
    faq: [
      { q: "Czym laser pikosekundowy różni się od starszych laserów Q-Switched?", a: "Impuls jest około 1000 razy krótszy (350 pikosekund vs nanosekundy). Pigment jest rozbijany ciśnieniem fali uderzeniowej, a nie ciepłem — dzięki temu skóra wokół nie ulega oparzeniu, a makrofagi sprawniej usuwają rozdrobniony pył barwnika. Mniej sesji, brak śladów po 2–4 godzinach." },
      { q: "Ile sesji potrzeba?", a: "Toning i fotoodmładzanie — seria 4–6 zabiegów co 3–4 tygodnie. Melasma — 3–5 sesji w trybie Dual Pulse. Blizny potrądzikowe — 4–6 sesji w trybie frakcyjnym Honeycomb. Tatuaż — średnio 4–8 sesji co 6–8 tygodni." },
      { q: "Jak długo trwa rekonwalescencja?", a: "Laser pikosekundowy pracuje wyłącznie w protokołach złożonych (zimna plazma + rewitalizacja + fototerapia LED). Dzięki temu rekonwalescencja jest minimalna — zwykle zero śladów już po 2–4 godzinach. Planowanie urlopu czy rezygnacja z aktywności jest niepotrzebna." },
      { q: "Czy zabieg boli?", a: "W trybie Multipulse (MPTP) zabieg jest niemal bezbolesny. W pozostałych trybach stosujemy chłodzenie i krem znieczulający." },
      { q: "Dlaczego ceny są na poziomie warszawskim?", a: "Od 10 lat pracuję wyłącznie w premium klinikach Warszawy. W Siedlcach wprowadzam dokładnie ten sam standard — protokoły, jakość urządzenia i bezpieczeństwo są identyczne. Oszczędzasz natomiast czas, paliwo i dzień urlopu." },
      { q: "Dlaczego laser pikosekundowy jest dostępny tylko w protokołach złożonych?", a: "Obecnie stosuję laser pikosekundowy wyłącznie w procedurach łączonych, ponieważ synergia z innymi technologiami (np. zimna plazma, fototerapia LED) daje wyniki niedostępne dla pojedynczych zabiegów. Skóra otrzymuje pełną regenerację w jednej sesji, a ultrakrótki impuls 350 ps gwarantuje brak rekonwalescencji." },
    ],
  },
  {
    slug: "renasculpt",
    name: "EMS + RF — modelowanie sylwetki",
    category: "modelowanie",
    shortDesc: "Synchroniczna stymulacja elektromagnetyczna mięśni i radiofrekwencja.",
    mechanism:
      "Pole HIFEM wywołuje skurcze supramaksymalne, jednocześnie RF podgrzewa tkankę tłuszczową do progu apoptozy.",
    indications: ["wzmocnienie mięśni brzucha", "ujędrnienie pośladków", "redukcja tkanki tłuszczowej"],
    pricing: [{ label: "Sesja 30 min — brzuch", price: 700 }, { label: "Pakiet 4 sesji", price: 2400 }],
    faq: [],
  },
  {
    slug: "fototerapia",
    name: "Fototerapia LED",
    category: "skóra",
    shortDesc: "Niskoenergetyczne światło LED w terapii skóry naczyniowej, trądziku i regeneracji.",
    mechanism: "Specyficzne długości fal (415/630/830 nm) modulują aktywność komórek skóry.",
    indications: ["trądzik aktywny", "skóra naczyniowa", "wsparcie po zabiegach"],
    pricing: [{ label: "Sesja 20 min", price: 150 }],
    faq: [],
  },
];

export function getTechnology(slug: string) {
  return TECHNOLOGIES.find((t) => t.slug === slug);
}
