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
import heroAvif from "@/assets/tulowy-hero.avif.asset.json";
import heroWebp from "@/assets/tulowy-hero.webp.asset.json";
import { HeroPicture } from "@/components/site/HeroPicture";
import mechanizmAsset from "@/assets/tulowy-mechanizm.png.asset.json";
import ba1Before from "@/assets/tulowy-ba-1.png.asset.json";
import ba1After from "@/assets/tulowy-ba-1a.png.asset.json";
import ba2Before from "@/assets/tulowy-ba-2.png.asset.json";
import ba2After from "@/assets/tulowy-ba-2a.png.asset.json";
import ba3Before from "@/assets/tulowy-ba-3.png.asset.json";
import ba3After from "@/assets/tulowy-ba-3a.png.asset.json";

const BEFORE_AFTER = [
  { before: ba1Before.url, after: ba1After.url, title: "Przebarwienia posłoneczne i plamy pigmentacyjne", desc: "Wyraźna redukcja plam, ujednolicenie kolorytu i rozjaśnienie skóry twarzy." },
  { before: ba2Before.url, after: ba2After.url, title: "Melasma i hiperpigmentacja policzków", desc: "Wyrównanie odcienia cery i zmniejszenie ogniskowej hiperpigmentacji." },
  { before: ba3Before.url, after: ba3After.url, title: "Jednolity koloryt i rozświetlona skóra", desc: "Redukcja szarej, zmęczonej poświaty i poprawa jednolitości naskórka." },
];

const TECH_SLUG = "laser-tulowy";
const PAGE_URL = "https://bmclinics.ai/technologie/laser-tulowy";

