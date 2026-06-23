import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Shield,
  CheckCircle,
  AlertCircle,
  FileCheck,
  Stethoscope,
  Scale,
  Clock,
  ScanFace,
  Ruler,
  CircleDot,
  SlidersHorizontal,
  ThermometerSun,
  Droplets,
  Sun,
  Ban,
  Phone,
  MessageCircle,
  CalendarDays,
} from "lucide-react";

export const Route = createFileRoute("/bezpieczenstwo-zabiegow-laserowych")({
  head: () => ({
    meta: [
      {
        title: "Bezpieczeństwo zabiegów laserowych — Beauty & Mind Clinic Siedlce",
      },
      {
        name: "description",
        content:
          "Bezpieczeństwo zabiegów laserowych w zależności od obszaru: twarz, ciało, bikini. Co zwiększa ryzyko, jak je ograniczyć, kiedy zgłosić się do lekarza oraz jak dobieramy parametry laseroterapii.",
      },
      {
        property: "og:title",
        content: "Bezpieczeństwo zabiegów laserowych — Beauty & Mind Clinic",
      },
      {
        property: "og:description",
        content:
          "Jak dbamy o bezpieczeństwo pacjenta podczas zabiegów laserowych: konsultacja, przeciwwskazania, kwalifikacje personelu i nadzór medyczny.",
      },
      { property: "og:url", content: "https://bmclinics.ai/bezpieczenstwo-zabiegow-laserowych" },
    ],
    links: [
      { rel: "canonical", href: "https://bmclinics.ai/bezpieczenstwo-zabiegow-laserowych" },
    ],
  }),
  component: LaserSafetyPage,
});

const SAFETY_PILLARS = [
  {
    icon: Stethoscope,
    title: "Konsultacja lekarska przed zabiegiem",
    text: "Każdy protokół zaczynamy od wywiadu medycznego i badania skóry w polu zabiegowym. Lekarz ocenia fototyp, stan ogólny, przyjmowane leki, historię opryszczki oraz wcześniejsze zabiegi. Dopiero na tej podstawie dobieramy technologię, parametry i harmonogram.",
  },
  {
    icon: Shield,
    title: "Sprzęt medyczny z certyfikacją",
    text: "W klinice pracujemy wyłącznie na urządzeniach klasy medycznej, zarejestrowanych i dopuszczonych do użytkowania na terenie Polski. Regularny serwis, kalibracja i przeglądy techniczne są obowiązkowym elementem naszej praktyki.",
  },
  {
    icon: FileCheck,
    title: "Procedury jakościowe",
    text: "Stosujemy jednolite protokoły bezpieczeństwa: dezynfekcja głowic, jednorazowe elementy aplikatorów, okulary ochronne dla pacjenta i personelu, dokumentację fotograficzną oraz zapis każdej sesji w kartotece.",
  },
  {
    icon: Clock,
    title: "Czas na skórę",
    text: "Nie wykonujemy zabiegów 'na siłę'. Odstępy między sesjami dobiera się do regeneracji skóry — zbyt wczesna kolejna procedura to najczęstsza przyczyna przebarwień i podrażnień. Pacjent otrzymuje też pisemne zalecenia pozabiegowe.",
  },
];

const RISKS = [
  {
    title: "Rumień i obrzęk",
    desc: "Naturalna, najczęstsza reakcja skóry po laserze — ustępuje zazwyczaj w ciągu kilku godzin do 2–3 dni, w zależności od głębokości i agresywności zabiegu.",
  },
  {
    title: "Przebarwienia pozapalne (PIH)",
    desc: "Możliwe szczególnie u fototypów III–VI i po ekspozycji słonecznej przed lub po zabiegu. Dlatego tak istotna jest ocena fototypu, wywiad i przestrzeganie zaleceń dotyczących filtrów UV.",
  },
  {
    title: "Pęcherze, kruszki lub zadrażnienie naskórka",
    desc: "Występują przy zbyt agresywnych parametrach lub nieprawidłowej pielęgnacji po zabiegu. W naszej praktyce konsultacja kwalifikująca i stopniowa eskalacja parametrów minimalizują to ryzyko.",
  },
  {
    title: "Zmiany w pigmentacji",
    desc: "Zbyt niska lub zbyt wysoka energia, złe dobranie długości fali albo zaniechanie ochrony przeciwsłonecznej mogą prowadzić do przebarwień lub odbarwień. Laseroterapia wymaga precyzji, a nie prędkości.",
  },
  {
    title: "Blizny",
    desc: "Powikłanie rzadkie, ale możliwe przy zabiegach u osób z tendencją do bliznowacenia (keloidy), nieprawidłowej pielęgnacji rany lub zakażeniu wtórnym. Wywiad skutecznie wyklucza te sytuacje.",
  },
  {
    title: "Odbarwienie lub utrata efektu",
    desc: "Wyniki zabiegów laserowych zależą od biologii pacjenta, fototypu, stylu życia i przestrzegania zaleceń. Nie każda skóra zareaguje identycznie, dlatego plan leczenia jest zawsze indywidualny.",
  },
];

