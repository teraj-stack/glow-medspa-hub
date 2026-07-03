import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { BookingFormLazy } from "@/components/site/BookingFormLazy";
import { getTechnology, type Technology } from "@/data/technologies";
import { formatCena } from "@/lib/format";
import {
  ArrowLeft,
  Check,
  Sparkles,
  ShieldCheck,
  Clock,
  Target,
  Calendar,
  Droplet,
  Sun,
} from "lucide-react";
import heroAsset from "@/assets/peeling-weglowy-hero.jpg.asset.json";
import heroAvif from "@/assets/peeling-weglowy-hero.avif.asset.json";
import heroWebp from "@/assets/peeling-weglowy-hero.webp.asset.json";
import { HeroPicture } from "@/components/site/HeroPicture";
import { CLINIC_POSTAL_ADDRESS_JSONLD } from "@/config/clinic";

const TECH_SLUG = "peeling-weglowy-laserowy";
const PAGE_URL = "https://bmclinics.ai/technologie/peeling-weglowy-laserowy";

export const Route = createFileRoute("/technologie/peeling-weglowy-laserowy")({
  loader: (): { tech: Technology } => {
    const tech = getTechnology(TECH_SLUG);
    if (!tech) throw new Error("Peeling węglowy — brak wpisu w bazie");
    return { tech };
  },
  head: () => {
    const title =
      "Peeling węglowy laserowy (Hollywood Peel / Carbon Peel) — efekt glow bez rekonwalescencji | BMClinics.ai Warszawa";
    const description =
      "Laserowy peeling węglowy (Carbon Peel, Hollywood Peel) — natychmiastowy efekt rozświetlenia, zwężenia porów i wygładzenia skóry. Bez bólu, bez rekonwalescencji. Standard premium klinik warszawskich w Warszawie.";

    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "MedicalTherapy",
      name: "Peeling węglowy laserowy (Carbon Peel / Hollywood Peel)",
      description,
      url: PAGE_URL,
      provider: {
        "@type": "MedicalBusiness",
        name: "BMClinics.ai",
        url: "https://bmclinics.ai",
        address: { ...CLINIC_POSTAL_ADDRESS_JSONLD },
      },
      indication: [
        "rozszerzone pory",
        "skóra mieszana i tłusta",
        "trądzik zaskórnikowy",
        "matowa cera",
        "powierzchowne przebarwienia",
      ],
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "Czy peeling węglowy boli?", acceptedAnswer: { "@type": "Answer", text: "Nie — to jeden z najbardziej komfortowych zabiegów laserowych. Pacjentki opisują odczucie jako delikatne ciepło i lekkie „strzelanie” węgla. Znieczulenie nie jest potrzebne." } },
        { "@type": "Question", name: "Kiedy widać efekt peelingu węglowego?", acceptedAnswer: { "@type": "Answer", text: "Natychmiast po zabiegu — skóra jest gładka, jednolita, świetlista, pory wyraźnie mniejsze. To efekt „glow”, dla którego peeling nazywany jest Hollywood Peel." } },
        { "@type": "Question", name: "Czy po peelingu węglowym jest rekonwalescencja?", acceptedAnswer: { "@type": "Answer", text: "Praktycznie zerowa. Możliwy delikatny rumień 1–2 godziny po zabiegu. Można wrócić do pracy tego samego dnia, makijaż nakładamy następnego dnia." } },
        { "@type": "Question", name: "Ile zabiegów peelingu węglowego potrzeba?", acceptedAnswer: { "@type": "Answer", text: "Efekt rozświetlenia po jednym zabiegu. Dla trwałej redukcji porów, sebum i lekkiego trądziku — seria 4–6 zabiegów co 2–3 tygodnie, następnie podtrzymanie raz na kwartał." } },
        { "@type": "Question", name: "Czy peeling węglowy leczy trądzik?", acceptedAnswer: { "@type": "Answer", text: "Działa wspomagająco w lekkim trądziku zaskórnikowym i zapalnym — redukuje sebum, niszczy bakterie C. acnes i oczyszcza pory. W cięższych postaciach stanowi element protokołu łączonego." } },
        { "@type": "Question", name: "Ile kosztuje peeling węglowy w Warszawie?", acceptedAnswer: { "@type": "Answer", text: "Twarz — 600 zł, twarz + szyja + dekolt — 1100 zł. Seria 4 zabiegów twarzy — 2050 zł (ok. 15% taniej). Cennik premium klinik warszawskich, bez konieczności dojazdu do Warszawy." } },
      ],
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Strona główna", item: "https://bmclinics.ai/" },
        { "@type": "ListItem", position: 2, name: "Technologie", item: "https://bmclinics.ai/technologie" },
        { "@type": "ListItem", position: 3, name: "Peeling węglowy laserowy (Carbon Peel)", item: PAGE_URL },
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
  component: PeelingWeglowyPage,
});

