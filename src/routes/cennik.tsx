import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { TECHNOLOGIES } from "@/data/technologies";
import { formatCena } from "@/lib/format";

export const Route = createFileRoute("/cennik")({
  head: () => ({
    meta: [
      { title: "Cennik zabiegów | Beauty & Mind Clinic Siedlce" },
      {
        name: "description",
        content: "Orientacyjny cennik zabiegów medycyny estetycznej i laserowej w Siedlcach. Ostateczna cena ustalana na konsultacji.",
      },
      { property: "og:title", content: "Cennik — Beauty & Mind Clinic" },
      { property: "og:description", content: "Przejrzyste ceny, indywidualna wycena protokołu." },
    ],
  }),
  component: Pricing,
});

function Pricing() {
  return (
    <>
      <section className="bg-secondary/40 py-16 md:py-24">
        <div className="container-luxury">
          <SectionHeading
            eyebrow="Cennik"
            title="Przejrzyste ceny, indywidualne protokoły"
            description="Poniższe ceny mają charakter orientacyjny. Ostateczna wycena następuje po konsultacji medycznej."
          />
        </div>
      </section>

      <section className="container-luxury py-16 md:py-20">
        <div className="space-y-12">
          {TECHNOLOGIES.map((t) => (
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
    </>
  );
}
