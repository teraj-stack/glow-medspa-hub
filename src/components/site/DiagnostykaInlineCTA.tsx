import { Link } from "@tanstack/react-router";
import { ScanFace } from "lucide-react";

interface Props {
  variant?: "blog" | "safety";
  className?: string;
}

/**
 * Kontekstowy link do /diagnostyka-skory-warszawa.
 * Używany w artykułach bloga i na /bezpieczenstwo w celu budowy siatki linków wewnętrznych.
 */
export function DiagnostykaInlineCTA({ variant = "blog", className = "" }: Props) {
  const copy =
    variant === "safety"
      ? {
          eyebrow: "Zacznij od diagnostyki",
          title: "Kwalifikacja do zabiegu zaczyna się od badania skóry",
          text: "Zanim wybierzesz technologię, warto zobaczyć, co dzieje się w Twojej skórze. Analiza skóry twarzy w Warszawie (Klinika Ginekologii) trwa 45–60 minut i kończy się spersonalizowanym planem — bezpiecznym i wolnym od zgadywania.",
        }
      : {
          eyebrow: "Powiązane",
          title: "Zobacz stan swojej skóry, zanim wybierzesz zabieg",
          text: "Analiza skóry twarzy i badanie skóry pozwalają obiektywnie ocenić przebarwienia, nawilżenie, naczynia i głębokość zmarszczek. To najlepszy punkt startu dla tematu opisanego w artykule.",
        };

  return (
    <aside
      className={`my-10 rounded-lg border border-champagne/40 bg-card p-6 shadow-soft md:p-8 ${className}`}
      aria-label="Diagnostyka skóry w Warszawie"
    >
      <div className="flex items-start gap-4">
        <ScanFace className="mt-1 size-6 shrink-0 text-champagne" aria-hidden />
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-champagne">{copy.eyebrow}</div>
          <h3 className="mt-2 font-serif text-xl text-ink md:text-2xl">{copy.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">{copy.text}</p>
          <div className="mt-4">
            <Link
              to="/diagnostyka-skory-warszawa"
              className="inline-flex h-10 items-center justify-center rounded-md bg-ink px-5 text-sm tracking-wide text-alabaster transition hover:bg-ink/90"
            >
              Diagnostyka skóry Warszawa →
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
