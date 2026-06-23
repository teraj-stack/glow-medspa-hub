import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { getTechnology, type Technology } from "@/data/technologies";
import { formatCena } from "@/lib/format";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Calendar,
  ShieldCheck,
  Target,
  Zap,
  Activity,
  Flame,
  HeartPulse,
} from "lucide-react";

const TECH_SLUG = "renasculpt";
const PAGE_URL = "https://bmclinics.ai/renasculpt";

export const Route = createFileRoute("/renasculpt")({
  loader: (): { tech: Technology } => {
    const tech = getTechnology(TECH_SLUG);
    if (!tech) throw new Error("Renasculpt — brak wpisu w bazie technologii");
    return { tech };
  },
  head: ({ loaderData }) => {
    const tech = (loaderData as { tech: Technology } | undefined)?.tech ?? getTechnology(TECH_SLUG)!;
    const title =
      "Modelowanie sylwetki HIFEM + EMS + RF — Renasculpt | Beauty & Mind Clinic Siedlce";
    const description =
      "Synchroniczna stymulacja elektromagnetyczna mięśni (HIFEM/EMS) połączona z radiofrekwencją: 30-minutowa sesja, bez nacięć, bez znieczulenia, bez rekonwalescencji. Średnio +16% masy mięśniowej i -19% tkanki tłuszczowej w badaniach klinicznych. Standard premium klinik warszawskich — w Siedlcach.";
    const keywords =
      "HIFEM, EMS, RF, radiofrekwencja, modelowanie sylwetki Siedlce, redukcja tkanki tłuszczowej, lifting pośladków bez operacji, mięśnie dna miednicy, diastasis recti, Renasculpt, Beauty & Mind Clinic";

    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "MedicalTherapy",
      name: "Modelowanie sylwetki HIFEM + EMS + RF (Renasculpt)",
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
      indication: tech.indications,
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: (tech.faq ?? []).map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Strona główna", item: "https://bmclinics.ai/" },
        { "@type": "ListItem", position: 2, name: "Renasculpt — HIFEM + EMS + RF", item: PAGE_URL },
      ],
    };

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "keywords", content: keywords },
        { name: "author", content: "Beauty & Mind Clinic" },
        { name: "robots", content: "index, follow, max-image-preview:large" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: PAGE_URL },
        { property: "og:type", content: "article" },
        { property: "og:locale", content: "pl_PL" },
        { property: "og:site_name", content: "Beauty & Mind Clinic" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: PAGE_URL }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(serviceSchema) },
        { type: "application/ld+json", children: JSON.stringify(faqSchema) },
        { type: "application/ld+json", children: JSON.stringify(breadcrumbSchema) },
      ],
    };
  },
  component: RenasculptPage,
});

function RenasculptPage() {
  const { tech } = Route.useLoaderData() as { tech: Technology };

  return (
    <article className="bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-secondary/40 via-background to-background" />
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
              HIFEM · EMS · RF · 4 kanały
            </div>
            <h1 className="gold-line max-w-3xl font-serif text-4xl text-ink md:text-5xl lg:text-6xl">
              Mięsień i redukcja tłuszczu w jednej 30-minutowej sesji
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              {tech.shortDesc}
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
            { Icon: Clock, label: "Czas sesji", value: "30 minut" },
            { Icon: Calendar, label: "Protokół", value: "4–6 sesji co 2–3 dni" },
            { Icon: Target, label: "Efekt kliniczny", value: "+16% mięśnia · −19% tłuszczu" },
            { Icon: ShieldCheck, label: "Rekonwalescencja", value: "Brak" },
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
          title="Trzy technologie pracujące synchronicznie"
          description="HIFEM wymusza skurcze niemożliwe do uzyskania świadomym treningiem. RF doprowadza tkankę podskórną do progu apoptozy adipocytów. EMS poprawia ukrwienie i ewakuację metabolitów. Razem dają to, czego nie da żadna pojedyncza metoda."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              Icon: Zap,
              t: "HIFEM",
              sub: "High-Intensity Focused Electromagnetic",
              d: "Pole elektromagnetyczne wymusza skurcze supramaksymalne — kilkadziesiąt tysięcy w ciągu 30 minut. Efekt: hipertrofia i hiperplazja włókien mięśniowych.",
            },
            {
              Icon: Flame,
              t: "RF",
              sub: "Radiofrekwencja",
              d: "Kontrolowane podgrzanie tkanki podskórnej do 42–45°C uruchamia apoptozę adipocytów i skraca włókna kolagenowe — skóra się napina podczas modelowania.",
            },
            {
              Icon: Activity,
              t: "EMS",
              sub: "Elektromiostymulacja",
              d: "Niskoczęstotliwościowe impulsy poprawiają ukrwienie i drenaż. Eliminują typowe „zakwasy” po protokole — kwas mlekowy odprowadzany jest na bieżąco.",
            },
          ].map(({ Icon, t, sub, d }) => (
            <div key={t} className="rounded-xl border border-border/60 bg-card p-6">
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-champagne" />
                <div>
                  <div className="font-serif text-xl text-ink">{t}</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{sub}</div>
                </div>
              </div>
              <p className="mt-4 text-sm text-ink/80">{d}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-3xl text-sm text-muted-foreground">
          {tech.mechanism}
        </p>
      </section>

      {/* TRYBY I GŁOWICE */}
      <section className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 py-20">
          <SectionHeading
            eyebrow="Tryby i głowice"
            title="Pięć aplikatorów — pełna mapa ciała"
            description="Cztery niezależne kanały pozwalają pracować dwustronnie i równocześnie na różnych partiach. Każda głowica ma własny system chłodzenia i protokół dobrany do tkanki."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {tech.applicators?.map((a) => (
              <div key={a} className="flex items-start gap-3 rounded-xl border border-border/60 bg-card p-5">
                <Target className="mt-1 h-4 w-4 shrink-0 text-champagne" />
                <p className="text-sm text-ink/85">{a}</p>
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
          description="Każdy protokół dobieramy indywidualnie po wywiadzie medycznym, ocenie składu ciała i celów pacjentki."
        />
        <div className="mt-10 grid gap-3 md:grid-cols-2">
          {tech.indications.map((t) => (
            <div key={t} className="flex items-start gap-3 rounded-xl border border-border/60 bg-card p-5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-champagne" />
              <p className="text-sm text-ink/85">{t}</p>
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
            description="Pełną kwalifikację przeprowadzamy podczas konsultacji — wywiad, ocena pola zabiegowego, weryfikacja implantów."
          />
          <div className="mt-8 rounded-xl border border-border/60 bg-card p-6">
            <ul className="grid gap-3 md:grid-cols-2">
              {tech.contraindications?.map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm text-ink/80">
                  <HeartPulse className="mt-0.5 h-4 w-4 shrink-0 text-champagne" />
                  {t}
                </li>
              ))}
            </ul>
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
            {tech.faq?.map((f) => (
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

      {/* SUBTELNY CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border/60 bg-card p-10 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-champagne">Konsultacja</div>
          <h2 className="mt-3 font-serif text-3xl text-ink md:text-4xl">
            Sprawdź, czy ten protokół jest dla Ciebie
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
            Krótka rozmowa, ocena celów i kwalifikacja medyczna. Bez zobowiązań —
            wspólnie ustalimy, czy HIFEM + EMS + RF to najlepsza droga, czy lepszy będzie inny protokół.
          </p>
          <Link
            to="/konsultacja"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Umów konsultację
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </article>
  );
}
