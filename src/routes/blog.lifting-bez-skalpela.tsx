import { RelatedPosts } from "@/components/site/RelatedPosts";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ArrowLeft, Sparkles, AlertCircle } from "lucide-react";
import konturAsset from "@/assets/kontur-lifting-owal.avif.asset.json";

export const Route = createFileRoute("/blog/lifting-bez-skalpela")({
  head: () => ({
    meta: [
      { title: "Lifting bez skalpela — co realnie działa | BMC Siedlce" },
      {
        name: "description",
        content:
          "HIFU, radiofrekwencja mikroigłowa, stymulatory tkankowe, wolumetria, lasery — które technologie i w jakiej kolejności realnie odwracają ptozę.",
      },
      {
        name: "keywords",
        content:
          "lifting bez skalpela, HIFU, radiofrekwencja mikroigłowa, stymulatory tkankowe, wolumetria twarzy, nici PDO, Siedlce",
      },
      { property: "og:title", content: "Lifting bez skalpela — sekwencja, która działa" },
      {
        property: "og:description",
        content:
          "Co realnie odwraca ptozę tkanek — sekwencja zabiegów dobierana do stopnia opadania, bez magicznych pojedynczych rozwiązań.",
      },
      { property: "og:url", content: "https://bmclinics.ai/blog/lifting-bez-skalpela" },
      { property: "og:type", content: "article" },
      { property: "og:image", content: `https://bmclinics.ai${konturAsset.url}` },
      { property: "article:published_time", content: "2026-06-27T10:15:00+02:00" },
      { property: "article:section", content: "Medycyna estetyczna" },
      { property: "og:locale", content: "pl_PL" },
    ],
    links: [{ rel: "canonical", href: "https://bmclinics.ai/blog/lifting-bez-skalpela" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Lifting bez skalpela — sekwencja, która działa",
          author: { "@type": "Organization", name: "BMClinics.ai" },
          publisher: {
            "@type": "Organization",
            name: "BMClinics.ai",
            logo: { "@type": "ImageObject", url: "https://bmclinics.ai/favicon.ico" },
          },
          datePublished: "2026-06-27T10:15:00+02:00",
          mainEntityOfPage: { "@type": "WebPage", "@id": "https://bmclinics.ai/blog/lifting-bez-skalpela" },
        }),
      },
    ],
  }),
  component: NonSurgicalArticle,
});

