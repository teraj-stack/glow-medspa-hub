import { RelatedPosts } from "@/components/site/RelatedPosts";
import { BlurUpImage } from "@/components/site/BlurUpImage";
import { createFileRoute, Link } from "@tanstack/react-router";
import { DiagnostykaInlineCTA } from "@/components/site/DiagnostykaInlineCTA";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ArrowLeft, Layers } from "lucide-react";
import konturAsset from "@/assets/kontur-lifting-owal.avif.asset.json";
import szkicAsset from "@/assets/portret-starszej-kobiety.jpg.asset.json";
import etapyAsset from "@/assets/ptoza-wektory-etapy.jpg.asset.json";
import { cfImage } from "@/lib/cf-image";
import { withOgVersion } from "@/config/social-preview";
import ogCard from "@/assets/og/blog-ptoza-tkanek-twarzy.jpg";

const PORTRAIT_WIDTHS = [480, 768, 1024, 1280, 1600] as const;
const portraitSrcSet = PORTRAIT_WIDTHS
  .map((w) => `${cfImage(szkicAsset.url, { width: w, fit: "cover" })} ${w}w`)
  .join(", ");
const portraitSizes = "(min-width: 1024px) 768px, (min-width: 640px) 90vw, 100vw";


export const Route = createFileRoute("/blog/ptoza-tkanek-twarzy")({
  head: () => ({
    meta: [
      { title: "Ptoza tkanek twarzy — anatomia opadania | BMClinics Warszawa" },
      {
        name: "description",
        content:
          "Dlaczego twarz opada z wiekiem: kość, kompartmenty tłuszczowe, więzadła i SMAS. Anatomia ptozy w czterech stopniach zaawansowania.",
      },
      {
        name: "keywords",
        content:
          "ptoza tkanek twarzy, opadanie tkanek, anatomia twarzy, SMAS, więzadła zatrzymujące, kompartmenty tłuszczowe",
      },
      { property: "og:title", content: "Ptoza tkanek twarzy — anatomia opadania" },
      {
        property: "og:description",
        content:
          "Trzy piętra, które opadają z wiekiem — kość, tłuszcz, więzadła. I dlaczego sama skóra to dopiero końcówka problemu.",
      },
      { property: "og:url", content: "https://bmclinics.ai/blog/ptoza-tkanek-twarzy" },
      { property: "og:type", content: "article" },
      { property: "og:image", content: withOgVersion(`https://bmclinics.ai${ogCard}`) },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "BMClinics.ai — Warszawa (Wilanów), ul. Branickiego 10" },
      { name: "twitter:image", content: withOgVersion(`https://bmclinics.ai${ogCard}`) },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "article:published_time", content: "2026-06-27T10:10:00+02:00" },
      { property: "article:section", content: "Edukacja pacjenta" },
      { property: "og:locale", content: "pl_PL" },
    ],
    links: [{ rel: "canonical", href: "https://bmclinics.ai/blog/ptoza-tkanek-twarzy" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Ptoza tkanek twarzy — anatomia opadania",
          author: { "@type": "Organization", name: "BMClinics.ai" },
          publisher: {
            "@type": "Organization",
            name: "BMClinics.ai",
            logo: { "@type": "ImageObject", url: "https://bmclinics.ai/favicon.ico" },
          },
          datePublished: "2026-06-27T10:10:00+02:00",
          mainEntityOfPage: { "@type": "WebPage", "@id": "https://bmclinics.ai/blog/ptoza-tkanek-twarzy" },
        }),
      },
    ],
  }),
  component: PtosisArticle,
});

