import { ArrowRight } from "lucide-react";

export type PakietTileProps = {
  nr: string;
  tagline: string;
  title: string;
  icon: string;
  bullets: { title?: string; text: string }[];
  technologies?: string[];
};

const HIGHLIGHTS = [
  "z wiekiem",
  "owal twarzy",
  "wieku",
  "plam starczych",
  "redukcja blizn i rozstępów",
  "Dłonie",
];

function renderText(text: string) {
  const re = new RegExp(`(${HIGHLIGHTS.join("|")})`, "g");
  return text.split(re).map((part, i) =>
    HIGHLIGHTS.includes(part) ? (
      <strong key={i} className="font-medium text-foreground">
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
}: PakietTileProps) {
  return (
    <article className="group relative flex h-full flex-col rounded-sm bg-background p-6 transition-all duration-700 ease-out hover:bg-secondary/40 md:p-8">
      {/* Numer w rogu */}
      <div className="absolute right-6 top-6 text-xs uppercase tracking-[0.3em] text-champagne md:right-8 md:top-8">
        {nr}
      </div>

      {/* Awatar + tagline */}
      <div className="flex items-center gap-4">
        <div
          className="flex h-[84px] w-[84px] shrink-0 items-center justify-center rounded-full border transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg"
          style={{
            background: "color-mix(in oklab, var(--champagne) 10%, transparent)",
            borderColor: "color-mix(in oklab, var(--champagne) 30%, transparent)",
          }}
          aria-hidden="true"
        >
          <img
            src={icon}
            alt=""
            loading="lazy"
            className="h-full w-full object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-110"
          />
        </div>
        <span className="text-xs uppercase tracking-[0.3em] text-champagne">
          {tagline}
        </span>
      </div>

      {/* Tytuł + linia */}
      <h2 className="gold-line mt-7 font-serif text-2xl text-foreground md:text-3xl">
        {title}
      </h2>

      {/* Bullety */}
      <ul className="mt-4 space-y-2 font-sans text-sm leading-relaxed text-muted-foreground">
        {bullets.map((b, bi) => (
          <li key={bi} className="flex gap-2">
            <span
              className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-champagne"
              aria-hidden="true"
            />
            <span className="whitespace-pre-line">
              {b.title && (
                <strong className="font-medium text-foreground">{b.title}</strong>
              )}
              {b.title && b.text && " —\u00a0"}
              {renderText(b.text)}
            </span>
          </li>
        ))}
      </ul>

      {/* Stopka — przyciski technologii (identyczne jak w PakietCard) */}
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
        </footer>
      )}
    </article>
  );
}
