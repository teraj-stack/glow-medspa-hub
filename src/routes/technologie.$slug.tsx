import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { BookingForm } from "@/components/site/BookingForm";
import { getTechnology, TECHNOLOGIES, type Technology } from "@/data/technologies";
import { formatCena } from "@/lib/format";
import { ArrowLeft, Check } from "lucide-react";

export const Route = createFileRoute("/technologie/$slug")({
  loader: ({ params }): { tech: import("@/data/technologies").Technology } => {
    const tech = getTechnology(params.slug);
    if (!tech) throw notFound();
    return { tech };
  },
  head: ({ loaderData, params }) => {
    const serviceSchema = loaderData
      ? {
          "@context": "https://schema.org",
          "@type": "MedicalTherapy",
          name: loaderData.tech.name,
          description: loaderData.tech.shortDesc,
          url: `https://bmclinics.ai/technologie/${params.slug}`,
          provider: {
            "@type": "MedicalBusiness",
            name: "Beauty & Mind Clinic",
            url: "https://bmclinics.ai",
          },
          indication: loaderData.tech.indications,
        }
      : undefined;

    const faqSchema =
      loaderData && loaderData.tech.faq && loaderData.tech.faq.length > 0
        ? {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: loaderData.tech.faq.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          }
        : undefined;

    const scripts: Array<{ type: string; children: string }> = [];
    if (serviceSchema) scripts.push({ type: "application/ld+json", children: JSON.stringify(serviceSchema) });
    if (faqSchema) scripts.push({ type: "application/ld+json", children: JSON.stringify(faqSchema) });

    return {
      meta: loaderData
        ? [
            { title: loaderData.tech.name },
            { name: "description", content: loaderData.tech.shortDesc },
            { property: "og:title", content: loaderData.tech.name },
            { property: "og:description", content: loaderData.tech.shortDesc },
            { property: "og:url", content: `https://bmclinics.ai/technologie/${params.slug}` },
          ]
        : [{ title: "Technologia — Beauty & Mind Clinic" }],
      links: [{ rel: "canonical", href: `https://bmclinics.ai/technologie/${params.slug}` }],
      scripts: scripts.length > 0 ? scripts : undefined,
    };
  },
  component: TechnologyDetail,
  notFoundComponent: () => (
    <div className="container-luxury py-24 text-center">
      <h1 className="font-serif text-3xl">Technologia nie istnieje</h1>
      <Link to="/technologie" className="mt-6 inline-block text-sm underline">Wróć do katalogu</Link>
    </div>
  ),
});

function TechnologyDetail() {
  const { tech } = Route.useLoaderData() as { tech: Technology };

  return (
    <>
      <section className="bg-secondary/40 py-12 md:py-20">
        <div className="container-luxury">
          <Link to="/technologie" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Wszystkie technologie
          </Link>
          <div className="mt-6 grid gap-10 md:grid-cols-[2fr_1fr] md:items-end">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-champagne">Technologia</div>
              <h1 className="mt-4 font-serif text-ink">{tech.name}</h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{tech.shortDesc}</p>
            </div>
            <Link
              to="/"
              hash="rezerwacja"
              className="inline-flex h-12 items-center justify-center rounded-md bg-ink px-6 text-sm tracking-wide text-alabaster md:justify-self-end"
            >
              Umów konsultację
            </Link>
          </div>
        </div>
      </section>

      <section className="container-luxury grid gap-12 py-16 md:grid-cols-3 md:py-24">
        <article className="md:col-span-2 space-y-12">
          <div>
            <SectionHeading eyebrow="Mechanizm" title="Jak działa zabieg" />
            <p className="mt-4 text-base text-foreground/85 md:text-lg">{tech.mechanism}</p>
          </div>

          {tech.applicators && tech.applicators.length > 0 && (
            <div>
              <SectionHeading eyebrow="Konfiguracja" title="Głowice i tryby" />
              <div className="tile-grid mt-6">
                {tech.applicators.map((a) => (
                  <div key={a} className="tile-card">
                    <div className="tile-title text-base">{a}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <SectionHeading eyebrow="Wskazania" title="Kiedy ten zabieg ma sens" />
            <ul className="mt-6 grid gap-3 md:grid-cols-2">
              {tech.indications.map((i) => (
                <li key={i} className="flex items-start gap-3 text-foreground/85">
                  <Check className="mt-1 size-4 shrink-0 text-champagne" /> {i}
                </li>
              ))}
            </ul>
          </div>

          {tech.contraindications && (
            <div>
              <SectionHeading eyebrow="Bezpieczeństwo" title="Przeciwwskazania" />
              <ul className="mt-6 list-disc space-y-2 pl-5 text-foreground/85">
                {tech.contraindications.map((c) => <li key={c}>{c}</li>)}
              </ul>
            </div>
          )}

          {tech.faq.length > 0 && (
            <div>
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
          )}
        </article>

        <aside className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6 shadow-soft">
            <div className="text-xs uppercase tracking-[0.3em] text-champagne">Cennik</div>
            <h3 className="mt-2 font-serif text-2xl text-ink">Wycena zabiegu</h3>
            <ul className="mt-4 divide-y divide-border">
              {tech.pricing.map((p) => (
                <li key={p.label} className="flex items-center justify-between py-3 text-sm">
                  <span className="text-foreground/80">{p.label}</span>
                  <span className="font-medium text-ink">{formatCena(p.price, { prefix: "od" })}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              Ostateczna cena ustalana jest na konsultacji w oparciu o protokół.
            </p>
          </div>

          <div className="rounded-lg border border-champagne/40 bg-secondary/40 p-6">
            <div className="font-serif text-lg text-ink">Zapytanie o ten zabieg</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Wypełnij formularz — wstępnie zaznaczymy tę technologię.
            </p>
            <Link
              to="/"
              hash="rezerwacja"
              className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-ink px-5 text-sm text-alabaster"
            >
              Przejdź do rezerwacji
            </Link>
          </div>
        </aside>
      </section>

      <section className="bg-secondary/40 py-16 md:py-24">
        <div className="container-luxury grid gap-12 md:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Rezerwacja" title="Umówmy konsultację" />
            <p className="mt-4 text-muted-foreground">
              Każdy protokół zaczyna się od rozmowy. Bez presji, bez sprzedaży.
            </p>
            <div className="mt-8">
              <div className="text-xs uppercase tracking-[0.3em] text-champagne">Inne technologie</div>
              <ul className="mt-3 grid gap-2 text-sm">
                {TECHNOLOGIES.filter((t) => t.slug !== tech.slug).slice(0, 5).map((t) => (
                  <li key={t.slug}>
                    <Link to="/technologie/$slug" params={{ slug: t.slug }} className="text-foreground/80 hover:text-foreground">
                      → {t.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <BookingForm defaultTechnology={tech.slug} />
        </div>
      </section>
    </>
  );
}
