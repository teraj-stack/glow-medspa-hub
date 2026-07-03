import { RelatedPosts } from "@/components/site/RelatedPosts";
import { createFileRoute, Link } from "@tanstack/react-router";
import { DiagnostykaInlineCTA } from "@/components/site/DiagnostykaInlineCTA";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ArrowLeft, Sparkles, ShieldCheck } from "lucide-react";
import zdrowaAsset from "@/assets/plasma-skora-zdrowa.png.asset.json";
import wiotkaAsset from "@/assets/plasma-skora-wiotka.jpg.asset.json";
import fazyAsset from "@/assets/przyczyny-starzenia-trzy-problemy.jpeg.asset.json";
import { withOgVersion } from "@/config/social-preview";
import ogCard from "@/assets/og/blog-mechanizmy-starzenia-skory.jpg";

export const Route = createFileRoute("/blog/mechanizmy-starzenia-skory")({
  head: () => ({
    meta: [
      { title: "Mechanizmy starzenia skóry — kolagen, elastyna, glikacja | BMClinics Warszawa" },
      {
        name: "description",
        content:
          "Co dokładnie dzieje się w skórze z czasem: spadek kolagenu, fragmentacja elastyny, glikacja, stres oksydacyjny — i co realnie spowalnia ten proces.",
      },
      {
        name: "keywords",
        content:
          "mechanizmy starzenia skóry, kolagen, elastyna, glikacja, AGEs, stres oksydacyjny, photoaging, exposome",
      },
      { property: "og:title", content: "Mechanizmy starzenia skóry — co dzieje się pod powierzchnią" },
      {
        property: "og:description",
        content:
          "Trzy główne mechanizmy biologiczne, które zmieniają skórę z czasem — kolagen, elastyna, glikacja.",
      },
      { property: "og:url", content: "https://bmclinics.ai/blog/mechanizmy-starzenia-skory" },
      { property: "og:type", content: "article" },
      { property: "og:image", content: withOgVersion(`https://bmclinics.ai${ogCard},
      { name: "twitter:image", content: withOgVersion(`https://bmclinics.ai${ogCard}`) }`)}`) },
      { property: "article:published_time", content: "2026-06-27T10:05:00+02:00" },
      { property: "article:section", content: "Edukacja pacjenta" },
      { property: "og:locale", content: "pl_PL" },
    ],
    links: [{ rel: "canonical", href: "https://bmclinics.ai/blog/mechanizmy-starzenia-skory" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Mechanizmy starzenia skóry — co dzieje się pod powierzchnią",
          author: { "@type": "Organization", name: "BMClinics.ai" },
          publisher: {
            "@type": "Organization",
            name: "BMClinics.ai",
            logo: { "@type": "ImageObject", url: "https://bmclinics.ai/favicon.ico" },
          },
          datePublished: "2026-06-27T10:05:00+02:00",
          mainEntityOfPage: { "@type": "WebPage", "@id": "https://bmclinics.ai/blog/mechanizmy-starzenia-skory" },
        }),
      },
    ],
  }),
  component: MechanismsArticle,
});