export const Route = createFileRoute("/technologie/laser-tulowy")({
  loader: (): { tech: Technology } => {
    const tech = getTechnology(TECH_SLUG);
    if (!tech) throw new Error("Laser tulowy — brak wpisu w bazie");
    return { tech };
  },
  head: () => {
    const title =
      "Laser tulowy 1927 nm — melasma, przebarwienia, depigmentacja | BM Clinics Siedlce";
    const description =
      "Laser tulowy 1927 nm — najbezpieczniejsza technologia w leczeniu melasmy i przebarwień posłonecznych. Precyzyjna depigmentacja bez wpływu na głębsze warstwy skóry. Standard premium klinik warszawskich w Siedlcach.";

    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "MedicalTherapy",
      name: "Laser tulowy 1927 nm — depigmentacja i melasma",
      description,
      url: PAGE_URL,
      provider: {
        "@type": "MedicalBusiness",
        name: "BM Clinics",
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
        "plamy starcze",
        "nierówny koloryt skóry",
        "piegi i plamy pigmentacyjne",
      ],
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Czym różni się laser tulowy 1927 nm od lasera frakcyjnego CO₂?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Laser tulowy 1927 nm jest nieablacyjny — nie narusza warstwy rogowej naskórka. Działa bardzo powierzchownie, około 0,1 mm wgłąb, idealnie celując w warstwę, w której powstają przebarwienia. CO₂ jest ablacyjny, działa głębiej i wiąże się z tygodniową rekonwalescencją oraz większym ryzykiem powikłań pigmentacyjnych.",
          },
        },
        {
          "@type": "Question",
          name: "Czy zabieg jest bezpieczny dla osób z melasmą?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Tak — laser tulowy 1927 nm jest obecnie najbezpieczniejszą opcją laserową dla melasmy. Działa dokładnie w okolicy uszkodzonej błony podstawnej, nie pobudzając tyrozynazy w głębszych warstwach. W przeciwieństwie do laserów ablacyjnych nie wywołuje typowo pozapalnej hiperpigmentacji (PIH).",
          },
        },
        {
          "@type": "Question",
          name: "Ile sesji jest potrzebnych?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Dla melasmy i opornych przebarwień: seria 3–4 sesji co 4–6 tygodni, a następnie 1 sesja podtrzymująca co 6 miesięcy.",
          },
        },
        {
          "@type": "Question",
          name: "Jak wygląda rekonwalescencja?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Dzień 0–1: rumień i uczucie pieczenia, łagodny obrzęk. Dni 2–3: skóra przypomina „papier ścierny”, pojawiają się mikrobrązowe punkty (efekt MEND). Dni 4–7: punkty samoistnie odpadają, odsłaniając rozjaśniony, jednolity naskórek. Pełna rekonwalescencja — 7 dni.",
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
        {
          "@type": "Question",
          name: "Czy laser tulowy można łączyć z zabiegami z toksyną botulinową?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Tak. Laser 1927 nm pracuje wyłącznie na powierzchni skóry, dlatego nie uszkadza efektu neuromodulatora wprowadzonego w głębsze warstwy. Jest to jedna z najczęstszych sytuacji, w których pacjentki wybierają tę technologię.",
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
        { "@type": "ListItem", position: 3, name: "Laser tulowy 1927 nm", item: PAGE_URL },
      ],
    };

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: PAGE_URL },
        { property: "og:type", content: "article" },
        { property: "og:image", content: heroAsset.url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: heroAsset.url },
      ],
      links: [
        { rel: "canonical", href: PAGE_URL },
        { rel: "preload", as: "image", href: heroAvif.url, type: "image/avif", fetchPriority: "high" },
      ],
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
          <HeroPicture
            avifUrl={heroAvif.url}
            webpUrl={heroWebp.url}
            fallbackUrl={heroAsset.url}
            alt="Promienna, gładka skóra po zabiegu laserem tulowym"
            width={1600}
            height={1024}
            eager
            className="h-full w-full"
            imgClassName="h-full w-full object-cover opacity-50"
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
              Laser frakcyjny tulowy · 1927 nm
            </div>
            <h1 className="gold-line max-w-3xl font-serif text-4xl text-ink md:text-5xl lg:text-6xl">
              Laser, który zamyka temat melasmy i przebarwień
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Nieablacyjna fototermoliza frakcyjna lasera tulowego 1927 nm. Najbezpieczniejsza
              i najbardziej selektywna technologia w terapii hiperpigmentacji i melasmy.
              Działa na powierzchni skóry — około 0,1 mm — dlatego nie zakłóca efektów
              zabiegów z toksyną botulinową. Standard premium klinik warszawskich — w Siedlcach.
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
            { Icon: Target, label: "Długość fali", value: "1927 nm" },
            { Icon: Clock, label: "Czas zabiegu", value: "30–45 min" },
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
          title="Bardzo precyzyjna, powierzchowna depigmentacja"
          description="Wiązka 1927 nm jest silnie absorbowana przez wodę w naskórku. Dociera jedynie około 0,1 mm — dokładnie do warstwy, w której gromadzi się nadmiar melaniny. Działa wyłącznie na pigment, nie na SMAS, nie liftinguje i nie wpływa na głębsze struktury skóry."
        />
        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr,1fr] lg:items-center">
          <img
            src={mechanizmAsset.url}
            alt="Schemat działania lasera tulowego 1927 nm w skórze — kontrolowana koagulacja w warstwie pigmentowej, kolumna MTZ i efekt halo"
            loading="lazy"
            width={1600}
            height={1024}
            className="rounded-xl border border-border/60 shadow-sm"
          />
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <div className="flex items-center gap-3">
              <Sun className="h-5 w-5 text-champagne" />
              <h3 className="font-serif text-xl text-ink">1927 nm — wiązka tulowa</h3>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">Głębokość: około 0,1 mm</div>
            <p className="mt-3 text-sm text-ink/80">
              Wysoka absorpcja w wodzie zatrzymuje energię tuż przy granicy naskórka i skóry
              właściwej — dokładnie tam, gdzie znajduje się uszkodzona błona podstawna
              odpowiedzialna za melasmę i większość zmian barwnikowych.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                "melasma i ostuda",
                "przebarwienia posłoneczne i plamy starcze",
                "nierówny koloryt",
                "piegi i plamy pigmentacyjne",
                "skóra po zabiegach z toksyną botulinową",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-ink/80">
                  <Check className="mt-0.5 h-4 w-4 text-champagne" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FRAKCJA — MTZ */}
      <section className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto grid gap-10 px-4 py-20 lg:grid-cols-[1fr,1fr] lg:items-center">
          <div className="flex flex-col gap-4">
            <SectionHeading
              eyebrow="Frakcyjna fototermoliza"
              title="Tysiące mikropunktów leczących pigment. Nienaruszone wyspy zdrowej skóry."
            />
            <p className="text-muted-foreground">
              W przeciwieństwie do klasycznego resurfacingu, który usuwa cały naskórek,
              technologia frakcyjna dzieli wiązkę na tysiące mikroskopowych kolumn termicznych
              (MTZ — Microscopic Treatment Zones). Pomiędzy nimi pozostają wyspy całkowicie
              zdrowej tkanki — to one przyspieszają regenerację i ograniczają ryzyko
              przebarwień pozapalnych.
            </p>
            <p className="text-muted-foreground">
              Efekt: skuteczna depigmentacja przy krótkiej rekonwalescencji, niemal zerowym
              ryzyku bliznowacenia i możliwości wykonania zabiegu u osób aktywnych zawodowo.
            </p>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {[
                { Icon: Sun, t: "MEND — mikrowydzielanie", d: "naturalna eliminacja melaniny" },
                { Icon: Sparkles, t: "Wymiana naskórka", d: "szybkie złuszczenie warstwy rogowej" },
                { Icon: ShieldCheck, t: "Bez bliznowacenia", d: "wyspy zdrowej tkanki chronią przed PIH" },
                { Icon: HeartPulse, t: "Bezpieczny po toksynie", d: "nie zakłóca efektu neuromodulatora" },
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
            alt="Schemat frakcyjnej fototermolizy lasera tulowego — kolumny MTZ, nienaruszone wyspy skóry i strefa koagulacji halo"
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
            { t: "Plamy starcze i piegi", d: "Redukcja ogniskowej hiperpigmentacji — skóra staje się bardziej jednolita i rozjaśniona." },
            { t: "Nierówny koloryt", d: "Wyrównanie odcienia cery, redukcja szarej, zmęczonej poświaty bez głębszej ingerencji w skórę." },
            { t: "Skóra po toksynie botulinowej", d: "Częsty wybór pacjentek, które chcą zabieg laserowy bez ryzyka uszkodzenia efektu neuromodulatora." },
            { t: "Ciemne fototypy (IV–VI)", d: "Najbezpieczniejsza długość fali dla osób o ciemnej karnacji — minimalne ryzyko hiperpigmentacji pozapalnej." },
            { t: "Szyja i dekolt", d: "Cienka skóra w tych okolicach reaguje dobrze na delikatną, kontrolowaną depigmentację bez ryzyka oparzeń." },
            { t: "Dłonie", d: "Pierwsze oznaki fotoagingu w postaci plam pigmentacyjnych — skuteczne rozjaśnienie i odświeżenie." },
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
              { step: "1", t: "Konsultacja", d: "Wywiad, analiza fototypu, zdjęcia w świetle widzialnym i UV, dobór energii i parametrów pod pigment." },
              { step: "2", t: "Przygotowanie", d: "Demakijaż, znieczulenie miejscowe (krem EMLA, ok. 30 min). Schłodzenie skóry." },
              { step: "3", t: "Zabieg", d: "30–45 min. Skanowanie skóry głowicą — pacjentka odczuwa ciepło i mrowienie, intensywność dobrana indywidualnie." },
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
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            eyebrow="Rekonwalescencja"
            title="Co się dzieje po zabiegu — dzień po dniu"
          />
          <ul className="mt-10 space-y-4">
            {[
              { d: "Dzień 0", t: "Rumień, uczucie ciepła, lekki obrzęk. Skóra wygląda jakby po intensywnym treningu." },
              { d: "Dni 1–2", t: "Obrzęk maksymalny — szczególnie wokół oczu (do 24–48 h). Skóra staje się szorstka jak papier ścierny." },
              { d: "Dni 3–5", t: "Pojawiają się mikrobrązowe punkty (efekt MEND) — to wydalana melanina. Obrzęk znika, skóra zaczyna się delikatnie złuszczać." },
              { d: "Dni 5–7", t: "Mikropunkty samoistnie odpadają. Pod nimi — nowy, jednolity, rozjaśniony naskórek. Można wracać do makijażu." },
              { d: "Tydzień 2–4", t: "Stopniowe wyrównanie kolorytu i redukcja przebarwień. Pełny efekt depigmentacji rozwija się po serii zabiegów." },
            ].map((row) => (
              <li key={row.d} className="grid grid-cols-[100px,1fr] gap-4 border-l-2 border-champagne pl-4">
                <div className="font-serif text-sm uppercase tracking-wider text-champagne">{row.d}</div>
                <div className="text-sm text-ink/80">{row.t}</div>
              </li>
            ))}
          </ul>
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
                  "izotretynoina (leki przeciwtrądzikowe) — minimum 6 miesięcy po zakończeniu",
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

      {/* BEFORE / AFTER */}
      <section className="border-t border-border/40 bg-secondary/40">
        <div className="container mx-auto px-4 py-20">
          <SectionHeading
            eyebrow="Efekty"
            title="Przed i po — galeria pacjentek"
            description="Realne rezultaty po serii zabiegów laserem tulowym 1927 nm. Zdjęcia publikujemy za zgodą pacjentek."
          />
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {BEFORE_AFTER.map((item) => (
              <figure key={item.title} className="overflow-hidden rounded-lg border border-border bg-card">
                <div className="grid grid-cols-2">
                  <div className="relative">
                    <img src={item.before} alt={`${item.title} — przed zabiegiem`} loading="lazy" className="aspect-[3/4] w-full object-cover" />
                    <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white">Przed</span>
                  </div>
                  <div className="relative">
                    <img src={item.after} alt={`${item.title} — po zabiegu`} loading="lazy" className="aspect-[3/4] w-full object-cover" />
                    <span className="absolute left-3 top-3 rounded-full bg-champagne px-3 py-1 text-xs uppercase tracking-[0.2em] text-ink">Po</span>
                  </div>
                </div>
                <figcaption className="border-t border-border p-5">
                  <div className="font-serif text-lg text-ink">{item.title}</div>
                  <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Efekty zabiegu mogą się różnić w zależności od kondycji skóry, wieku, stylu życia i liczby sesji.
          </p>
        </div>
      </section>

      {/* FAQ */}

      <section className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 py-20">
          <SectionHeading eyebrow="FAQ" title="Najczęstsze pytania" />
          <div className="mx-auto mt-10 max-w-3xl divide-y divide-border/60 rounded-xl border border-border/60 bg-card">
            {[
              { q: "Czym różni się laser tulowy 1927 nm od lasera CO₂?", a: "Laser tulowy 1927 nm jest nieablacyjny — nie narusza warstwy rogowej naskórka. Działa bardzo powierzchownie, około 0,1 mm wgłąb, idealnie celując w warstwę, w której powstają przebarwienia. CO₂ jest ablacyjny, działa głębiej i wiąże się z 7–14-dniową rekonwalescencją oraz większym ryzykiem powikłań pigmentacyjnych." },
              { q: "Czy laser tulowy liftinguje lub odmładza skórę?", a: "Nie. Laser 1927 nm działa wyłącznie na powierzchniowej warstwie skóry i nie dociera do struktur odpowiedzialnych za lifting czy przebudowę kolagenu. Do modelowania konturu i ujędrnienia wybieramy HIFU lub RF mikroigłową." },
              { q: "Czy zabieg jest bezpieczny dla osób z melasmą?", a: "Tak — laser tulowy 1927 nm jest obecnie najbezpieczniejszą opcją laserową dla melasmy. Działa dokładnie w okolicy uszkodzonej błony podstawnej, nie pobudzając tyrozynazy w głębszych warstwach." },
              { q: "Ile sesji potrzeba?", a: "Dla melasmy i opornych przebarwień: seria 3–4 sesji co 4–6 tygodni + sesja podtrzymująca co 6 miesięcy." },
              { q: "Czy mogę wykonać zabieg po toksynie botulinowej?", a: "Tak. Jest to jedna z najczęstszych sytuacji, w których pacjentki wybierają laser tulowy — jego głębokość działania nie wpływa na efekt neuromodulatora wprowadzonego w głębsze warstwy." },
              { q: "Czy mogę wykonać zabieg latem?", a: "Optymalny sezon to jesień–wiosna. Latem — pod warunkiem bezwzględnej fotoprotekcji SPF 50+ i unikania bezpośredniego słońca przez minimum 4 tygodnie po zabiegu." },
              { q: "Czy nadaje się dla ciemnych fototypów?", a: "Tak. 1927 nm ma najwyższą absorpcję w wodzie i najniższą w melaninie — jest najbezpieczniejszą długością fali dla fototypów IV–VI." },
              { q: "Jak szybko widać efekt?", a: "Pierwsza poprawa kolorytu — w 7. dniu po pierwszej sesji. Pełny efekt depigmentacji rozwija się po serii zabiegów." },
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
              BM Clinics Siedlce · 10 lat doświadczenia w klinikach premium Warszawy ·
              ten sam sprzęt, ten sam standard, lokalnie.
            </p>
          </div>
          <BookingForm />
        </div>
      </section>
    </article>
  );
}
