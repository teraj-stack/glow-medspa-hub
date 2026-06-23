import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Technology } from "@/data/technologies";

const CAT_LABEL: Record<Technology["category"], string> = {
  twarz: "Twarz",
  ciało: "Ciało",
  intymność: "Intymność",
  skóra: "Skóra",
  modelowanie: "Modelowanie",
};

export function TechCard({ tech }: { tech: Technology }) {
  return (
    <Link
      to="/technologie/$slug"
      params={{ slug: tech.slug }}
      data-testid="tech-card-link"
      className="tile-card group rise-in focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.25em] text-champagne">
          {CAT_LABEL[tech.category]}
        </span>
        <ArrowUpRight className="size-4 text-muted-foreground transition group-hover:text-ink" />
      </div>
      <h3 className="tile-title whitespace-pre-line">{tech.name}</h3>
      <p className="tile-text">{tech.shortDesc}</p>
    </Link>
  );
}