const REGULATIONS = [
  {
    icon: Scale,
    title: "Ustawa o działalności leczniczej",
    text: "Zabiegi laserowe wykonywane są jako świadczenia zdrowotne lub w ramach działalności leczniczej. Klinika podlega nadzorowi wojewódzkiego inspektoratu weterynarii i inspekcji sanitarno-epidemiologicznej oraz wymogom lokalowym i sanitarnym.",
  },
  {
    icon: CheckCircle,
    title: "Kwalifikacje personelu",
    text: "Laseroterapię przeprowadzają osoby z odpowiednimi uprawnieniami i szkoleniami z zakresu laserów medycznych oraz medycyny estetycznej. Lekarz odpowiada medycznie za dobranie technologii i parametrów zabiegu.",
  },
  {
    icon: FileCheck,
    title: "Rejestracja urządzeń i dokumentacja",
    text: "Używane lasery są zarejestrowane jako wyroby medyczne lub sprzęt podlegający certyfikacji. Każda procedura jest dokumentowana — od wywiadu, przez zgodę, po zalecenia pozabiegowe i fotografie.",
  },
  {
    icon: AlertCircle,
    title: "Odpowiedzialna reklama",
    text: "Zgodnie z polskim prawem oraz wytycznymi reklamy wyrobów medycznych nie obiecujemy wyleczenia, nie używamy nazw handlowych urządzeń w komunikacji publicznej i nie gwarantujemy efektów — opisujemy wyłącznie mechanizmy działania i typowe wskazania.",
  },
];

const AREA_RISKS = [
  {
    id: "twarz",
    label: "Twarz",
    icon: ScanFace,
    summary: "Najwyższa widoczność i precyzja, delikatna skóra, blisko oczu i ust.",
    points: [
      "Skóra twarzy jest cienka, dobrze unaczyniona i szybciej reaguje rumieniem.",
      "Największe ryzyko przebarwień w okolicach ust, nosa i pod oczami, gdzie skóra jest najcieńsza.",
      "Konieczna jest pełna ochrona oczu pacjenta i operatora oraz wykluczenie aktywnej opryszczki.",
      "Ewentualne zmiany pigmentacyjne są najbardziej widoczne, dlatego parametry wybiera się konserwatywnie.",
      "Blizna po nieprawidłowej procedurze na twarzy ma największe znaczenie estetyczne i emocjonalne.",
    ],
  },
  {
    id: "cialo",
    label: "Ciało",
    icon: Ruler,
    summary: "Większa powierzchnia, grubsza skóra, dłuższy zabieg, ale mniej widoczne ewentualne zmiany.",
    points: [
      "Skóra ciała jest zazwyczaj grubsza i mniej wrażliwa niż na twarzy, co pozwala na szerszy zakres parametrów.",
      "Duża powierzchnia wymaga podzielenia zabiegu na segmenty i systematycznego chłodzenia.",
      "Ryzyko nierównomiernego efektu wzrasta przy zbyt szybkiej pracy lub niewłaściwym nakładaniu głowicy.",
      "Zmiany pigmentacyjne są mniej widoczne niż na twarzy, ale mogą pojawić się w miejscach narażonych na tarcie lub słońce (np. ramiona, dekolt).",
      "Po zabiegach na dużych powierzchniach istotne jest nawodnienie skóry i unikanie pocenia się przez pierwsze 24–48 h.",
    ],
  },
  {
    id: "bikini",
    label: "Bikini",
    icon: CircleDot,
    summary: "Obszar intymny, wrażliwa skóra, szczególna higiena i ograniczenie tarcia w okresie pozabiegowym.",
    points: [
      "Skóra w okolicy bikini jest cienka, elastyczna i często bardziej pigmentowana lub znamionowana.",
      "Występuje wyższa wrażliwość na ból oraz skłonność do podrażnień mechanicznych od bielizny i tarcia.",
      "Ryzyko infekcji wzrasta, gdy nie zachowana zostanie odpowiednia higiena lub gdy pacjent zbyt wcześnie wraca do aktywności fizycznej.",
      "Zabiegi w tym obszarze wymagają starannej oceny wszystkich zmian skórnych i fototypu.",
      "Rekonwalescencja wymaga luźnej bielizny, unikania gorącej kąpieli, sauny i depilacji mechanicznej przez czas wskazany przez lekarza.",
    ],
  },
];

