import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { BookingForm } from "@/components/site/BookingForm";
import { getTechnology, type Technology } from "@/data/technologies";
import { formatCena } from "@/lib/format";
import {
  ArrowLeft,
  Check,
  Sparkles,
  ShieldCheck,
  Clock,
  Droplet,
  Sun,
  Target,
  Calendar,
  HeartPulse,
} from "lucide-react";
import heroAsset from "@/assets/tulowy-hero.jpg.asset.json";
import mechanizmAsset from "@/assets/tulowy-mechanizm.png.asset.json";
import rezultatAsset from "@/assets/tulowy-rezultat.jpg.asset.json";

const TECH_SLUG = "laser-tulowy";
const URL = "https://bmclinics.ai/technologie/laser-tulowy";

export const Route = createFileRoute("/technologie/laser-tulowy")({
  loader: (): { tech: Technology } => {
    const tech = getTechnology(TECH_SLUG);
    if (!tech) throw new Error("Laser tulowy — brak wpisu w bazie");
    return { tech };
  },
  head: () => {
    const title =
      "Laser tulowo-erbowy (Thulium/Erbium Glass) 1927 nm + 1550 nm — melasma, przebarwienia, rewitalizacja | Beauty & Mind Clinic Siedlce";
    const description =
      "Laser tulowo-erbowy, czyli hybryda lasera tulowego 1927 nm i lasera erbowego (szkło erbowe, Erbium Glass) 1550 nm — złoty standard w leczeniu melasmy, przebarwień posłonecznych i fotostarzenia. Standard premium klinik warszawskich w Siedlcach.";

    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "MedicalTherapy",
      name: "Laser tulowo-erbowy (Thulium/Erbium Glass) 1927 nm + 1550 nm — rewitalizacja i depigmentacja",
      description,
      url: URL,
      provider: {
        "@type": "MedicalBusiness",
        name: "Beauty & Mind Clinic",
        url: "https://bmclinics.ai",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Siedlce",
          addressCountry: "PL",
        },
      },
      indication: [
        "melasma",
        "przebarwienia posłoneczne",
        "fotostarzenie",
        "drobne zmarszczki",
        "nierówna tekstura skóry",
        "rozszerzone pory",
      ],
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Czym różni się laser tulowo-erbowy 1927 nm od lasera frakcyjnego CO₂?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Laser tulowo-erbowy (hybryda Thulium/Erbium Glass) jest nieablacyjny — nie narusza warstwy rogowej naskórka. Działa do 0,3 mm wgłąb, idealnie celując w warstwę, w której powstają przebarwienia. CO₂ jest ablacyjny, działa głębiej, daje silniejszą przebudowę kolagenu, ale wiąże się z tygodniową rekonwalescencją i większym ryzykiem powikłań pigmentacyjnych.",
          },
        },
        {
          "@type": "Question",
          name: "Czy zabieg jest bezpieczny dla osób z melasmą?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Tak — laser tulowy 1927 nm jest obecnie najbezpieczniejszą opcją laserową dla melasmy. Działa dokładnie w okolicy uszkodzonej błony podstawnej (~0,3 mm), nie pobudzając tyrozynazy w głębszych warstwach. W przeciwieństwie do laserów ablacyjnych nie wywołuje typowo pozapalnej hiperpigmentacji (PIH).",
          },
        },
        {
          "@type": "Question",
          name: "Ile sesji jest potrzebnych?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Dla rewitalizacji: 1–2 sesje rocznie. Dla melasmy i opornych przebarwień: seria 3–4 sesji co 4–6 tygodni, a następnie 1 sesja podtrzymująca co 6 miesięcy.",
          },
        },
        {
          "@type": "Question",
          name: "Jak wygląda rekonwalescencja?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Dzień 0–1: rumień i uczucie pieczenia, łagodny obrzęk. Dni 2–3: skóra przypomina „papier ścierny”, pojawiają się mikrobrązowe punkty (efekt MEND). Dni 4–7: punkty samoistnie odpadają, odsłaniając rozjaśnioną, gładką skórę. Pełna rekonwalescencja — 7 dni.",
          },
        },
        {
          "@type": "Question",
          name: "Czy mogę wykonać zabieg latem?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Najlepszy sezon to jesień–wiosna. Latem zabieg jest możliwy pod warunkiem bezwzględnej fotoprotekcji SPF 50+ (reaplikacja co 2 godziny) i unikania bezpośredniego słońca przez minimum 4 tygodnie. Przy aktywnej opaleniźnie odraczamy termin.",
          },
        },
        {
          "@type": "Question",
          name: "Czy laser tulowy nadaje się dla ciemnych fototypów (IV–VI)?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Tak — 1927 nm ma najwyższą absorpcję w wodzie i najniższą w melaninie ze wszystkich laserów tej klasy. To czyni go najbezpieczniejszą długością fali dla skóry typu IV–VI, gdzie inne lasery często powodują przebarwienia pozapalne.",
          },
        },
        {
          "@type": "Question",
          name: "Ile kosztuje zabieg w Siedlcach?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Pojedyncza sesja twarzy: 1750 zł. Pakiet 3 sesji twarzy: 4600 zł (ok. 15% taniej). Combo twarz + szyja + dekolt: 4000 zł. To cennik klinik warszawskich — bez konieczności dojazdu do Warszawy.",
          },
        },
      ],
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Strona główna", item: "https://bmclinics.ai/" },
        { "@type": "ListItem", position: 2, name: "Technologie", item: "https://bmclinics.ai/technologie" },
        { "@type": "ListItem", position: 3, name: "Laser tulowo-erbowy (Thulium/Erbium Glass) 1927/1550 nm", item: URL },
      ],
    };

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: URL },
        { property: "og:type", content: "article" },
        { property: "og:image", content: heroAsset.url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: heroAsset.url },
      ],
      links: [{ rel: "canonical", href: URL }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(serviceSchema) },
        { type: "application/ld+json", children: JSON.stringify(faqSchema) },
        { type: "application/ld+json", children: JSON.stringify(breadcrumbSchema) },
      ],
    };
  },
  component: LaserTulowyPage,
});

