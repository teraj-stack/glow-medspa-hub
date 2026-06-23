/**
 * Katalog technologii — opisy WYŁĄCZNIE techniczne (zgodność z prawem reklamy
 * wyrobów medycznych). Nie używamy nazw handlowych urządzeń w treści publicznej.
 */
import hifuMechanizmImg from "@/assets/hifu-mechanizm.jpg";
export type PricingItem = { label: string; price: number | null; note?: string };
export type FaqItem = { q: string; a: string };

export type Technology = {
  slug: string;
  name: string;            // techniczna nazwa publiczna
  category: "twarz" | "ciało" | "intymność" | "skóra" | "modelowanie";
  shortDesc: string;
  mechanism: string;       // jak działa
  mechanismImage?: { src: string; alt: string; caption?: string };
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
    shortDesc:
      "Precyzyjna, powierzchowna fototermoliza frakcyjna do depigmentacji — najbezpieczniejsza opcja dla melasmy i przebarwień.",
    mechanism:
      "Wiązka 1927 nm jest silnie absorbowana przez wodę w naskórku i dociera jedynie około 0,1 mm wgłąb. Tworzy mikrokolumny koagulacji dokładnie w warstwie, w której gromadzi się nadmiar melaniny, przyspieszając wymianę komórkową i depigmentację. Zabieg nie dociera do warstw odpowiedzialnych za lifting czy przebudowę kolagenu, dlatego nie modeluje konturu twarzy ani nie działa anti-aging. Jest natomiast bezpieczny dla osób po zabiegach z toksyną botulinową — jego głębokość działania nie zakłóca efektu neuromodulatora.",
    indications: [
      "melasma",
      "przebarwienia posłoneczne i plamy starcze",
      "nierówny koloryt",
      "piegi i plamy pigmentacyjne",
      "skóra po zabiegach z toksyną botulinową",
    ],
    contraindications: [
      "ciąża i karmienie piersią",
      "aktywna opryszczka",
      "świeża opalenizna lub samoopalacz",
      "leki światłouczulające",
      "choroby autoimmunologiczne w fazie zaostrzenia",
    ],
    pricing: [
      { label: "Twarz", price: 1750 },
      { label: "Szyja", price: 1200 },
      { label: "Dekolt", price: 1400 },
      { label: "Dłonie", price: 1000 },
      { label: "Combo: twarz + szyja + dekolt", price: 4000 },
      { label: "Seria 3× twarz", price: 4600, note: "ok. 15% rabatu strukturalnego" },
    ],
    faq: [
      {
        q: "Czy laser tulowy liftinguje twarz?",
        a: "Nie. Laser 1927 nm penetruje około 0,1 mm i działa wyłącznie na poziomie naskórka oraz powierzchniowej warstwy skóry właściwej. Do modelowania owalu i liftingu wybieramy HIFU lub RF mikroigłową.",
      },
      {
        q: "Czy laser tulowy jest bezpieczny po zabiegu z toksyną botulinową?",
        a: "Tak. Jest często wybierany przez pacjentki po zabiegach z toksyną botulinową, ponieważ jego głębokość działania nie wpływa na efekt neuromodulatora.",
      },
      { q: "Czy zabieg boli?", a: "Stosujemy znieczulenie miejscowe — odczucie ciepła i mrowienia jest do zaakceptowania." },
    ],
  },
  {
    slug: "fusion-plasma",
    name: "Zimna plazma atmosferyczna (CAP)",
    category: "skóra",
    shortDesc:
      "Najnowsza, nieablacyjna technologia rewitalizacji — czwarty stan skupienia materii pracujący w temperaturze fizjologicznej (35–40°C). Obecnie najczęściej wybierane narzędzie regeneracyjne na świecie — ponad 1 200 000 pacjentek miesięcznie.",
    mechanism:
      "Zjonizowany strumień gazu szlachetnego (hel / argon) dostarcza do skóry kontrolowane stężenia Reaktywnych Form Tlenu i Azotu (RONS). Indukują one tzw. eustres oksydacyjny — fibroblasty zwiększają proliferację i biogenezę mitochondriów, uruchamiając kaskadę TGF-β / SMAD4. Po 12 tygodniach gęstość siatki kolagenowej rośnie średnio o 40%. Równolegle zachodzi plazmoporacja — czasowe rozluźnienie połączeń międzykomórkowych naskórka, które zwiększa przenikalność kosmetyków aktywnych nawet kilkudziesięciokrotnie.",
    applicators: [
      "Głowica omywająca — pełnopowierzchniowa rewitalizacja twarzy, szyi, dekoltu",
      "Sonda punktowa — antyseptyka ognisk zapalnych, trądzik, opryszczka",
      "Matryca do wprowadzania substancji aktywnych (plasma drug delivery)",
    ],
    indications: [
      "skóra wrażliwa, naczyniowa, atopowa (AZS)",
      "trądzik pospolity i potrądzikowe stany zapalne",
      "zapalenie okołowargowe, egzema",
      "nierówny koloryt, rozszerzone pory, szorstka tekstura",
      "profilaktyka starzenia, rewitalizacja przed- i pozabiegowa",
      "wspomaganie gojenia po laserach i mikronakłuwaniu",
      "bielactwo nabyte (Vitiligo) — aktywacja szlaku Nrf2-ARE",
    ],
    contraindications: ["rozrusznik serca i implanty elektroniczne", "ciąża", "aktywna choroba nowotworowa skóry w polu zabiegowym"],
    pricing: [
      { label: "Okolice oczu (powieki)", price: 2150 },
      { label: "Twarz (cała — high energy)", price: 4250 },
      { label: "Szyja", price: 2400 },
      { label: "Dekolt", price: 3000 },
      { label: "Combo: twarz + oczy + szyja", price: 7500 },
      { label: "Pakiet seryjny (low energy)", price: 7250 },
    ],
    faq: [
      { q: "Czy to ta sama „plazma” co przy nieoperacyjnej blefaroplastyce?", a: "Nie. Blefaroplastyka plazmowa wykorzystuje mikroskopijny łuk elektryczny (plazma gorąca, sublimacja w 60–65°C) i pozostawia strupki. Zimna plazma atmosferyczna (CAP) pracuje w 35–40°C, nie powoduje koagulacji ani strupów — działa wyłącznie biochemicznie, przez chemię wolnych rodników." },
      { q: "Czy zabieg boli i wymaga rekonwalescencji?", a: "Zabieg jest bezbolesny, bezinwazyjny, bez rekonwalescencji. Skóra po zabiegu wygląda promiennie, można od razu wrócić do codziennych aktywności i nałożyć makijaż." },
      { q: "Dlaczego stosuję zimną plazmę w każdym protokole rewitalizacyjnym?", a: "To obecnie najnowsza i najczęściej wybierana technologia regeneracyjna na świecie — ponad 1,2 miliona pacjentek miesięcznie. Zwiększa przenikalność substancji aktywnych nawet kilkudziesięciokrotnie, dlatego stanowi pierwszy krok w protokołach złożonych (zimna plazma → laser pikosekundowy → fototerapia LED)." },
      { q: "Czy plazma działa antybakteryjnie?", a: "Tak — strumień plazmy generuje ozon i RONS, które niszczą Cutibacterium acnes przez peroksydację lipidów błony komórkowej. Bakterie nie wytwarzają oporności wtórnej, dlatego CAP jest wykorzystywany w trądziku zapalnym, AZS i wspomaganiu gojenia ran." },
      { q: "Ile zabiegów potrzeba?", a: "Efekt rewitalizujący widać już po pierwszej sesji. Pełna przebudowa kolagenowa rozwija się przez 12 tygodni — rekomendujemy serię 4–6 zabiegów co 2–3 tygodnie." },
    ],
  },
  {
    slug: "hifu",
    name: "HIFU 6w1 — skupiona ultradźwiękowa stymulacja SMAS",
    category: "twarz",
    shortDesc:
      "Najskuteczniejszy nieoperacyjny lifting twarzy, szyi i ciała. Skupione ultradźwięki HIFU docierają głęboko do warstwy SMAS, nie uszkadzając skóry i nie pozostawiając śladu. Zabieg można wykonywać o każdej porze roku — również latem, ponieważ nie ma przeciwwskazań do ekspozycji słonecznej po procedurze.",
    mechanism:
      "Technologia HIFU (High Intensity Focused Ultrasound) dostarcza precyzyjnie skupioną energię ultradźwiękową na głębokość od 1,5 do 13 mm, tworząc punktowe ogniska termicznej koagulacji. Energia dociera do powierzchniowo-mięśniowej warstwy SMAS, której chirurgiczne naciągnięcie jest podstawą klasycznego liftingu twarzy — HIFU wywołuje jej obkurczanie i intensywną stymulację nowego kolagenu, dając efekt naturalnego, nieoperacyjnego liftingu bez cięcia i bez śladu po zabiegu. " +
      "Pacjenci z Siedlec i okolic często pytają o tę metodę, dlatego warto jasno opisać wszystkie możliwości urządzenia. Posiadana sonda umożliwia wykonanie zabiegu identycznego z implantacją nici pod skórę — działa w tej samej płaszczyźnie, natychmiast podtrzymuje kontur twarzy i wywołuje długotrwałe ujędrnienie. Dzięki temu HIFU nie tylko liftinguje owal i linię żuchwy, ale także kompleksowo rewitalizuje skórę, poprawia jej gęstość i opóźnia procesy starzenia. " +
      "Procedura jest w pełni bezinwazyjna — skóra pozostaje nieprzekłuta i nieuszkodzona, nie powstają strupy, opuchlizna ani okres rekonwalescencji. Dlatego latem nie ma przeciwwskazań do wykonywania zabiegu; pacjentka może wrócić do codziennych aktywności i stosować standardową ochronę przeciwsłoneczną. Efekt utrzymuje się 2–3 lata — wystarczy jedna sesja, by przez lata cieszyć się wyraźnie młodszą, bardziej napiętą i promienną skórą. To właśnie dlatego, pomimo upływu lat i pojawiania się nowszych technologii, HIFU pozostaje najskuteczniejszym narzędziem rewitalizującym i anti-aging.",
    mechanismImage: {
      src: hifuMechanizmImg,
      alt: "Przekrój skóry twarzy z głowicą HIFU — skupione wiązki ultradźwiękowe docierają do trzech głębokości (1,5 mm, 3,0 mm, 4,5 mm) tworząc punktowe ogniska termicznej koagulacji w warstwie SMAS.",
      caption: "Skupione wiązki ultradźwiękowe konwergują w precyzyjnych ogniskach na głębokościach 1,5 / 3,0 / 4,5 mm — od skóry właściwej po warstwę SMAS — bez naruszenia naskórka.",
    },
    applicators: ["1,5 mm", "3,0 mm", "4,5 mm", "6 mm", "9 mm", "13 mm"],
    indications: [
      "wiotkość owalu twarzy i szyi",
      "nieoperacyjny lifting twarzy i SMAS",
      "modelowanie linii żuchwy i podbródka",
      "kurze łapki, zmarszczki i utrata jędrności",
      "rewitalizacja i anti-aging skóry twarzy",
      "ujędrnienie skóry ciała (brzuch, uda, pośladki, ramiona)",
    ],
    pricing: [
      { label: "Twarz (cała)", price: 5250 },
      { label: "Szyja", price: 3000 },
      { label: "Dekolt", price: 3500 },
      { label: "Dłonie", price: 1750 },
      { label: "Brzuch", price: 7250 },
      { label: "Combo: twarz + szyja + dekolt", price: 9750 },
    ],
    faq: [
      { q: "Czy HIFU można wykonywać latem?", a: "Tak — zabieg nie narusza naskórka, nie powoduje śladów ani strupów i nie ma przeciwwskazań do ekspozycji słonecznej po procedurze. Wystarczy standardowa ochrona przeciwsłoneczna, jak zawsze." },
      { q: "Ile trwa efekt?", a: "Efekt utrzymuje się zwykle 2–3 lata. Wystarczy jedna sesja, by przez długi czas cieszyć się ujędrnioną skórą i wyraźnie poprawionym owalem." },
      { q: "Czy zabieg jest bolesny i wymaga rekonwalescencji?", a: "Zabieg jest bezinwazyjny — skóra pozostaje nieuszkodzona. Odczuwalne są punkty ciepła w głębszych warstwach, ale nie ma śladów, opuchlizny ani okresu rekonwalescencji. Można wrócić do codziennych aktywności od razu." },
      { q: "Czym HIFU różni się od zabiegów nici?", a: "Specjalistyczna sonda HIFU pozwala wykonać zabieg w tej samej płaszczyźnie co implantacja nici pod skórę — bez nakłuwania, bez wchłaniania materiału i bez ryzyka powikłań inwazyjnych. Efekt liftingu i ujędrnienia jest porównywalny." },
    ],
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
    pricing: [],
    faq: [],
  },
  {
    slug: "peeling-weglowy-laserowy",
    name: "Peeling węglowy laserowy (Carbon Peel / Hollywood Peel)",
    category: "skóra",
    shortDesc:
      "Laserowa fototermoliza pasty węglowej — natychmiastowy efekt rozświetlenia, oczyszczenia porów i wygładzenia skóry bez rekonwalescencji. Klasyczny „lunchtime peel” gwiazd Hollywood.",
    mechanism:
      "Na skórę nakładamy warstwę nanocząsteczkowej pasty węglowej, która penetruje rozszerzone ujścia mieszków włosowych i wiąże sebum, martwy naskórek oraz zanieczyszczenia. Następnie wiązka lasera pikosekundowego 1064 nm (ultrakrótki impuls ~350 ps) pracuje na pełnej powierzchni — węgiel staje się egzogennym chromoforem, absorbuje energię i zostaje sublimowany fotoakustyczną falą uderzeniową. Dzięki pikosekundowemu czasowi impulsu otaczające tkanki pozostają chłodne, a efekt łączy mechaniczne złuszczanie (fotoeksplozja węgla) z precyzyjną pracą na sebum, bakteriach C. acnes i powierzchownej warstwie skóry. Drugie przejście w trybie frakcyjnym pobudza fibroblasty do syntezy kolagenu i dodatkowo zwęża pory, bez termicznego uszkadzania naskórka.",
    applicators: [
      "Laser pikosekundowy 1064 nm — tryb fotomechaniczny (faza węglowa, sebum, bakterie)",
      "Laser pikosekundowy 1064 nm — tryb frakcyjny Honeycomb (kolagen, pory, tekstura)",
      "Pasta węglowa kosmetyczna o granulacji nano (chromofor egzogenny)",
    ],
    indications: [
      "rozszerzone pory i nadprodukcja sebum",
      "skóra mieszana, tłusta, łojotokowa",
      "trądzik zaskórnikowy i lekki trądzik zapalny",
      "matowa, szara cera „palacza”",
      "drobne nierówności tekstury",
      "powierzchowne przebarwienia posłoneczne",
      "przygotowanie skóry do ważnego wydarzenia (efekt „glow”)",
    ],
    contraindications: [
      "ciąża i karmienie piersią",
      "aktywna opryszczka i stany zapalne skóry w polu zabiegu",
      "świeża opalenizna lub samoopalacz",
      "leki światłouczulające (izotretynoina — odstęp min. 6 miesięcy)",
      "ciężki trądzik ropny i torbielowaty",
      "choroby autoimmunologiczne w fazie zaostrzenia",
    ],
    pricing: [
      { label: "Twarz", price: 600 },
      { label: "Twarz + szyja", price: 850 },
      { label: "Twarz + szyja + dekolt", price: 1100 },
      { label: "Plecy (trądzik)", price: 900 },
      { label: "Seria 4× twarz", price: 2050, note: "ok. 15% taniej" },
      { label: "Peeling węglowy jako „finisz” po laserze pikosekundowym", price: 350, note: "dokupiony do innego zabiegu" },
    ],
    faq: [
      { q: "Czy zabieg boli?", a: "Nie — peeling węglowy jest jednym z najbardziej komfortowych zabiegów laserowych. Pacjentki opisują odczucie jako delikatne ciepło i lekkie „strzelanie” węgla. Znieczulenie nie jest potrzebne." },
      { q: "Kiedy zobaczę efekt?", a: "Natychmiast po zabiegu — skóra jest gładka, jednolita, świetlista, pory zauważalnie mniejsze. To dlatego peeling węglowy nazywany jest „Hollywood Peel” i „lunchtime peel” — gwiazdy wykonują go tuż przed czerwonym dywanem." },
      { q: "Czy mogę wrócić do pracy tego samego dnia?", a: "Tak. Rekonwalescencja jest praktycznie zerowa — może wystąpić delikatny rumień utrzymujący się 1–2 godziny. Makijaż można nałożyć już następnego dnia." },
      { q: "Ile zabiegów potrzeba?", a: "Efekt rozświetlenia widać po jednym zabiegu. Dla trwałej redukcji porów, sebum i lekkiego trądziku zalecamy serię 4–6 zabiegów co 2–3 tygodnie, a następnie podtrzymanie raz na kwartał." },
      { q: "Czy peeling węglowy leczy trądzik?", a: "Działa wspomagająco w lekkim trądziku zaskórnikowym i zapalnym — redukuje sebum, niszczy bakterie C. acnes i oczyszcza pory. W cięższych postaciach stanowi element protokołu łączonego (zimna plazma + LED + peeling węglowy), nie zastępuje jednak leczenia dermatologicznego." },
      { q: "Dlaczego stosuję peeling węglowy w protokołach łączonych?", a: "Doskonale finiszuje zabiegi pikosekundowe i laserowe — sublimacja pasty węglowej dodatkowo wygładza warstwę rogową naskórka, a tryb Q-Switched pobudza powierzchowną syntezę kolagenu. Skóra wychodzi z gabinetu z efektem „filtra” w jednej sesji." },
      { q: "Dlaczego ceny są na poziomie warszawskim?", a: "Od 10 lat pracuję wyłącznie w premium klinikach Warszawy. W Siedlcach wprowadzam dokładnie ten sam standard — protokoły, jakość urządzenia i bezpieczeństwo są identyczne. Oszczędzasz natomiast czas, paliwo i dzień urlopu." },
    ],
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
      { label: "Twarz (cała)", price: 2100 },
      { label: "Szyja", price: 1350 },
      { label: "Dekolt", price: 1650 },
      { label: "Dłonie", price: 1100 },
      { label: "Combo: twarz + szyja + dekolt", price: 5000 },
      { label: "Seria 3× twarz", price: 5300, note: "ok. 15% rabatu strukturalnego" },
      { label: "Usuwanie tatuażu — do 5 cm²", price: 500 },
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
    slug: "terapia-led",
    name: "Terapia LED (fotobiomodulacja PBM)",
    category: "skóra",
    shortDesc:
      "Wielodiodowa matryca LED wysokiej mocy emitująca światło widzialne i bliską podczerwień (445–870 nm). Nieinwazyjna fotobiomodulacja: gojenie, kolagen, melasma, trądzik.",
    mechanism:
      "Niejonizujące fotony wzbudzają oksydazę cytochromu c i strukturyzują wodę okołobłonową, uruchamiając pozamitochondrialną syntezę ATP. Efekt: aktywacja fibroblastów, neokolageneza, modulacja stanu zapalnego i fotodynamiczna eliminacja patogenów.",
    indications: [
      "wsparcie po zabiegach laserowych i iniekcjach",
      "trądzik aktywny i Malassezia",
      "skóra naczyniowa, rumień, rosacea",
      "melasma i hiperpigmentacja pozapalna (PIH)",
      "anti-aging — drobne zmarszczki, utrata gęstości",
      "blizny potrądzikowe i pooperacyjne",
      "łysienie androgenowe (stymulacja mieszków)",
    ],
    pricing: [
      { label: "Sesja LED — twarz (20 min)", price: 150 },
      { label: "Sesja LED — twarz + szyja + dekolt", price: 220 },
      { label: "Pakiet 6 sesji — twarz", price: 750, note: "ok. 15% taniej" },
      { label: "LED jako finisz po zabiegu laserowym / iniekcjach", price: 100, note: "dokupiona do innego zabiegu" },
    ],
    faq: [],
  },
];


export function getTechnology(slug: string) {
  return TECHNOLOGIES.find((t) => t.slug === slug);
}
