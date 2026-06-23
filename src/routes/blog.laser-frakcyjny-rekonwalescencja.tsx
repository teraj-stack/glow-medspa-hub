import { RelatedPosts } from "@/components/site/RelatedPosts";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import {
  ArrowLeft,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Sparkles,
  Sun,
} from "lucide-react";

const FAQ = [
  {
    q: "Który laser frakcyjny ma najkrótszą rekonwalescencję?",
    a: "Najkrótszą rekonwalescencję ma laser pikosekundowy frakcyjny (soczewka typu plaster miodu) — zaczerwienienie ustępuje w 2–6 godzin, a makijaż można nałożyć następnego dnia. Laser tulowy 1927 nm to 3–5 dni łuszczenia i suchości. Laser frakcyjny CO2 to najmocniejszy zabieg ablacyjny — pełna rekonwalescencja zajmuje 7–14 dni, w tym 4–5 dni intensywnego wysięku i strupków.",
  },
  {
    q: "Czy po laserze frakcyjnym CO2 trzeba brać wolne z pracy?",
    a: "Tak, minimum 5–7 dni. W pierwszych 2–3 dniach skóra wydziela limfę, jest mocno obrzęknięta i pokryta cienką warstwą maści okluzyjnej — wygląd jest na tyle nietypowy, że nie nadaje się do kontaktów zawodowych ani spotkań prywatnych. Po 7 dniach pozostaje różowy odcień skóry maskowalny makijażem mineralnym.",
  },
  {
    q: "Czy po laserze pikosekundowym frakcyjnym można od razu wrócić do pracy?",
    a: "Tak — to główna przewaga tej technologii. Po zabiegu (najczęściej 30–45 minut) skóra jest zaczerwieniona jak po treningu, a uczucie ciepła ustępuje w 2–6 godzin. Nie ma strupków, łuszczenia ani wysięku. Następnego dnia można pracować, ćwiczyć i nakładać makijaż. To zabieg w stylu „lunch-time procedure”.",
  },
  {
    q: "Ile dni łuszczy się skóra po laserze tulowym 1927 nm?",
    a: "Łuszczenie zaczyna się w 2. lub 3. dobie i trwa zwykle 3–5 dni. Skóra schodzi delikatnymi płatkami (tzw. micro-peeling), bez głębokich strupków. W tym czasie nie wolno odrywać łuszczących się fragmentów — należy je pozwolić odpaść samoistnie i intensywnie nawilżać skórę.",
  },
  {
    q: "Czy mogę nałożyć makijaż dzień po zabiegu frakcyjnym?",
    a: "Po laserze pikosekundowym frakcyjnym — tak, już następnego dnia (mineralny). Po laserze tulowym 1927 nm — makijaż można nakładać dopiero po zakończeniu łuszczenia, czyli zwykle w 5.–6. dobie. Po laserze frakcyjnym CO2 — najwcześniej w 8.–10. dobie, gdy skóra jest już zregenerowana i tylko różowa.",
  },
  {
    q: "Kiedy widać efekt po zabiegu laserem frakcyjnym?",
    a: "Efekt „glow” widać natychmiast po ustąpieniu obrzęku — w przypadku pikosekundowego po 24 godzinach, tulowego po 7 dniach, CO2 po 14 dniach. Pełna przebudowa kolagenu trwa 3–6 miesięcy po ostatniej sesji. Wygładzenie blizn, zwężenie porów i wyrównanie kolorytu narastają stopniowo.",
  },
  {
    q: "Czy mogę uprawiać sport po laserze frakcyjnym?",
    a: "Po laserze pikosekundowym — od następnego dnia. Po laserze tulowym 1927 nm — po 48–72 godzinach (pocenie się rozkleja strupki i przedłuża gojenie). Po laserze frakcyjnym CO2 — dopiero po 10–14 dniach, gdy skóra jest w pełni zamknięta. Wcześniejszy wysiłek grozi infekcją i przebarwieniami pozapalnymi.",
  },
  {
    q: "Który laser frakcyjny daje najmocniejszy efekt?",
    a: "Im głębsza i bardziej ablacyjna jest energia, tym mocniejszy efekt — ale i dłuższe gojenie. Laser frakcyjny CO2 daje najsilniejszy efekt liftingujący i wygładzający w jednej sesji, ale wymaga 2 tygodni wyłączenia z życia. Laser tulowy 1927 nm to złoty środek — bardzo dobre wyniki na pigmentacji, melanocytach i drobnych zmarszczkach przy 3–5 dniach downtime. Laser pikosekundowy frakcyjny wymaga serii 4–6 sesji, ale bez przerywania życia codziennego.",
  },
  {
    q: "Jakie kosmetyki stosować w okresie rekonwalescencji?",
    a: "Dostajesz indywidualny pakiet dermokosmetyków dopasowany do typu zabiegu: maść regenerującą (dexpanthenol, ceramidy), tonik fizjologiczny, krem SPF 50+ z filtrem mineralnym. Bezwzględnie unikamy retinolu, kwasów, witaminy C w wysokim stężeniu i peelingów enzymatycznych przez 14 dni. W pierwszych dobach myjemy skórę wyłącznie wodą fizjologiczną lub łagodnym żelem bez SLS.",
  },
];