const FAQ_AREA_RISKS = [
  {
    area: "Twarz",
    icon: ScanFace,
    questions: [
      {
        q: "Co zwiększa ryzyko powikłań przy zabiegach laserowych na twarz?",
        a: "Największe znaczenie mają: bardzo cienka skóra w okolicy oczu, nosa i ust, aktywna opryszczka lub jej skłonność, świeża opalenizna lub samoopalacz, leki światłouczulające (np. niektóre antybiotyki, izotretynoina), niedoświadczenie operatora, zbyt agresywne parametry oraz brak odpowiedniej ochrony oczu.",
      },
      {
        q: "Jak ograniczyć ryzyko podczas zabiegów na twarz?",
        a: "Przed zabiegiem: szczery wywiad, ocena fototypu, unikanie słońca i samoopalaczy przez 4 tygodnie, odstawienie drażniących substancji zgodnie z zaleceniami. W trakcie: testowa aplikacja, konserwatywne parametry na początku, pełna ochrona oczu. Po zabiegu: filtr SPF 50+, łagodna pielęgnacja, nie wycieranie ani drapanie skóry, unikanie makijażu przez czas wskazany przez lekarza.",
      },
      {
        q: "Kiedy zgłosić się do lekarza po zabiegu na twarz?",
        a: "Natychmiast, gdy pojawi się: silny ból, pęcherze lub kruszki, zauważalne zmiany w pigmentacji, objawy infekcji (ropień, rosnące zaczerwienienie, gorączka), oparzenie, wysiew opryszczki lub powstawanie blizny. Wczesna interwencja lekarza skutecznie zapobiega trwałym zmianom.",
      },
    ],
  },
  {
    area: "Ciało",
    icon: Ruler,
    questions: [
      {
        q: "Co zwiększa ryzyko powikłań przy zabiegach laserowych na ciele?",
        a: "Do głównych czynników należą: opalenizna przed lub po zabiegu, pocenie się i tarcie ubrań w polu zabiegowym, wykonywanie zabiegu na zbyt dużej powierzchni bez odpowiedniego chłodzenia, zbyt krótkie odstępy między sesjami, zbyt agresywne parametry, a także pielęgnacja z kwasami, retinoidami lub środkami drażniącymi w okresie pozabiegowym.",
      },
      {
        q: "Jak ograniczyć ryzyko podczas zabiegów na ciele?",
        a: "Kluczowe jest podzielenie dużych powierzchni na segmenty, systematyczne chłodzenie skóry, nawodnienie naskórka, unikanie pocenia się przez 24–48 godzin, noszenie luźnych, przewiewnych ubrań oraz bezwzględne stosowanie ochrony przeciwsłonecznej. Lekarz dobiera też odstępy między zabiegami do tempa regeneracji skóry.",
      },
      {
        q: "Kiedy zgłosić się do lekarza po zabiegu na ciele?",
        a: "Konsultacja jest konieczna, gdy rumień i obrzęk nie ustępują po 2–3 dniach, pojawiają się pęcherze, bolesne zaczerwienienie, zmiany pigmentacyjne, ropne wydzielanie, gorączka lub pogorszenie stanu skóry po kilku dniach od zabiegu.",
      },
    ],
  },
  {
    area: "Bikini",
    icon: CircleDot,
    questions: [
      {
        q: "Co zwiększa ryzyko powikłań przy zabiegach laserowych w okolicy bikini?",
        a: "Ryzyko rośnie przy: bardzo cienkiej i wrażliwej skórze, licznych znamionach, wysokim stężeniu melaniny, tarciu bielizny i syntetycznych materiałach, gorących kąpielach, saunie i basenie bez zgody lekarza, zbyt szybkim powrocie do aktywności fizycznej oraz niewłaściwej higienie w okresie pozabiegowym.",
      },
      {
        q: "Jak ograniczyć ryzyko podczas zabiegów w okolicy bikini?",
        a: "Przed zabiegiem lekarz ocenia wszystkie zmiany skórne i fototyp. Po zabiegu zalecamy: luźną bawełnianą bieliznę, staranną higienę bez agresywnych środków, unikanie gorącej wody i sauny, rezygnację z depilacji mechanicznej przez wskazany czas oraz powstrzymanie się od intensywnego ruchu, który nasila pocenie i tarcie.",
      },
      {
        q: "Kiedy zgłosić się do lekarza po zabiegu w okolicy bikini?",
        a: "Należy skontaktować się z kliniką w przypadku: silnego bólu, pęcherzy, ropniejących zmian, narastającego zaczerwienienia, gorączki, wyraźnych zmian pigmentacyjnych lub objawów infekcji. Obszar intymny wymaga szczególnej uwagi, dlatego nie warto czekać na samoistne ustąpienie niepokojących objawów.",
      },
    ],
  },
];

