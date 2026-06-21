import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const NAV = [
  { to: "/technologie", label: "Technologie" },
  { to: "/potrzeby", label: "Potrzeby" },
  { to: "/cennik", label: "Cennik" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="container-luxury flex h-16 items-center justify-between md:h-20">
        <Link to="/" className="flex items-baseline gap-2 font-serif text-xl tracking-wide text-ink">
          <span>Beauty</span>
          <span className="text-champagne">&amp;</span>
          <span>Mind</span>
          <span className="ml-1 text-xs uppercase tracking-[0.3em] text-muted-foreground">Clinic</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm tracking-wide text-foreground/80 transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/"
            hash="rezerwacja"
            className="inline-flex h-10 items-center justify-center rounded-md bg-ink px-5 text-sm tracking-wide text-alabaster transition hover:bg-ink/90"
          >
            Umów wizytę
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border md:hidden"
          aria-label="Menu"
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border md:hidden">
          <div className="container-luxury flex flex-col gap-1 py-4">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-3 text-base text-foreground/90 hover:bg-secondary"
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/"
              hash="rezerwacja"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex h-11 items-center justify-center rounded-md bg-ink px-5 text-sm tracking-wide text-alabaster"
            >
              Umów wizytę
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