const TIMELINE = [
  {
    day: "Dzień 0 — bezpośrednio po zabiegu",
    pico: {
      look: "Skóra zaczerwieniona jak po treningu, lekkie uczucie ciepła.",
      care: "Maska kojąca w gabinecie, krem regenerujący, SPF 50+.",
      downtime: "0 — można od razu wrócić do pracy.",
    },
    tul: {
      look: "Intensywne zaczerwienienie, obrzęk, uczucie pieczenia (jak po silnym oparzeniu słonecznym).",
      care: "Zimne kompresy fizjologiczne, maść okluzyjna z dexpanthenolem.",
      downtime: "Reszta dnia w domu, bez ekspozycji na słońce.",
    },
    co2: {
      look: "Mocny obrzęk twarzy, wysięk limfy z mikrokanałów, skóra pokryta cienką warstwą maści.",
      care: "Okłady fizjologiczne co 2 godziny, gęsta warstwa maści okluzyjnej, paracetamol.",
      downtime: "Bezwzględnie w domu, leżąc z głową lekko uniesioną.",
    },
  },
  {
    day: "Dzień 1",
    pico: {
      look: "Skóra normalna, lekko różowa. Pacjentka opisuje „glow”.",
      care: "Krem nawilżający + SPF 50+. Makijaż mineralny OK.",
      downtime: "0 — praca, spotkania, ćwiczenia.",
    },
    tul: {
      look: "Skóra szorstka w dotyku, jak fine-grit sandpaper. Uczucie ściągania.",
      care: "Maść regenerująca 3–4× dziennie, brak kosmetyków aktywnych.",
      downtime: "Praca zdalna OK, spotkania niewskazane.",
    },
    co2: {
      look: "Pełny obrzęk twarzy (oczy często „domknięte” rano), żółtawy wysięk, zaczynają formować się mikrostrupki.",
      care: "Płukanie wodą fizjologiczną co 2 godziny, ponownie maść. Paracetamol w razie potrzeby.",
      downtime: "Bezwzględnie wolne.",
    },
  },
  {
    day: "Dzień 2",
    pico: {
      look: "Bez śladu zabiegu.",
      care: "Standardowa pielęgnacja, SPF 50+.",
      downtime: "0.",
    },
    tul: {
      look: "Początek łuszczenia — drobne płatki przy nosie i policzkach.",
      care: "Intensywne nawilżanie. Bezwzględnie nie zdzierać skóry.",
      downtime: "Praca OK, makijaż jeszcze nie.",
    },
    co2: {
      look: "Obrzęk stopniowo opada, wysięk maleje, formują się ciemnobrązowe mikrostrupki na całej powierzchni.",
      care: "Delikatne mycie wodą fizjologiczną, maść 4–5× dziennie.",
      downtime: "Bezwzględnie wolne.",
    },
  },
  {
    day: "Dzień 3",
    pico: {
      look: "—",
      care: "—",
      downtime: "—",
    },
    tul: {
      look: "Pełne łuszczenie — skóra schodzi płatami jak po silnym oparzeniu słonecznym.",
      care: "Maść regenerująca, krem SPF 50+ (mineralny), woda termalna.",
      downtime: "Praca OK, kontakty zawodowe — w zależności od stopnia.",
    },
    co2: {
      look: "Strupki zaczynają stopniowo odpadać — zaczynając od czoła i policzków.",
      care: "Maść 4–5× dziennie. Krótki, letni prysznic bez gorącej wody.",
      downtime: "Wolne.",
    },
  },
  {
    day: "Dzień 4–5",
    pico: {
      look: "—",
      care: "—",
      downtime: "—",
    },
    tul: {
      look: "Łuszczenie kończy się, skóra odsłania nową warstwę naskórka — gładką, różową, świetlistą.",
      care: "Powrót do nawilżających serum i kremów. SPF 50+ obowiązkowy.",
      downtime: "Pełen powrót do życia zawodowego, makijaż mineralny OK.",
    },
    co2: {
      look: "Strupki schodzą — skóra pod spodem intensywnie różowa, bardzo cienka i wrażliwa.",
      care: "Maść regenerująca, krem barierowy, SPF 50+ mineralny obowiązkowy.",
      downtime: "Praca zdalna OK, spotkania nadal niewskazane.",
    },
  },
  {
    day: "Dzień 6–7",
    pico: {
      look: "—",
      care: "—",
      downtime: "—",
    },
    tul: {
      look: "Pełna regeneracja. Widoczny efekt — wyrównany koloryt, mniej widoczne piegi i przebarwienia.",
      care: "Standardowa pielęgnacja + SPF 50+ przez kolejne 4 tygodnie.",
      downtime: "Zero ograniczeń (z wyjątkiem solarium i sauny).",
    },
    co2: {
      look: "Skóra w pełni zamknięta, ale nadal różowa (tzw. „pink phase”).",
      care: "Krem barierowy, SPF 50+ mineralny. Makijaż mineralny OK od dnia 8–10.",
      downtime: "Powrót do pracy biurowej OK, sport nadal nie.",
    },
  },
  {
    day: "Dzień 8–14",
    pico: {
      look: "—",
      care: "—",
      downtime: "—",
    },
    tul: {
      look: "—",
      care: "—",
      downtime: "—",
    },
    co2: {
      look: "Różowy odcień stopniowo zanika, skóra wraca do naturalnego kolorytu. Widać początkowy efekt: gładszą teksturę, zwężone pory, wygładzone zmarszczki.",
      care: "Powrót do pełnej rutyny pielęgnacyjnej (bez retinolu i kwasów do dnia 21). SPF 50+ obowiązkowy 3 miesiące.",
      downtime: "Sport po dniu 10–14. Sauna, basen, solarium — minimum 4 tygodnie przerwy.",
    },
  },
];

