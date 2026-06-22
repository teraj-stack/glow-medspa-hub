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
  Sun,
  Target,
  Calendar,
  HeartPulse,
  Activity,
  Droplet,
  Zap,
} from "lucide-react";
import heroAsset from "@/assets/led-hero.jpg.asset.json";

const TECH_SLUG = "terapia-led";
const PAGE_URL = "https://bmclinics.ai/technologie/terapia-led";

export const Route = createFileRoute("/technologie/terapia-led")({
  loader: (): { tech: Technology } => {
    const tech = getTechnology(TECH_SLUG);
    if (!tech) throw new Error("Terapia LED — brak wpisu w bazie");
    return { tech };
  },
  head: () => {
    const title =
      "Terapia LED (fotobiomodulacja PBM) — wielodiodowa lampa wysokiej mocy 445/595/660/870 nm | Beauty & Mind Clinic Siedlce";
    const description =
      "Fotobiomodulacja (PBM / LED Therapy) — nieinwazyjna terapia światłem widzialnym i bliską podczerwienią. Przyspiesza gojenie, stymuluje kolagen, wycisza rumień, niszczy bakterie trądziku i grzyby Malassezia. Idealna jako finisz po laserze.";

    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "MedicalTherapy",
      name: "Terapia LED — fotobiomodulacja (PBM) wielodiodową lampą wysokiej mocy",
      description,
      url: PAGE_URL,
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
        "trądzik aktywny",
        "rumień i rosacea",
        "melasma",
        "fotostarzenie",
        "blizny potrądzikowe",
        "regeneracja po laserze",
      ],
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Czym jest terapia LED i czym różni się od lasera?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Terapia LED (fotobiomodulacja, PBM) wykorzystuje niskoenergetyczne, niekoherentne światło o określonych długościach fali. W odróżnieniu od lasera nie niszczy tkanki — wzbudza komórki do produkcji ATP, stymuluje fibroblasty i moduluje stan zapalny. Zero rekonwalescencji, zero bólu.",
          },
        },
        {
          "@type": "Question",
          name: "Dlaczego stosujemy lampę wysokiej mocy, a nie klasyczny panel?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Niska moc oznacza, że fotony nie docierają do skóry właściwej — gubią się już w naskórku. Matryca wielodiodowa wysokiej gęstości mocy (rzędu setek watów) dostarcza dawkę klinicznie skuteczną do warstwy siateczkowatej i powięzi, skraca czas sesji i przekracza próg aktywacji neokolagenezy.",
          },
        },
        {
          "@type": "Question",
          name: "Czy terapia LED boli? Czy trzeba się przygotować?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Nie. Pacjentka leży w okularach ochronnych pod panelem emisyjnym, odczuwając jedynie ciepło. Nie wymaga znieczulenia, demakijaż wystarczy. Po zabiegu można wrócić do pracy, makijażu i aktywności bez ograniczeń.",
          },
        },
        {
          "@type": "Question",
          name: "Ile sesji potrzeba, żeby zobaczyć efekt?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Trądzik aktywny: 6–10 sesji, 2 razy w tygodniu. Anti-aging i rewitalizacja: 8–12 sesji co 7–10 dni, następnie podtrzymanie raz w miesiącu. Po laserze lub iniekcjach: 1 sesja bezpośrednio po zabiegu plus 1–2 sesje w kolejnym tygodniu.",
          },
        },
        {
          "@type": "Question",
          name: "Czy terapię LED można łączyć z innymi zabiegami?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Tak — to jej najsilniejsza rola. LED zamyka większość protokołów premium: po laserze pikosekundowym, frakcyjnym tulowo-erbowym, zimnej plazmie, mezoterapii, mikronakłuwaniu. Skraca rumień, eliminuje obrzęk, przyspiesza gojenie o 50–60% i pogłębia ostateczny efekt.",
          },
        },
        {
          "@type": "Question",
          name: "Kto nie może skorzystać z terapii LED?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Bezwzględnie: aktywna choroba nowotworowa skóry, porfirie, toczeń rumieniowaty, padaczka światłoczuła, immunoterapia onkologiczna w ostatnich 5 latach. Względnie: silne leki światłouczulające — wymagają indywidualnej oceny.",
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
        { "@type": "ListItem", position: 3, name: "Terapia LED (fotobiomodulacja PBM)", item: PAGE_URL },
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
      links: [{ rel: "canonical", href: PAGE_URL }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(serviceSchema) },
        { type: "application/ld+json", children: JSON.stringify(faqSchema) },
        { type: "application/ld+json", children: JSON.stringify(breadcrumbSchema) },
      ],
    };
  },
  component: TerapiaLedPage,
});

