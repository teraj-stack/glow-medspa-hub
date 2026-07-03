import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { LocalWarsawSection } from "@/components/site/LocalWarsawSection";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CheckCircle2, AlertTriangle, Clock, CalendarCheck, Sparkles, ShieldCheck } from "lucide-react";


interface IndicationContent {
  slug: string;
  title: string;
  short: string;
  h1: string;
  metaTitle: string;
  metaDesc: string;
  keyword: string;
  intro: string;
  types: { h3: string; text: string }[];
  methods: { h3: string; text: string; to?: string }[];
  timeline: string;
  contraindications: string[];
  priceNote: string;
  faq: { q: string; a: string }[];
}

export const CONTENT: Record<string, IndicationContent> = {
  "przebarwienia-warszawa": {
    slug: "przebarwienia-warszawa",
    title: "Przebarwienia",
    short: "Plamy posłoneczne, pozapalne i barwnikowe — diagnostyka i dobór lasera.",
    h1: "Usuwanie przebarwień w Warszawie",
    metaTitle: "Usuwanie przebarwień Warszawa — diagnostyka i leczenie | BMClinics",
    metaDesc:
      "Przebarwienia posłoneczne, hormonalne i pozapalne. Diagnostyka spektralna i dobór terapii lekarskiej w Warszawie — ul. Branickiego 10 (klinika ginekologii).",
    keyword: "usuwanie przebarwień Warszawa",
    intro:
      "Przebarwienia to nie jedna choroba — to kilka różnych mechanizmów, które wymagają różnych terapii. Zaczynamy od diagnostyki, dobieramy technologię, planujemy sezonowo.",
    types: [
      {
        h3: "Posłoneczne (soczewicowate)",
        text: "Skupiska melaniny w naskórku po latach ekspozycji na UV. Dobrze reagują na laser pikosekundowy i fotoodmładzanie.",
      },
      {
        h3: "Melasma / ostuda (hormonalna)",
        text: "Symetryczne plamy na policzkach i czole, często u kobiet w ciąży lub przyjmujących antykoncepcję. Wymagają ostrożnej, wielomiesięcznej strategii.",
      },
      {
        h3: "Pozapalne (po trądziku, po zabiegach)",
        text: "Ślady po stanach zapalnych skóry. Redukujemy stopniowo, chroniąc barierę hydrolipidową.",
      },
      {
        h3: "Różnicowanie ze zmianami barwnikowymi",
        text: "Znamiona i plamy soczewicowate wymagają wcześniejszej oceny dermatoskopowej — bezpieczeństwo przed skutecznością.",
      },
    ],
    methods: [
      {
        h3: "Laser pikosekundowy",
        text: "Rozbija głęboko osadzony pigment ultrakrótkimi impulsami — dla trwałych, ograniczonych plam.",
      },
      {
        h3: "Laser tulowy 1927 nm",
        text: "Płytka penetracja 0,1 mm — dla powierzchownych, rozlanych przebarwień i melasmy.",
        to: "/technologie/laser-tulowy",
      },
      {
        h3: "Terapie łączone i kwasy medyczne",
        text: "Peelingi zawodowe, mezoterapia rozjaśniająca, farmakoterapia miejscowa — jako uzupełnienie lasera.",
      },
      {
        h3: "Fotoprotekcja i pielęgnacja domowa",
        text: "SPF 50+ codziennie i aktywne składniki rozjaśniające — bez tego efekt lasera nie utrzyma się.",
      },
    ],
    timeline:
      "Standardowa seria: 3–5 sesji lasera co 4–6 tygodni + pielęgnacja domowa. Pełne efekty widoczne po 3–6 miesiącach. Zabiegi planujemy poza sezonem letnim, aby zminimalizować ryzyko nawrotu.",
    contraindications: [
      "aktywna opalenizna lub świeża ekspozycja na UV",
      "ciąża i karmienie (dla wybranych metod)",
      "izotretynoina doustna w ostatnich 6 miesiącach",
      "aktywne infekcje skóry w obszarze zabiegu",
      "fotodermatozy i niezdiagnozowane zmiany barwnikowe",
    ],
    priceNote:
      "Konsultacja z diagnostyką skóry: od 300 zł (odliczana od zabiegu). Sesja lasera pikosekundowego na przebarwienia twarzy: od 900 zł. Pakiety serii z rabatem.",
    faq: [
      {
        q: "Czy laser usuwa przebarwienia raz na zawsze?",
        a: "Laser trwale rozbija konkretny pigment, ale nowe przebarwienia mogą pojawić się przy braku fotoprotekcji lub zaburzeniach hormonalnych. Regularne SPF 50+ i badania kontrolne są kluczowe.",
      },
      {
        q: "Ile kosztuje usuwanie przebarwień w Warszawie?",
        a: "Sesja lasera pikosekundowego na twarz to koszt od 900 zł, seria 3–5 zabiegów mieści się w widełkach 2 700–5 500 zł. Ostateczna wycena po diagnostyce.",
      },
      {
        q: "Kiedy nie robić lasera na przebarwienia?",
        a: "Nie wykonujemy zabiegu na skórze świeżo opalonej, przy izotretynoinie doustnej w ostatnich 6 miesiącach, w ciąży i przy aktywnych infekcjach skóry.",
      },
      {
        q: "Czy melasmę można wyleczyć?",
        a: "Melasma jest przewlekła i skłonna do nawrotów. Skutecznie ją kontrolujemy — wielomiesięcznym połączeniem lasera tulowego, farmakoterapii i bezwzględnej fotoprotekcji.",
      },
      {
        q: "Ile trwa rekonwalescencja?",
        a: "Po laserze pikosekundowym: rumień do 24 h, drobne strupki 5–7 dni. Po laserze tulowym: łuszczenie 3–5 dni. Powrót do pracy zwykle następnego dnia.",
      },
    ],
  },
  "naczynka-rumien-warszawa": {
    slug: "naczynka-rumien-warszawa",
    title: "Naczynka i rumień",
    short: "Teleangiektazje, rumień stały i rumień napadowy (rosacea) — zamykanie naczyń i wyciszanie skóry.",
    h1: "Naczynka i rumień na twarzy — leczenie w Warszawie",
    metaTitle: "Naczynka i rumień Warszawa — laserowe zamykanie naczyń | BMClinics",
    metaDesc:
      "Teleangiektazje, rumień stały, rosacea. Diagnostyka i laserowe zamykanie naczyń krwionośnych w Warszawie — ul. Branickiego 10 (klinika ginekologii).",
    keyword: "zamykanie naczynek Warszawa",
    intro:
      "Widoczne naczynka i utrzymujący się rumień to nie tylko kwestia estetyczna — to sygnał, że skóra reaguje nadmiernie. Rozróżniamy typy naczyń i dobieramy długość fali lasera, która zamknie je bez uszkodzenia okolicy.",
    types: [
      { h3: "Teleangiektazje (pojedyncze naczynka)", text: "Cienkie czerwone lub fioletowe naczynia na policzkach, skrzydełkach nosa i brodzie — dobrze reagują na laser naczyniowy." },
      { h3: "Rumień stały", text: "Utrzymujące się zaczerwienienie środkowej części twarzy — wymaga serii zabiegów wyciszających mikrokrążenie." },
      { h3: "Rosacea (trądzik różowaty)", text: "Rumień z napadami, grudkami i uczuciem pieczenia — łączymy leczenie laserowe z farmakoterapią miejscową." },
      { h3: "Erytroza szyi i dekoltu", text: "Rumień poszerzający się na dekolt, często z komponentą fotostarzenia — plan wielosesyjny." },
    ],
    methods: [
      { h3: "Laser naczyniowy (długości fali dedykowane hemoglobinie)", text: "Selektywnie zamyka naczynia bez uszkodzenia naskórka. 2–4 sesje co 4–6 tygodni." },
      { h3: "Fotoodmładzanie (IPL medyczny)", text: "Dla rozlanego rumienia i drobnych teleangiektazji na dużych powierzchniach." },
      { h3: "Farmakoterapia miejscowa", text: "Iwermektyna, brymonidyna, metronidazol — jako uzupełnienie w rosacei." },
      { h3: "Pielęgnacja bariery i fotoprotekcja", text: "Mineralne SPF 50+, kosmetyki bez alkoholu i drażniących składników — bez tego nawroty są pewne." },
    ],
    timeline:
      "Standardowo 3–4 sesje lasera co 4–6 tygodni. Pierwsze efekty po pojedynczym zabiegu; pełna stabilizacja po serii i wdrożeniu pielęgnacji domowej. Zabiegi możemy wykonywać przez cały rok, unikając świeżej opalenizny.",
    contraindications: [
      "aktywna opalenizna",
      "izotretynoina doustna w ostatnich 6 miesiącach",
      "ciąża i karmienie (dla wybranych metod)",
      "zaburzenia krzepnięcia i leki przeciwzakrzepowe (indywidualna kwalifikacja)",
      "aktywne infekcje skóry w obszarze zabiegu",
    ],
    priceNote:
      "Konsultacja lekarska: od 300 zł (odliczana od zabiegu). Sesja lasera naczyniowego (fragment twarzy): od 600 zł. Cała twarz: od 1 200 zł. Pakiety serii z rabatem.",
    faq: [
      { q: "Czy zamknięte naczynko wróci?", a: "Konkretne naczynie po zamknięciu nie wraca. Skóra ze skłonnością naczyniową może jednak tworzyć nowe — dlatego kluczowa jest pielęgnacja i unikanie czynników zaostrzających." },
      { q: "Czy zabieg boli?", a: "Odczucie porównywalne do strzelenia gumką. Znieczulenie zwykle nie jest potrzebne; przy większych obszarach stosujemy chłodzenie kontaktowe." },
      { q: "Ile trwa rekonwalescencja?", a: "Rumień i lekki obrzęk 24–48 h. Drobne strupki przy większych naczyniach mogą utrzymać się 5–7 dni. Powrót do pracy zwykle następnego dnia." },
      { q: "Czy laser leczy rosaceę?", a: "Laser skutecznie redukuje rumień i naczynia — komponentę zapalną (grudki, krostki) leczymy dodatkowo farmakoterapią miejscową i ogólną." },
    ],
  },
  "blizny-potradzikowe-warszawa": {
    slug: "blizny-potradzikowe-warszawa",
    title: "Blizny potrądzikowe",
    short: "Blizny zanikowe (ice pick, boxcar, rolling) i przebarwienia pozapalne — remodeling skóry.",
    h1: "Leczenie blizn potrądzikowych w Warszawie",
    metaTitle: "Blizny potrądzikowe Warszawa — laser frakcyjny i remodeling | BMClinics",
    metaDesc:
      "Redukcja blizn zanikowych po trądziku — laser frakcyjny CO2, mikronakłuwanie medyczne, subcyzja. Klinika w Warszawie, ul. Branickiego 10.",
    keyword: "blizny potrądzikowe Warszawa",
    intro:
      "Blizny potrądzikowe wymagają cierpliwej, wielosesyjnej pracy nad remodelingiem skóry. Kluczem jest rozpoznanie typu blizn — inne metody działają na ice pick, inne na rolling, jeszcze inne na przebarwienia pozapalne.",
    types: [
      { h3: "Ice pick", text: "Wąskie, głębokie blizny przypominające ukłucia — najtrudniejsze; wymagają technik ablacyjnych lub TCA CROSS." },
      { h3: "Boxcar", text: "Szersze blizny z ostrymi krawędziami — dobrze reagują na laser frakcyjny ablacyjny." },
      { h3: "Rolling", text: "Faliste zagłębienia od zrostów włóknistych — odpowiadają na subcyzję i stymulację kolagenu." },
      { h3: "Przebarwienia pozapalne", text: "Ślady po zmianach zapalnych — redukujemy laserem i pielęgnacją rozjaśniającą." },
    ],
    methods: [
      { h3: "Laser frakcyjny CO2", text: "Ablacyjny remodeling skóry — najskuteczniejszy w bliznach boxcar i rolling. Seria 2–4 zabiegów.", to: "/technologie/laser-frakcyjny-co2-warszawa" },
      { h3: "Mikronakłuwanie medyczne z osoczem", text: "Stymulacja kolagenu i skrócona regeneracja dzięki czynnikom wzrostu z krwi pacjenta." },
      { h3: "Subcyzja", text: "Mechaniczne uwolnienie zrostów włóknistych pod blizną — dla blizn rolling." },
      { h3: "TCA CROSS", text: "Punktowa aplikacja stężonego kwasu w blizny ice pick — kontrolowana odbudowa tkanki." },
    ],
    timeline:
      "Realny plan to 6–12 miesięcy pracy: 2–4 sesje lasera frakcyjnego co 6–8 tygodni, uzupełnione mikronakłuwaniem i subcyzją. Redukcja blizn: 40–70% w zależności od typu. Zabiegi ablacyjne planujemy poza sezonem letnim.",
    contraindications: [
      "aktywny trądzik zapalny (najpierw wyciszamy)",
      "izotretynoina doustna w ostatnich 6–12 miesiącach",
      "skłonność do bliznowców",
      "aktywne infekcje skóry i opryszczka nawrotowa (wymaga profilaktyki)",
      "ciąża i karmienie",
    ],
    priceNote:
      "Konsultacja lekarska: od 300 zł (odliczana od zabiegu). Sesja lasera frakcyjnego CO2 (twarz): od 1 800 zł. Mikronakłuwanie z osoczem: od 900 zł. Subcyzja: od 500 zł/obszar.",
    faq: [
      { q: "Czy blizny znikną całkowicie?", a: "Redukujemy je zwykle o 40–70%. Całkowite zniknięcie blizn zanikowych nie jest realistyczne — celem jest skóra znacznie gładsza i lepiej odbijająca światło." },
      { q: "Ile trwa rekonwalescencja po laserze frakcyjnym?", a: "Zaczerwienienie i obrzęk 3–5 dni, delikatne łuszczenie do 7 dni. Powrót do pełnej aktywności społecznej: 5–7 dni." },
      { q: "Kiedy rozpocząć leczenie blizn?", a: "Po co najmniej 6 miesiącach od wygaszenia aktywnego trądziku i minimum 6 miesięcy po zakończeniu izotretynoiny doustnej." },
      { q: "Czy jedna sesja wystarczy?", a: "Nie. Blizny potrądzikowe wymagają serii — pojedynczy zabieg daje 15–25% poprawy, pełny plan zajmuje 6–12 miesięcy." },
    ],
  },
  "tradzik-warszawa": {
    slug: "tradzik-warszawa",
    title: "Trądzik",
    short: "Trądzik zapalny, hormonalny i mechaniczny — leczenie lekarskie łączone z zabiegami.",
    h1: "Leczenie trądziku u dorosłych w Warszawie",
    metaTitle: "Trądzik Warszawa — leczenie lekarskie i zabiegi | BMClinics",
    metaDesc:
      "Trądzik zapalny, hormonalny, pozostałości po trądziku młodzieńczym. Farmakoterapia, peelingi medyczne, laser. Konsultacje w Warszawie, ul. Branickiego 10.",
    keyword: "leczenie trądziku Warszawa",
    intro:
      "Trądzik u dorosłych rzadko wynika z jednej przyczyny. Zaczynamy od różnicowania (zapalny, hormonalny, mechaniczny, indukowany kosmetykami) i budujemy plan łączący farmakoterapię, zabiegi i pielęgnację domową.",
    types: [
      { h3: "Trądzik zapalny", text: "Grudki, krostki, cysty — wymaga farmakoterapii miejscowej lub ogólnej." },
      { h3: "Trądzik hormonalny", text: "Zmiany na linii żuchwy i brodzie, nasilenie w cyklu — konieczna diagnostyka endokrynologiczna." },
      { h3: "Trądzik zaskórnikowy", text: "Zaskórniki otwarte i zamknięte — dobrze reaguje na retinoidy i peelingi medyczne." },
      { h3: "Mechaniczny / indukowany kosmetykami", text: "Zmiany od pocierania, maseczek, komedogennych kosmetyków — plan zaczyna się od eliminacji przyczyny." },
    ],
    methods: [
      { h3: "Farmakoterapia miejscowa", text: "Retinoidy, nadtlenek benzoilu, antybiotyki miejscowe — dobierane po ocenie skóry." },
      { h3: "Farmakoterapia ogólna", text: "Antybiotykoterapia, terapia hormonalna, izotretynoina doustna — dla postaci opornych i zapalnych." },
      { h3: "Peelingi medyczne", text: "Kwas salicylowy, migdałowy, TCA — kontrolują łojotok i wygaszają zmiany." },
      { h3: "Zabiegi wspierające", text: "Oczyszczanie manualne, mikronakłuwanie, laser — dopiero po opanowaniu stanu zapalnego." },
    ],
    timeline:
      "Pierwsze efekty farmakoterapii: 6–8 tygodni. Pełna kontrola trądziku zapalnego: 3–6 miesięcy. Terapia hormonalna i izotretynoiną prowadzona miesiącami pod kontrolą badań laboratoryjnych.",
    contraindications: [
      "ciąża i karmienie (dla retinoidów i izotretynoiny — bezwzględnie)",
      "zaburzenia funkcji wątroby (dla wybranych terapii)",
      "zaburzenia lipidowe wymagające kontroli",
      "znana nietolerancja substancji czynnych",
    ],
    priceNote:
      "Konsultacja dermatologiczna: od 300 zł. Wizyta kontrolna: od 200 zł. Peeling medyczny: od 350 zł. Pakiet leczenia trądziku (konsultacja + 3 zabiegi): od 1 600 zł.",
    faq: [
      { q: "Czy trądzik dorosłych da się wyleczyć?", a: "Tak — u zdecydowanej większości pacjentów uzyskujemy pełną kontrolę zmian. Skłonność może pozostać, ale codzienna kontrola jest realna." },
      { q: "Czy izotretynoina jest bezpieczna?", a: "Tak, przy prawidłowej kwalifikacji i monitoringu (badania krwi co 4–8 tygodni). Bezwzględnie wymaga antykoncepcji u kobiet w wieku rozrodczym." },
      { q: "Kiedy zacząć zabiegi (peelingi, laser)?", a: "Po wyciszeniu ostrego stanu zapalnego. Na skórze aktywnie zapalnej ryzykujemy pogorszenie i przebarwienia pozapalne." },
      { q: "Czy dieta ma znaczenie?", a: "Tak — cukry proste, produkty wysokoglikemiczne i nabiał mogą nasilać zmiany. Konkretne zalecenia dobieramy indywidualnie." },
    ],
  },
  "wiotkosc-owalu-twarzy-warszawa": {
    slug: "wiotkosc-owalu-twarzy-warszawa",
    title: "Wiotkość owalu twarzy",
    short: "Opadanie policzków, zatarcie linii żuchwy, wiotkość szyi — nieinwazyjne technologie liftingujące.",
    h1: "Lifting owalu twarzy bez skalpela — Warszawa",
    metaTitle: "Wiotkość owalu twarzy Warszawa — nieinwazyjny lifting | BMClinics",
    metaDesc:
      "Ujędrnianie skóry i przywracanie owalu twarzy — technologie skoncentrowanej energii, stymulatory tkankowe. Klinika w Warszawie, ul. Branickiego 10.",
    keyword: "lifting bez skalpela Warszawa",
    intro:
      "Wiotkość owalu to nie jedna zmiana, ale suma trzech procesów: utraty objętości głębokich kompartmentów tłuszczowych, wiotczenia więzadeł i osłabienia jakości skóry. Skuteczny plan działa na wszystkich trzech piętrach.",
    types: [
      { h3: "Utrata konturu żuchwy (jowls)", text: "Zsuwanie się tkanek policzka poniżej linii żuchwy — wymaga zagęszczania włókien kolagenowych na głębokości SMAS." },
      { h3: "Wiotkość szyi i podbródka", text: "Cienka skóra szyi i tkanka pod brodą — dedykowane głowice technologii skoncentrowanej energii." },
      { h3: "Zapadnięte policzki", text: "Utrata objętości środkowej strefy — najpierw odbudowa objętości, potem stymulacja kolagenu." },
      { h3: "Osłabiona jakość skóry", text: "Cienka, mało elastyczna skóra — biostymulatory tkankowe i zabiegi zagęszczające." },
    ],
    methods: [
      { h3: "Skoncentrowana energia (HIFU, RF frakcyjne)", text: "Punktowe podgrzanie warstw głębokich stymuluje neokolagenezę — efekt widoczny po 8–12 tygodniach." },
      { h3: "Biostymulatory tkankowe", text: "Iniekcje pobudzające skórę do produkcji własnego kolagenu — efekt narasta przez 3–6 miesięcy." },
      { h3: "Mezoterapia i osocze bogatopłytkowe", text: "Poprawa jakości i grubości skóry — jako terapia uzupełniająca." },
      { h3: "Odbudowa objętości", text: "Iniekcje wypełniaczy w głębokie kompartmenty tłuszczowe — przywracają architekturę twarzy." },
    ],
    timeline:
      "Efekt technologii energetycznych narasta 8–12 tygodni po zabiegu. Pełny plan: 1–2 sesje głównej technologii + 2–3 sesje biostymulatorów w ciągu roku. Efekt utrzymuje się 12–18 miesięcy, wymaga zabiegów podtrzymujących.",
    contraindications: [
      "ciąża i karmienie",
      "aktywne infekcje skóry i choroby autoimmunologiczne w zaostrzeniu",
      "wszczepione urządzenia elektroniczne w polu zabiegu (dla RF)",
      "leki przeciwzakrzepowe (indywidualna kwalifikacja iniekcji)",
      "zaburzenia gojenia i skłonność do bliznowców",
    ],
    priceNote:
      "Konsultacja lekarska: od 300 zł (odliczana od zabiegu). Zabieg skoncentrowanej energii (twarz + szyja): od 3 500 zł. Biostymulator tkankowy: od 1 800 zł/ampułka.",
    faq: [
      { q: "Czy to zastąpi lifting chirurgiczny?", a: "Nie w każdym przypadku. Przy dużej wiotkości skóry lifting chirurgiczny pozostaje bardziej skuteczny. Nasze technologie sprawdzają się przy wiotkości małej i umiarkowanej lub jako profilaktyka." },
      { q: "Kiedy zacząć?", a: "Optymalnie między 35. a 50. rokiem życia, gdy skóra jeszcze dobrze odpowiada na stymulację kolagenu. Można też później — plan wtedy łączy więcej metod." },
      { q: "Jak długo utrzymuje się efekt?", a: "12–18 miesięcy po pełnej serii. Coroczna sesja podtrzymująca pozwala utrzymać rezultat na lata." },
      { q: "Czy jest widoczna rekonwalescencja?", a: "Po zabiegach energetycznych: rumień 24 h, drobny obrzęk do 48 h. Po iniekcjach: siniaki możliwe do 7 dni. Powrót do pracy zwykle następnego dnia." },
    ],
  },
  "rozstepy-warszawa": {
    slug: "rozstepy-warszawa",
    title: "Rozstępy",
    short: "Świeże rozstępy czerwone i dojrzałe białe — remodeling skóry i redukcja koloru.",
    h1: "Leczenie rozstępów w Warszawie",
    metaTitle: "Rozstępy Warszawa — laser frakcyjny i mikronakłuwanie | BMClinics",
    metaDesc:
      "Redukcja rozstępów czerwonych i białych — laser frakcyjny, mikronakłuwanie medyczne z osoczem. Klinika w Warszawie, ul. Branickiego 10.",
    keyword: "leczenie rozstępów Warszawa",
    intro:
      "Skuteczność leczenia rozstępów zależy przede wszystkim od ich wieku. Rozstępy świeże (czerwone) reagują dużo lepiej niż dojrzałe (białe) — dlatego kluczowe jest wczesne wdrożenie terapii.",
    types: [
      { h3: "Rozstępy czerwone (striae rubrae)", text: "Świeże, do 12 miesięcy — dobrze reagują na laser i mikronakłuwanie, można je znacznie zredukować." },
      { h3: "Rozstępy białe (striae albae)", text: "Dojrzałe, powyżej 12 miesięcy — wymagają wielosesyjnego remodelingu; realna redukcja 30–50%." },
      { h3: "Rozstępy pociążowe", text: "Zwykle na brzuchu, biodrach, piersiach — zaczynamy leczenie najwcześniej 3 miesiące po porodzie i zakończeniu karmienia." },
      { h3: "Rozstępy po szybkiej zmianie masy ciała", text: "Na udach, pośladkach, ramionach — plan wielomiesięczny łączący laser i mikronakłuwanie." },
    ],
    methods: [
      { h3: "Laser frakcyjny CO2", text: "Ablacyjny remodeling — najskuteczniejszy dla rozstępów dojrzałych i głębszych.", to: "/technologie/laser-frakcyjny-co2-warszawa" },
      { h3: "Mikronakłuwanie medyczne z osoczem", text: "Stymulacja kolagenu, szczególnie skuteczna w rozstępach świeżych." },
      { h3: "Laser naczyniowy", text: "Dla rozstępów czerwonych — wygasza komponent naczyniowy, przyspieszając „bielenie” zmiany do dalszej terapii." },
      { h3: "Pielęgnacja domowa z retinolem", text: "Preparaty stymulujące kolagen między sesjami — wzmacniają efekt zabiegów." },
    ],
    timeline:
      "Seria 4–6 sesji co 4–6 tygodni. Pierwsze efekty (poprawa kolorytu i tekstury) po 2–3 sesjach. Pełen wynik oceniamy 6 miesięcy po zakończeniu serii. Rozstępy świeże: redukcja do 70%; dojrzałe: 30–50%.",
    contraindications: [
      "ciąża i karmienie",
      "aktywna opalenizna",
      "izotretynoina doustna w ostatnich 6–12 miesiącach",
      "skłonność do bliznowców",
      "aktywne infekcje skóry w obszarze zabiegu",
    ],
    priceNote:
      "Konsultacja lekarska: od 300 zł (odliczana od zabiegu). Sesja lasera frakcyjnego (jeden obszar, np. brzuch): od 1 200 zł. Mikronakłuwanie z osoczem: od 900 zł. Pakiety serii z rabatem.",
    faq: [
      { q: "Czy rozstępy znikną całkowicie?", a: "Nie. Rozstęp to trwałe uszkodzenie skóry właściwej — celem terapii jest znaczna redukcja widoczności (30–70%), poprawa tekstury i wyrównanie koloru." },
      { q: "Kiedy zacząć po ciąży?", a: "Optymalnie 3 miesiące po porodzie i zakończeniu karmienia — wtedy rozstępy są jeszcze świeże, a hormony stabilne." },
      { q: "Czy zabiegi bolą?", a: "Stosujemy znieczulenie miejscowe (krem) i chłodzenie. Odczucie jest znośne; największy dyskomfort trwa 15–30 minut podczas zabiegu." },
      { q: "Ile trwa rekonwalescencja?", a: "Po laserze frakcyjnym: rumień 3–5 dni, łuszczenie do 7 dni. Po mikronakłuwaniu: rumień 24–48 h. Powrót do aktywności fizycznej: 5–7 dni." },
    ],
  },
  "wypadanie-wlosow-warszawa": {
    slug: "wypadanie-wlosow-warszawa",
    title: "Wypadanie włosów",
    short: "Łysienie androgenowe, telogenowe i ogniskowe — diagnostyka trichologiczna i leczenie łączone.",
    h1: "Leczenie wypadania włosów w Warszawie",
    metaTitle: "Wypadanie włosów Warszawa — trichologia lekarska | BMClinics",
    metaDesc:
      "Diagnostyka trichologiczna, mezoterapia i osocze bogatopłytkowe, farmakoterapia. Konsultacje w Warszawie, ul. Branickiego 10 (klinika ginekologii).",
    keyword: "wypadanie włosów Warszawa",
    intro:
      "Nadmierna utrata włosów zawsze wymaga różnicowania — zupełnie inaczej leczy się łysienie androgenowe, inaczej telogenowe, jeszcze inaczej ogniskowe. Zaczynamy od diagnostyki i badań laboratoryjnych, dopiero potem wdrażamy terapię.",
    types: [
      { h3: "Łysienie androgenowe", text: "Postępujące przerzedzenie w linii szczytowej i skroniowej — wymaga wieloletniej terapii podtrzymującej." },
      { h3: "Telogenowe wypadanie", text: "Rozlane przerzedzenie po stresie, ciąży, chorobie, restrykcyjnej diecie — zwykle odwracalne po usunięciu przyczyny." },
      { h3: "Łysienie ogniskowe (alopecia areata)", text: "Ostro odgraniczone ogniska wyłysienia — leczenie miejscowe i systemowe pod kontrolą lekarza." },
      { h3: "Blizowaciejące", text: "Trwałe uszkodzenie mieszka włosowego — wymaga wcześniejszej biopsji i konsultacji dermatologicznej." },
    ],
    methods: [
      { h3: "Diagnostyka trichologiczna", text: "Trichoskopia, phototrichogram, badania laboratoryjne (ferrytyna, TSH, witamina D, androgeny) — bez tego terapia jest zgadywaniem." },
      { h3: "Farmakoterapia miejscowa i ogólna", text: "Minoksydyl, finasteryd (u mężczyzn i wybranych kobiet), spironolakton, suplementacja — dobierane po diagnostyce." },
      { h3: "Osocze bogatopłytkowe (PRP)", text: "Iniekcje w skórę głowy — stymulują mieszki włosowe. Seria 3–4 zabiegów co 4 tygodnie, potem podtrzymanie co 4–6 miesięcy." },
      { h3: "Mezoterapia igłowa", text: "Koktajle z witaminami, aminokwasami i peptydami — wspierają jakość włosów między sesjami PRP." },
    ],
    timeline:
      "Pierwsze efekty terapii łączonej widoczne po 3–4 miesiącach. Realną ocenę robimy po 6–9 miesiącach. Łysienie androgenowe wymaga terapii dożywotniej — po przerwaniu wraca. Telogenowe zwykle ustępuje w 6–12 miesięcy.",
    contraindications: [
      "ciąża i karmienie (dla wybranych leków — bezwzględnie finasteryd i spironolakton)",
      "aktywne infekcje skóry głowy",
      "zaburzenia krzepnięcia (dla iniekcji)",
      "choroby nowotworowe skóry głowy",
      "nieustalone rozpoznanie — najpierw diagnostyka",
    ],
    priceNote:
      "Konsultacja trichologiczna z trichoskopią: od 400 zł. Sesja PRP na skórę głowy: od 800 zł. Mezoterapia igłowa: od 500 zł. Pakiet 4 zabiegów PRP: od 2 800 zł.",
    faq: [
      { q: "Czy PRP wystarczy?", a: "PRP jest skuteczne, ale najlepsze wyniki daje w połączeniu z farmakoterapią przyczynową. Bez leczenia mechanizmu (np. androgenowego) efekt PRP jest krótkotrwały." },
      { q: "Czy finasteryd jest bezpieczny?", a: "Tak, przy prawidłowej kwalifikacji. Wymaga jednak omówienia potencjalnych działań niepożądanych i monitorowania. U kobiet w wieku rozrodczym stosowany tylko z bezwzględną antykoncepcją." },
      { q: "Kiedy zgłosić się do lekarza?", a: "Gdy tracisz więcej niż 100 włosów dziennie przez dłużej niż 2–3 miesiące, widzisz przerzedzenie w linii szczytowej lub pojawiają się ogniska wyłysienia." },
      { q: "Czy zabiegi bolą?", a: "PRP i mezoterapia — odczucie dyskomfortu podczas iniekcji, znoszone dobrze. Stosujemy krem znieczulający i chłodzenie. Po zabiegu bez rekonwalescencji." },
    ],
  },
};

