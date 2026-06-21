import { ArrowRight } from "lucide-react";

export type PakietCardProps = {
  subtitle: string;
  title: string;
  protocol: string;
  protocolDescription: string;
  technologies: string[];
};

export default function PakietCard({
  subtitle,
  title,
  protocol,
  protocolDescription,
  technologies,
}: PakietCardProps) {
  return (
    <article className="group h-full flex flex-col p-6 sm:p-8 md:p-10 rounded-sm border border-border/60 bg-card hover:border-champagne/60 hover:shadow-[0_20px_40px_-20px_hsl(var(--champagne)/0.25)] hover:-translate-y-1 transition-[transform,border-color,box-shadow] duration-500 ease-out will-change-transform">
      {/* Header */}
      <header className="mb-5 sm:mb-6 md:mb-7">
        <div className="min-w-0">
          <p className="text-xs tracking-[0.3em] uppercase text-champagne font-body mb-1">
            {subtitle}
          </p>
          <h3 className="font-serif text-2xl md:text-3xl text-foreground leading-tight">
            {title}
          </h3>
        </div>
      </header>

      {/* Middle */}
      <div className="mb-5 pl-0 sm:pl-[6.25rem] md:pl-[7.5rem]">
        <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-body mb-2">
          Twój protokół
        </p>
        <p className="font-serif text-xl text-champagne mb-3">{protocol}</p>
        <p className="text-muted-foreground font-body leading-relaxed">
          {protocolDescription}
        </p>
      </div>

      {/* Footer */}
      <footer className="mt-auto pt-5 pl-0 sm:pl-[6.25rem] md:pl-[7.5rem] border-t border-border/40">
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
    </article>
  );
}
