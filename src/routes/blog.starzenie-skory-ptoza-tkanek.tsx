import { RelatedPosts } from "@/components/site/RelatedPosts";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ArrowLeft, Layers, Clock, Sparkles, ShieldCheck, AlertCircle } from "lucide-react";
import konturAsset from "@/assets/mapowanie-procesu-starzenia.jpeg.asset.json";
import wiotkaAsset from "@/assets/plasma-skora-wiotka.jpg.asset.json";
import zdrowaAsset from "@/assets/plasma-skora-zdrowa.png.asset.json";
import zaawAsset from "@/assets/plasma-zaawansowana.png.asset.json";

const FAQ = [
  {
    q: "W jakim wieku zaczyna się starzenie skóry?",
    a: "Procesy biologiczne ruszają już po 25. roku życia — fibroblasty stopniowo zwalniają produkcję kolagenu (ok. 1% rocznie). Pierwsze widoczne zmiany (drobne linie mimiczne, utrata blasku) pojawiają się zazwyczaj między 28. a 35. rokiem życia. Ptoza tkanek, czyli ich opadanie pod wpływem grawitacji, staje się widoczna po 40.–45. roku życia, a dynamicznie przyspiesza w okresie peri- i pomenopauzalnym, gdy spada poziom estrogenów.",
  },
  {
    q: "Co to jest ptoza tkanek?",
    a: "Ptoza to anatomiczne opadanie tkanek miękkich twarzy: skóry, tkanki tłuszczowej, mięśni i powięzi SMAS. Powstaje w wyniku trzech równoległych procesów — utraty objętości w głębokich kompartmentach tłuszczowych, rozluźnienia więzadeł zatrzymujących (retaining ligaments) oraz resorpcji kostnej szkieletu twarzy. Efekt: opadające policzki, pogłębione bruzdy nosowo-wargowe, „chomiki”, podwójny podbródek i utrata wyraźnego owalu.",
  },
  {
    q: "Czy ptozie można zapobiec?",
    a: "Nie można jej całkowicie zatrzymać — to proces fizjologiczny. Można jednak istotnie spowolnić jej tempo i odsunąć moment, w którym staje się widoczna: konsekwentna fotoprotekcja (SPF 50+), niepalenie, sen, dieta o niskim ładunku glikemicznym, retinoidy, antyoksydanty, a w gabinecie — wczesne zabiegi stymulujące fibroblasty (radiofrekwencja, mikronakłuwanie z RF, stymulatory tkankowe) i precyzyjna wolumetria w głębokich kompartmentach.",
  },
  {
    q: "Czym różni się starzenie wewnątrzpochodne od zewnątrzpochodnego?",
    a: "Wewnątrzpochodne (chronologiczne) zależy od genów, hormonów i czasu — odpowiada za cieńszą skórę, drobne linie i utratę elastyczności. Zewnątrzpochodne (photoaging i exposome) wynika z promieniowania UV, zanieczyszczeń, palenia i diety — odpowiada za 80–90% widocznych oznak starzenia: głębokie zmarszczki, przebarwienia, teleangiektazje, „skóra rolnika”. Większość tego, co widzimy w lustrze, jest pochodzenia zewnątrzpochodnego — czyli teoretycznie do uniknięcia.",
  },
  {
    q: "Czy lifting bez skalpela faktycznie działa?",
    a: "Tak — pod warunkiem, że dobierzemy technologię do etapu i typu ptozy. Ultradźwięki skupione (HIFU) i radiofrekwencja mikroigłowa pracują w warstwie SMAS i głębokiej skórze właściwej, stymulując neokolagenezę i obkurczanie powięzi. Stymulatory tkankowe (kwas polimlekowy, hydroksyapatyt wapnia) odbudowują rusztowanie kolagenowe na 12–24 miesięcy. Wolumetria precyzyjnie uzupełnia ubytki w głębokich kompartmentach. Pełnoobjawowa ptoza IV stopnia pozostaje wskazaniem chirurgicznym.",
  },
  {
    q: "Od czego zacząć po 40. roku życia?",
    a: "Od konsultacji z mapą anatomiczną twarzy — ocena ptozy, jakości skóry, ubytków objętościowych i mimiki. Na tej podstawie planujemy sekwencję: najpierw fundament (stymulatory tkankowe lub HIFU), potem precyzyjna wolumetria w głębokich kompartmentach, na końcu polerka powierzchni (lasery frakcyjne, peeling chemiczny, toksyna botulinowa w mimice). Odwrotna kolejność daje efekt „przepełnionej” twarzy bez liftingu — to najczęstszy błąd.",
  },
  {
    q: "Czy te zabiegi można łączyć w jednej sesji?",
    a: "Niektóre — tak, inne wymagają odstępu. HIFU + toksyna botulinowa: bezpieczne razem. HIFU + wypełniacze: minimum 2 tygodnie odstępu (energia ultradźwięków może migrowć żel). Lasery frakcyjne + stymulatory tkankowe: 4 tygodnie odstępu. Każdy plan jest indywidualny — sekwencjonowanie zabiegów wpływa na efekt końcowy bardziej niż wybór konkretnej technologii.",
  },
  {
    q: "Jak długo utrzymują się efekty?",
    a: "Zależy od technologii: toksyna botulinowa 4–6 miesięcy, wypełniacze kwasem hialuronowym 9–18 miesięcy (głębokie do 24), stymulatory tkankowe 18–24 miesiące, HIFU i radiofrekwencja 12–18 miesięcy z efektem narastającym do 3–6 miesiąca po zabiegu. Trwałość zwiększają sesje przypominające co 12 miesięcy oraz dobra pielęgnacja domowa (retinoid, antyoksydanty, SPF).",
  },
];

