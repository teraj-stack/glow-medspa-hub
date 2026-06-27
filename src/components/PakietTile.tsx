import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type PakietTileProps = {
  nr: string;
  tagline: string;
  title: string;
  icon: string;
  bullets: { title?: string; text?: string; boldParts?: string[] }[];
  technologies?: string[];
  protocol?: { label: string; href: string };
  iconHref?: string;
  iconTooltip?: string;
  id?: string;
  topIcons?: { src: string; alt: string }[];
};


function renderBoldParts(text: string, boldParts?: string[]) {
  if (!boldParts || boldParts.length === 0) return <span>{text}</span>;
  const re = new RegExp(`(${boldParts.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join("|")})`, "g");
  return text.split(re).map((part, i) =>
    boldParts.includes(part) ? (
      <strong key={i} className="font-semibold text-foreground">
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export default function PakietTile({
  nr,
  tagline,
  title,
  icon,
  bullets,
  technologies,
  protocol,
  iconHref,
  iconTooltip,
  id,
}: PakietTileProps) {
  const iconCircle = (
    <div
      className="flex h-[84px] w-[84px] shrink-0 items-center justify-center rounded-full border transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg"
      style={{
        background: "color-mix(in oklab, var(--champagne) 10%, transparent)",
        borderColor: "color-mix(in oklab, var(--champagne) 30%, transparent)",
      }}
    >
      <img
        src={icon}
        alt=""
        loading="lazy"
        className="h-full w-full object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-110 motion-safe:animate-[float_6s_ease-in-out_infinite]"
      />
    </div>
  );

  const iconNode = iconHref ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={iconHref}
          aria-label={iconTooltip ?? title}
          className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
        >
          {iconCircle}
        </a>
      </TooltipTrigger>
      {iconTooltip && <TooltipContent side="top">{iconTooltip}</TooltipContent>}
    </Tooltip>
  ) : (
    <div aria-hidden="true">{iconCircle}</div>
  );

  return (
    <article id={id} className="group relative flex h-full flex-col rounded-sm bg-card p-6 transition-all duration-700 ease-out hover:-translate-y-1 hover:shadow-lg md:p-8">
      {/* Numer w rogu */}
      <div className="absolute right-6 top-6 text-xs uppercase tracking-[0.3em] text-champagne md:right-8 md:top-8">
        {nr}
      </div>

      {/* Awatar + tagline */}
      <div className="flex items-center gap-4">
        {iconNode}
        <span className="text-xs uppercase tracking-[0.3em] text-champagne">
          {tagline}
        </span>
      </div>

      {/* Tytuł */}
      <h2 className="mt-7 font-serif text-2xl text-foreground md:text-3xl">
        {title}
      </h2>

      {/* Separator */}
      <div className="mt-3 h-px w-10 bg-foreground/20" />

      {/* Bullety */}
      <ul className="mt-4 space-y-2 font-sans text-sm leading-relaxed text-muted-foreground">
        {bullets.map((b, bi) => (
          <li key={bi} className="flex gap-2">
            <span className="mt-1.5 shrink-0 text-champagne" aria-hidden="true">
              •
            </span>
            <span className="whitespace-pre-line">
              {b.title && (
                <strong className="font-semibold text-foreground">{b.title}</strong>
              )}
              {b.title && b.text && " —\u00a0"}
              {b.text && renderBoldParts(b.text, b.boldParts)}
            </span>
          </li>
        ))}
      </ul>

      {/* Stopka — przyciski technologii */}
      {technologies && technologies.length > 0 && (
        <footer className="mt-auto pt-5 border-t border-border/40">
          <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-body mb-2">
            Technologia
          </p>
          <ul className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <li key={tech}>
                <span className="text-xs px-3 py-1.5 rounded-sm border border-border/60 text-foreground font-body inline-flex items-center gap-1 hover:border-champagne hover:text-champagne hover:bg-champagne/5 transition-colors duration-300">
                  {tech}
                  <ArrowRight size={12} className="opacity-60" aria-hidden />
                </span>
              </li>
            ))}
          </ul>

          {protocol && (
            <div className="mt-4">
              <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-body mb-2">
                Protokół zabiegowy
              </p>
              <Link
                to={protocol.href}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-sm border border-champagne/40 bg-champagne/5 text-champagne font-body hover:bg-champagne/10 hover:border-champagne/60 transition-colors duration-300"
              >
                {protocol.label}
                <ArrowRight size={12} className="opacity-60" aria-hidden />
              </Link>
            </div>
          )}
        </footer>
      )}
    </article>
  );
}