function NonSurgicalArticle() {
  return (
    <>
      <section className="bg-secondary/40 py-12 md:py-20">
        <div className="container-luxury">
          <Link to="/blog/ptoza-tkanek-twarzy" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Część 2
          </Link>
          <div className="mt-6 max-w-3xl">
            <div className="text-xs uppercase tracking-[0.3em] text-champagne">Część 3 z 3 · seria o starzeniu</div>
            <h1 className="mt-4 font-serif text-ink">Lifting bez skalpela — co realnie odwraca ptozę</h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Nie istnieje jeden zabieg, który „cofa czas”. Istnieje sekwencja dobrana do stopnia
              ptozy i jakości skóry — to ona daje efekt naturalny, trwały i niemożliwy do osiągnięcia
              jednym wypełniaczem czy jedną serią nici.
            </p>
          </div>
        </div>
      </section>

      <div className="container-luxury grid gap-12 py-16 md:grid-cols-3 md:py-24">
        <article className="md:col-span-2 space-y-12">
          <section>
            <SectionHeading eyebrow="Fundament" title="Technologie pracujące w głębi" />
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-serif text-lg text-ink">Skupione ultradźwięki (HIFU)</h3>
                <p className="mt-3 text-base text-foreground/85 leading-relaxed">
                  Energia ultradźwiękowa skupiona dokładnie w warstwie SMAS (3–4,5 mm) lub w skórze
                  właściwej (1,5–3 mm) podgrzewa tkankę do 65–70°C, wywołując punktową koagulację.
                  Powięź obkurcza się natychmiast, a w ciągu 3–6 miesięcy zachodzi neokolageneza.
                  Złoty standard dla ptozy II/III stopnia. Efekt utrzymuje się 12–18 miesięcy.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-serif text-lg text-ink">Radiofrekwencja mikroigłowa</h3>
                <p className="mt-3 text-base text-foreground/85 leading-relaxed">
                  Izolowane mikroigły dostarczają energię o częstotliwości radiowej na precyzyjnie
                  ustaloną głębokość (0,5–3,5 mm). Powstają mikro-strefy koagulacji w skórze właściwej —
                  bez naruszania naskórka. Pobudza neokolagenezę i neoelastogenezę. Bezpieczna dla
                  wszystkich fototypów, również po opaleniźnie.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-serif text-lg text-ink">Stymulatory tkankowe</h3>
                <p className="mt-3 text-base text-foreground/85 leading-relaxed">
                  Iniekcyjne preparaty z kwasem polimlekowym (PLLA) lub hydroksyapatytem wapnia
                  (CaHA) działają jak rusztowanie — pobudzają fibroblasty do produkcji własnego
                  kolagenu. Efekt narasta przez 3–6 miesięcy po serii zabiegów i utrzymuje się
                  18–24 miesięcy. Nie wypełniają — odbudowują strukturę.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-serif text-lg text-ink">Wolumetria precyzyjna</h3>
                <p className="mt-3 text-base text-foreground/85 leading-relaxed">
                  Kwas hialuronowy o gęstości dobranej do warstwy (kostnej, głęboko-tłuszczowej,
                  powierzchownej). Cel: przywrócenie utraconej objętości w głębokich kompartmentach,
                  nie wypełnianie bruzd. Dobrze wykonana wolumetria <em>podnosi</em> twarz, źle
                  wykonana — dociąża.
                </p>
              </div>
            </div>
          </section>

          <section>
            <SectionHeading eyebrow="Mimika i powierzchnia" title="Polerka po fundamencie" />
            <div className="mt-8 space-y-4">
              <div className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-serif text-lg text-ink">Toksyna botulinowa</h3>
                <p className="mt-2 text-base text-foreground/85">
                  Punktowe wyłączenie mięśni hiperaktywnych (czoło, lwie zmarszczki, kąciki oczu).
                  Po 45. r.ż. dawkowanie wymaga szczególnej delikatności — mięśnie unoszące twarz
                  muszą zostać oszczędzone, by nie pogłębiać ptozy.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-serif text-lg text-ink">Lasery frakcyjne</h3>
                <p className="mt-2 text-base text-foreground/85">
                  Pracują nad teksturą, kolorytem i drobnymi liniami — to polerka po fundamencie,
                  nie samodzielne rozwiązanie ptozy. W połączeniu z HIFU dają efekt synergiczny:
                  gęstsza, gładsza, bardziej napięta skóra na podniesionym SMAS.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-serif text-lg text-ink">Mezoterapia i biostymulatory iniekcyjne</h3>
                <p className="mt-2 text-base text-foreground/85">
                  Witaminy, peptydy, kwas hialuronowy o niskiej masie — nawodnienie, blask,
                  delikatne pobudzenie fibroblastów. Świetne uzupełnienie planu, słaby substytut
                  technologii pracujących głębiej.
                </p>
              </div>
            </div>
          </section>

          <section>
            <SectionHeading eyebrow="Sekwencja" title="W jakiej kolejności planujemy zabiegi" />
            <ol className="mt-6 space-y-4 text-base text-foreground/85">
              <li className="flex gap-3">
                <Sparkles className="mt-1 size-4 shrink-0 text-champagne" />
                <span><strong>Krok 1 — fundament:</strong> HIFU lub stymulatory tkankowe. Dajemy skórze 8–12 tygodni na neokolagenezę.</span>
              </li>
              <li className="flex gap-3">
                <Sparkles className="mt-1 size-4 shrink-0 text-champagne" />
                <span><strong>Krok 2 — proporcje:</strong> precyzyjna wolumetria w głębokich kompartmentach (kość jarzmowa, broda, kąt żuchwy). Nie wypełniamy bruzd — odbudowujemy szkielet.</span>
              </li>
              <li className="flex gap-3">
                <Sparkles className="mt-1 size-4 shrink-0 text-champagne" />
                <span><strong>Krok 3 — mimika:</strong> toksyna botulinowa w mięśniach hiperaktywnych.</span>
              </li>
              <li className="flex gap-3">
                <Sparkles className="mt-1 size-4 shrink-0 text-champagne" />
                <span><strong>Krok 4 — powierzchnia:</strong> laser frakcyjny lub peeling chemiczny pod koloryt i teksturę.</span>
              </li>
              <li className="flex gap-3">
                <Sparkles className="mt-1 size-4 shrink-0 text-champagne" />
                <span><strong>Krok 5 — utrzymanie:</strong> sesja przypominająca co 12 miesięcy + domowy retinoid, antyoksydanty, SPF 50+.</span>
              </li>
            </ol>
            <figure className="mt-8 overflow-hidden rounded-lg border border-border bg-card">
              <img src={konturAsset.url} alt="Wektory podnoszenia tkanek przy zabiegach liftingujących" loading="lazy" decoding="async" className="w-full object-cover" />
              <figcaption className="px-4 py-3 text-sm text-muted-foreground">
                Wektory pracy zabiegowej — odwrotne do wektorów ptozy, dobrane do anatomii pacjentki.
              </figcaption>
            </figure>
          </section>

          <section>
            <SectionHeading eyebrow="Pułapki" title="Trzy najczęstsze błędy" />
            <div className="mt-8 space-y-4">
              <div className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-1 size-5 shrink-0 text-champagne" />
                  <div>
                    <h3 className="font-serif text-lg text-ink">Wypełniacze bez fundamentu</h3>
                    <p className="mt-2 text-base text-foreground/85">
                      Dolewanie żelu w bruzdy bez uprzedniego podniesienia SMAS daje efekt
                      „przepełnionej” twarzy. Tkanki nie unoszą się — są dociążane.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-1 size-5 shrink-0 text-champagne" />
                  <div>
                    <h3 className="font-serif text-lg text-ink">Nici jako jedyne rozwiązanie</h3>
                    <p className="mt-2 text-base text-foreground/85">
                      Nici PDO/PLLA mają sens jako element protokołu, nie monoterapia ptozy II/III
                      stopnia. Bez równoległej pracy nad jakością skóry i wolumetrią efekt utrzymuje
                      się 6–9 miesięcy.
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
                      Mięśnie dolnej części twarzy aktywnie podnoszą tkanki — ich wyłączenie po
                      45. r.ż. nasila ptozę zamiast jej przeciwdziałać. Toksyna w tej okolicy
                      wymaga zniuansowanego planowania.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-secondary/30 p-6 md:p-8">
            <h3 className="font-serif text-xl text-ink">Plan szyty na miarę — konsultacja</h3>
            <p className="mt-3 text-base text-foreground/85">
              Sekwencja zabiegów ma sens tylko w odniesieniu do konkretnej twarzy — jej anatomii,
              stopnia ptozy, jakości skóry i celów pacjentki. Podczas konsultacji mapujemy ptozę,
              oceniamy jakość skóry i planujemy 12–24 miesięcy pracy z realnymi kosztami i
              odstępami między zabiegami.
            </p>
            <Link to="/konsultacja" className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-ink px-5 text-sm text-alabaster">
              Umów konsultację
            </Link>
          </section>
        </article>

        <aside className="md:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-lg border border-border bg-secondary/30 p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-champagne">Seria 3 artykułów</div>
              <ol className="mt-4 space-y-2 text-sm">
                <li><Link to="/blog/mechanizmy-starzenia-skory" className="text-foreground hover:text-champagne">1. Mechanizmy starzenia</Link></li>
                <li><Link to="/blog/ptoza-tkanek-twarzy" className="text-foreground hover:text-champagne">2. Ptoza tkanek twarzy</Link></li>
                <li className="font-medium text-ink">3. Lifting bez skalpela (tu jesteś)</li>
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

      <RelatedPosts currentSlug="lifting-bez-skalpela" />
    </>
  );
}