export const Route = createFileRoute("/wskazania/$slug")({
  loader: ({ params }) => {
    const data = CONTENT[params.slug];
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const canonical = `https://bmclinics.ai/wskazania/${loaderData.slug}`;
    return {
      meta: [
        { title: loaderData.metaTitle },
        { name: "description", content: loaderData.metaDesc },
        { name: "keywords", content: `${loaderData.keyword}, ${loaderData.title} Warszawa, Branickiego, klinika ginekologii` },
        { property: "og:title", content: loaderData.metaTitle },
        { property: "og:description", content: loaderData.metaDesc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: canonical },
        { name: "geo.region", content: "PL-MZ" },
        { name: "geo.placename", content: "Warszawa" },
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            url: canonical,
            name: loaderData.h1,
            about: { "@type": "MedicalCondition", name: loaderData.title },
            mainContentOfPage: loaderData.metaDesc,
            audience: { "@type": "MedicalAudience", geographicArea: { "@type": "City", name: "Warszawa" } },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: loaderData.faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Strona główna", item: "https://bmclinics.ai/" },
              { "@type": "ListItem", position: 2, name: "Wskazania", item: "https://bmclinics.ai/wskazania" },
              { "@type": "ListItem", position: 3, name: loaderData.title, item: canonical },
            ],
          }),
        },
      ],
    };
  },
  notFoundComponent: ComingSoonIndication,
  errorComponent: ({ error }) => (
    <main className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="font-serif text-3xl text-ink">Wystąpił błąd</h1>
      <p className="mt-3 text-sm text-muted-foreground">{error?.message ?? "Spróbuj ponownie."}</p>
    </main>
  ),
  component: IndicationPage,
});

