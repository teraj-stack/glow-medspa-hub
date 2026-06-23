import { ArrowRight, Gem } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type PakietETileTechnology = {
  name: string;
  slug?: string;
};

export type PakietETileProps = {
  letter: string;
  subtitle: string;
  title: string;
  protocolLabel: string;
  protocol: string;
  protocolDescription: string;
  technologiesLabel: string;
  technologies: PakietETileTechnology[];
  ctaTeaser?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageSrc?: string;
  imageAlt?: string;
  Icon?: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  iconHref?: string;
  iconTooltip?: string;
  id?: string;
};

export default function PakietETile({
  letter,
  subtitle,
  title,
  protocolLabel,
  protocol,
  protocolDescription,
  technologiesLabel,
  technologies,
  ctaTeaser,
  ctaLabel,
  ctaHref,
  imageSrc,
  imageAlt,
  Icon = Gem,
  iconHref,
  iconTooltip,
  id,
}: PakietETileProps) {
  const iconInner = (
    <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-sm bg-champagne/10 border border-champagne/30 flex items-center justify-center text-champagne overflow-hidden transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg group-hover:border-champagne/60">
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={imageAlt ?? ""}
          width={96}
          height={96}
          loading="lazy"
          decoding="async"
          className="object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-110 motion-safe:animate-[float_6s_ease-in-out_infinite] mix-blend-multiply contrast-125 dark:mix-blend-screen dark:contrast-150 dark:[filter:invert(1)_sepia(0.55)_saturate(4)_hue-rotate(-8deg)_brightness(1.05)]"
        />
      ) : (
        <Icon size={40} strokeWidth={1.5} />
      )}
    </div>
  );

  const iconNode = iconHref ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <a href={iconHref} aria-label={iconTooltip ?? title} className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne">
          {iconInner}
        </a>
      </TooltipTrigger>
      {iconTooltip && <TooltipContent side="top">{iconTooltip}</TooltipContent>}
    </Tooltip>
  ) : (
    iconInner
  );

  return (
    <article
      id={id}
      className="group h-full flex flex-col p-6 sm:p-8 md:p-10 rounded-sm border border-border/60 bg-card hover:border-champagne/60 hover:shadow-[0_20px_40px_-20px_hsl(var(--champagne)/0.25)] hover:-translate-y-1 transition-[transform,border-color,box-shadow] duration-500 ease-out will-change-transform"
    >
      {/* Sekcja 1 — Nagłówek */}
      <header className="flex items-start gap-4 sm:gap-5 md:gap-6 mb-6">
        {iconNode}

        <div className="flex-1 min-w-0">
          <div className="text-xs tracking-[0.3em] uppercase text-champagne font-body mb-1">
            PAKIET {letter} — {subtitle}
          </div>
          <h3 className="font-serif text-2xl md:text-3xl text-foreground leading-tight">
            « {title} »
          </h3>
        </div>
      </header>

      {/* Sekcja 2 — Protokół */}
      <div className="mb-5 pl-0 sm:pl-[6.25rem] md:pl-[7.5rem]">
        <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-body mb-2">
          {protocolLabel}
        </p>
        <p className="font-serif text-xl text-champagne mb-3">{protocol}</p>
        <p className="text-muted-foreground font-body leading-relaxed">
          {protocolDescription}
        </p>
      </div>

      {/* Sekcja 3 — Technologie + CTA */}
      <footer className="mt-auto pt-5 pl-0 sm:pl-[6.25rem] md:pl-[7.5rem] border-t border-border/40">
        <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-body mb-2">
          {technologiesLabel}
        </p>
        <ul className="flex flex-wrap gap-2">
          {technologies.map((tech) => {
            const baseClass =
              "text-xs px-3 py-1.5 rounded-sm border border-border/60 text-foreground font-body inline-flex items-center gap-1";
            if (tech.slug) {
              return (
                <li key={tech.name}>
                  <Link
                    to="/technologie/$slug"
                    params={{ slug: tech.slug }}
                    className={`${baseClass} hover:border-champagne hover:text-champagne hover:bg-champagne/5 transition-colors duration-300`}
                  >
                    « {tech.name} »
                    <ArrowRight size={12} className="opacity-60" aria-hidden />
                  </Link>
                </li>
              );
            }
            return (
              <li key={tech.name}>
                <span className={baseClass}>« {tech.name} »</span>
              </li>
            );
          })}
        </ul>

        {(ctaTeaser || ctaLabel) && (
          <div className="mt-5">
            {ctaTeaser && (
              <p className="text-[0.7rem] tracking-[0.3em] uppercase text-champagne font-body mb-2">
                {ctaTeaser}
              </p>
            )}
            {ctaLabel && ctaHref && (
              <a
                href={ctaHref}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-champagne text-accent-foreground text-sm font-medium rounded-sm hover:bg-champagne-light transition-colors duration-500 tracking-wide"
              >
                {ctaLabel}
              </a>
            )}
          </div>
        )}
      </footer>
    </article>
  );
}