export const Route = createFileRoute("/blog/starzenie-skory-ptoza-tkanek")({
  head: () => ({
    meta: [
      { title: "Starzenie skóry i ptoza tkanek — kompletny przewodnik | BMC Siedlce" },
      {
        name: "description",
        content:
          "Jak starzeje się skóra, dlaczego dochodzi do ptozy tkanek twarzy i co realnie możemy z tym zrobić — anatomia, mechanizmy i nowoczesne metody bez skalpela.",
      },
      {
        name: "keywords",
        content:
          "starzenie skóry, ptoza tkanek, opadanie tkanek twarzy, lifting bez skalpela, utrata jędrności, kolagen, elastyna, SMAS, Siedlce",
      },
      { property: "og:title", content: "Starzenie skóry i ptoza tkanek — jak zatrzymać czas bez skalpela" },
      {
        property: "og:description",
        content:
          "Anatomia ptozy, mechanizmy starzenia i sekwencja zabiegów, która działa — przewodnik dla pacjentki, która chce świadomie zaplanować lata 35+.",
      },
      { property: "og:url", content: "https://bmclinics.ai/blog/starzenie-skory-ptoza-tkanek" },
      { property: "og:type", content: "article" },
      { property: "og:image", content: `https://bmclinics.ai${konturAsset.url}` },
      { property: "article:published_time", content: "2026-06-27T10:00:00+02:00" },
      { property: "article:modified_time", content: "2026-06-27T10:00:00+02:00" },
      { property: "article:author", content: "BMClinics.ai" },
      { property: "article:section", content: "Medycyna estetyczna" },
      { property: "article:tag", content: "starzenie skóry" },
      { property: "article:tag", content: "ptoza tkanek" },
      { property: "article:tag", content: "lifting bez skalpela" },
      { property: "og:locale", content: "pl_PL" },
    ],
    links: [{ rel: "canonical", href: "https://bmclinics.ai/blog/starzenie-skory-ptoza-tkanek" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Starzenie skóry i ptoza tkanek — jak zatrzymać czas bez skalpela",
          description:
            "Przewodnik po mechanizmach starzenia skóry, anatomii ptozy tkanek oraz nowoczesnych metodach jej leczenia bez skalpela.",
          author: { "@type": "Organization", name: "BMClinics.ai" },
          publisher: {
            "@type": "Organization",
            name: "BMClinics.ai",
            logo: { "@type": "ImageObject", url: "https://bmclinics.ai/favicon.ico" },
          },
          datePublished: "2026-06-27T10:00:00+02:00",
          dateModified: "2026-06-27T10:00:00+02:00",
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": "https://bmclinics.ai/blog/starzenie-skory-ptoza-tkanek",
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
            { "@type": "ListItem", position: 1, name: "Strona główna", item: "https://bmclinics.ai/" },
            { "@type": "ListItem", position: 2, name: "Blog", item: "https://bmclinics.ai/blog" },
            {
              "@type": "ListItem",
              position: 3,
              name: "Starzenie skóry i ptoza tkanek",
              item: "https://bmclinics.ai/blog/starzenie-skory-ptoza-tkanek",
            },
          ],
        }),
      },
    ],
  }),
  component: AgingPillarArticle,
});