type WaveRow = {
  hex: string;
  name: string;
  nm: string;
  depth: string;
  depthPct: number;
  role: string;
};

const WAVELENGTHS: WaveRow[] = [
  { hex: "#7a4bd8", name: "Fiolet", nm: "400–420 nm", depth: "0,1 mm", depthPct: 6, role: "Antybakteryjne, drenaż toksyn, łagodzenie." },
  { hex: "#2f6bff", name: "Niebieskie", nm: "430–450 nm", depth: "0,3 mm", depthPct: 12, role: "Trądzik (P. acnes), fotodynamiczna eliminacja Malassezia (445 nm), sebostaza." },
  { hex: "#22c1c3", name: "Cyjan", nm: "500–520 nm", depth: "0,5 mm", depthPct: 18, role: "Uspokaja po peelingach i iniekcjach, obkurcza naczynia." },
  { hex: "#f5c400", name: "Żółte", nm: "570–600 nm", depth: "1,0 mm", depthPct: 30, role: "Wygasza rumień i rosaceę. Kluczowa fala 595 nm: tłumi IL-6 i TNF-α." },
  { hex: "#ff8a3c", name: "Pomarańczowe", nm: "590–630 nm", depth: "1,5 mm", depthPct: 42, role: "Glow, rewitalizacja cer zmęczonych i palaczy." },
  { hex: "#ff3b5c", name: "Czerwone", nm: "630–700 nm", depth: "3,0 mm", depthPct: 72, role: "Królowa PBM. Fala 660 nm: synteza ATP, fibroblasty, drenaż limfy." },
  { hex: "#9a1f2e", name: "Bliska podczerwień (NIR)", nm: "830–870 nm", depth: "5,0 mm", depthPct: 100, role: "Powięź, tkanka tłuszczowa. Neokolageneza, aktywacja komórek macierzystych ADSC." },
];

