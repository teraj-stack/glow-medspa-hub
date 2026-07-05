import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getEmailOverview } from "@/lib/email-admin.functions";

export const Route = createFileRoute("/_authenticated/admin/panel")({
  head: () => ({ meta: [{ title: "Panel administracyjny — wszystkie funkcje" }, { name: "robots", content: "noindex" }] }),
  component: PanelPage,
});

const emailQuery = {
  queryKey: ["admin-email-overview"],
  queryFn: () => getEmailOverview(),
  staleTime: 30_000,
};

function Section({ id, title, description, children }: { id: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 space-y-4">
      <div className="border-b border-border pb-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {children}
    </section>
  );
}

function StatCard({ label, value, tone }: { label: string; value: number | string; tone?: "ok" | "warn" | "err" | "muted" }) {
  const color =
    tone === "ok" ? "text-emerald-500" :
    tone === "warn" ? "text-amber-500" :
    tone === "err" ? "text-rose-500" :
    "text-foreground";
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`text-2xl font-semibold mt-1 ${color}`}>{value}</div>
    </div>
  );
}

function EmailSection() {
  const { data } = useSuspenseQuery(emailQuery);
  return (
    <Section
      id="email"
      title="Obsługa poczty"
      description="Statystyki wysyłek z ostatnich 7 dni (deduplikacja po message_id). Dane z email_send_log."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Łącznie" value={data.total} />
        <StatCard label="Wysłane" value={data.sent} tone="ok" />
        <StatCard label="Nieudane / DLQ" value={data.failed} tone="err" />
        <StatCard label="Zablokowane" value={data.suppressed} tone="warn" />
        <StatCard label="W kolejce" value={data.pending} tone="muted" />
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
          <h3 className="text-sm font-medium">Ostatnie wysyłki</h3>
          <span className="text-xs text-muted-foreground">Suppresowane adresy: {data.suppressedCount}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/20 text-muted-foreground">
              <tr>
                <th className="text-left px-3 py-2 font-normal">Kiedy</th>
                <th className="text-left px-3 py-2 font-normal">Szablon</th>
                <th className="text-left px-3 py-2 font-normal">Odbiorca</th>
                <th className="text-left px-3 py-2 font-normal">Status</th>
                <th className="text-left px-3 py-2 font-normal">Błąd</th>
              </tr>
            </thead>
            <tbody>
              {data.recent.length === 0 && (
                <tr><td colSpan={5} className="px-3 py-6 text-center text-muted-foreground">Brak wysyłek w ostatnich 7 dniach.</td></tr>
              )}
              {data.recent.map((r, i) => (
                <tr key={r.message_id ?? i} className="border-t border-border">
                  <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">
                    {r.created_at ? new Date(r.created_at).toLocaleString("pl-PL") : "—"}
                  </td>
                  <td className="px-3 py-2">{r.template_name ?? "—"}</td>
                  <td className="px-3 py-2">{r.recipient_email ?? "—"}</td>
                  <td className="px-3 py-2">
                    <span className={
                      r.status === "sent" ? "text-emerald-500" :
                      r.status === "suppressed" ? "text-amber-500" :
                      r.status === "pending" ? "text-muted-foreground" :
                      "text-rose-500"
                    }>{r.status ?? "—"}</span>
                  </td>
                  <td className="px-3 py-2 text-xs text-muted-foreground max-w-[24rem] truncate">{r.error_message ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}

type CardLink = { to: string; title: string; description: string };

const groups: Array<{ id: string; title: string; description: string; links: CardLink[] }> = [
  {
    id: "operacje",
    title: "Operacje kliniki",
    description: "Codzienna obsługa pacjentów, zespołu i cennika.",
    links: [
      { to: "/admin/rezerwacje", title: "Rezerwacje", description: "Wizyty, potwierdzenia i anulacje." },
      { to: "/admin/lekarze", title: "Lekarze", description: "Zespół, grafiki i integracja kalendarza." },
      { to: "/admin/cennik", title: "Cennik", description: "Widoczność pozycji cennika." },
      { to: "/admin/nap", title: "NAP i cytowania", description: "Dane firmy dla katalogów lokalnych." },
    ],
  },
  {
    id: "seo",
    title: "SEO i widoczność",
    description: "Monitoring pozycji, indeksacji i słów kluczowych.",
    links: [
      { to: "/admin/seo", title: "SEO — przegląd", description: "Panel główny SEO." },
      { to: "/admin/seo/raporty", title: "Raporty SEO", description: "Dzienne raporty widoczności." },
      { to: "/admin/seo/indeksacja", title: "Indeksacja", description: "Status indeksacji w Google." },
      { to: "/admin/seo/keywords", title: "Słowa kluczowe", description: "Analiza fraz i konkurencji." },
      { to: "/admin/seo/og-rescrape", title: "OG re-scrape", description: "Odświeżanie podglądów social." },
    ],
  },
  {
    id: "wydajnosc",
    title: "Wydajność i infrastruktura",
    description: "Core Web Vitals i status DNS.",
    links: [
      { to: "/admin/web-vitals", title: "Web Vitals", description: "LCP, INP, CLS w czasie." },
      { to: "/admin/dns", title: "Status DNS", description: "MX, SPF, DKIM, DMARC i notify.*." },
    ],
  },
  {
    id: "bezpieczenstwo",
    title: "Użytkownicy i bezpieczeństwo",
    description: "Konta, role i audyt akcji.",
    links: [
      { to: "/admin/uzytkownicy", title: "Użytkownicy", description: "Konta i przydzielanie ról." },
      { to: "/admin/audyt", title: "Audyt", description: "Logi akcji admina, auth i webhooków." },
    ],
  },
];

function PanelPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold">Panel administracyjny</h2>
        <p className="text-sm text-muted-foreground">
          Wszystkie funkcje w jednym miejscu. Szybkie przejścia do szczegółowych ekranów.
        </p>
        <nav className="flex flex-wrap gap-2 pt-2">
          {[{ id: "email", label: "Poczta" }, ...groups.map((g) => ({ id: g.id, label: g.title }))].map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="text-xs px-3 py-1 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
            >
              {s.label}
            </a>
          ))}
        </nav>
      </header>

      <EmailSection />

      {groups.map((g) => (
        <Section key={g.id} id={g.id} title={g.title} description={g.description}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {g.links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="block rounded-lg border border-border p-4 hover:border-primary transition-colors"
              >
                <h3 className="font-medium">{l.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{l.description}</p>
              </Link>
            ))}
          </div>
        </Section>
      ))}
    </div>
  );
}