function AgingPillarArticle() {
  return (
    <>
      <section className="bg-secondary/40 py-12 md:py-20">
        <div className="container-luxury">
          <Link
            to="/technologie"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Technologie
          </Link>
          <div className="mt-6 max-w-3xl">
            <div className="text-xs uppercase tracking-[0.3em] text-champagne">Przewodnik filarowy</div>
            <h1 className="mt-4 font-serif text-ink">
              Jak starzeje się skóra i dlaczego dochodzi do ptozy tkanek
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Twarz nie „opada” z dnia na dzień. To suma trzech procesów rozłożonych na 20–30 lat —
              jeśli rozumiemy ich kolejność, możemy skutecznie ją odwrócić, zanim wymaga skalpela.
              Poniżej kompletny przewodnik dla pacjentki, która chce świadomie zaplanować dekadę
              po 35.
            </p>
          </div>
        </div>
      </section>

      <div className="container-luxury grid gap-12 py-16 md:grid-cols-3 md:py-24">
        <article className="md:col-span-2 space-y-16">
          <section>
            <SectionHeading
              eyebrow="Dwa równoległe procesy"
              title="Starzenie wewnątrzpochodne i zewnątrzpochodne"
            />
            <p className="mt-4 text-base text-foreground/85 md:text-lg leading-relaxed">
              W medycynie estetycznej rozdzielamy dwa równoległe procesy. <strong>Wewnątrzpochodne</strong>{" "}
              (chronologiczne) jest zapisane w genach i hormonach — fibroblasty stopniowo zwalniają,
              spada poziom estrogenów, kości tracą masę. <strong>Zewnątrzpochodne</strong> (photoaging
              i tzw. exposome) wynika z UV, zanieczyszczeń, palenia i diety — i to ono odpowiada za
              80–90% tego, co widzimy w lustrze. Większość zmian, którym przypisujemy „wiek”, w istocie
              jest do uniknięcia.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <figure className="overflow-hidden rounded-lg border border-border bg-card">
                <img
                  src={zdrowaAsset.url}
                  alt="Schemat skóry młodej — gęste włókna kolagenu i elastyny"
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover"
                />
                <figcaption className="px-4 py-3 text-sm text-muted-foreground">
                  Skóra młoda: gęste, równolegle ułożone włókna kolagenu typu I/III i elastyny.
                </figcaption>
              </figure>
              <figure className="overflow-hidden rounded-lg border border-border bg-card">
                <img
                  src={wiotkaAsset.url}
                  alt="Schemat skóry dojrzałej — fragmentacja włókien i utrata gęstości"
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover"
                />
                <figcaption className="px-4 py-3 text-sm text-muted-foreground">
                  Skóra dojrzała: fragmentacja kolagenu, utrata elastyczności, pogrubiała warstwa rogowa.
                </figcaption>
              </figure>
            </div>
          </section>

          <section>
            <SectionHeading
              eyebrow="Mechanizm"
              title="Co dokładnie dzieje się w skórze z czasem"
            />
            <p className="mt-4 text-base text-foreground/85 md:text-lg leading-relaxed">
              Po 25. roku życia fibroblasty zwalniają produkcję kolagenu o około 1% rocznie. Włókna
              elastyny, które dają skórze sprężystość, ulegają fragmentacji pod wpływem
              metaloproteinaz (MMP-1) aktywowanych przez UV. Kwas hialuronowy w macierzy zewnątrz­komórkowej
              wiąże coraz mniej wody. Proces glikacji — łączenia cukrów z białkami — usztywnia
              włókna kolagenu (zjawisko AGEs, Advanced Glycation End-products), przez co skóra
              traci sprężystość i nabiera żółtawego odcienia.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="tile-card">
                <div className="tile-icon"><Layers className="size-5" /></div>
                <div className="tile-title text-base">Kolagen ↓ 1%/rok</div>
                <p className="tile-text">
                  Po 50. roku życia skóra ma o 25–30% mniej kolagenu niż w wieku 25 lat.
                </p>
              </div>
              <div className="tile-card">
                <div className="tile-icon"><Layers className="size-5" /></div>
                <div className="tile-title text-base">Elastyna — fragmentacja</div>
                <p className="tile-text">
                  Włókna pękają i zlepiają się w grudki (elastoza posłoneczna) — utrata sprężystości.
                </p>
              </div>
              <div className="tile-card">
                <div className="tile-icon"><Layers className="size-5" /></div>
                <div className="tile-title text-base">Glikacja (AGEs)</div>
                <p className="tile-text">
                  Cukier + białko = sztywne, żółknące włókna. Dieta o niskim IG istotnie spowalnia proces.
                </p>
              </div>
            </div>
          </section>

          <section>
            <SectionHeading
              eyebrow="Anatomia ptozy"
              title="Trzy piętra, które opadają — kość, tłuszcz, więzadła"
            />
            <p className="mt-4 text-base text-foreground/85 md:text-lg leading-relaxed">
              Ptoza tkanek twarzy nie jest „obwisaniem skóry”. To efekt trzech równoległych
              procesów w głębszych strukturach — i właśnie dlatego sam lifting skóry (chirurgiczny
              czy nici) nigdy nie daje długotrwałego efektu, jeśli pomija fundament.
            </p>
            <div className="mt-8 space-y-6">
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-serif text-xl text-ink">1. Resorpcja kostna szkieletu</h3>
                <p className="mt-3 text-base text-foreground/85 leading-relaxed">
                  Po 40. roku życia kości twarzy stopniowo tracą masę — szczególnie żuchwa, kość
                  jarzmowa i brzeg oczodołu. Szkielet, na którym opiera się reszta tkanek, kurczy się.
                  Efekt: zapadnięte skronie, opadające brwi, „pusty” obszar pod oczami, cofnięta
                  żuchwa, utrata kąta między szyją a podbródkiem.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-serif text-xl text-ink">2. Migracja kompartmentów tłuszczowych</h3>
                <p className="mt-3 text-base text-foreground/85 leading-relaxed">
                  Tkanka tłuszczowa twarzy nie jest jednolita — to system około 20 odrębnych
                  kompartmentów (głębokich i powierzchownych). Z wiekiem głębokie kompartmenty
                  (np. DMCF pod policzkiem) tracą objętość, a powierzchowne opadają. Powstają
                  bruzdy nosowo-wargowe, „chomiki” (jowls) i podwójny podbródek — nie z nadmiaru
                  tkanki, lecz z jej grawitacyjnego przesunięcia.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-serif text-xl text-ink">3. Rozluźnienie więzadeł zatrzymujących</h3>
                <p className="mt-3 text-base text-foreground/85 leading-relaxed">
                  System retaining ligaments (jarzmowe, żuchwowe, masseterowe) trzyma tkanki
                  miękkie w młodym położeniu. Z czasem włókna kolagenowe więzadeł słabną, a
                  granice między „przytrzymanymi” a opadającymi obszarami stają się widoczne jako
                  charakterystyczne załamania — bruzda łzowa, bruzda nosowo-wargowa, linia kąta
                  żuchwy.
                </p>
              </div>
            </div>
            <figure className="mt-8 overflow-hidden rounded-lg border border-border bg-card">
              <img
                src={konturAsset.url}
                alt="Mapowanie procesu starzenia się — wizualizacja opadania tkanek w trzech etapach: pełna harmonia (30 lat), początek opadania i zmiany wektorów, zaawansowane opadanie (70 lat)"
                loading="lazy"
                decoding="async"
                className="w-full object-cover"
              />
              <figcaption className="px-4 py-3 text-sm text-muted-foreground">
                Mapowanie procesu starzenia — trzy etapy opadania tkanek twarzy, ze wskazaniem kierunków wektorów ptozy i dezorganizacji struktury skóry.
              </figcaption>
            </figure>
          </section>

          <section>
            <SectionHeading
              eyebrow="Etapy"
              title="Cztery stopnie ptozy — co realnie widać"
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-card p-5">
                <div className="text-xs uppercase tracking-[0.3em] text-champagne">Stopień I · 30–40 lat</div>
                <h3 className="mt-2 font-serif text-lg text-ink">Wczesna utrata jędrności</h3>
                <p className="mt-2 text-sm text-foreground/85">
                  Drobne linie mimiczne, utrata blasku, początek bruzd nosowo-wargowych w mimice.
                  Owal twarzy zachowany. Wskazania: prewencja, stymulatory, retinoidy, SPF.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-5">
                <div className="text-xs uppercase tracking-[0.3em] text-champagne">Stopień II · 40–50 lat</div>
                <h3 className="mt-2 font-serif text-lg text-ink">Widoczne opadanie</h3>
                <p className="mt-2 text-sm text-foreground/85">
                  Bruzdy nosowo-wargowe trwałe, pierwsze „chomiki”, zarysowanie bruzdy łzowej,
                  opadanie zewnętrznego kącika oka. Wskazania: HIFU, radiofrekwencja, wolumetria
                  głębokich kompartmentów.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-5">
                <div className="text-xs uppercase tracking-[0.3em] text-champagne">Stopień III · 50–60 lat</div>
                <h3 className="mt-2 font-serif text-lg text-ink">Zatarty owal twarzy</h3>
                <p className="mt-2 text-sm text-foreground/85">
                  Wyraźne jowls, opadanie kącików ust („marionetkowe linie”), podwójny podbródek,
                  cienka skóra szyi. Wskazania: protokoły łączone (HIFU + stymulatory + wolumetria
                  + lasery frakcyjne).
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-5">
                <div className="text-xs uppercase tracking-[0.3em] text-champagne">Stopień IV · 60+ lat</div>
                <h3 className="mt-2 font-serif text-lg text-ink">Pełnoobjawowa ptoza</h3>
                <p className="mt-2 text-sm text-foreground/85">
                  Nadmiar skóry, głębokie bruzdy, opadanie powiek górnych zasłaniające pole widzenia.
                  Wskazania głównie chirurgiczne — medycyna estetyczna jako uzupełnienie lub
                  utrzymanie po liftingu.
                </p>
              </div>
            </div>
            <figure className="mt-8 overflow-hidden rounded-lg border border-border bg-card">
              <img
                src={zaawAsset.url}
                alt="Porównanie skóry w różnych stopniach zaawansowania ptozy"
                loading="lazy"
                decoding="async"
                className="w-full object-cover"
              />
              <figcaption className="px-4 py-3 text-sm text-muted-foreground">
                Progresja zmian skórnych: od wczesnej utraty jędrności po zaawansowaną wiotkość.
              </figcaption>
            </figure>
          </section>

          <section>
            <SectionHeading
              eyebrow="Strategia"
              title="Sekwencja zabiegów, która działa"
            />
            <p className="mt-4 text-base text-foreground/85 md:text-lg leading-relaxed">
              Najczęstszy błąd w medycynie estetycznej to odwrócona kolejność — wypełnianie ubytków
              objętości w skórze, która straciła fundament. Efekt „przepełnionej” twarzy bez
              liftingu bierze się stąd, że tkanki, które powinny być uniesione, są tylko dociążone
              większą ilością żelu. Poprawna sekwencja zaczyna się od fundamentu.
            </p>
            <ol className="mt-8 space-y-4 text-base text-foreground/85">
              <li className="flex gap-3">
                <Sparkles className="mt-1 size-4 shrink-0 text-champagne" />
                <span><strong>1. Fundament:</strong> stymulatory tkankowe lub HIFU — odbudowa rusztowania kolagenowego, podniesienie SMAS.</span>
              </li>
              <li className="flex gap-3">
                <Sparkles className="mt-1 size-4 shrink-0 text-champagne" />
                <span><strong>2. Wolumetria:</strong> precyzyjne uzupełnienie głębokich kompartmentów (kość jarzmowa, broda, kąt żuchwy) — przywraca proporcje, nie „dorzuca” tkanki.</span>
              </li>
              <li className="flex gap-3">
                <Sparkles className="mt-1 size-4 shrink-0 text-champagne" />
                <span><strong>3. Mimika:</strong> toksyna botulinowa w strategicznych mięśniach (czoło, kąciki oczu, podbródek).</span>
              </li>
              <li className="flex gap-3">
                <Sparkles className="mt-1 size-4 shrink-0 text-champagne" />
                <span><strong>4. Powierzchnia:</strong> lasery frakcyjne, peelingi, mezoterapia — polerka, koloryt, blask.</span>
              </li>
              <li className="flex gap-3">
                <Sparkles className="mt-1 size-4 shrink-0 text-champagne" />
                <span><strong>5. Podtrzymanie:</strong> domowy retinoid, antyoksydanty, SPF 50+, sesje przypominające co 12 miesięcy.</span>
              </li>
            </ol>
          </section>

          <section>
            <SectionHeading eyebrow="Czego unikać" title="Najczęstsze błędy w leczeniu ptozy" />
            <div className="mt-8 space-y-4">
              <div className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-1 size-5 shrink-0 text-champagne" />
                  <div>
                    <h3 className="font-serif text-lg text-ink">Wypełniacze bez fundamentu</h3>
                    <p className="mt-2 text-base text-foreground/85">
                      Dolewanie żelu w bruzdy bez uniesienia tkanek powyżej daje efekt „balona” i
                      pogłębia ptozę — żel dociąża opadające struktury zamiast ich podnosić.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-1 size-5 shrink-0 text-champagne" />
                  <div>
                    <h3 className="font-serif text-lg text-ink">Lifting nicią jako monoterapia</h3>
                    <p className="mt-2 text-base text-foreground/85">
                      Nici PDO/PLLA mają sens jako uzupełnienie protokołu, nie jako samodzielne
                      rozwiązanie ptozy II/III stopnia. Bez równoległej pracy nad jakością skóry
                      i wolumetrią efekt utrzymuje się 6–9 miesięcy.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-1 size-5 shrink-0 text-champagne" />
                  <div>
                    <h3 className="font-serif text-lg text-ink">Agresywna toksyna w dolnej części twarzy</h3>
                    <p className="mt-2 text-base text-foreground/85">
                      Wyłączenie mięśni dolnej części twarzy w obecności ptozy pogłębia opadanie —
                      mięśnie te aktywnie podnoszą tkanki. Toksyna botulinowa po 45. r.ż. wymaga
                      bardziej zniuansowanego planowania niż w wieku 30.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <SectionHeading
              eyebrow="Prewencja"
              title="Co realnie spowalnia starzenie skóry"
            />
            <ul className="mt-6 space-y-3 text-base text-foreground/85">
              <li className="flex gap-3">
                <ShieldCheck className="mt-1 size-4 shrink-0 text-champagne" />
                <span><strong>SPF 50+ codziennie</strong> — pojedynczy najsilniejszy czynnik prewencyjny. UVA przenika szyby i chmury, niszczy włókna kolagenu cały rok.</span>
              </li>
              <li className="flex gap-3">
                <ShieldCheck className="mt-1 size-4 shrink-0 text-champagne" />
                <span><strong>Retinoid wieczorem</strong> — jedyna substancja z udokumentowanym wpływem na pogrubienie skóry właściwej i odbudowę kolagenu (poziom dowodów A).</span>
              </li>
              <li className="flex gap-3">
                <ShieldCheck className="mt-1 size-4 shrink-0 text-champagne" />
                <span><strong>Antyoksydanty rano</strong> (witamina C, E, ferulik) — neutralizują wolne rodniki z UV i zanieczyszczeń.</span>
              </li>
              <li className="flex gap-3">
                <ShieldCheck className="mt-1 size-4 shrink-0 text-champagne" />
                <span><strong>Niski ładunek glikemiczny</strong> — ogranicza glikację białek strukturalnych skóry (AGEs).</span>
              </li>
              <li className="flex gap-3">
                <ShieldCheck className="mt-1 size-4 shrink-0 text-champagne" />
                <span><strong>Sen 7–8 godzin</strong> — w fazie głębokiego snu fibroblasty produkują najwięcej kolagenu.</span>
              </li>
              <li className="flex gap-3">
                <ShieldCheck className="mt-1 size-4 shrink-0 text-champagne" />
                <span><strong>Niepalenie</strong> — palacze starzeją się skórnie o 10–15 lat szybciej (utlenianie, niedotlenienie, MMP-1).</span>
              </li>
            </ul>
            <p className="mt-6 text-base text-foreground/85 leading-relaxed">
              <Clock className="mr-1 inline size-4 text-champagne" />
              Trzy konsekwentne nawyki domowe (SPF, retinoid, antyoksydant) potrafią opóźnić
              widoczne starzenie o 5–8 lat — to więcej niż jakikolwiek pojedynczy zabieg w gabinecie.
            </p>
          </section>

          <section>
            <SectionHeading eyebrow="FAQ" title="Najczęstsze pytania o starzenie i ptozę" />
            <div className="mt-8 space-y-4">
              {FAQ.map((item) => (
                <details key={item.q} className="group rounded-lg border border-border bg-card p-6 open:shadow-soft">
                  <summary className="cursor-pointer font-serif text-lg text-ink">{item.q}</summary>
                  <p className="mt-3 text-base text-foreground/85 leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        </article>

        <aside className="md:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-lg border border-border bg-secondary/30 p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-champagne">Spis treści</div>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a href="#dwa-procesy" className="text-foreground hover:text-champagne">Dwa procesy starzenia</a></li>
                <li>Mechanizmy w skórze</li>
                <li>Anatomia ptozy</li>
                <li>Cztery stopnie ptozy</li>
                <li>Sekwencja zabiegów</li>
                <li>Czego unikać</li>
                <li>Prewencja</li>
              </ul>
            </div>

            <div className="rounded-lg border border-border bg-secondary/30 p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-champagne">Standard warszawski</div>
              <h3 className="mt-2 font-serif text-xl text-ink">Plan szyty na miarę</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Mapowanie ptozy, ocena jakości skóry i indywidualna sekwencja zabiegów — bez
                dojeżdżania do stolicy.
              </p>
              <Link to="/konsultacja" className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-ink px-5 text-sm text-alabaster">
                Umów konsultację
              </Link>
            </div>

            <div className="rounded-lg border border-border p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-champagne">Czytaj dalej</div>
              <ul className="mt-4 space-y-3 text-sm">
                <li><Link to="/blog/mechanizmy-starzenia-skory" className="text-foreground hover:text-champagne">→ Mechanizmy starzenia skóry</Link></li>
                <li><Link to="/blog/ptoza-tkanek-twarzy" className="text-foreground hover:text-champagne">→ Anatomia ptozy tkanek</Link></li>
                <li><Link to="/blog/lifting-bez-skalpela" className="text-foreground hover:text-champagne">→ Lifting bez skalpela</Link></li>
              </ul>
            </div>
          </div>
        </aside>
      </div>

      <RelatedPosts currentSlug="starzenie-skory-ptoza-tkanek" />
    </>
  );
}