function LaserTulowyPage() {
  const { tech } = Route.useLoaderData() as { tech: Technology };

  return (
    <article className="bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroAsset.url}
            alt="Promienna, gładka skóra po zabiegu laserem tulowym"
            className="h-full w-full object-cover opacity-50"
            width={1600}
            height={1024}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        </div>

        <div className="container mx-auto grid gap-10 px-4 py-20 md:py-28 lg:grid-cols-[1.2fr,1fr] lg:items-center">
          <div className="flex max-w-2xl flex-col gap-6">
            <Link
              to="/technologie"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" />
              Wszystkie technologie
            </Link>
            <div className="text-xs uppercase tracking-[0.3em] text-champagne">
              Laser frakcyjny tulowo-erbowy · 1927 nm / 1550 nm
            </div>
            <h1 className="gold-line max-w-3xl font-serif text-4xl text-ink md:text-5xl lg:text-6xl">
              Laser, który zamyka temat melasmy i przebarwień
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Nieablacyjna fototermoliza frakcyjna lasera tulowo-erbowego — połączenie wiązki
              tulowej 1927 nm i wiązki erbowej (szkło erbowe) 1550 nm. Najbezpieczniejsza
              i najbardziej selektywna technologia w terapii hiperpigmentacji, fotostarzenia
              i rewitalizacji skóry. Standard premium klinik warszawskich — w Siedlcach.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/konsultacja"
                className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                Umów konsultację
              </Link>
              <a
                href="#mechanizm"
                className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-muted"
              >
                Jak to działa
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK FACTS */}
      <section className="border-b border-border/40 bg-muted/30">
        <div className="container mx-auto grid gap-6 px-4 py-12 md:grid-cols-4">
          {[
            { Icon: Target, label: "Długość fali", value: "1927 nm + 1550 nm" },
            { Icon: Clock, label: "Czas zabiegu", value: "45–60 min" },
            { Icon: Calendar, label: "Rekonwalescencja", value: "3–7 dni" },
            { Icon: ShieldCheck, label: "Bezpieczeństwo", value: "Fototypy I–VI" },
          ].map(({ Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <Icon className="mt-1 h-5 w-5 text-champagne" />
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
                <div className="font-serif text-lg text-ink">{value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MECHANIZM */}
      <section id="mechanizm" className="container mx-auto px-4 py-20">
        <SectionHeading
          eyebrow="Mechanizm działania"
          title="Dwie długości fali. Dwie różne głębokości pracy."
          description="Technologia hybrydowa łączy w jednym urządzeniu wiązkę tulową 1927 nm (warstwa powierzchowna — pigment) z wiązką erbową, czyli szkłem erbowym 1550 nm (skóra właściwa — kolagen i blizny). Zabieg dopasowujemy do problemu, nie odwrotnie."
        />
        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr,1fr] lg:items-center">
          <img
            src={mechanizmAsset.url}
            alt="Schemat działania lasera frakcyjnego tulowo-erbowego 1927 nm i szkła erbowego 1550 nm w skórze — kontrolowana koagulacja, kolumna MTZ i efekt halo"
            loading="lazy"
            width={1600}
            height={1024}
            className="rounded-xl border border-border/60 shadow-sm"
          />
          <div className="flex flex-col gap-6">
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <div className="flex items-center gap-3">
                <Sun className="h-5 w-5 text-champagne" />
                <h3 className="font-serif text-xl text-ink">1927 nm — wiązka tulowa</h3>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">Głębokość: ~0,3 mm</div>
              <p className="mt-3 text-sm text-ink/80">
                Wysoka absorpcja w wodzie zatrzymuje energię tuż przy granicy naskórka i skóry
                właściwej — dokładnie tam, gdzie znajduje się uszkodzona błona podstawna
                odpowiedzialna za melasmę i większość zmian barwnikowych.
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                {["melasma i ostuda", "przebarwienia posłoneczne i posłoneczne plamy starcze", "fotostarzenie powierzchowne", "drobne zmarszczki, rozszerzone pory", "nierówny koloryt"].map((t) => (
                  <li key={t} className="flex items-start gap-2 text-ink/80">
                    <Check className="mt-0.5 h-4 w-4 text-champagne" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border/60 bg-card p-6">
              <div className="flex items-center gap-3">
                <Droplet className="h-5 w-5 text-champagne" />
                <h3 className="font-serif text-xl text-ink">1550 nm — wiązka erbowa</h3>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">Głębokość: do ~1,5 mm</div>
              <p className="mt-3 text-sm text-ink/80">
                Niższa absorpcja w wodzie pozwala fotonom „prześlizgnąć się” przez naskórek
                i dotrzeć do warstwy siateczkowatej skóry właściwej, gdzie pracują fibroblasty.
                Tu odbywa się przebudowa kolagenu i remodeling blizn.
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                {["blizny potrądzikowe i pooperacyjne", "rozstępy białe i atroficzne", "głębsze zmarszczki", "zwiotczenie skóry", "aktywny trądzik (redukcja sebum)"].map((t) => (
                  <li key={t} className="flex items-start gap-2 text-ink/80">
                    <Check className="mt-0.5 h-4 w-4 text-champagne" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FRAKCJA — MTZ */}
      <section className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto grid gap-10 px-4 py-20 lg:grid-cols-[1fr,1fr] lg:items-center">
          <div className="flex flex-col gap-4">
            <SectionHeading
              eyebrow="Frakcyjna fototermoliza"
              title="Tysiące mikropunktów leczących. Nienaruszone wyspy zdrowej skóry."
            />
            <p className="text-muted-foreground">
              W przeciwieństwie do klasycznego resurfacingu, który usuwa cały naskórek,
              technologia frakcyjna dzieli wiązkę na tysiące mikroskopowych kolumn termicznych
              (MTZ — Microscopic Treatment Zones). Pomiędzy nimi pozostają wyspy całkowicie
              zdrowej tkanki — to one są rezerwuarem komórek macierzystych i przyspieszają
              regenerację o 80–90% w stosunku do laserów ablacyjnych.
            </p>
            <p className="text-muted-foreground">
              Efekt: krótka rekonwalescencja, niemal zerowe ryzyko bliznowacenia, możliwość
              wykonania zabiegu również u osób aktywnych zawodowo.
            </p>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {[
                { Icon: HeartPulse, t: "Neokolageneza", d: "wzrost gęstości kolagenu o ~40% w 12 tygodni" },
                { Icon: Sparkles, t: "Wymiana naskórka", d: "pełna reepitelizacja w 24–72 h" },
                { Icon: ShieldCheck, t: "Bez bliznowacenia", d: "wyspy zdrowej tkanki chronią przed PIH" },
                { Icon: Sun, t: "MEND — mikrowydzielanie", d: "naturalna eliminacja melaniny" },
              ].map(({ Icon, t, d }) => (
                <div key={t} className="rounded-lg border border-border/60 bg-card p-4">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-champagne" />
                    <div className="font-serif text-ink">{t}</div>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{d}</div>
                </div>
              ))}
            </div>
          </div>
          <img
            src={mechanizmAsset.url}
            alt="Schemat frakcyjnej fototermolizy — kolumny MTZ, nienaruszone wyspy skóry i strefa koagulacji halo"
            loading="lazy"
            width={1600}
            height={1024}
            className="rounded-xl border border-border/60 shadow-sm"
          />
        </div>
      </section>

      {/* WSKAZANIA */}
      <section className="container mx-auto px-4 py-20">
        <SectionHeading
          eyebrow="Dla kogo"
          title="Wskazania"
          description="Każdy protokół dobierany jest indywidualnie podczas konsultacji — z oceną fototypu, wywiadem hormonalnym i analizą zdjęć w świetle UV."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { t: "Melasma i ostuda", d: "Złoty standard. Działa dokładnie w warstwie uszkodzonej błony podstawnej, bez ryzyka nawrotu przez przegrzanie głębszych warstw." },
            { t: "Przebarwienia posłoneczne", d: "Plamy soczewicowate, piegi, zmiany barwnikowe po przewlekłej ekspozycji UV. Efekt już po 1 sesji." },
            { t: "Fotostarzenie", d: "Drobne zmarszczki, szorstka tekstura, utrata gęstości — kompleksowa odbudowa naskórka i pobudzenie fibroblastów." },
            { t: "Rozszerzone pory", d: "Obkurczenie ujść mieszków włosowych przez kontrolowaną koagulację okolicznych tkanek." },
            { t: "Blizny potrądzikowe", d: "Wiązka 1550 nm wnika do skóry właściwej i przebudowuje strukturę blizn atroficznych typu „ice pick” i „boxcar”." },
            { t: "Aktywny trądzik", d: "Redukcja sebum przez termiczne uszkodzenie gruczołów łojowych, działanie przeciwzapalne." },
            { t: "Rozstępy białe", d: "Stymulacja neokolagenezy w obrębie zaniku skóry właściwej — efektywne na rozstępy w fazie dojrzałej." },
            { t: "Ciemne fototypy (IV–VI)", d: "Najbezpieczniejsza długość fali dla osób o ciemnej karnacji — minimalne ryzyko hiperpigmentacji pozapalnej." },
            { t: "Skóra szyi i dekoltu", d: "Cienka, fotostarzała skóra reaguje znakomicie — bez ryzyka oparzeń typowych dla laserów ablacyjnych." },
          ].map(({ t, d }) => (
            <div key={t} className="rounded-xl border border-border/60 bg-card p-6">
              <h3 className="font-serif text-lg text-ink">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRZEBIEG ZABIEGU */}
      <section className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 py-20">
          <SectionHeading
            eyebrow="Przebieg zabiegu"
            title="Krok po kroku"
          />
          <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { step: "1", t: "Konsultacja", d: "Wywiad, analiza fototypu, zdjęcia w świetle widzialnym i UV, dobór długości fali i energii." },
              { step: "2", t: "Przygotowanie", d: "Demakijaż, znieczulenie miejscowe (krem EMLA, ok. 30 min). Schłodzenie skóry." },
              { step: "3", t: "Zabieg", d: "45–60 min. Skanowanie skóry głowicą — pacjentka odczuwa ciepło i mrowienie, intensywność dobrana indywidualnie." },
              { step: "4", t: "Pielęgnacja po", d: "Maska kojąca, peptydy regenerujące, SPF 50+. Plan pielęgnacji domowej na 14 dni." },
            ].map(({ step, t, d }) => (
              <li key={step} className="rounded-xl border border-border/60 bg-card p-6">
                <div className="font-serif text-3xl text-champagne">{step}</div>
                <div className="mt-2 font-serif text-lg text-ink">{t}</div>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* REKONWALESCENCJA */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr,1.2fr] lg:items-center">
          <img
            src={rezultatAsset.url}
            alt="Skóra po zabiegu laserem tulowym — gładka, rozjaśniona, zregenerowana"
            loading="lazy"
            width={1024}
            height={1536}
            className="rounded-xl border border-border/60 shadow-sm"
          />
          <div className="flex flex-col gap-6">
            <SectionHeading
              eyebrow="Rekonwalescencja"
              title="Co się dzieje po zabiegu — dzień po dniu"
            />
            <ul className="space-y-4">
              {[
                { d: "Dzień 0", t: "Rumień, uczucie ciepła, lekki obrzęk. Skóra wygląda jakby po intensywnym treningu." },
                { d: "Dni 1–2", t: "Obrzęk maksymalny — szczególnie wokół oczu (do 24–48 h). Skóra staje się szorstka jak papier ścierny." },
                { d: "Dni 3–5", t: "Pojawiają się mikrobrązowe punkty (efekt MEND) — to wydalana melanina. Obrzęk znika, skóra zaczyna się delikatnie złuszczać." },
                { d: "Dni 5–7", t: "Mikropunkty samoistnie odpadają. Pod nimi — nowy, jednolity, rozjaśniony naskórek. Można wracać do makijażu." },
                { d: "Tydzień 2–12", t: "Stopniowa neokolageneza. Skóra zyskuje gęstość, koloryt się wyrównuje, drobne zmarszczki ulegają wygładzeniu." },
              ].map((row) => (
                <li key={row.d} className="grid grid-cols-[100px,1fr] gap-4 border-l-2 border-champagne pl-4">
                  <div className="font-serif text-sm uppercase tracking-wider text-champagne">{row.d}</div>
                  <div className="text-sm text-ink/80">{row.t}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PRZECIWWSKAZANIA */}
      <section className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <SectionHeading
            eyebrow="Bezpieczeństwo"
            title="Przeciwwskazania"
            description="Bezwzględne i względne — szczegółowy wywiad przed każdym zabiegiem."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <h3 className="font-serif text-lg text-ink">Bezwzględne</h3>
              <ul className="mt-3 space-y-2 text-sm text-ink/80">
                {[
                  "ciąża i laktacja",
                  "aktywna opryszczka w polu zabiegowym",
                  "świeża opalenizna lub solarium (4 tyg.)",
                  "izotretynoina (Roakkutan) — minimum 6 miesięcy po zakończeniu",
                  "aktywna choroba nowotworowa skóry",
                  "padaczka światłoczuła",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <span className="mt-2 h-1 w-1 rounded-full bg-champagne" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <h3 className="font-serif text-lg text-ink">Względne — wymagają omówienia</h3>
              <ul className="mt-3 space-y-2 text-sm text-ink/80">
                {[
                  "skłonność do bliznowców",
                  "leki światłouczulające (niektóre antybiotyki, retinoidy)",
                  "choroby autoimmunologiczne skóry",
                  "świeże wypełniacze HA (2 tyg. odstępu)",
                  "toksyna botulinowa (2 tyg. odstępu)",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <span className="mt-2 h-1 w-1 rounded-full bg-champagne" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CENNIK */}
      <section className="container mx-auto px-4 py-20">
        <SectionHeading
          eyebrow="Cennik"
          title="Inwestycja"
          description="Standard premium klinik warszawskich — bez konieczności dojazdu, urlopu i parkingu w centrum stolicy."
        />
        <div className="mt-10 overflow-hidden rounded-xl border border-border/60">
          <table className="w-full">
            <tbody>
              {tech.pricing.map((row, idx) => (
                <tr
                  key={row.label}
                  className={`${idx % 2 === 0 ? "bg-card" : "bg-muted/40"} border-b border-border/40 last:border-0`}
                >
                  <td className="px-6 py-4">
                    <div className="font-serif text-ink">{row.label}</div>
                    {row.note && <div className="mt-1 text-xs text-muted-foreground">{row.note}</div>}
                  </td>
                  <td className="px-6 py-4 text-right font-serif text-lg text-ink">
                    {formatCena(row.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 py-20">
          <SectionHeading eyebrow="FAQ" title="Najczęstsze pytania" />
          <div className="mx-auto mt-10 max-w-3xl divide-y divide-border/60 rounded-xl border border-border/60 bg-card">
            {[
              { q: "Czym różni się laser tulowy 1927 nm od lasera CO₂?", a: "Laser tulowy jest nieablacyjny — nie narusza warstwy rogowej naskórka. Działa do 0,3 mm wgłąb, idealnie celując w warstwę, w której powstają przebarwienia. CO₂ jest ablacyjny, działa głębiej, daje silniejszą przebudowę kolagenu, ale wiąże się z 7–14-dniową rekonwalescencją i większym ryzykiem powikłań pigmentacyjnych." },
              { q: "Czy zabieg jest bezpieczny dla osób z melasmą?", a: "Tak — laser tulowy 1927 nm jest obecnie najbezpieczniejszą opcją laserową dla melasmy. Działa dokładnie w okolicy uszkodzonej błony podstawnej, nie pobudzając tyrozynazy w głębszych warstwach." },
              { q: "Ile sesji potrzeba?", a: "Rewitalizacja: 1–2 sesje rocznie. Melasma i oporne przebarwienia: seria 3–4 sesji co 4–6 tygodni + sesja podtrzymująca co 6 miesięcy." },
              { q: "Czy mogę wykonać zabieg latem?", a: "Optymalny sezon to jesień–wiosna. Latem — pod warunkiem bezwzględnej fotoprotekcji SPF 50+ i unikania bezpośredniego słońca przez minimum 4 tygodnie po zabiegu." },
              { q: "Czy nadaje się dla ciemnych fototypów?", a: "Tak. 1927 nm ma najwyższą absorpcję w wodzie i najniższą w melaninie — jest najbezpieczniejszą długością fali dla fototypów IV–VI." },
              { q: "Jak szybko widać efekt?", a: "Pierwsza poprawa kolorytu — w 7. dniu po pierwszej sesji. Pełna przebudowa kolagenu — 12 tygodni." },
            ].map((f) => (
              <details key={f.q} className="group p-6 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-start justify-between gap-4">
                  <span className="font-serif text-ink">{f.q}</span>
                  <span className="mt-1 shrink-0 text-champagne transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED */}
      <section className="container mx-auto px-4 py-20">
        <SectionHeading eyebrow="Powiązane" title="Czytaj dalej" />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Link
            to="/blog/laser-frakcyjny-rekonwalescencja"
            className="group rounded-xl border border-border/60 bg-card p-6 transition-colors hover:bg-muted/40"
          >
            <div className="text-xs uppercase tracking-wider text-champagne">Przewodnik</div>
            <div className="mt-2 font-serif text-lg text-ink group-hover:text-champagne">
              Laser frakcyjny — rekonwalescencja dzień po dniu
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Porównanie technologii pikosekundowej, tulowej 1927 nm i CO₂ — co realnie czeka cię
              przez 14 dni po zabiegu.
            </p>
          </Link>
          <Link
            to="/blog/blizny-potradzikowe"
            className="group rounded-xl border border-border/60 bg-card p-6 transition-colors hover:bg-muted/40"
          >
            <div className="text-xs uppercase tracking-wider text-champagne">Artykuł</div>
            <div className="mt-2 font-serif text-lg text-ink group-hover:text-champagne">
              Blizny potrądzikowe — co naprawdę działa
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Klasyfikacja blizn, dobór technologii i realne efekty terapii skojarzonych.
            </p>
          </Link>
        </div>
      </section>

      {/* CTA / BOOKING */}
      <section id="konsultacja" className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto grid gap-10 px-4 py-20 lg:grid-cols-[1fr,1fr] lg:items-start">
          <div className="flex flex-col gap-6">
            <SectionHeading
              eyebrow="Konsultacja"
              title="Zaplanuj swój zabieg w Siedlcach"
              description="Wypełnij formularz — oddzwaniamy w ciągu 24 godzin, by ustalić termin konsultacji i odpowiedzieć na wszystkie pytania."
            />
            <p className="text-sm text-muted-foreground">
              Beauty & Mind Clinic Siedlce · 10 lat doświadczenia w klinikach premium Warszawy ·
              ten sam sprzęt, ten sam standard, lokalnie.
            </p>
          </div>
          <BookingForm />
        </div>
      </section>
    </article>
  );
}