function MechanismsArticle() {
  return (
    <>
      <section className="bg-secondary/40 py-12 md:py-20">
        <div className="container-luxury">
          <Link to="/blog/starzenie-skory-ptoza-tkanek" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Przewodnik filarowy
          </Link>
          <div className="mt-6 max-w-3xl">
            <div className="text-xs uppercase tracking-[0.3em] text-champagne">Część 1 z 3 · seria o starzeniu</div>
            <h1 className="mt-4 font-serif text-ink">Mechanizmy starzenia skóry — co dzieje się pod powierzchnią</h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Zanim porozmawiamy o ptozie i zabiegach, warto zrozumieć, co dokładnie zmienia się
              w skórze z każdą dekadą. To biologia, którą można spowolnić — jeśli wiemy, na co patrzymy.
            </p>
          </div>
        </div>
      </section>

      <div className="container-luxury grid gap-12 py-16 md:grid-cols-3 md:py-24">
        <article className="md:col-span-2 space-y-12">
          <section>
            <SectionHeading eyebrow="Fundament" title="Kolagen — rusztowanie skóry" />
            <p className="mt-4 text-base text-foreground/85 md:text-lg leading-relaxed">
              Kolagen typu I i III stanowi 70–80% suchej masy skóry właściwej. To on nadaje jej
              gęstość, sprężystość i pełność. Fibroblasty produkują go aktywnie do około 25. roku
              życia — potem produkcja spada średnio o 1% rocznie. Po 50. r.ż. skóra ma o 25–30% mniej
              kolagenu niż w wieku 25 lat, a po menopauzie tempo utraty przyspiesza dodatkowo
              o 30% w ciągu pierwszych 5 lat po jej rozpoczęciu.
            </p>
            <p className="mt-4 text-base text-foreground/85 leading-relaxed">
              Równolegle do spadku produkcji rośnie aktywność enzymów rozkładających kolagen —
              metaloproteinaz macierzy (MMP-1, MMP-3, MMP-9). UV jest ich najsilniejszym aktywatorem:
              już 15 minut intensywnego słońca podnosi poziom MMP-1 w skórze 4-krotnie na kilka dni.
              To dlatego fotoprotekcja działa nie tylko prewencyjnie, ale również terapeutycznie.
            </p>
          </section>

          <section>
            <SectionHeading eyebrow="Sprężystość" title="Elastyna — fragmentacja i elastoza" />
            <p className="mt-4 text-base text-foreground/85 md:text-lg leading-relaxed">
              Elastyna stanowi tylko 2–4% skóry właściwej, ale to ona pozwala jej wracać do
              wyjściowego kształtu po rozciągnięciu (uśmiechu, mimice, mimowolnym pociągnięciu).
              Włókna elastyny powstają w skórze dziecka i nastolatka — po 30. roku życia produkcja
              praktycznie ustaje. Wszystko, co mamy w wieku 35 lat, musi nam wystarczyć na resztę
              życia, jeśli będziemy je chronić.
            </p>
            <p className="mt-4 text-base text-foreground/85 leading-relaxed">
              Pod wpływem UV włókna ulegają fragmentacji i zlepiają się w bezkształtne grudki —
              zjawisko zwane <strong>elastozą posłoneczną</strong>. Skóra przestaje wracać do
              kształtu wyjściowego: szczyptana zatrzymuje się w „namiocie” na kilka sekund (test
              elastyczności wykorzystywany w gabinecie). To moment, w którym mówimy o utracie
              sprężystości jako problemie strukturalnym, nie kosmetycznym.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <figure className="overflow-hidden rounded-lg border border-border bg-card">
                <img src={zdrowaAsset.url} alt="Skóra młoda — gęsta sieć włókien" loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
                <figcaption className="px-4 py-3 text-sm text-muted-foreground">Młoda skóra — równoległe, gęste włókna elastyny.</figcaption>
              </figure>
              <figure className="overflow-hidden rounded-lg border border-border bg-card">
                <img src={wiotkaAsset.url} alt="Skóra dojrzała — elastoza posłoneczna" loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
                <figcaption className="px-4 py-3 text-sm text-muted-foreground">Skóra dojrzała — elastoza, fragmentacja, utrata podparcia.</figcaption>
              </figure>
            </div>
            <figure id="mapowanie-procesu-starzenia" className="mt-8 overflow-hidden rounded-lg border border-border bg-card">
              <img src={fazyAsset.url} alt="Przyczyny starzenia się skóry — trzy główne problemy: redukcja kwasu hialuronowego (GAGs), nadmierna produkcja proteaz (MMPs), spadek regeneracji (HSPS) oraz zjawiska dodatkowe — stres oksydacyjny i glikacja" loading="lazy" decoding="async" className="w-full object-cover" />
              <figcaption className="px-4 py-3 text-sm text-muted-foreground">Przyczyny starzenia się skóry — trzy główne problemy: redukcja GAGs, nadmierna produkcja MMPs i spadek regeneracji (HSPS), uzupełnione o stres oksydacyjny i glikację.</figcaption>
            </figure>
          </section>

          <section>
            <SectionHeading eyebrow="Cukier" title="Glikacja — gdy dieta starzeje skórę" />
            <p className="mt-4 text-base text-foreground/85 md:text-lg leading-relaxed">
              Glikacja to spontaniczna reakcja cukrów z białkami strukturalnymi skóry — głównie
              kolagenem i elastyną. Powstają <strong>AGEs (Advanced Glycation End-products)</strong> —
              trwałe, sztywne kompleksy, które usztywniają włókna i nadają skórze charakterystyczny
              żółtawy odcień. To mechanizm, który po 40. roku życia odpowiada za znaczną część utraty
              elastyczności i blasku — niezależnie od UV.
            </p>
            <p className="mt-4 text-base text-foreground/85 leading-relaxed">
              Dieta o wysokim ładunku glikemicznym (cukry proste, biała mąka, słodzone napoje) oraz
              produkty smażone i grillowane (gotowe AGEs) podnoszą poziom glikacji skórnej. Dieta
              śródziemnomorska i niski indeks glikemiczny istotnie spowalniają proces — efekt
              widoczny po 6–12 miesiącach konsekwentnej zmiany.
            </p>
          </section>

          <section>
            <SectionHeading eyebrow="Wolne rodniki" title="Stres oksydacyjny i exposome" />
            <p className="mt-4 text-base text-foreground/85 md:text-lg leading-relaxed">
              Pojęcie <strong>exposome</strong> obejmuje całość czynników środowiskowych, którym
              skóra jest poddawana: UV (UVA + UVB + światło widzialne, szczególnie niebieskie),
              zanieczyszczenia powietrza (PM2.5, ozon), dym papierosowy, stres, niedosypianie.
              Każdy z tych czynników generuje reaktywne formy tlenu (ROS), które uszkadzają DNA
              komórek skóry, lipidy błon komórkowych i białka strukturalne.
            </p>
            <p className="mt-4 text-base text-foreground/85 leading-relaxed">
              Antyoksydanty stosowane miejscowo (witamina C 10–20%, witamina E, kwas ferulowy,
              resweratrol, niacynamid) neutralizują wolne rodniki, zanim te zdążą uszkodzić strukturę.
              To dlatego serum antyoksydacyjne rano + SPF 50+ jest klasycznym, naukowo
              udokumentowanym duetem prewencyjnym o najlepszym stosunku efektu do kosztu.
            </p>
          </section>

          <section>
            <SectionHeading eyebrow="Co możesz zrobić dziś" title="Trzy nawyki o największym wpływie" />
            <ul className="mt-6 space-y-4 text-base text-foreground/85">
              <li className="flex gap-3">
                <ShieldCheck className="mt-1 size-4 shrink-0 text-champagne" />
                <span><strong>SPF 50+ codziennie</strong> — jedyna substancja, której skuteczność prewencyjna ma poziom dowodów A. Niezależnie od pory roku, pogody i czasu spędzanego w domu (UVA przenika szyby).</span>
              </li>
              <li className="flex gap-3">
                <ShieldCheck className="mt-1 size-4 shrink-0 text-champagne" />
                <span><strong>Retinoid wieczorem</strong> — pobudza fibroblasty, pogrubia skórę właściwą, normalizuje rogowacenie. Zaczynamy od 0,025–0,05% raz w tygodniu, stopniowo zwiększamy częstotliwość.</span>
              </li>
              <li className="flex gap-3">
                <ShieldCheck className="mt-1 size-4 shrink-0 text-champagne" />
                <span><strong>Serum antyoksydacyjne rano</strong> — witamina C 10–15% + witamina E + kwas ferulowy. Klasyczna formuła z udokumentowaną synergią ochronną.</span>
              </li>
            </ul>
            <p className="mt-6 text-base text-foreground/85 leading-relaxed">
              <Sparkles className="mr-1 inline size-4 text-champagne" />
              Te trzy nawyki, stosowane konsekwentnie od 25.–30. roku życia, opóźniają widoczne
              starzenie skóry o 5–8 lat. Każdy zabieg w gabinecie buduje na tym fundamencie —
              bez niego efekt utrzymuje się krócej.
            </p>
          </section>

          <section className="rounded-lg border border-border bg-secondary/30 p-6 md:p-8">
            <h3 className="font-serif text-xl text-ink">Następna część serii</h3>
            <p className="mt-3 text-base text-foreground/85">
              Zrozumieliśmy, co dzieje się w samej skórze. W kolejnym artykule przechodzimy głębiej —
              do kości, tkanki tłuszczowej i więzadeł twarzy. To one decydują o tym, jak wygląda
              owal twarzy po 45. roku życia.
            </p>
            <Link to="/blog/ptoza-tkanek-twarzy" className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-ink px-5 text-sm text-alabaster">
              Czytaj część 2 →
            </Link>
          </section>
        <DiagnostykaInlineCTA />
        </article>

        <aside className="md:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-lg border border-border bg-secondary/30 p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-champagne">Seria 3 artykułów</div>
              <ol className="mt-4 space-y-2 text-sm">
                <li className="font-medium text-ink">1. Mechanizmy starzenia (tu jesteś)</li>
                <li><Link to="/blog/ptoza-tkanek-twarzy" className="text-foreground hover:text-champagne">2. Ptoza tkanek twarzy</Link></li>
                <li><Link to="/blog/lifting-bez-skalpela" className="text-foreground hover:text-champagne">3. Lifting bez skalpela</Link></li>
              </ol>
            </div>
            <div className="rounded-lg border border-border p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-champagne">Przewodnik filarowy</div>
              <Link to="/blog/starzenie-skory-ptoza-tkanek" className="mt-3 block text-sm text-foreground hover:text-champagne">
                → Kompletny przewodnik o starzeniu i ptozie
              </Link>
            </div>
          </div>
        </aside>
      </div>

      <RelatedPosts currentSlug="mechanizmy-starzenia-skory" />
    </>
  );
}
