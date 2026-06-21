import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-ink text-alabaster">
      <div className="container-luxury grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-serif text-2xl">
            BMClinics.ai
          </div>
          <p className="mt-3 max-w-md text-sm text-alabaster/70">
            Klinika medycyny estetycznej i laserowej. Naturalny efekt.&nbsp;
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-champagne">Klinika</div>
          <ul className="mt-3 space-y-2 text-sm text-alabaster/80">
            <li><Link to="/technologie">Technologie</Link></li>
            <li><Link to="/cennik">Cennik</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-champagne">Informacje</div>
          <ul className="mt-3 space-y-2 text-sm text-alabaster/80">
            <li><Link to="/polityka-prywatnosci">Polityka prywatności</Link></li>
            <li><Link to="/regulamin">Regulamin</Link></li>
            <li><Link to="/auth">Konto pacjenta</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-luxury flex flex-col items-start justify-between gap-2 py-5 text-xs text-alabaster/50 md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} BMClinics.ai</div>
          <div>Wykonano z dbałością o detal by Jan Bujok.</div>
        </div>
      </div>
    </footer>
  );
}