export const Route = createFileRoute("/blog/laser-frakcyjny-rekonwalescencja")({
  head: () => ({
    meta: [
      {
        title:
          "Laser frakcyjny — dzień po dniu rekonwalescencji (pikosekundowy, tulowy, CO2) | BMC Siedlce",
      },
      {
        name: "description",
        content:
          "Laser frakcyjny dzień po dniu: porównanie rekonwalescencji po laserze pikosekundowym frakcyjnym, tulowym 1927 nm i frakcyjnym CO2. Co dzieje się ze skórą, jak pielęgnować, kiedy wrócić do pracy.",
      },
      {
        name: "keywords",
        content:
          "laser frakcyjny dzień po dniu, rekonwalescencja po laserze frakcyjnym, laser frakcyjny CO2, laser tulowy 1927 nm, laser pikosekundowy frakcyjny, downtime laser, gojenie po laserze, pielęgnacja po laserze frakcyjnym, Siedlce",
      },
      {
        property: "og:title",
        content: "Laser frakcyjny — dzień po dniu rekonwalescencji",
      },
      {
        property: "og:description",
        content:
          "Trzy lasery frakcyjne, trzy scenariusze gojenia. Pełen plan dzień po dniu — co wygląda jak, jak pielęgnować skórę, kiedy wrócić do pracy i sportu.",
      },
      {
        property: "og:url",
        content: "https://bmclinics.ai/blog/laser-frakcyjny-rekonwalescencja",
      },
      { property: "og:type", content: "article" },
      { property: "article:published_time", content: "2026-06-22T12:00:00+02:00" },
      { property: "article:modified_time", content: "2026-06-22T12:00:00+02:00" },
      { property: "article:author", content: "Beauty & Mind Clinic" },
      { property: "article:section", content: "Medycyna estetyczna" },
      { property: "article:tag", content: "laser frakcyjny" },
      { property: "article:tag", content: "rekonwalescencja" },
      { property: "article:tag", content: "laser CO2" },
      { property: "article:tag", content: "laser tulowy" },
      { property: "og:locale", content: "pl_PL" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://bmclinics.ai/blog/laser-frakcyjny-rekonwalescencja",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline:
            "Laser frakcyjny — dzień po dniu rekonwalescencji (pikosekundowy, tulowy, CO2)",
          description:
            "Porównanie gojenia po trzech rodzajach lasera frakcyjnego: pikosekundowym, tulowym 1927 nm i frakcyjnym CO2. Pełen przewodnik dzień po dniu.",
          author: { "@type": "Organization", name: "Beauty & Mind Clinic" },
          publisher: {
            "@type": "Organization",
            name: "Beauty & Mind Clinic",
            logo: { "@type": "ImageObject", url: "https://bmclinics.ai/favicon.ico" },
          },
          datePublished: "2026-06-22T12:00:00+02:00",
          dateModified: "2026-06-22T12:00:00+02:00",
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": "https://bmclinics.ai/blog/laser-frakcyjny-rekonwalescencja",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Strona główna",
              item: "https://bmclinics.ai/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Laser frakcyjny — dzień po dniu rekonwalescencji",
              item: "https://bmclinics.ai/blog/laser-frakcyjny-rekonwalescencja",
            },
          ],
        }),
      },
    ],
  }),
  component: FractionalLaserRecoveryGuide,
});

