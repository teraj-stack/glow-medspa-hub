import { Component, Suspense, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { NapBlock } from "@/components/site/NapBlock";
import { CLINIC_ADDRESS } from "@/config/clinic";

/**
 * Static fallback rendered when the dynamic NAP query fails (DB timeout,
 * PostgREST worker killed, SSR abort). Keeps the footer — and the whole
 * page — from crashing to a 522 when nap_settings is slow.
 */
function NapFallback() {
  return (
    <address className="not-italic text-sm leading-relaxed text-alabaster/80" data-testid="nap-block-fallback">
      <div className="text-xs uppercase tracking-[0.3em] text-champagne">Kontakt · NAP</div>
      <div className="mt-3 font-medium">BMClinics.ai</div>
      <div className="mt-1">
        <div>{CLINIC_ADDRESS.streetWithVenue}</div>
        <div>
          {CLINIC_ADDRESS.postalCode} {CLINIC_ADDRESS.city}, {CLINIC_ADDRESS.region}
        </div>
      </div>
    </address>
  );
}

class NapBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown) {
    console.error("[Footer] NapBlock failed, rendering static fallback:", error);
  }
  render() {
    if (this.state.hasError) return <NapFallback />;
    return this.props.children;
  }
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-ink text-alabaster">
      <div className="container-luxury grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-serif text-2xl">BMClinics.ai</div>
          <p className="mt-3 max-w-md text-sm text-alabaster/70">
            Klinika medycyny estetycznej i laserowej. Piękno nie potrzebuje hałasu, potrzebuje zrozumienia
          </p>
          <div className="mt-6">
            <NapBoundary>
              <Suspense fallback={<NapFallback />}>
                <NapBlock />
              </Suspense>
            </NapBoundary>
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-champagne">Klinika</div>
          <ul className="mt-3 space-y-2 text-sm text-alabaster/80">
            <li><Link to="/technologie">Technologie</Link></li>
            <li><Link to="/cennik">Cennik</Link></li>
            <li><Link to="/bezpieczenstwo-zabiegow-laserowych">Bezpieczeństwo laseroterapii</Link></li>
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
