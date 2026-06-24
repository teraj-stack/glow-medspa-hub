import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logoLightMode from "@/assets/bujok-medical-logo-dark.jpg.asset.json";
import logoDarkMode from "@/assets/bujok-medical-logo.png.asset.json";



const NAV = [
  { to: "/potrzeby", label: "Potrzeby" },
  { to: "/rozwiazania", label: "Rozwiązania" },
  { to: "/technologie", label: "Technologie" },
  { to: "/lekarze", label: "Lekarze" },
  { to: "/cennik", label: "Cennik" },
  { to: "/bezpieczenstwo-zabiegow-laserowych", label: "Bezpieczeństwo" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="container-luxury flex h-16 items-center justify-between md:h-20">
        <Link to="/" aria-label="BM Clinics — strona główna" className="flex items-center">
          <picture>
            <source srcSet={logoDarkMode.url} media="(prefers-color-scheme: dark)" />
            <img
              src={logoLightMode.url}
              alt="Bujok Medical"
              className="h-12 w-auto drop-shadow-sm md:h-16"
              width={160}
              height={160}
              decoding="async"
            />
          </picture>
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
            to="/konsultacja"
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
              to="/konsultacja"
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
