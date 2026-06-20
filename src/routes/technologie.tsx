import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { TechCard } from "@/components/site/TechCard";
import { TECHNOLOGIES, type Technology } from "@/data/technologies";

export const Route = createFileRoute("/technologie")({
  head: () => ({
    meta: [
      { title: "Technologie | Beauty & Mind Clinic Siedlce" },
      {
        name: "description",
        content:
          "Pełna lista technologii medycyny estetycznej i laserowej dostępnych w klinice Beauty & Mind w Siedlcach.",
      },
      { property: "og:title", content: "Technologie — Beauty & Mind Clinic" },
      { property: "og:description", content: "15 sprawdzonych technologii dobranych pod Państwa potrzeby." },
    ],
  }),
  component: TechnologiesPage,
});

const CATEGORIES: { key: Technology["category"]; label: string }[] = [
  { key: "twarz", label: "Twarz" },
  { key: "ciało", label: "Ciało" },
  { key: "skóra", label: "Skóra" },
  { key: "modelowanie", label: "Modelowanie" },
  { key: "intymność", label: "Intymność" },
];

function TechnologiesPage() {
  return (
    <>
      <section className="bg-secondary/40 py-16 md:py-24">
        <div className="container-luxury">
          <SectionHeading
            eyebrow="Katalog"
            title="Technologie, na które stawiamy"
            description="Każde urządzenie ma swoje miejsce w protokole. Opisujemy je po inżyniersku — nazwy handlowe omawiamy w gabinecie."
          />
        </div>
      </section>

      {CATEGORIES.map((cat) => {
        const items = TECHNOLOGIES.filter((t) => t.category === cat.key);
        if (!items.length) return null;
        return (
          <section key={cat.key} className="container-luxury py-12 md:py-16">
            <div className="mb-8 flex items-baseline justify-between">
              <h2 className="gold-line font-serif text-ink">{cat.label}</h2>
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {items.length} {items.length === 1 ? "technologia" : "technologie"}
              </div>
            </div>
            <div className="tile-grid">
              {items.map((t) => <TechCard key={t.slug} tech={t} />)}
            </div>
          </section>
        );
      })}
    </>
  );
}
