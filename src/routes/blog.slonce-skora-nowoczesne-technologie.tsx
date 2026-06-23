import { RelatedPosts } from "@/components/site/RelatedPosts";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import {
  ArrowLeft,
  Sun,
  ShieldCheck,
  Sparkles,
  Calendar,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const SLUG = "slonce-skora-nowoczesne-technologie";
const URL = `https://bmclinics.ai/blog/${SLUG}`;
const TITLE =
  "Słońce, skóra i nowoczesne technologie — czy każdy laser „boi się” lata?";
const DESCRIPTION =
  "Nie każda technologia laserowa wymaga jesieni. Wyjaśniamy, dlaczego laser frakcyjny CO2 odkładamy na chłodniejsze miesiące, a laser pikosekundowy bezpiecznie pracuje również latem.";
const PUBLISHED = "2026-06-23T10:00:00+02:00";

const FAQ = [
  {
    q: "Czy zabiegi laserowe są bezpieczne latem?",
    a: "Część tak, część nie. Zabiegi ablacyjne (laser frakcyjny CO2), które otwierają naskórek, rezerwujemy na chłodniejsze miesiące — gojąca się skóra bez naturalnej bariery jest bardzo wrażliwa na UV i ryzyko przebarwień jest realne. Zabiegi nieablacyjne, jak laser pikosekundowy, można bezpiecznie wykonywać przez cały rok, ponieważ pozostawiają naskórek nienaruszony.",
  },
  {
    q: "Dlaczego laser frakcyjny CO2 nie jest wykonywany w sezonie wiosenno-letnim?",
    a: "Laser CO2 działa fototermicznie — odparowuje mikroskopijne kolumny tkanki, aby pobudzić syntezę nowego kolagenu. Naskórek jest przez kilka dni „otwarty”. Bezpośrednia ekspozycja na promieniowanie UV w tym czasie prowadzi do hiperpigmentacji pozapalnej, którą trudno usunąć. Dlatego głębokie renowacje CO2 planujemy od jesieni do wczesnej wiosny.",
  },
  {
    q: "Czym różni się laser pikosekundowy od lasera CO2?",
    a: "Laser CO2 działa cieplnie i ablacyjnie — uszkadza naskórek, aby uruchomić przebudowę. Laser pikosekundowy działa fotoakustycznie: bardzo krótki impuls (jedna bilionowa sekundy) generuje w skórze właściwej mikroskopijną falę uderzeniową, która stymuluje kolagen, ale pozostawia naskórek nienaruszony. To dwa zupełnie różne mechanizmy.",
  },
  {
    q: "Czy po laserze pikosekundowym można się opalać?",
    a: "Świadomego opalania unikamy zawsze — niezależnie od zabiegu. Po samym laserze pikosekundowym nie ma rekonwalescencji wymagającej cienia. Normalna ekspozycja na słońce (spacer, codzienne aktywności) jest bezpieczna pod warunkiem stosowania kremu z filtrem SPF 50, który i tak powinien być codziennym standardem o każdej porze roku.",
  },
  {
    q: "Jak długo trwa zaczerwienienie po laserze pikosekundowym?",
    a: "Bardzo krótko — od 2 do 6 godzin. Skóra wygląda jak po treningu, jest delikatnie różowa i ciepła. Nie ma strupów, łuszczenia ani wysięku. Następnego dnia można wrócić do pracy, makijażu i sportu.",
  },
  {
    q: "Jaki laser wybrać latem, a jaki jesienią?",
    a: "Latem skupiamy się na bezinwazyjnej stymulacji podskórnej — laser pikosekundowy, terapia LED, mezoterapia bezigłowa, odpowiednio dobrane formuły dermokosmetyczne. Jesienią i zimą wracamy do mocniejszych narzędzi ablacyjnych: laser frakcyjny CO2, głębokie peelingi medyczne. Plan ułożony na cały rok daje lepsze efekty niż pojedyncze zabiegi.",
  },
  {
    q: "Czy krem z filtrem wystarczy, aby chronić skórę po laserze?",
    a: "Krem SPF 50 z filtrem mineralnym jest absolutnym minimum każdego dnia w roku — także bez zabiegów. Po zabiegach ablacyjnych (np. CO2) sam krem nie wystarczy: dodatkowo zalecamy unikanie bezpośredniego słońca, nakrycie głowy, okulary i ograniczenie aktywności na zewnątrz w godzinach południowych przez pierwsze 4–6 tygodni.",
  },
];

export const Route = createFileRoute("/blog/slonce-skora-nowoczesne-technologie")({
  head: () => ({
    meta: [
      { title: `${TITLE} — Beauty & Mind Clinic` },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: URL },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "pl_PL" },
      { property: "article:published_time", content: PUBLISHED },
      { property: "article:modified_time", content: PUBLISHED },
      { property: "article:author", content: "Beauty & Mind Clinic" },
      { property: "article:section", content: "Medycyna estetyczna" },
      { property: "article:tag", content: "laser pikosekundowy" },
      { property: "article:tag", content: "laser frakcyjny CO2" },
      { property: "article:tag", content: "zabiegi latem" },
      { property: "article:tag", content: "fotoprotekcja" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: TITLE,
          description: DESCRIPTION,
          author: { "@type": "Organization", name: "Beauty & Mind Clinic" },
          publisher: {
            "@type": "Organization",
            name: "Beauty & Mind Clinic",
            logo: {
              "@type": "ImageObject",
              url: "https://bmclinics.ai/favicon.ico",
            },
          },
          datePublished: PUBLISHED,
          dateModified: PUBLISHED,
          mainEntityOfPage: { "@type": "WebPage", "@id": URL },
          inLanguage: "pl-PL",
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
              name: TITLE,
              item: URL,
            },
          ],
        }),
      },
    ],
  }),
  component: SunSkinTechArticle,
});