function PtosisArticle() {
  return (
    <>
      <section className="bg-secondary/40 py-12 md:py-20">
        <div className="container-luxury">
          <Link to="/blog/mechanizmy-starzenia-skory" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Część 1
          </Link>
          <div className="mt-6 max-w-3xl">
            <div className="text-xs uppercase tracking-[0.3em] text-champagne">Część 2 z 3 · seria o starzeniu</div>
            <h1 className="mt-4 font-serif text-ink">Ptoza tkanek twarzy — anatomia opadania</h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Twarz po 45. roku życia zmienia się nie z powodu „obwisłej skóry” — to skutek
              głębszych procesów w trzech warstwach pod nią. Bez ich zrozumienia żaden zabieg
              liftingujący nie daje trwałego efektu.
            </p>
          </div>
        </div>
      </section>

      <div className="container-luxury grid gap-12 py-16 md:grid-cols-3 md:py-24">
        <article className="md:col-span-2 space-y-12">
          <section>
            <SectionHeading eyebrow="Definicja" title="Czym jest ptoza tkanek" />
            <p className="mt-4 text-base text-foreground/85 md:text-lg leading-relaxed">
              Ptoza (z gr. <em>ptōsis</em> — opadanie) to anatomiczne przesunięcie tkanek miękkich
              twarzy w dół pod wpływem grawitacji. Dotyczy wszystkich warstw — skóry, tkanki
              tłuszczowej, mięśni mimicznych i powięzi SMAS — choć każda opada w innym tempie i
              w innym kierunku. Efektem są charakterystyczne zmiany konturu: opadające policzki,
              pogłębione bruzdy nosowo-wargowe, „chomiki” (jowls), podwójny podbródek, zatarty
              kąt żuchwy.
            </p>
            <figure className="mt-8 overflow-hidden rounded-lg border border-border bg-card">
              <BlurUpImage
                src={cfImage(szkicAsset.url, { width: 1024, fit: "cover" })}
                srcSet={portraitSrcSet}
                sizes={portraitSizes}
                alt="Portret starszej kobiety — widoczne zmarszczki i postępująca ptoza tkanek twarzy"
                width={1600}
                height={1067}
                loading="lazy"
                decoding="async"
                className="w-full bg-muted"
              />
              <figcaption className="px-4 py-3 text-sm text-muted-foreground">
                Schemat anatomiczny — granice estetyczne twarzy, na których widać postępującą ptozę.
              </figcaption>
            </figure>
          </section>

          <section>
            <SectionHeading eyebrow="Trzy piętra" title="Co dokładnie opada" />
            <div className="mt-8 space-y-6">
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-start gap-3">
                  <Layers className="mt-1 size-5 shrink-0 text-champagne" />
                  <div>
                    <h3 className="font-serif text-xl text-ink">1. Szkielet — resorpcja kostna</h3>
                    <p className="mt-3 text-base text-foreground/85 leading-relaxed">
                      Kość szczęki, jarzmowa, brzeg oczodołu i żuchwa stopniowo tracą masę po 40. r.ż.
                      Brzeg oczodołu cofa się o 1–2 mm na dekadę, co odsłania kompartment tłuszczowy
                      pod oczami (zarysowuje się <em>tear trough</em>). Resorpcja żuchwy zaciera kąt
                      żuchwy i skraca odległość między bródką a uchem. Cała reszta tkanek opiera się
                      na tym kurczącym szkielecie — i siłą rzeczy zsuwa się ku środkowi twarzy.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-start gap-3">
                  <Layers className="mt-1 size-5 shrink-0 text-champagne" />
                  <div>
                    <h3 className="font-serif text-xl text-ink">2. Tłuszcz — migracja kompartmentów</h3>
                    <p className="mt-3 text-base text-foreground/85 leading-relaxed">
                      Tkanka tłuszczowa twarzy nie jest jednolitą warstwą — to system około 20 odrębnych
                      kompartmentów rozdzielonych przegrodami łącznotkankowymi. Wyróżniamy kompartmenty
                      głębokie (np. DMCF — Deep Medial Cheek Fat, SOOF — Sub-Orbicularis Oculi Fat) i
                      powierzchowne (Nasolabial, Jowl, Submental). Z wiekiem głębokie tracą objętość,
                      a powierzchowne opadają i rozdzielają się — stąd „chomiki” oraz cień nad bruzdą
                      nosowo-wargową. Twarz nie tyje ani nie chudnie symetrycznie — ona <strong>migruje</strong>.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-start gap-3">
                  <Layers className="mt-1 size-5 shrink-0 text-champagne" />
                  <div>
                    <h3 className="font-serif text-xl text-ink">3. Więzadła — rozluźnienie retaining ligaments</h3>
                    <p className="mt-3 text-base text-foreground/85 leading-relaxed">
                      System więzadeł zatrzymujących (jarzmowe — Zygomatic, McGregor's patch;
                      żuchwowe — Mandibular; masseterowe — Masseteric cutaneous ligament) trzyma
                      tkanki miękkie w pozycji młodej. Z wiekiem włókna kolagenowe więzadeł słabną
                      i wydłużają się. Granica między obszarem „przytrzymanym” a opadającym staje
                      się widoczna jako trwała bruzda — bruzda łzowa, nosowo-wargowa, linia kąta
                      żuchwy. Te bruzdy to nie zmarszczki na skórze — to anatomiczne granice tkanek
                      głębszych.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-start gap-3">
                  <Layers className="mt-1 size-5 shrink-0 text-champagne" />
                  <div>
                    <h3 className="font-serif text-xl text-ink">4. SMAS — powięź łącząca wszystko</h3>
                    <p className="mt-3 text-base text-foreground/85 leading-relaxed">
                      <strong>SMAS</strong> (Superficial Musculo-Aponeurotic System) to powięź łącząca
                      mięśnie mimiczne z tkanką podskórną. Po 45. r.ż. traci napięcie i opada razem z
                      tkanką tłuszczową powierzchowną. Tradycyjny lifting chirurgiczny pracuje właśnie
                      na SMAS — z medycyny estetycznej w tę warstwę celuje ultradźwiękowy lifting
                      HIFU (skupione ultradźwięki o częstotliwości 4 MHz osiągają temperaturę
                      koagulacji 65–70°C dokładnie na głębokości 3–4,5 mm).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <SectionHeading eyebrow="Stopnie" title="Cztery etapy ptozy" />
            <div className="mt-8 space-y-4">
              <div className="rounded-lg border border-border bg-card p-5">
                <div className="text-xs uppercase tracking-[0.3em] text-champagne">Stopień I · 30–40 lat</div>
                <p className="mt-2 text-base text-foreground/85">
                  Drobne linie mimiczne, pierwsze cienie pod oczami, mimiczne bruzdy nosowo-wargowe.
                  Owal twarzy nienaruszony. Praca na poziomie prewencji — stymulatory tkankowe,
                  retinoid, SPF.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-5">
                <div className="text-xs uppercase tracking-[0.3em] text-champagne">Stopień II · 40–50 lat</div>
                <p className="mt-2 text-base text-foreground/85">
                  Trwałe bruzdy nosowo-wargowe, początek jowls, zarysowanie bruzdy łzowej, opadanie
                  zewnętrznego kącika oka. Praca na SMAS i głębokich kompartmentach — HIFU,
                  radiofrekwencja mikroigłowa, wolumetria głęboka.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-5">
                <div className="text-xs uppercase tracking-[0.3em] text-champagne">Stopień III · 50–60 lat</div>
                <p className="mt-2 text-base text-foreground/85">
                  Wyraźne jowls, zatarty kąt żuchwy, „linie marionetkowe” opadające w dół od kącika
                  ust, podwójny podbródek, wiotka skóra szyi. Protokoły łączone wielowarstwowe —
                  HIFU + stymulatory + wolumetria + lasery frakcyjne.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-5">
                <div className="text-xs uppercase tracking-[0.3em] text-champagne">Stopień IV · 60+ lat</div>
                <p className="mt-2 text-base text-foreground/85">
                  Nadmiar skóry, opadanie powiek górnych zasłaniające pole widzenia, głębokie bruzdy.
                  Wskazania głównie chirurgiczne (lifting SMAS, blefaroplastyka). Medycyna estetyczna
                  jako uzupełnienie i utrzymanie efektu po zabiegu chirurgicznym.
                </p>
              </div>
            </div>
            <figure className="mt-8 overflow-hidden rounded-lg border border-border bg-card">
              <img src={konturAsset.url} alt="Wektory opadania tkanek twarzy" loading="lazy" decoding="async" className="w-full object-cover" />
              <figcaption className="px-4 py-3 text-sm text-muted-foreground">
                Wektory ptozy — kierunki opadania tkanek pomagają planować odwrotne wektory zabiegowe.
              </figcaption>
            </figure>
            <figure className="mt-6 overflow-hidden rounded-lg border border-border bg-card">
              <img src={etapyAsset.url} alt="Etapy planowania leczenia ptozy — analiza potrzeb 50+, przebudowa skosowa i wektory siły, odzyskana harmonia 35+" loading="lazy" decoding="async" className="w-full object-cover" />
              <figcaption className="px-4 py-3 text-sm text-muted-foreground">
                Plan leczenia w trzech etapach: analiza wektorów napięcia (50+), celowana regeneracja i ułożenie włókien, efekt odzyskanej harmonii (wizualnie 35+).
              </figcaption>
            </figure>
          </section>

          <section className="rounded-lg border border-border bg-secondary/30 p-6 md:p-8">
            <h3 className="font-serif text-xl text-ink">Następna część serii</h3>
            <p className="mt-3 text-base text-foreground/85">
              Wiemy, co opada i dlaczego. W ostatnim artykule serii — co realnie możemy z tym zrobić
              bez skalpela: technologie, sekwencja zabiegów, czego unikać.
            </p>
            <Link to="/blog/lifting-bez-skalpela" className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-ink px-5 text-sm text-alabaster">
              Czytaj część 3 →
            </Link>
          </section>
        <DiagnostykaInlineCTA />
        </article>

        <aside className="md:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-lg border border-border bg-secondary/30 p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-champagne">Seria 3 artykułów</div>
              <ol className="mt-4 space-y-2 text-sm">
                <li><Link to="/blog/mechanizmy-starzenia-skory" className="text-foreground hover:text-champagne">1. Mechanizmy starzenia</Link></li>
                <li className="font-medium text-ink">2. Ptoza tkanek twarzy (tu jesteś)</li>
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

      <RelatedPosts currentSlug="ptoza-tkanek-twarzy" />
    </>
  );
}