function IndicationPage() {
  const data = Route.useLoaderData();

  return (
    <main className="bg-background">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-16 md:pt-24">
        <nav aria-label="Ścieżka" className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          <Link to="/" className="hover:text-ink">Start</Link> ·{" "}
          <Link to="/wskazania" className="hover:text-ink">Wskazania</Link> · {data.title}
        </nav>
        <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-ink md:text-5xl">{data.h1}</h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">{data.intro}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/konsultacja"
            className="inline-flex h-11 items-center justify-center rounded-md bg-ink px-6 text-sm tracking-wide text-alabaster hover:bg-ink/90"
          >
            Umów konsultację
          </Link>
          <Link
            to="/diagnostyka-skory-warszawa"
            className="inline-flex h-11 items-center justify-center rounded-md border border-border px-6 text-sm text-ink hover:bg-secondary"
          >
            Zacznij od diagnostyki
          </Link>
        </div>
      </section>

      {/* Rodzaje */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading eyebrow="Typologia" title="Rodzaje i skąd się biorą" />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {data.types.map((t: { h3: string; text: string }) => (
            <div key={t.h3} className="rounded-lg border border-border bg-card p-6 shadow-soft">
              <h3 className="font-serif text-lg text-ink">{t.h3}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Metody */}
      <section className="bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <SectionHeading
            eyebrow="Leczenie"
            title="Metody dobierane w klinice"
            description="Terapię projektujemy indywidualnie — poniższe metody łączymy w plan dopasowany do skóry i trybu życia."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {data.methods.map((m: { h3: string; text: string; to?: string }) => (
              <div key={m.h3} className="rounded-lg border border-border bg-card p-6 shadow-soft">
                <h3 className="font-serif text-lg text-ink">{m.h3}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{m.text}</p>
                {m.to && (
                  <Link to={m.to} className="mt-3 inline-block text-xs uppercase tracking-[0.25em] text-champagne hover:underline">
                    Poznaj technologię →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-4xl px-4 py-16">
        <SectionHeading eyebrow="Realne efekty" title="Czego oczekiwać po serii" />
        <p className="mt-6 text-base text-foreground/90">{data.timeline}</p>
      </section>

      {/* Przeciwwskazania */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <SectionHeading eyebrow="Bezpieczeństwo" title="Przeciwwskazania" />
        <ul className="mt-8 grid gap-2">
          {data.contraindications.map((c: string) => (
            <li key={c} className="flex items-start gap-3 rounded-md border border-border bg-card p-4 text-sm">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-champagne" aria-hidden />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Cennik note */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <SectionHeading eyebrow="Cennik" title="Koszt konsultacji i zabiegów w Warszawie" />
        <p className="mt-6 text-base text-foreground/90">{data.priceNote}</p>
        <Link to="/cennik" className="mt-4 inline-block text-sm text-champagne hover:underline">
          Pełny cennik →
        </Link>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <SectionHeading eyebrow="FAQ" title="Najczęstsze pytania" />
        <div className="mt-8 space-y-4">
          {data.faq.map((f: { q: string; a: string }) => (
            <details key={f.q} className="group rounded-lg border border-border bg-card p-5 shadow-soft">
              <summary className="cursor-pointer list-none font-serif text-lg text-ink">
                {f.q}
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Local */}
      <LocalWarsawSection procedureLabel={`terapię — ${data.title.toLowerCase()}`} />

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 py-24 text-center">
        <div className="rounded-lg border border-champagne/40 bg-card p-8 shadow-soft md:p-12">
          <div className="text-xs uppercase tracking-[0.3em] text-champagne">Umów wizytę</div>
          <h2 className="mt-3 font-serif text-2xl text-ink md:text-3xl">
            Zacznij od rozmowy — plan jest ważniejszy niż pojedynczy zabieg
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/konsultacja" className="inline-flex h-11 items-center justify-center rounded-md bg-ink px-6 text-sm text-alabaster hover:bg-ink/90">
              Umów konsultację
            </Link>
            <Link to="/lekarze" className="inline-flex h-11 items-center justify-center rounded-md border border-border px-6 text-sm text-ink hover:bg-secondary">
              Poznaj zespół
            </Link>
          </div>
          <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="size-4 text-champagne" aria-hidden />
            ul. Branickiego 10, Warszawa (klinika ginekologii)
          </p>
        </div>
      </section>
    </main>
  );
}

function humanizeSlug(slug: string) {
  const cleaned = slug
    .replace(/-warszawa$/i, "")
    .replace(/-/g, " ")
    .trim();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function ComingSoonIndication() {
  const { slug } = Route.useParams();
  const title = humanizeSlug(slug);

  return (
    <main className="bg-background">
      <section className="mx-auto max-w-4xl px-4 pb-10 pt-16 md:pt-24">
        <nav aria-label="Ścieżka" className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          <Link to="/" className="hover:text-ink">Start</Link> ·{" "}
          <Link to="/wskazania" className="hover:text-ink">Wskazania</Link> · {title}
        </nav>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-champagne/50 bg-champagne/5 px-3 py-1 text-xs uppercase tracking-[0.25em] text-champagne">
          <Clock className="size-3.5" aria-hidden /> Wkrótce
        </div>
        <h1 className="mt-4 font-serif text-4xl leading-tight text-ink md:text-5xl">
          {title} — strona w przygotowaniu
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
          Pracujemy nad pełnym opisem tego wskazania. W międzyczasie możesz umówić konsultację — plan
          leczenia projektujemy indywidualnie po diagnostyce skóry, a rekomendacje przekażemy podczas wizyty
          w naszej klinice w Warszawie na ul. Branickiego 10 (klinika ginekologii).
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/konsultacja"
            className="inline-flex h-11 items-center justify-center rounded-md bg-ink px-6 text-sm tracking-wide text-alabaster hover:bg-ink/90"
          >
            <CalendarCheck className="mr-2 size-4" aria-hidden />
            Umów konsultację
          </Link>
          <Link
            to="/diagnostyka-skory-warszawa"
            className="inline-flex h-11 items-center justify-center rounded-md border border-border px-6 text-sm text-ink hover:bg-secondary"
          >
            Zacznij od diagnostyki
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12">
        <SectionHeading eyebrow="Przygotowanie" title="Jak przygotować się do konsultacji" />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            {
              icon: ShieldCheck,
              h: "Unikaj słońca i solarium",
              p: "Przez min. 4 tygodnie przed wizytą — świeża opalenizna wyklucza część zabiegów laserowych.",
            },
            {
              icon: Sparkles,
              h: "Odstaw retinol i mocne kwasy",
              p: "Na 5–7 dni przed konsultacją, aby ocena skóry była wiarygodna.",
            },
            {
              icon: CheckCircle2,
              h: "Przygotuj historię skóry",
              p: "Wcześniejsze zabiegi, przyjmowane leki (szczególnie izotretynoina), alergie i przewlekłe choroby.",
            },
            {
              icon: AlertTriangle,
              h: "Zdjęcia „przed”",
              p: "Zrób 2–3 zdjęcia problematycznych obszarów w naturalnym świetle — pomagają zaplanować terapię.",
            },
          ].map((item) => (
            <div key={item.h} className="flex gap-4 rounded-lg border border-border bg-card p-5 shadow-soft">
              <item.icon className="mt-1 size-5 shrink-0 text-champagne" aria-hidden />
              <div>
                <h3 className="font-serif text-lg text-ink">{item.h}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.p}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-lg border border-border bg-secondary/40 p-6 text-sm text-muted-foreground">
          Szukasz konkretnego wskazania? Zajrzyj do{" "}
          <Link to="/wskazania" className="text-champagne hover:underline">
            listy wszystkich wskazań
          </Link>{" "}
          lub napisz do nas — dopiszemy Twój temat do priorytetów redakcyjnych.
        </div>
      </section>

      <LocalWarsawSection procedureLabel="konsultację lekarską" />

      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <div className="rounded-lg border border-champagne/40 bg-card p-8 shadow-soft md:p-12">
          <div className="text-xs uppercase tracking-[0.3em] text-champagne">Zarezerwuj termin</div>
          <h2 className="mt-3 font-serif text-2xl text-ink md:text-3xl">
            Nie czekaj na pełny opis — porozmawiajmy o Twoim przypadku
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/konsultacja" className="inline-flex h-11 items-center justify-center rounded-md bg-ink px-6 text-sm text-alabaster hover:bg-ink/90">
              Umów konsultację
            </Link>
            <Link to="/lekarze" className="inline-flex h-11 items-center justify-center rounded-md border border-border px-6 text-sm text-ink hover:bg-secondary">
              Poznaj zespół
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