function SunSkinTechArticle() {
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
              Edukacja pacjenta
            </div>
            <h1 className="mt-4 font-serif text-ink">
              Słońce, skóra i nowoczesne technologie — czy każdy laser „boi się” lata?
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              „Poczekam z odmładzaniem do jesieni, bo latem lasery są niebezpieczne” — jedno
              z najczęstszych przekonań, z jakimi spotykamy się w gabinecie. Prawda jest
              bardziej precyzyjna: medycyna estetyczna nie musi brać urlopu na wakacje,
              jeśli mądrze dobierzemy narzędzie do warunków, jakie panują na zewnątrz.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3.5" /> 23 czerwca 2026
              </span>
              <span aria-hidden>·</span>
              <span>6 min czytania</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container-luxury grid gap-12 py-16 md:grid-cols-3 md:py-24">
        {/* Main */}
        <article className="md:col-span-2 space-y-16">
          <section>
            <p className="text-base text-foreground/85 md:text-lg leading-relaxed">
              Jako zespół, który od kilkunastu lat pracuje z najbardziej zaawansowanymi
              technologiami medycznymi, chcemy dać Ci pełen obraz sytuacji. Zrozumienie
              tego, jak działają nasze narzędzia, to najlepszy sposób na spokój
              i bezpieczeństwo. Przyjrzyjmy się dwóm potężnym technologiom z naszej
              pracowni: <strong>laserowi frakcyjnemu CO2</strong> oraz{" "}
              <strong>laserowi pikosekundowemu</strong>.
            </p>
          </section>

          {/* CO2 */}
          <section>
            <SectionHeading
              eyebrow="Laser frakcyjny CO2"
              title="Głęboka przebudowa, która wymaga cienia"
            />
            <div className="mt-6 space-y-5 text-base text-foreground/85 leading-relaxed md:text-lg">
              <p>
                Laser CO2 to absolutny złoty standard w medycynie anti-aging — narzędzie
                o potężnej mocy, które pozwala na spektakularną odnowę i wygładzenie
                skóry. Działa w oparciu o efekt <em>fototermiczny</em> (cieplny).
              </p>
              <p>
                Podczas zabiegu wiązka lasera CO2 celowo i w bardzo kontrolowany sposób
                odparowuje mikroskopijne kolumny tkanki, przechodząc przez naskórek aż do
                głębszych warstw. Proces ten wywołuje silną stymulację i tworzenie nowego
                kolagenu.
              </p>
              <div className="tile-card not-prose">
                <div className="tile-icon">
                  <Sun className="size-5" />
                </div>
                <div className="tile-title text-base">
                  Dlaczego latem odkładamy to urządzenie na półkę?
                </div>
                <p className="tile-text">
                  Wyobraź sobie naskórek jako dach Twojego domu, który chroni wnętrze przed
                  warunkami atmosferycznymi. Laser CO2, aby zadziałać w głębi, musi ten
                  „dach” w wielu miejscach delikatnie otworzyć. Po zabiegu skóra przez
                  kilka dni jest pozbawiona naturalnej tarczy ochronnej. Jeśli wystawisz
                  ją na promienie słoneczne — nawet podczas krótkiego spaceru — UV uderzy
                  bezpośrednio w bezbronne, gojące się komórki. To prosty przepis na
                  głębokie, bardzo trudne do usunięcia przebarwienia (hiperpigmentację
                  pozapalną).
                </p>
              </div>
              <p>
                Dlatego dla Twojego pełnego bezpieczeństwa głębokie renowacje przy użyciu
                lasera CO2 rezerwujemy <strong>wyłącznie na chłodniejsze i ciemniejsze
                miesiące</strong>.
              </p>
            </div>
          </section>

          {/* Pikosekundowy */}
          <section>
            <SectionHeading
              eyebrow="Laser pikosekundowy"
              title="Letni architekt wewnątrz skóry"
            />
            <div className="mt-6 space-y-5 text-base text-foreground/85 leading-relaxed md:text-lg">
              <p>
                Skoro laser CO2 wymaga jesieni, jak dbamy o jakość Twojej skóry w lipcu
                czy sierpniu? Tu na scenę wkracza prawdziwy cud nowoczesnej fizyki
                medycznej — laser pikosekundowy.
              </p>
              <p>
                W przeciwieństwie do lasera CO2, laser pikosekundowy niemal w ogóle nie
                opiera się na cieple. Jego działanie wykorzystuje efekt{" "}
                <em>fotoakustyczny</em>. Uderza w tkankę z tak niewyobrażalną prędkością
                (pikosekunda to jedna bilionowa sekundy), że zamiast podgrzewać komórki,
                tworzy w nich mikroskopijną falę uderzeniową — dźwiękową.
              </p>
              <div className="tile-card not-prose">
                <div className="tile-icon">
                  <Sparkles className="size-5" />
                </div>
                <div className="tile-title text-base">
                  Dlaczego to technologia całoroczna?
                </div>
                <p className="tile-text">
                  Dzięki specjalnym soczewkom (np. frakcyjnym typu „plaster miodu”) laser
                  pikosekundowy ogniskuje energię <strong>pod powierzchnią naskórka</strong>.
                  Tworzy w skórze właściwej mikroskopijne obszary optycznego przebicia
                  (LIOB), które wymuszają intensywną produkcję kolagenu — a naskórek
                  pozostaje całkowicie nienaruszony.
                </p>
              </div>
              <p>
                Wracając do naszej metafory: laser pikosekundowy to architekt, który wchodzi
                do domu, wykonuje gruntowny remont fundamentów i ścian nośnych, ale w ogóle
                nie zdejmuje dachu.
              </p>
              <p>
                Twój naskórek przez cały czas pozostaje spójny i nienaruszony. Działa jak
                naturalna tarcza, która — przy wsparciu dobrego kremu z filtrem SPF
                (absolutna konieczność każdego dnia w roku) — skutecznie chroni
                przebudowywaną w środku skórę przed słońcem. Po zabiegu może wystąpić
                jedynie delikatne zaczerwienienie, znikające w ciągu kilku godzin.
                Następnego dnia wracasz do letnich aktywności, a procesy odmładzania
                toczą się cicho i dyskretnie w głębi skóry.
              </p>
            </div>
          </section>

          {/* Porównanie */}
          <section>
            <SectionHeading
              eyebrow="Porównanie"
              title="Kiedy który laser — w skrócie"
            />
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="tile-card">
                <div className="tile-icon">
                  <AlertCircle className="size-5" />
                </div>
                <div className="tile-title text-base">Laser frakcyjny CO2</div>
                <ul className="mt-3 space-y-2 text-sm text-foreground/85">
                  <li>
                    <strong>Sezon:</strong> jesień – wczesna wiosna
                  </li>
                  <li>
                    <strong>Mechanizm:</strong> fototermiczny, ablacyjny
                  </li>
                  <li>
                    <strong>Naskórek:</strong> otwarty na kilka dni
                  </li>
                  <li>
                    <strong>Downtime:</strong> 7–14 dni
                  </li>
                  <li>
                    <strong>Wskazania:</strong> głęboka przebudowa, blizny, ostre objawy
                    fotostarzenia
                  </li>
                </ul>
              </div>
              <div className="tile-card">
                <div className="tile-icon">
                  <CheckCircle2 className="size-5" />
                </div>
                <div className="tile-title text-base">Laser pikosekundowy</div>
                <ul className="mt-3 space-y-2 text-sm text-foreground/85">
                  <li>
                    <strong>Sezon:</strong> cały rok, także lato
                  </li>
                  <li>
                    <strong>Mechanizm:</strong> fotoakustyczny, nieablacyjny
                  </li>
                  <li>
                    <strong>Naskórek:</strong> nienaruszony
                  </li>
                  <li>
                    <strong>Downtime:</strong> 2–6 godzin
                  </li>
                  <li>
                    <strong>Wskazania:</strong> przebarwienia, stymulacja kolagenu,
                    wyrównanie kolorytu
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Podsumowanie */}
          <section>
            <SectionHeading
              eyebrow="Podsumowanie"
              title="Twój plan piękna nie zna przerw"
            />
            <div className="mt-6 space-y-5 text-base text-foreground/85 leading-relaxed md:text-lg">
              <p>
                Upływ czasu i utrata kolagenu nie robią sobie wakacyjnej przerwy — dlatego
                nasze plany zabiegowe również nie muszą. Posiadając w arsenale różnorodne,
                zaawansowane platformy medyczne, możemy precyzyjnie zarządzać architekturą
                Twojej twarzy przez cały rok.
              </p>
              <p>
                Wiosną i latem skupiamy się na bezinwazyjnej stymulacji podskórnej
                i prewencji — laser pikosekundowy oraz odpowiednio dobrane formuły
                dermokosmetyczne. Jesienią i zimą, gdy słońce chowa się za chmurami,
                zapraszamy na głęboką, potężną przebudowę laserami ablacyjnymi.
              </p>
              <p>
                Wszystko po to, aby rzeźbienie Twojego naturalnego piękna było procesem nie
                tylko skutecznym, ale przede wszystkim — <strong>absolutnie bezpiecznym</strong>.
              </p>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <SectionHeading eyebrow="FAQ" title="Najczęstsze pytania pacjentek" />
            <div className="mt-8 space-y-4">
              {FAQ.map((item, idx) => (
                <details key={idx} className="tile-card group cursor-pointer">
                  <summary className="flex items-start justify-between gap-4 text-base font-medium text-ink">
                    {item.q}
                    <span className="text-champagne transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-foreground/80 leading-relaxed">
                    {item.a}
                  </p>
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
              bezpieczeństwa, ten sam dobór technologii do sezonu, bez konieczności
              dojazdu do stolicy.
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
              <Sun className="size-5" />
            </div>
            <div className="tile-title text-base">Sezonowy plan zabiegowy</div>
            <ul className="mt-3 space-y-2 text-sm text-foreground/85">
              <li>
                <strong>Wiosna / lato:</strong> pikosekundowy, LED, mezoterapia bezigłowa
              </li>
              <li>
                <strong>Jesień / zima:</strong> CO2, peelingi medyczne, głębokie protokoły
              </li>
              <li>
                <strong>Cały rok:</strong> SPF 50 mineralny każdego dnia
              </li>
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
                  to="/blog/laser-frakcyjny-rekonwalescencja"
                  className="text-champagne hover:underline"
                >
                  → Laser frakcyjny — dzień po dniu rekonwalescencji
                </Link>
              </li>
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
                  to="/bezpieczenstwo-zabiegow-laserowych"
                  className="text-champagne hover:underline"
                >
                  → Bezpieczeństwo zabiegów laserowych
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <RelatedPosts currentSlug={SLUG} />
    </>
  );
}