const PARAMETER_FACTORS = [
  {
    title: "Fototyp skóry",
    desc: "Na podstawie skali Fitzpatricka oceniamy reaktywność skóry na światło. Ciemniejsze fototypy wymagają niższej energii, innej długości fali i dłuższych odstępów między sesjami.",
  },
  {
    title: "Grubość i lokalizacja skóry",
    desc: "Skóra twarzy i bikini jest cieńsza niż na plecach czy udach. Do każdego obszaru dobieramy inną gęstość energii, wielkość plastra i czas impulsu.",
  },
  {
    title: "Cel zabiegu",
    desc: "Depilacja, redukcja przebarwień, rewitalizacja czy usuwanie zmian naczyniowych — każdy cel wymaga innego zakresu parametrów i częstotliwości sesji.",
  },
  {
    title: "Stan skóry w dniu zabiegu",
    desc: "Opalenizna, podrażnienia, stany zapalne, świeże zabiegi chemiczne lub retinoidy mogą zmusić do odroczenia procedury lub obniżenia energii.",
  },
  {
    title: "Historia reakcji",
    desc: "Jeśli pacjent wcześniej reagował silnym rumieniem, pęcherzami lub przebarwieniami, kolejna sesja rozpoczyna się od niższych parametrów i testowej aplikacji.",
  },
];

const PARAMETER_TABLE = [
  { parameter: "Energia / gęstość energii", role: "Decyduje o sile oddziaływania na docelową strukturę w skórze." },
  { parameter: "Długość fali", role: "Wybiera głębokość penetracji i selektywność dla barwnika: melanina, hemoglobina czy woda." },
  {
    parameter: "Czas trwania impulsu",
    role: "Krótsze impulsy koncentrują energię precyzyjniej; dłuższe rozpraszają ciepło na większej objętości.",
  },
  { parameter: "Rozmiar głowicy / plastra", role: "Wpływa na szybkość zabiegu i równomierność pokrycia dużych powierzchnii." },
  { parameter: "Chłodzenie skóry", role: "Chroni naskórek przed przegrzaniem, zwiększając komfort i bezpieczeństwo." },
  { parameter: "Odstępy między sesjami", role: "Dają skórze czas na regenerację i zmniejszają ryzyko przebarwień." },
];

const POST_PROCEDURE_SYMPTOMS = [
  {
    icon: ThermometerSun,
    title: "Rumień i ciepło",
    text: "Skóra po zabiegu laserowym jest zazwyczaj zaczerwieniona, ciepła i nieco wrażliwa na dotyk. To naturalna reakcja termiczna naskórka — najczęściej ustępuje w ciągu kilku godzin do 2–3 dni.",
  },
  {
    icon: Droplets,
    title: "Delikatny obrzęk i ściągnięcie",
    text: "Lekki obrzęk oraz uczucie ściągnięcia skóry mogą utrzymywać się 24–72 godziny. Pomaga chłodzenie, nawodnienie i łagodna pielęgnacja zalecana przez lekarza.",
  },
  {
    icon: Sun,
    title: "Łuszczenie i zmiana pigmentacji",
    text: "Przez kolejne dni może pojawić się drobne łuszczenie naskórka, a w niektórych protokołach — przejściowe ciemniejsze lub jaśniejsze przebarwienia. Ich ustępowanie trwa zwykle od kilku dni do kilku tygodni.",
  },
  {
    icon: AlertCircle,
    title: "Kruszki lub drobne strupki",
    text: "Przy głębszych zabiegach mogą powstać drobne kruszki lub strupki. Nie należy ich zdzierać — podrażnia to skórę i zwiększa ryzyko przebarwień oraz blizn.",
  },
];

