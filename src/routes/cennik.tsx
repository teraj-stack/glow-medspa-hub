import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SectionHeading } from "@/components/site/SectionHeading";
import { TECHNOLOGIES } from "@/data/technologies";
import { formatCena } from "@/lib/format";
import { listHiddenPricingItems } from "@/lib/pricing-visibility.functions";

export const Route = createFileRoute("/cennik")({
  head: () => ({
    meta: [
      { title: "Cennik zabiegów | BMClinics.ai Warszawa" },
      {
        name: "description",
        content: "Orientacyjny cennik zabiegów medycyny estetycznej i laserowej w Warszawie. Ostateczna cena ustalana na konsultacji.",
      },
      { property: "og:title", content: "Cennik — BMClinics.ai" },
      { property: "og:description", content: "Przejrzyste ceny, indywidualna wycena protokołu." },
      { property: "og:url", content: "https://bmclinics.ai/cennik" },
    ],
    links: [{ rel: "canonical", href: "https://bmclinics.ai/cennik" }],
  }),
  component: Pricing,
});

function Pricing() {
  const { data: hidden = [] } = useQuery({
    queryKey: ["hidden-pricing-items"],
    queryFn: () => listHiddenPricingItems(),
    staleTime: 60_000,
  });
  const hiddenSet = new Set(hidden.map((h) => `${h.slug}::${h.label}`));

  const groups = TECHNOLOGIES.map((t) => ({
    ...t,
    pricing: t.pricing.filter((p) => !hiddenSet.has(`${t.slug}::${p.label}`)),
  })).filter((t) => t.pricing.length > 0);

  return (
    <>
      <section className="bg-secondary/40 py-16 md:py-24">
        <div className="container-luxury">
          <SectionHeading
            eyebrow="Cennik"
            title="Przejrzyste ceny, indywidualne protokoły"
            description="Poniższe ceny mają charakter orientacyjny. Ostateczna wycena następuje po konsultacji medycznej."
            as="h1"
          />
        </div>
      </section>

      <section className="container-luxury py-16 md:py-20">
        <div className="space-y-12">
          {groups.map((t) => (
            <div key={t.slug}>
              <div className="mb-4 flex items-baseline justify-between gap-4">
                <h2 className="gold-line font-serif text-ink">{t.name}</h2>
              </div>
              <div className="overflow-hidden rounded-lg border border-border bg-card">
                <table className="w-full text-sm">
                  <tbody>
                    {t.pricing.map((p) => (
                      <tr key={p.label} className="border-b border-border last:border-0">
                        <td className="px-5 py-4 text-foreground/85">{p.label}</td>
                        <td className="px-5 py-4 text-right font-medium text-ink">
                          {formatCena(p.price, { prefix: "od" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>


      <section className="bg-secondary/40 py-16 md:py-20">
        <div className="container-luxury text-center">
          <h2 className="font-serif text-ink">Gotowy/a na konsultację?</h2>
          <p className="mx-auto mt-3 max-w-xl text-foreground/75">
            Ostateczna wycena protokołu odbywa się po konsultacji medycznej (500 zł).
          </p>
          <Link
            to="/konsultacja"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-md bg-ink px-6 text-sm tracking-wide text-alabaster transition hover:bg-ink/90"
          >
            Umów konsultację — 500 zł
          </Link>
        </div>
      </section>
    </>
  );
}
