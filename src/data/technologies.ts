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
    slug: "laser-pikosekundy",
    name: "Laser pikosekundowy Nd:YAG",
    category: "skóra",
    shortDesc: "Ultra-krótkie impulsy 532/1064 nm — efekt fotoakustyczny.",
    mechanism:
      "Impulsy w skali pikosekund działają fotoakustycznie, rozbijając cząsteczki barwnika i tatuażu z minimalnym uszkodzeniem termicznym otaczających tkanek.",
    applicators: [
      "głowica standardowa",
      "soczewka frakcyjna heksagonalna",
      "głowica do peelingu węglowego",
      "soczewka frakcyjna kołowa",
      "soczewka frakcyjna kwadratowa",
    ],
    indications: ["melasma", "plamy soczewicowate", "blizny potrądzikowe", "usuwanie tatuażu", "drobne zmarszczki"],
    pricing: [
      { label: "Twarz — toning", price: 800 },
      { label: "Blizny potrądzikowe — twarz", price: 1200 },
      { label: "Usuwanie tatuażu — 1 cm²", price: 80 },
    ],
    faq: [{ q: "Ile sesji na tatuaż?", a: "Średnio 5–10 sesji co 6–8 tygodni, w zależności od koloru i głębokości pigmentu." }],
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
    slug: "endermologia",
    name: "Endermologia mechaniczna",
    category: "ciało",
    shortDesc: "Patentowana stymulacja mechaniczna powierzchni skóry rolkami i podciśnieniem.",
    mechanism: "Podciśnienie kontrolowane oraz rolki zwijająco-rozwijające pobudzają fibroblasty i drenują tkankę.",
    indications: ["cellulit", "miejscowe nagromadzenia tłuszczu", "obrzęki"],
    pricing: [{ label: "Sesja 35 min", price: 250 }, { label: "Pakiet 10 sesji", price: 2200 }],
    faq: [],
  },
  {
    slug: "stortz-medical",
    name: "Fala uderzeniowa radialna",
    category: "ciało",
    shortDesc: "Akustyczne fale radialne w terapii bólu i cellulitu.",
    mechanism: "Impulsy akustyczne o wysokiej amplitudzie rozchodzą się w tkance, stymulując mikrokrążenie i remodeling.",
    indications: ["cellulit włóknisty", "rozstępy", "ból mięśniowo-powięziowy"],
    pricing: [{ label: "Sesja — 1 strefa", price: 300 }],
    faq: [],
  },
  {
    slug: "thor-mt",
    name: "Mikrofalowa terapia nadpotliwości",
    category: "ciało",
    shortDesc: "Selektywna ablacja gruczołów potowych energią mikrofalową.",
    mechanism: "Energia mikrofalowa nieodwracalnie dezaktywuje gruczoły apokrynowe na pograniczu skóry właściwej i tkanki podskórnej.",
    indications: ["nadpotliwość pach", "przykry zapach potu"],
    pricing: [{ label: "Sesja — obie pachy", price: 3500 }],
    faq: [{ q: "Czy efekt jest trwały?", a: "Tak — gruczoły nie regenerują się. Najczęściej wystarcza 1–2 sesje." }],
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
  {
    slug: "kriolipoliza-cooltech",
    name: "Kriolipoliza — kontrolowane chłodzenie",
    category: "modelowanie",
    shortDesc: "Selektywna apoptoza adipocytów przez kontrolowane chłodzenie.",
    mechanism: "Tkanka tłuszczowa chłodzona do –8 °C ulega apoptozie i jest stopniowo eliminowana układem limfatycznym.",
    indications: ["miejscowe nagromadzenia tłuszczu", "fałd podbrzusza", "tzw. boczki"],
    pricing: [{ label: "1 aplikator", price: 1200 }, { label: "2 aplikatory równocześnie", price: 2000 }],
    faq: [{ q: "Kiedy efekt?", a: "Stopniowo przez 8–12 tygodni po zabiegu." }],
  },
  {
    slug: "harmony-xl-pro",
    name: "Platforma laserowa wielofunkcyjna",
    category: "skóra",
    shortDesc: "Modułowa platforma laserowa do skomplikowanych terapii skórnych.",
    mechanism: "Zestaw głowic laserowych i IPL umożliwiający łączone protokoły w jednej sesji.",
    indications: ["zaawansowane fotoodmładzanie", "łączone protokoły naczyniowo-barwnikowe"],
    pricing: [{ label: "Konsultacja kwalifikacyjna", price: 200 }],
    faq: [],
  },
];

export function getTechnology(slug: string) {
  return TECHNOLOGIES.find((t) => t.slug === slug);
}