function PeelingWeglowyPage() {
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
            alt="Peeling węglowy laserowy — aplikacja nanocząsteczkowej pasty węglowej w gabinecie kosmetologii estetycznej"
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
              Carbon Peel · Hollywood Peel · laser pikosekundowy 1064 nm
            </div>
            <h1 className="gold-line max-w-3xl font-serif text-4xl text-ink md:text-5xl lg:text-6xl">
              Peeling węglowy — efekt „glow” w 45 minut
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Laserowa fototermoliza pasty węglowej. Pory mniejsze, skóra rozświetlona,
              tekstura wygładzona — wszystko w jednej sesji, bez rekonwalescencji.
              Klasyczny zabieg czerwonego dywanu — standard klinik warszawskich w Warszawie.
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
            { Icon: Target, label: "Długość fali", value: "pikosekundowy 1064 nm" },
            { Icon: Clock, label: "Czas zabiegu", value: "30–45 min" },
            { Icon: Calendar, label: "Rekonwalescencja", value: "0 dni" },
            { Icon: ShieldCheck, label: "Bezpieczeństwo", value: "Fototypy I–V" },
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
          title="Dwie fazy. Jedna sesja. Natychmiastowy efekt."
          description="Peeling węglowy łączy mechaniczne złuszczanie z fotoakustyczną pracą na sebum, bakteriach i kolagenie. Węgiel pełni rolę „sztucznego chromoforu” — przyciąga energię lasera dokładnie tam, gdzie chcemy."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <div className="flex items-center gap-3">
              <Droplet className="h-5 w-5 text-champagne" />
              <h3 className="font-serif text-xl text-ink">Faza 1 — fotoakustyczna sublimacja</h3>
            </div>
            <p className="mt-3 text-sm text-ink/80">
              Nanocząsteczki pasty węglowej wnikają w ujścia mieszków włosowych i wiążą sebum,
              martwy naskórek oraz zanieczyszczenia. Wiązka lasera pikosekundowego 1064 nm
              (impuls ~350 ps) uderza w węgiel falą fotoakustyczną — sublimuje go wraz
              z zawartością porów, nie nagrzewając otaczającej skóry.
              Jednocześnie energia redukuje aktywność gruczołów łojowych i niszczy bakterie
              C. acnes odpowiedzialne za trądzik.
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-champagne" />
              <h3 className="font-serif text-xl text-ink">Faza 2 — frakcyjna stymulacja kolagenu</h3>
            </div>
            <p className="mt-3 text-sm text-ink/80">
              Drugie przejście w trybie frakcyjnym (Honeycomb) rozbija powierzchowne przebarwienia
              i tworzy mikroobszary kontrolowanej stymulacji. Pozostały na skórze pył węglowy
              „eksploduje” pikosekundowo, a fibroblasty zostają pobudzone do syntezy kolagenu.
              Efekt: pory wyraźnie mniejsze, skóra rozświetlona, koloryt ujednolicony.
            </p>
          </div>
        </div>
      </section>

      {/* PROTOKÓŁ */}
      <section className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 py-20">
          <SectionHeading
            eyebrow="Przebieg zabiegu"
            title="Krok po kroku — 45 minut w gabinecie"
          />
          <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { n: "01", t: "Demakijaż i diagnostyka", d: "Ocena fototypu, oczyszczenie skóry, ustalenie parametrów lasera." },
              { n: "02", t: "Aplikacja pasty węglowej", d: "Cienka, równa warstwa pasty nanocząsteczkowej. Pozostawiamy do wchłonięcia w pory (~10 min)." },
              { n: "03", t: "Sublimacja — laser pikosekundowy", d: "Sekwencyjna praca lasera pikosekundowego 1064 nm na całej powierzchni. Fotoakustyczna fala uderzeniowa sublimuje węgiel bez termicznego uszkadzania skóry." },
              { n: "04", t: "Faza frakcyjna i pielęgnacja", d: "Drugie przejście w trybie frakcyjnym Honeycomb, aplikacja kosmetyków kojących, SPF 50+." },
            ].map((s) => (
              <li key={s.n} className="rounded-xl border border-border/60 bg-card p-6">
                <div className="font-serif text-2xl text-champagne">{s.n}</div>
                <div className="mt-2 font-serif text-lg text-ink">{s.t}</div>
                <div className="mt-2 text-sm text-muted-foreground">{s.d}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* WSKAZANIA */}
      <section className="container mx-auto px-4 py-20">
        <SectionHeading
          eyebrow="Dla kogo"
          title="Wskazania"
          description="Peeling węglowy najlepiej sprawdza się przy skórze tłustej, mieszanej, łojotokowej oraz jako szybki „resetujący” zabieg przed ważnym wydarzeniem."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tech.indications.map((i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-border/60 bg-card p-5">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-champagne" />
              <span className="text-ink/85">{i}</span>
            </div>
          ))}
        </div>
      </section>

      {/* REKONWALESCENCJA */}
      <section className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto grid gap-10 px-4 py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Rekonwalescencja"
              title="Lunchtime peel — bez przestoju"
            />
            <p className="mt-4 text-muted-foreground">
              To jeden z najmniej inwazyjnych zabiegów laserowych. Skóra po zabiegu jest
              gładka, jednolita i rozświetlona. Możliwy delikatny rumień utrzymujący się
              1–2 godziny — szybko ustępuje, można wrócić do pracy tego samego dnia.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "0 h — delikatny rumień, efekt „świetlistej skóry” od razu widoczny",
                "24 h — można nałożyć makijaż, wrócić do treningu i sauny",
                "48–72 h — szczyt efektu „glow”, pory wyraźnie mniejsze",
                "2–3 tygodnie — optymalny odstęp do kolejnej sesji",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-ink/80">
                  <Sun className="mt-0.5 h-4 w-4 shrink-0 text-champagne" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-champagne/40 bg-card p-6">
            <div className="text-xs uppercase tracking-[0.25em] text-champagne">Zalecenia po zabiegu</div>
            <h3 className="mt-2 font-serif text-2xl text-ink">Co warto zrobić</h3>
            <ul className="mt-4 space-y-3 text-sm text-ink/85">
              {[
                "SPF 50+ codziennie przez minimum 2 tygodnie",
                "łagodne, nawilżające kosmetyki bez retinolu i kwasów (7 dni)",
                "unikać sauny, basenu i intensywnego treningu przez 24 h",
                "pić dużo wody — wspomaga regenerację naskórka",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-champagne" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CENNIK + REZERWACJA */}
      <section className="container mx-auto grid gap-12 px-4 py-20 md:grid-cols-3">
        <aside className="space-y-6 md:col-span-1">
          <div className="rounded-lg border border-border bg-card p-6 shadow-soft">
            <div className="text-xs uppercase tracking-[0.3em] text-champagne">Cennik</div>
            <h3 className="mt-2 font-serif text-2xl text-ink">Wycena zabiegu</h3>
            <ul className="mt-4 divide-y divide-border">
              {tech.pricing.map((p) => (
                <li key={p.label} className="flex items-start justify-between gap-4 py-3 text-sm">
                  <div>
                    <div className="text-foreground/80">{p.label}</div>
                    {p.note && <div className="text-xs text-muted-foreground">{p.note}</div>}
                  </div>
                  <span className="font-medium text-ink whitespace-nowrap">
                    {formatCena(p.price, { prefix: "od" })}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              Cena ostateczna ustalana na konsultacji w oparciu o protokół i powierzchnię.
            </p>
          </div>
        </aside>

        <div className="md:col-span-2">
          <SectionHeading eyebrow="Bezpieczeństwo" title="Przeciwwskazania" />
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {(tech.contraindications ?? []).map((c) => (
              <li key={c} className="flex items-start gap-2 rounded-md border border-border/60 bg-card p-4 text-sm text-ink/85">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-champagne" />
                {c}
              </li>
            ))}
          </ul>

          <div className="mt-12">
            <SectionHeading eyebrow="FAQ" title="Najczęstsze pytania" />
            <div className="mt-6 divide-y divide-border rounded-lg border border-border bg-card">
              {tech.faq.map((f) => (
                <details key={f.q} className="group p-5 open:bg-secondary/30">
                  <summary className="cursor-pointer list-none font-serif text-lg text-ink">
                    {f.q}
                  </summary>
                  <p className="mt-3 text-foreground/80">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* REZERWACJA */}
      <section className="border-t border-border/40 bg-muted/30 py-16 md:py-24">
        <div className="container-luxury grid gap-12 md:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Rezerwacja" title="Umówmy konsultację" />
            <p className="mt-4 text-muted-foreground">
              Peeling węglowy często wykonujemy jako finisz protokołów łączonych —
              z laserem pikosekundowym, zimną plazmą lub fototerapią LED. Na konsultacji
              dobieram dokładną sekwencję pod cel skóry.
            </p>
          </div>
          <BookingFormLazy defaultTechnology={tech.slug} />
        </div>
      </section>
    </article>
  );
}