function FractionalLaserRecoveryGuide() {
  return (
    <>
      {/* Hero */}
      <section className="bg-secondary/40 py-12 md:py-20">
        <div className="container-luxury">
          <Link
            to="/technologie"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Technologie
          </Link>
          <div className="mt-6 max-w-3xl">
            <div className="text-xs uppercase tracking-[0.3em] text-champagne">
              Przewodnik rekonwalescencji
            </div>
            <h1 className="mt-4 font-serif text-ink">
              Laser frakcyjny — dzień po dniu rekonwalescencji
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Trzy główne lasery frakcyjne — pikosekundowy, tulowy 1927 nm i CO2 — działają na
              skórę zupełnie inaczej. Różnica widać przede wszystkim w gojeniu. Poniżej
              porównanie dzień po dniu: jak wygląda skóra, jak ją pielęgnować i kiedy realnie
              można wrócić do pracy, sportu i makijażu.
            </p>
          </div>
        </div>
      </section>

      <div className="container-luxury grid gap-12 py-16 md:grid-cols-3 md:py-24">
        {/* Main content */}
        <article className="md:col-span-2 space-y-16">
          {/* Section: trzy lasery w skrócie */}
          <section>
            <SectionHeading
              eyebrow="Wprowadzenie"
              title="Trzy lasery frakcyjne, trzy różne mechanizmy"
            />
            <p className="mt-4 text-base text-foreground/85 md:text-lg leading-relaxed">
              „Laser frakcyjny” to nie jeden zabieg, tylko cała rodzina technologii. Słowo
              „frakcyjny” oznacza tylko jedno: wiązka jest rozdzielona na setki mikropunktów,
              a między nimi pozostaje nietknięta zdrowa skóra. To ona odpowiada za regenerację.
              Reszta — głębokość, długość fali, mechanizm — różni się drastycznie. Stąd
              różnice w okresie gojenia: od 6 godzin do 2 tygodni.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="tile-card">
                <div className="tile-icon">
                  <Sparkles className="size-5" />
                </div>
                <div className="tile-title text-base">Laser pikosekundowy frakcyjny</div>
                <p className="tile-text">
                  Nieablacyjny. Impuls 350 pikosekund tworzy efekt fotoakustyczny (LIOB) bez
                  uszkodzenia naskórka. <strong>Downtime: 2–6 godzin.</strong>
                </p>
              </div>
              <div className="tile-card">
                <div className="tile-icon">
                  <Sun className="size-5" />
                </div>
                <div className="tile-title text-base">Laser tulowy 1927 nm</div>
                <p className="tile-text">
                  Nieablacyjny, ale termiczny. Powierzchowna koagulacja naskórka — łuszczenie
                  jak po silnym oparzeniu słonecznym. <strong>Downtime: 3–5 dni.</strong>
                </p>
              </div>
              <div className="tile-card">
                <div className="tile-icon">
                  <AlertCircle className="size-5" />
                </div>
                <div className="tile-title text-base">Laser frakcyjny CO2</div>
                <p className="tile-text">
                  Ablacyjny — odparowuje fragmenty naskórka i skóry właściwej. Najsilniejszy
                  efekt, najdłuższe gojenie. <strong>Downtime: 7–14 dni.</strong>
                </p>
              </div>
            </div>
          </section>

          {/* Section: timeline */}
          <section>
            <SectionHeading
              eyebrow="Dzień po dniu"
              title="Tabela porównawcza rekonwalescencji"
            />
            <p className="mt-4 text-base text-foreground/85 md:text-lg leading-relaxed">
              Najważniejszy fragment przewodnika. Dla każdego dnia opisuję, jak wygląda skóra,
              jak ją pielęgnować i co można robić. Plan oparty na praktyce w klinikach
              warszawskich, w których zabiegi prowadzimy od ponad 10 lat — ten sam standard
              gabinetowy znajdziesz w Siedlcach.
            </p>

            <div className="mt-8 space-y-8">
              {TIMELINE.map((row, idx) => (
                <div key={idx} className="tile-card">
                  <div className="flex items-center gap-2 text-champagne">
                    <Calendar className="size-4" />
                    <div className="text-xs uppercase tracking-[0.25em]">{row.day}</div>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <div>
                      <div className="font-serif text-lg text-ink">Pikosekundowy</div>
                      <p className="mt-2 text-sm text-foreground/80">
                        <strong>Wygląd:</strong> {row.pico.look}
                      </p>
                      <p className="mt-1 text-sm text-foreground/80">
                        <strong>Pielęgnacja:</strong> {row.pico.care}
                      </p>
                      <p className="mt-1 text-sm text-foreground/80">
                        <strong>Aktywność:</strong> {row.pico.downtime}
                      </p>
                    </div>
                    <div>
                      <div className="font-serif text-lg text-ink">Tulowy 1927 nm</div>
                      <p className="mt-2 text-sm text-foreground/80">
                        <strong>Wygląd:</strong> {row.tul.look}
                      </p>
                      <p className="mt-1 text-sm text-foreground/80">
                        <strong>Pielęgnacja:</strong> {row.tul.care}
                      </p>
                      <p className="mt-1 text-sm text-foreground/80">
                        <strong>Aktywność:</strong> {row.tul.downtime}
                      </p>
                    </div>
                    <div>
                      <div className="font-serif text-lg text-ink">Frakcyjny CO2</div>
                      <p className="mt-2 text-sm text-foreground/80">
                        <strong>Wygląd:</strong> {row.co2.look}
                      </p>
                      <p className="mt-1 text-sm text-foreground/80">
                        <strong>Pielęgnacja:</strong> {row.co2.care}
                      </p>
                      <p className="mt-1 text-sm text-foreground/80">
                        <strong>Aktywność:</strong> {row.co2.downtime}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              „—” oznacza, że pacjent jest już w pełni po rekonwalescencji — nie ma żadnych
              ograniczeń ani specjalnej pielęgnacji.
            </p>
          </section>

          {/* Section: dla kogo */}
          <section>
            <SectionHeading
              eyebrow="Dobór technologii"
              title="Który laser frakcyjny wybrać?"
            />
            <p className="mt-4 text-base text-foreground/85 md:text-lg leading-relaxed">
              Decyzja zawsze zależy od trzech zmiennych: <strong>celu zabiegowego</strong>
              , <strong>fototypu skóry</strong> i <strong>tolerowanego downtime</strong>.
              Poniżej praktyczne wskazówki.
            </p>

            <div className="mt-8 space-y-4">
              <div className="tile-card">
                <div className="font-serif text-lg text-ink">
                  Wybierz laser pikosekundowy frakcyjny, gdy…
                </div>
                <ul className="mt-3 space-y-2 text-sm text-foreground/85">
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-champagne" />
                    nie możesz pozwolić sobie nawet na 2 dni „nieobecności społecznej”;
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-champagne" />
                    masz ciemniejszy fototyp (III–V) — brak ryzyka przebarwień pozapalnych;
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-champagne" />
                    pracujesz nad bliznami potrądzikowymi, melasmą lub pigmentacją.
                  </li>
                </ul>
              </div>

              <div className="tile-card">
                <div className="font-serif text-lg text-ink">Wybierz laser tulowy 1927 nm, gdy…</div>
                <ul className="mt-3 space-y-2 text-sm text-foreground/85">
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-champagne" />
                    masz piegi, plamy soczewicowate, drobne przebarwienia posłoneczne;
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-champagne" />
                    możesz zarezerwować 3–5 dni „w domu” (np. urlop, praca zdalna);
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-champagne" />
                    szukasz efektu „resurfacingu” skóry w jednej sesji.
                  </li>
                </ul>
              </div>

              <div className="tile-card">
                <div className="font-serif text-lg text-ink">Wybierz laser frakcyjny CO2, gdy…</div>
                <ul className="mt-3 space-y-2 text-sm text-foreground/85">
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-champagne" />
                    masz głębokie zmarszczki, wiotkość, blizny atroficzne lub fotostarzenie III–IV°;
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-champagne" />
                    możesz zaplanować 2 tygodnie wyłączenia z życia zawodowego i prywatnego;
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-champagne" />
                    masz jasny fototyp (I–III) i nie planujesz ekspozycji na słońce przez 3 miesiące.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section: czerwone flagi */}
          <section>
            <SectionHeading
              eyebrow="Bezpieczeństwo"
              title="Sygnały alarmowe — kiedy zadzwonić do kliniki"
            />
            <p className="mt-4 text-base text-foreground/85 md:text-lg leading-relaxed">
              W ogromnej większości przypadków rekonwalescencja przebiega przewidywalnie
              i bez powikłań. Są jednak sytuacje, w których nie czekamy — dzwonimy lub
              przychodzimy na kontrolę tego samego dnia.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="tile-card">
                <div className="tile-icon">
                  <AlertCircle className="size-5" />
                </div>
                <div className="tile-title text-base">Pęcherze surowicze, sączące rany</div>
                <p className="tile-text">
                  Po laserze nieablacyjnym (pikosekundowym, tulowym) nie powinny powstawać. To
                  oznaka oparzenia drugiego stopnia — wymaga interwencji.
                </p>
              </div>
              <div className="tile-card">
                <div className="tile-icon">
                  <AlertCircle className="size-5" />
                </div>
                <div className="tile-title text-base">Pulsujący ból, gorączka, ropny wysięk</div>
                <p className="tile-text">
                  Może świadczyć o nadkażeniu bakteryjnym lub reaktywacji opryszczki — pilna
                  konsultacja i antybiotykoterapia / lek przeciwwirusowy.
                </p>
              </div>
              <div className="tile-card">
                <div className="tile-icon">
                  <AlertCircle className="size-5" />
                </div>
                <div className="tile-title text-base">Ciemne, twarde strupy (poza CO2)</div>
                <p className="tile-text">
                  Po laserze pikosekundowym i tulowym strupów nie ma. Jeśli się pojawiają,
                  może to oznaczać zbyt intensywne ustawienia lub reakcję alergiczną.
                </p>
              </div>
              <div className="tile-card">
                <div className="tile-icon">
                  <AlertCircle className="size-5" />
                </div>
                <div className="tile-title text-base">Białe lub żółte plamy po 2 tygodniach</div>
                <p className="tile-text">
                  Mogą być wczesnym sygnałem hypopigmentacji — pilna konsultacja
                  z dermatologiem prowadzącym.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <SectionHeading eyebrow="FAQ" title="Najczęstsze pytania pacjentek" />
            <div className="mt-8 space-y-4">
              {FAQ.map((item, idx) => (
                <details
                  key={idx}
                  className="tile-card group cursor-pointer"
                >
                  <summary className="flex items-start justify-between gap-4 text-base font-medium text-ink">
                    {item.q}
                    <span className="text-champagne transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-foreground/80 leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        </article>

        {/* Sidebar */}
        <aside className="space-y-8">
          <div className="tile-card">
            <div className="tile-icon">
              <ShieldCheck className="size-5" />
            </div>
            <div className="tile-title text-base">Standard warszawski w Siedlcach</div>
            <p className="tile-text">
              10 lat doświadczenia w klinikach premium Warszawy — ten sam protokół
              bezpieczeństwa, ten sam standard pielęgnacji pozabiegowej, bez konieczności
              dojazdu i nocowania w stolicy.
            </p>
            <Link
              to="/konsultacja"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-champagne hover:underline"
            >
              Umów konsultację →
            </Link>
          </div>

          <div className="tile-card">
            <div className="tile-icon">
              <Clock className="size-5" />
            </div>
            <div className="tile-title text-base">Skrót downtime</div>
            <ul className="mt-3 space-y-2 text-sm text-foreground/85">
              <li><strong>Pikosekundowy:</strong> 2–6 godzin</li>
              <li><strong>Tulowy 1927 nm:</strong> 3–5 dni</li>
              <li><strong>Frakcyjny CO2:</strong> 7–14 dni</li>
            </ul>
          </div>

          <div className="tile-card">
            <div className="tile-icon">
              <Sparkles className="size-5" />
            </div>
            <div className="tile-title text-base">Powiązane lektury</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  to="/blog/blizny-potradzikowe"
                  className="text-champagne hover:underline"
                >
                  → Blizny potrądzikowe — kompletny przewodnik
                </Link>
              </li>
              <li>
                <Link
                  to="/blog/powiklania-mezoterapia-iglowa"
                  className="text-champagne hover:underline"
                >
                  → Powikłania po mezoterapii igłowej
                </Link>
              </li>
              <li>
                <Link to="/technologie" className="text-champagne hover:underline">
                  → Wszystkie technologie zabiegowe
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <RelatedPosts currentSlug="laser-frakcyjny-rekonwalescencja" />
    </>
  );
}