function TerapiaLedPage() {
  const { tech } = Route.useLoaderData() as { tech: Technology };

  return (
    <article className="bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroAsset.url}
            alt="Pacjentka podczas sesji terapii LED — wielodiodowa lampa wysokiej mocy"
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
              Fotobiomodulacja (PBM) · 445 / 595 / 660 / 870 nm
            </div>
            <h1 className="gold-line max-w-3xl font-serif text-4xl text-ink md:text-5xl lg:text-6xl">
              Terapia LED, której pacjenci jeszcze nie znają — a która zmienia każdy protokół
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Wielodiodowa matryca LED wysokiej mocy emituje światło widzialne i bliską podczerwień.
              Nieinwazyjnie pobudza komórki do regeneracji, wycisza stan zapalny, niszczy bakterie
              trądziku i odbudowuje kolagen — bez bólu, bez igły, bez rekonwalescencji.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/konsultacja"
                className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                Umów konsultację
              </Link>
              <a
                href="#fale"
                className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-muted"
              >
                Co robi każda barwa
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK FACTS */}
      <section className="border-b border-border/40 bg-muted/30">
        <div className="container mx-auto grid gap-6 px-4 py-12 md:grid-cols-4">
          {[
            { Icon: Target, label: "Spektrum", value: "400–870 nm" },
            { Icon: Clock, label: "Czas sesji", value: "15–30 min" },
            { Icon: Calendar, label: "Rekonwalescencja", value: "0 dni" },
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

      {/* CZYM JEST PBM */}
      <section className="container mx-auto px-4 py-20">
        <SectionHeading
          eyebrow="Co to właściwie jest"
          title="Fotobiomodulacja — światło, które rozmawia z komórką"
          description="To nie jest lampa kosmetyczna i nie jest to laser. Pacjenci często nie znają tej technologii, dlatego wyjaśniamy ją w trzech zdaniach."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {[
            {
              Icon: Sun,
              t: "Światło, nie ciepło",
              d: "Niejonizujące fotony o określonej długości fali wnikają w skórę bez nagrzewania jej. Pacjentka czuje tylko delikatne ciepło — żadnego bólu, żadnych nacięć, żadnej ablacji.",
            },
            {
              Icon: Zap,
              t: "Wzbudza produkcję ATP",
              d: "Fotony 660 i 870 nm aktywują oksydazę cytochromu c w mitochondriach oraz strukturyzują wodę okołobłonową. Komórka dostaje zastrzyk energii — startuje cykl naprawczy.",
            },
            {
              Icon: HeartPulse,
              t: "Uruchamia regenerację",
              d: "Fibroblasty produkują nowy kolagen i elastynę. Uśpione komórki macierzyste (STEM, ADSC) ruszają w górę warstw skóry. Stan zapalny gaśnie, rumień znika.",
            },
          ].map(({ Icon, t, d }) => (
            <div key={t} className="rounded-xl border border-border/60 bg-card p-6">
              <Icon className="h-5 w-5 text-champagne" />
              <h3 className="mt-3 font-serif text-xl text-ink">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DLACZEGO WYSOKA MOC */}
      <section className="border-y border-border/40 bg-muted/30">
        <div className="container mx-auto grid gap-10 px-4 py-20 lg:grid-cols-[1fr,1fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Dlaczego matryca wysokiej mocy"
              title="Niska moc = fotony giną w naskórku"
            />
            <p className="mt-4 text-muted-foreground">
              Klasyczne panele LED z gabinetów kosmetycznych operują na mocy kilkunastu watów.
              Tymczasem przez gęstą sieć włókien kolagenowych światło rozprasza się tak silnie,
              że już na głębokości dziesiątych części milimetra dawka spada poniżej progu klinicznej
              aktywacji (krzywa Arndt-Schulza).
            </p>
            <p className="mt-3 text-muted-foreground">
              Wielodiodowa matryca wysokiej gęstości mocy pokonuje straty rozpraszania Mie i absorpcji
              przez melaninę, dostarczając do warstwy siateczkowatej skóry właściwej — a falą 870 nm
              nawet do powięzi — dawkę, która realnie pracuje.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                { t: "Krótsza sesja", d: "15–30 min zamiast godziny pod słabym panelem" },
                { t: "Głębsza penetracja", d: "do 5 mm w paśmie NIR" },
                { t: "Próg neokolagenezy", d: "przekroczony, nie tylko kosmetyczny efekt" },
                { t: "Brak przegrzania", d: "kontrolowane chłodzenie, zero koagulacji" },
              ].map((row) => (
                <div key={row.t} className="rounded-lg border border-border/60 bg-card p-4">
                  <div className="font-serif text-ink">{row.t}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{row.d}</div>
                </div>
              ))}
            </div>
          </div>

          {/* PENETRATION CHART */}
          <div id="penetracja" className="rounded-xl border border-border/60 bg-card p-6">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-champagne" />
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Głębokość penetracji w skórze
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {WAVELENGTHS.map((w) => (
                <div key={w.nm}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-serif text-ink">
                      {w.nm} <span className="text-muted-foreground">· {w.name}</span>
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">{w.depth}</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${w.depthPct}%`, backgroundColor: w.hex }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              Skala referencyjna na podstawie danych NCBI PMC dla typowej skóry kaukaskiej.
              Realna penetracja zależy od fototypu, nawodnienia i pigmentacji.
            </p>
          </div>
        </div>
      </section>

      {/* SPEKTRUM */}
      <section id="fale" className="container mx-auto px-4 py-20">
        <SectionHeading
          eyebrow="Spektrum barw"
          title="Każda długość fali robi coś innego"
          description={'W gabinecie nigdy nie używamy „jednego światła”. Protokół zawsze łączy 2–3 długości fali dobrane do problemu i fototypu pacjentki.'}
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {WAVELENGTHS.map((w) => (
            <div key={w.nm} className="flex gap-4 rounded-xl border border-border/60 bg-card p-5">
              <div
                className="mt-1 h-10 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: w.hex }}
                aria-hidden
              />
              <div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-serif text-lg text-ink">{w.name}</h3>
                  <span className="font-mono text-xs uppercase tracking-wider text-champagne">
                    {w.nm}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{w.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TRIADA */}
      <section className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 py-20">
          <SectionHeading
            eyebrow="Złoty standard regeneracji"
            title="Triada 595 + 660 + 870 nm"
            description="Najsilniejszy autorski tryb terapii — trzy długości fali pracujące jednocześnie na trzech poziomach skóry."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                color: "#f5c400",
                t: "595 nm — wygaszenie",
                d: "Obkurcza mikronaczynia, tłumi cytokiny IL-1 i TNF-α. Likwiduje rumień zapalny i przygotowuje środowisko komórkowe do regeneracji.",
              },
              {
                color: "#ff3b5c",
                t: "660 nm — energia",
                d: "Działa na fibroblasty macierzyste i indukuje pozamitochondrialną syntezę ATP. To paliwo dla całej naprawy.",
              },
              {
                color: "#9a1f2e",
                t: "870 nm — przebudowa",
                d: "Dociera do powięzi (4–5 mm). Aktywuje komórki macierzyste ADSC, wymusza neokolagenezę i remodeling rusztowania skóry.",
              },
            ].map((row) => (
              <div key={row.t} className="rounded-xl border border-border/60 bg-card p-6">
                <div
                  className="h-1.5 w-12 rounded-full"
                  style={{ backgroundColor: row.color }}
                  aria-hidden
                />
                <h3 className="mt-3 font-serif text-xl text-ink">{row.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{row.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WSKAZANIA */}
      <section className="container mx-auto px-4 py-20">
        <SectionHeading
          eyebrow="Dla kogo"
          title="Wskazania"
          description="Terapia LED to jedno z niewielu narzędzi, które naprawdę pasuje każdemu — od nastolatki z trądzikiem po pacjentkę po laserze CO₂."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { t: "Trądzik aktywny", d: "Fala 445 nm fotodynamicznie niszczy P. acnes i Malassezia. Bez antybiotyków, bez oporności." },
            { t: "Rumień i rosacea", d: "595 nm obkurcza naczynia i wycisza mediatory zapalne — kluczowa fala dla skóry naczyniowej." },
            { t: "Melasma i PIH", d: "Odłącza szlak sygnałowy „keratynocyt → melanocyt”. Skóra przestaje produkować nadmiar barwnika." },
            { t: "Anti-aging", d: "660 + 870 nm produkują kolagen I, sieciują elastynę. Wypełnienie tkanek widoczne po kilkunastu dniach." },
            { t: "Blizny potrądzikowe", d: "Stymuluje fibroblasty STEM — przebudowa atrofii bez termicznego urazu." },
            { t: "Finisz po laserze i iniekcjach", d: "Skraca rumień i obrzęk, przyspiesza reepitelizację o 50–60%. Standard po pikosekundzie, tulu i CO₂." },
            { t: "Wsparcie gojenia", d: "Po zabiegach chirurgicznych, mezoterapii, mikronakłuwaniu — czysty proces gojenia bez bliznowacenia." },
            { t: "Łysienie androgenowe", d: "660 nm w paśmie czerwonym pobudza mieszki włosowe w fazie spoczynku do anagenu." },
            { t: "Ciemne fototypy", d: "Brak ryzyka oparzenia i PIH — pasmo widzialne pomija ścieżki termolizy melaniny." },
          ].map(({ t, d }) => (
            <div key={t} className="rounded-xl border border-border/60 bg-card p-6">
              <h3 className="font-serif text-lg text-ink">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRZEBIEG */}
      <section className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 py-20">
          <SectionHeading eyebrow="Przebieg sesji" title="Krok po kroku" />
          <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { step: "1", t: "Demakijaż", d: "Dokładne oczyszczenie skóry — kosmetyki blokują absorpcję fotonów." },
              { step: "2", t: "Pozycjonowanie", d: "Pacjentka leży w okularach ochronnych. Panel ustawiamy 5–15 cm od twarzy." },
              { step: "3", t: "Naświetlanie", d: "15–30 min w wybranym programie. Pacjentka czuje wyłącznie ciepło — wielu pacjentów zasypia." },
              { step: "4", t: "Po sesji", d: "Można nakładać makijaż i wracać do aktywności. Brak rumienia, brak złuszczania." },
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

      {/* PROTOKOŁY / DAWKOWANIE */}
      <section className="container mx-auto px-4 py-20">
        <SectionHeading
          eyebrow="Dawkowanie i protokoły"
          title="Czas naświetlania to filar fotobiomodulacji"
          description="Krzywa Arndt-Schulza: za mała dawka nie zadziała, za duża wyhamuje regenerację. Dlatego każdy program ma ściśle wyliczone okno."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { t: "Niszczenie Malassezia / trądzik (445 nm)", d: "3–5 min na pole", note: "Wysoce biobójcze, energia precyzyjnie dawkowana." },
            { t: "Redukcja rumienia i rosacea (595 nm)", d: "8–12 min na sektor", note: "Powolny wzrost obciążenia, omija przegrzanie." },
            { t: "Neokolageneza (660 + 870 nm)", d: "15–20 min", note: "Pełne nasycenie fotonowe głębokich warstw." },
          ].map((row) => (
            <div key={row.t} className="rounded-xl border border-border/60 bg-card p-6">
              <h3 className="font-serif text-lg text-ink">{row.t}</h3>
              <div className="mt-2 font-mono text-2xl text-champagne">{row.d}</div>
              <p className="mt-2 text-sm text-muted-foreground">{row.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRZECIWWSKAZANIA */}
      <section className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <SectionHeading
            eyebrow="Bezpieczeństwo"
            title="Przeciwwskazania"
            description="Terapia LED należy do najbezpieczniejszych technologii w medycynie estetycznej — nie używa promieniowania jonizującego ani UV. Lista wykluczeń jest krótka."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <h3 className="font-serif text-lg text-ink">Bezwzględne</h3>
              <ul className="mt-3 space-y-2 text-sm text-ink/80">
                {[
                  "aktywna choroba nowotworowa skóry (czerniak, BCC) bez resekcji",
                  "czynna immunoterapia onkologiczna (ostatnie 5 lat)",
                  "porfirie",
                  "toczeń rumieniowaty układowy (LE)",
                  "padaczka światłoczuła (tryby pulsacyjne)",
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
                  "silne fotouczulacze i chemioterapeutyki ogólnoustrojowe",
                  "wybrane tetracykliny (modyfikacja dawki)",
                  "aktywne zakażenia z gorączką",
                  "ciężka immunosupresja",
                  "ciąża (LED stosujemy tylko po konsultacji ginekologicznej)",
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
              { q: "Czym jest terapia LED i czym różni się od lasera?", a: "Fotobiomodulacja (PBM) używa niskoenergetycznego, niekoherentnego światła. Nie niszczy tkanki — wzbudza komórki do produkcji ATP, stymuluje fibroblasty i moduluje stan zapalny. Zero rekonwalescencji." },
              { q: "Dlaczego stosujemy lampę wysokiej mocy?", a: "Niska moc — fotony nie docierają do skóry właściwej. Matryca wielodiodowa wysokiej gęstości mocy dostarcza dawkę klinicznie skuteczną do warstwy siateczkowatej, a falą 870 nm aż do powięzi." },
              { q: "Czy terapia boli? Czy potrzebne znieczulenie?", a: "Nie. Pacjentka czuje wyłącznie ciepło. Wielu pacjentów zasypia w trakcie sesji." },
              { q: "Ile sesji potrzeba?", a: "Trądzik: 6–10 sesji 2× w tygodniu. Anti-aging: 8–12 sesji co 7–10 dni + podtrzymanie 1×/miesiąc. Po laserze: 1 sesja od razu + 1–2 w kolejnym tygodniu." },
              { q: "Czy można łączyć z innymi zabiegami?", a: "Tak — to najsilniejsza rola LED. Zamyka większość naszych protokołów: po pikosekundzie, tulu, zimnej plazmie, mezoterapii. Skraca rumień, eliminuje obrzęk, pogłębia efekt." },
              { q: "Czy potrzebna fotoprotekcja po sesji?", a: "Standardowy SPF 30–50 jak na co dzień. Sama terapia LED nie powoduje fotouczulenia. Skóra nie ulega złuszczeniu." },
              { q: "Czy LED zastąpi laser?", a: "Nie zastąpi — uzupełni. Laser działa przez kontrolowane uszkodzenie, LED przez biostymulację. Połączenie dwóch mechanizmów daje efekty niemożliwe do osiągnięcia osobno." },
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
            to="/technologie/laser-tulowy"
            className="group rounded-xl border border-border/60 bg-card p-6 transition-colors hover:bg-muted/40"
          >
            <div className="text-xs uppercase tracking-wider text-champagne">Technologia</div>
            <div className="mt-2 font-serif text-lg text-ink group-hover:text-champagne">
              Laser tulowo-erbowy 1927 / 1550 nm
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Po zabiegu kończymy sesją LED — to standard skracający rekonwalescencję o połowę.
            </p>
          </Link>
          <Link
            to="/technologie/fusion-plasma"
            className="group rounded-xl border border-border/60 bg-card p-6 transition-colors hover:bg-muted/40"
          >
            <div className="text-xs uppercase tracking-wider text-champagne">Technologia</div>
            <div className="mt-2 font-serif text-lg text-ink group-hover:text-champagne">
              Zimna plazma atmosferyczna
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Plazma → laser pikosekundowy → LED. Pełen protokół regeneracyjny w jednej wizycie.
            </p>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section id="konsultacja" className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto grid gap-10 px-4 py-20 lg:grid-cols-[1fr,1fr] lg:items-start">
          <div className="flex flex-col gap-6">
            <SectionHeading
              eyebrow="Konsultacja"
              title="Zaplanuj sesję LED w Siedlcach"
              description="Wypełnij formularz — oddzwaniamy w ciągu 24 godzin, by ustalić termin i dobrać protokół do Twojej skóry."
            />
            <p className="text-sm text-muted-foreground">
              <Droplet className="mr-1 inline h-4 w-4 text-champagne" />
              Beauty &amp; Mind Clinic Siedlce · 10 lat doświadczenia w klinikach premium Warszawy ·
              ten sam sprzęt, ten sam standard, lokalnie.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-4 w-4 text-champagne" />
              Sesja LED dokupiona do innego zabiegu — promocyjnie 100 zł.
            </div>
          </div>
          <BookingForm />
        </div>
      </section>
    </article>
  );
}