const POST_PROCEDURE_DONT = [
  "Nie wystawiaj skóry na słońce ani nie korzystaj z solarium przez czas wskazany przez lekarza (zazwyczaj minimum 4 tygodnie).",
  "Nie używaj na polu zabiegowym kwasów, retinoidów, peelingów mechanicznych ani kosmetyków z alkoholem, dopóki lekarz nie zgodzi się na powrót do rutyny.",
  "Nie pilinguj, nie drap i nie wycieraj mocno skóry — unikaj tarcia ręcznikiem, gąbką i kosmetycznymi rolkami.",
  "Nie korzystaj z sauny, gorących kąpieli, basenu i intensywnych ćwiczeń przez pierwsze 24–72 godziny (dłużej w okolicach bikini i twarzy, jeśli zalecono).",
  "Nie nakładaj makijażu na świeżo podrażnioną skórę twarzy bez zgody lekarza, by nie wprowadzić bakterii i nie nasilić reakcji.",
];

const CONTACT_STEPS = [
  {
    icon: MessageCircle,
    title: "1. Opisz objawy precyzyjnie",
    text: "Napisz lub powiedz, kiedy wykonano zabieg, w jakim obszarze występują objawy, jak długo trwają i czy towarzyszy im ból, pęcherz, ropa lub gorączka. Im więcej szczegółów, tym szybciej lekarz oceni sytuację.",
  },
  {
    icon: Phone,
    title: "2. Skontaktuj się bezpośrednio z kliniką",
    text: "Nie czekaj na samoistne ustąpienie niepokojących objawów. Zadzwoń lub napisz do Beauty & Mind Clinic — konsultację po zabiegu traktujemy priorytetowo, a nasz personel medyczny oceni, czy konieczna jest wizyta kontrolna.",
  },
  {
    icon: CalendarDays,
    title: "3. Umów wizytę kontrolną, jeśli zalecono",
    text: "Po rozmowie lekarz może zaprosić Cię na bezpłatną wizytę kontrolną, by obejrzeć skórę, wdrożyć łagodzącą pielęgnację lub w razie potrzeby rozpocząć leczenie powikłania. Termin dostosowujemy do pilności przypadku.",
  },
];

const FAQ = [
  {
    q: "Czy zabiegi laserowe są bezpieczne?",
    a: "Tak, pod warunkiem że są wykonywane przez wykwalifikowany personel na certyfikowanym sprzęcie, po pełnej konsultacji i z zachowaniem procedur pozabiegowych. Bezpieczeństwo to wynik wielu czynników, nie tylko samego urządzenia.",
  },
  {
    q: "Dlaczego zabiegi laserowe muszą być nadzorowane przez lekarza?",
    a: "Laseroterapia to procedura medyczna o określonym profilu ryzyka. Lekarz ocenia przeciwwskazania, dobiera parametry, rozpoznaje powikłania i decyduje o bezpiecznym łączeniu technologii. Nadzór medyczny jest wymogiem prawnym i standardem odpowiedzialnej praktyki.",
  },
  {
    q: "Czy laser może powodować nowotwory skóry?",
    a: "Nie ma wiarygodnych dowodów na to, że zabiegi laserowe wykonywane zgodnie z zasadami sztuki medycznej wywołują nowotwory skóry. Stosowane długości fali i parametry są dobierane tak, by działać na docelowe struktury bez uszkadzania DNA komórek.",
  },
  {
    q: "Co zrobić, żeby zmniejszyć ryzyko przebarwień?",
    a: "Unikać opalania i samoopalaczy przez 4 tygodnie przed i po zabiegu, stosować filtry SPF 50+, nie wycierać i nie drapać skóry, unikać substancji drażniących (kwasy, retinoidy) zgodnie z zaleceniami i pilnować odstępów między sesjami.",
  },
  {
    q: "Kto nie powinien poddawać się zabiegom laserowym?",
    a: "Przeciwwskazaniami są m.in. ciąża i karmienie, aktywne stany zapalne skóry, opryszczka w fazie wysiewu, świeża opalenizna, leki światłouczulające (np. izotretynoina, niektóre antybiotyki), choroby autoimmunologiczne w zaostrzeniu, skłonność do bliznowacenia oraz niektóre implanty elektryczne w polu zabiegowym.",
  },
];

function LaserSafetyPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-secondary/40 py-16 md:py-24">
        <div className="container-luxury">
          <SectionHeading
            eyebrow="BEZPIECZEŃSTWO"
            title="Bezpieczeństwo zabiegów laserowych"
            description="Laseroterapia to skuteczna, ale precyzyjna procedura medyczna. Bezpieczeństwo pacjenta zależy od wykwalifikowanego personelu, odpowiedniego sprzętu, rzetelnej konsultacji i przestrzegania zaleceń pozabiegowych."
            as="h1"
          />
        </div>
      </section>

      {/* PILLARS */}
      <section className="container-luxury py-12 md:py-20">
        <div className="grid gap-8 md:grid-cols-2">
          {SAFETY_PILLARS.map((p) => (
            <div
              key={p.title}
              className="rounded-lg border border-border bg-card p-6 shadow-soft md:p-8"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-champagne/10 text-champagne">
                  <p.icon className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-serif text-xl text-ink">{p.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/80 md:text-base">
                    {p.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RISKS */}
      <section className="bg-secondary/40 py-12 md:py-20">
        <div className="container-luxury">
          <SectionHeading
            eyebrow="RYZYKO"
            title="Potencjalne działania niepożądane"
            description="Każdy zabieg laserowy wiąże się z pewnym ryzykiem. Szanujemy pacjenta, dlatego opisujemy je otwarcie — większość powikłań jest przejściowa i można jej uniknąć dzięki kwalifikacji, odpowiedzialnemu doborowi parametrów i współpracy pacjenta w okresie pozabiegowym."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {RISKS.map((r) => (
              <div
                key={r.title}
                className="rounded-lg border border-border bg-card p-5 shadow-soft"
              >
                <div className="flex items-center gap-2 text-champagne">
                  <AlertCircle className="size-4" aria-hidden="true" />
                  <h3 className="font-serif text-lg text-ink">{r.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-foreground/80">{r.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Nie wszystkie osoby kwalifikują się do laseroterapii. Podczas konsultacji lekarz
            omawia indywidualne ryzyko i — jeśli zabieg nie jest bezpieczny dla danego pacjenta —
            proponuje alternatywne rozwiązania lub odsuwa termin.
          </p>
        </div>
      </section>

      {/* AREA RISKS */}
      <section className="container-luxury py-12 md:py-20">
        <SectionHeading
          eyebrow="OBSZARY ZABIEGOWE"
          title="Porównanie ryzyka: twarz, ciało, bikini"
          description="To samo światło lasera działa inaczej w zależności od grubości skóry, ukrwienia, narażenia na słońce i wrażliwości pacjenta. Poniżej pokazujemy, na co zwracamy szczególną uwagę w każdym obszarze."
        />
        <Tabs defaultValue="twarz" className="mt-10">
          <TabsList className="mb-6 grid h-auto w-full grid-cols-3 bg-secondary p-1 md:w-fit">
            {AREA_RISKS.map((area) => (
              <TabsTrigger
                key={area.id}
                value={area.id}
                className="flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm data-[state=active]:bg-card data-[state=active]:text-ink"
              >
                <area.icon className="size-4" aria-hidden="true" />
                {area.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {AREA_RISKS.map((area) => (
            <TabsContent
              key={area.id}
              value={area.id}
              className="rounded-lg border border-border bg-card p-6 shadow-soft md:p-8"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-champagne/10 text-champagne">
                  <area.icon className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-ink">{area.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/80 md:text-base">
                    {area.summary}
                  </p>
                </div>
              </div>
              <ul className="mt-6 space-y-3">
                {area.points.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-foreground/80 md:text-base">
                    <AlertCircle className="mt-0.5 size-4 shrink-0 text-champagne" aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* AREA FAQ */}
      <section className="bg-secondary/40 py-12 md:py-20">
        <div className="container-luxury">
          <SectionHeading
            eyebrow="FAQ"
            title="Ryzyko w poszczególnych obszarach"
            description="Poniżej odpowiadamy na najczęstsze pytania o to, co może zwiększać ryzyko powikłań, jak je ograniczyć oraz kiedy po zabiegu należy skontaktować się z lekarzem."
          />
          <div className="mt-10 space-y-8">
            {FAQ_AREA_RISKS.map((area) => (
              <div
                key={area.area}
                className="rounded-lg border border-border bg-card p-6 shadow-soft md:p-8"
              >
                <div className="flex items-center gap-3 text-champagne">
                  <area.icon className="size-5" aria-hidden="true" />
                  <h3 className="font-serif text-xl text-ink">{area.area}</h3>
                </div>
                <div className="mt-6 divide-y divide-border rounded-lg border border-border">
                  {area.questions.map((item) => (
                    <details key={item.q} className="group p-5 open:bg-secondary/30 md:p-6">
                      <summary className="cursor-pointer list-none font-serif text-lg text-ink">
                        {item.q}
                      </summary>
                      <p className="mt-3 text-sm leading-relaxed text-foreground/80 md:text-base">
                        {item.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REGULATIONS */}
      <section className="container-luxury py-12 md:py-20">
        <SectionHeading
          eyebrow="NADZÓR I REGULACJE"
          title="Dlaczego zabiegi laserowe są regulowane?"
          description="Zabiegi laserowe w medycynie estetycznej nie są zwykłymi zabiegami kosmetycznymi. Wiążą się z działaniem energii na tkanki żywe, dlatego podlegają przepisom prawa medycznego, wymagają nadzoru specjalisty i odpowiednich kwalifikacji personelu."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {REGULATIONS.map((r) => (
            <div
              key={r.title}
              className="rounded-lg border border-border bg-card p-6 shadow-soft"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-champagne/10 text-champagne">
                  <r.icon className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-ink">{r.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/80 md:text-base">
                    {r.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PARAMETERS */}
      <section className="bg-secondary/40 py-12 md:py-20">
        <div className="container-luxury">
          <SectionHeading
            eyebrow="PARAMETRY"
            title="Jak dobieramy parametry zabiegu?"
            description="Nie podajemy nazw handlowych urządzeń ani uniwersalnych „programów”. Każdy protokół powstaje indywidualnie na podstawie fototypu, grubości skóry, celu zabiegu i wcześniejszych reakcji pacjenta."
          />
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-6 shadow-soft md:p-8">
              <div className="flex items-center gap-3 text-champagne">
                <SlidersHorizontal className="size-5" aria-hidden="true" />
                <h3 className="font-serif text-xl text-ink">Czynniki decydujące o parametrach</h3>
              </div>
              <ul className="mt-6 space-y-5">
                {PARAMETER_FACTORS.map((f) => (
                  <li key={f.title} className="flex flex-col gap-1">
                    <span className="font-medium text-ink">{f.title}</span>
                    <span className="text-sm leading-relaxed text-foreground/80 md:text-base">
                      {f.desc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 shadow-soft md:p-8">
              <div className="flex items-center gap-3 text-champagne">
                <Shield className="size-5" aria-hidden="true" />
                <h3 className="font-serif text-xl text-ink">Co składa się na bezpieczny protokół?</h3>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3">Parametr</TableHead>
                    <TableHead>Zadanie w doborze bezpieczeństwa</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {PARAMETER_TABLE.map((row) => (
                    <TableRow key={row.parameter}>
                      <TableCell className="font-medium text-ink">{row.parameter}</TableCell>
                      <TableCell className="text-foreground/80">{row.role}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Przy pierwszym kontakcie z nową skórą stosujemy testową aplikację na niewielkim fragmencie
            pola zabiegowego. Reakcję oceniamy po kilku dniach, dopiero wtedy ustalamy pełny protokół.
            Każda sesja jest dokumentowana — dzięki temu wiemy, które parametry działają bezpiecznie i
            skutecznie dla danego pacjenta.
          </p>
        </div>
      </section>

      {/* POST-PROCEDURE */}
      <section className="container-luxury py-12 md:py-20">
        <SectionHeading
          eyebrow="PO ZABIEGU"
          title="Kiedy i co robić po zabiegu"
          description="Po laseroterapii skóra potrzebuje wsparcia, by zregenerować się bezpiecznie. Poniżej znajdziesz typowe objawy, czynności, których należy unikać, oraz jasne kroki kontaktu z kliniką, gdy coś Cię niepokoi."
        />
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6 shadow-soft md:p-8">
            <div className="flex items-center gap-3 text-champagne">
              <Clock className="size-5" aria-hidden="true" />
              <h3 className="font-serif text-xl text-ink">Typowe objawy po zabiegu</h3>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
              Większość poniższych objawów jest przejściowa i ustępuje samoistnie. Ich nasilenie zależy od głębokości i agresywności zabiegu oraz indywidualnej reaktywności skóry.
            </p>
            <ul className="mt-6 space-y-5">
              {POST_PROCEDURE_SYMPTOMS.map((s) => (
                <li key={s.title} className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-champagne/10 text-champagne">
                    <s.icon className="size-4" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="font-medium text-ink">{s.title}</span>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/80 md:text-base">
                      {s.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <div className="rounded-lg border border-border bg-card p-6 shadow-soft md:p-8">
              <div className="flex items-center gap-3 text-champagne">
                <Ban className="size-5" aria-hidden="true" />
                <h3 className="font-serif text-xl text-ink">Czego unikać po zabiegu</h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                Przestrzeganie tych zasad zmniejsza ryzyko przebarwień, podrażnień i opóźnienia regeneracji:
              </p>
              <ul className="mt-6 space-y-4">
                {POST_PROCEDURE_DONT.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-foreground/80 md:text-base">
                    <AlertCircle className="mt-0.5 size-4 shrink-0 text-champagne" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 shadow-soft md:p-8">
              <div className="flex items-center gap-3 text-champagne">
                <Phone className="size-5" aria-hidden="true" />
                <h3 className="font-serif text-xl text-ink">Jak skontaktować się z kliniką</h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                Jeśli objawy utrzymują się dłużej niż zalecono, nasilają się lub budzą niepokój — skontaktuj się z nami w trzech prostych krokach:
              </p>
              <ol className="mt-6 space-y-5">
                {CONTACT_STEPS.map((step) => (
                  <li key={step.title} className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-champagne/10 text-champagne">
                      <step.icon className="size-4" aria-hidden="true" />
                    </div>
                    <div>
                      <span className="font-medium text-ink">{step.title}</span>
                      <p className="mt-1 text-sm leading-relaxed text-foreground/80 md:text-base">
                        {step.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-8 rounded-lg bg-secondary/40 p-5">
                <p className="text-sm leading-relaxed text-foreground/80 md:text-base">
                  <strong className="text-ink">W razie nagłych objawów:</strong> silny ból, pęcherze, ropne wydzielanie, gorączka lub szybko narastające zaczerwienienie — zadzwoń natychmiast lub przyjdź na wizytę kontrolną. Twoje bezpieczeństwo jest dla nas priorytetem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-secondary/40 py-12 md:py-20">
        <div className="container-luxury">
          <SectionHeading eyebrow="FAQ" title="Najczęstsze pytania o bezpieczeństwo" />
          <div className="mt-8 divide-y divide-border rounded-lg border border-border bg-card">
            {FAQ.map((item) => (
              <details key={item.q} className="group p-5 open:bg-secondary/30 md:p-6">
                <summary className="cursor-pointer list-none font-serif text-lg text-ink">
                  {item.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-foreground/80 md:text-base">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-luxury py-16 md:py-24">
        <div className="rounded-lg bg-ink p-8 text-alabaster md:p-12">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.3em] text-champagne">Konsultacja</div>
            <h2 className="mt-3 font-serif text-2xl md:text-3xl">
              Omówmy Twoje pytania o laseroterapię
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-alabaster/85 md:text-base">
              Jeśli masz wątpliwości co do bezpieczeństwa, przeciwwskazań lub tego, która technologia
              jest dla Ciebie odpowiednia — umów konsultację. Wstępna ocena jest bezpłatna i
              niezobowiązująca.
            </p>
            <Link
              to="/konsultacja"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-md bg-champagne px-8 text-sm font-medium tracking-wide text-accent-foreground transition hover:bg-champagne/90"
            >
              Umów bezpłatną konsultację
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
