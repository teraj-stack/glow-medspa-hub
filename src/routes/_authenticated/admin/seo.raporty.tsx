import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import {
  listSeoSnapshots,
  getSeoSnapshot,
  runSeoSnapshotNow,
  getSeoReportSettings,
  updateSeoReportSettings,
} from "@/lib/seo-snapshot.functions";

const searchSchema = z.object({ id: z.string().uuid().optional() });

export const Route = createFileRoute("/_authenticated/admin/seo/raporty")({
  codeSplitGroupings: [["loader", "component", "errorComponent", "notFoundComponent", "pendingComponent"]],
  validateSearch: searchSchema,
  component: SeoReportsPage,
});

function fmtDate(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pl-PL", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function fmtNum(n?: number | null) {
  return n == null ? "—" : n.toLocaleString("pl-PL");
}

function SeoReportsPage() {
  const { id } = useSearch({ from: "/_authenticated/admin/seo/raporty" });
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [notify, setNotify] = useState(false);

  const listQ = useQuery({
    queryKey: ["seo-snapshots"],
    queryFn: () => listSeoSnapshots({ data: { limit: 30 } }),
  });

  const detailQ = useQuery({
    queryKey: ["seo-snapshot", id],
    queryFn: () => getSeoSnapshot({ data: { id: id! } }),
    enabled: !!id,
  });

  const runMut = useMutation({
    mutationFn: () => runSeoSnapshotNow({ data: { notify } }),
    onSuccess: async (res) => {
      toast.success(`Migawka zapisana (${fmtNum(res.organicKeywords)} fraz)`);
      await qc.invalidateQueries({ queryKey: ["seo-snapshots"] });
      navigate({ to: "/admin/seo/raporty", search: { id: res.snapshotId } });
    },
    onError: (e: any) => toast.error(e?.message ?? "Nie udało się zapisać migawki"),
  });

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-semibold">Raporty SEO</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Codzienna migawka widoczności z Semrush (cron 06:00 Europe/Warsaw).
            Endpoint: <code>POST /api/public/hooks/seo-snapshot</code>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm flex items-center gap-2">
            <input
              type="checkbox"
              checked={notify}
              onChange={(e) => setNotify(e.target.checked)}
            />
            wyślij e-mail
          </label>
          <Button
            onClick={() => runMut.mutate()}
            disabled={runMut.isPending}
          >
            {runMut.isPending ? "Zapisywanie…" : "Uruchom migawkę teraz"}
          </Button>
        </div>
      </header>

      <NotificationSettingsCard />


      <div className="grid gap-6 md:grid-cols-[320px_1fr]">
        <aside className="border border-border rounded-md overflow-hidden">
          <div className="px-3 py-2 text-xs uppercase tracking-wide text-muted-foreground border-b border-border">
            Ostatnie migawki
          </div>
          <ul className="max-h-[560px] overflow-y-auto divide-y divide-border">
            {listQ.isLoading && <li className="p-3 text-sm text-muted-foreground">Ładowanie…</li>}
            {listQ.data?.map((s: any) => (
              <li key={s.id}>
                <button
                  onClick={() => navigate({ to: "/admin/seo/raporty", search: { id: s.id } })}
                  className={`w-full text-left p-3 text-sm hover:bg-muted transition-colors ${
                    id === s.id ? "bg-muted" : ""
                  }`}
                >
                  <div className="flex justify-between items-baseline">
                    <span className="font-medium">{fmtDate(s.captured_at)}</span>
                    <span className="text-xs text-muted-foreground">{s.triggered_by}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {s.domain} · {fmtNum(s.organic_keywords)} fraz · ruch {fmtNum(s.organic_traffic)}
                  </div>
                  {s.error && <div className="text-xs text-destructive mt-1">błąd: {s.error}</div>}
                </button>
              </li>
            ))}
            {!listQ.isLoading && !listQ.data?.length && (
              <li className="p-3 text-sm text-muted-foreground">Brak migawek — kliknij „Uruchom migawkę teraz”.</li>
            )}
          </ul>
        </aside>

        <section className="border border-border rounded-md p-4 min-h-[400px]">
          {!id && (
            <p className="text-sm text-muted-foreground">Wybierz migawkę z listy lub uruchom nową.</p>
          )}
          {id && detailQ.isLoading && <p className="text-sm text-muted-foreground">Ładowanie…</p>}
          {id && detailQ.data && (() => {
            const { snapshot, keywords, competitors, gapKeywords } = detailQ.data as any;
            if (!snapshot) return <p className="text-sm">Migawka nie znaleziona.</p>;
            return (
              <div className="space-y-5">
                <header>
                  <h3 className="text-lg font-semibold">{snapshot.domain}</h3>
                  <p className="text-xs text-muted-foreground">
                    {fmtDate(snapshot.captured_at)} · baza {snapshot.database} · źródło {snapshot.triggered_by}
                  </p>
                  {snapshot.error && (
                    <p className="mt-2 text-sm text-destructive bg-destructive/10 rounded px-3 py-2">
                      {snapshot.error}
                    </p>
                  )}
                </header>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    ["Frazy TOP100", snapshot.organic_keywords],
                    ["Ruch / mc", snapshot.organic_traffic],
                    ["Konkurentów", snapshot.competitors_count],
                    ["Luki (fraz)", snapshot.gap_keywords_count],
                  ].map(([label, val]) => (
                    <div key={label as string} className="border border-border rounded p-3">
                      <div className="text-2xl font-semibold">{fmtNum(val as number)}</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">{label}</div>
                    </div>
                  ))}
                </div>

                <section>
                  <h4 className="text-sm font-semibold mb-2">Top rankujące frazy</h4>
                  <div className="border border-border rounded overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50 text-xs uppercase tracking-wide">
                        <tr>
                          <th className="text-left p-2">Fraza</th>
                          <th className="text-right p-2">Poz.</th>
                          <th className="text-right p-2">Poprz.</th>
                          <th className="text-right p-2">Wolumen</th>
                          <th className="text-left p-2">URL</th>
                        </tr>
                      </thead>
                      <tbody>
                        {keywords.length === 0 && (
                          <tr><td colSpan={5} className="p-3 text-muted-foreground text-center">Brak fraz w bazie.</td></tr>
                        )}
                        {keywords.map((k: any) => (
                          <tr key={k.id} className="border-t border-border">
                            <td className="p-2">{k.phrase}</td>
                            <td className="p-2 text-right">{fmtNum(k.position)}</td>
                            <td className="p-2 text-right text-muted-foreground">{fmtNum(k.previous_position)}</td>
                            <td className="p-2 text-right">{fmtNum(k.search_volume)}</td>
                            <td className="p-2 truncate max-w-[280px] text-muted-foreground">{k.url}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Konkurencja</h4>
                    <ul className="border border-border rounded divide-y divide-border">
                      {competitors.map((c: any) => (
                        <li key={c.id} className="p-2 text-sm flex justify-between">
                          <span>{c.competitor_domain}</span>
                          <span className="text-muted-foreground text-xs">
                            {fmtNum(c.competitor_keywords)} fraz · wspólnych {fmtNum(c.common_keywords)}
                          </span>
                        </li>
                      ))}
                      {competitors.length === 0 && (
                        <li className="p-2 text-sm text-muted-foreground">Brak danych.</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Luki słów kluczowych</h4>
                    <ul className="border border-border rounded divide-y divide-border max-h-[260px] overflow-y-auto">
                      {gapKeywords.map((g: any) => (
                        <li key={g.id} className="p-2 text-sm flex justify-between gap-2">
                          <span className="truncate">{g.phrase}</span>
                          <span className="text-muted-foreground text-xs whitespace-nowrap">
                            #{fmtNum(g.competitor_position)} · {fmtNum(g.search_volume)}/mc
                          </span>
                        </li>
                      ))}
                      {gapKeywords.length === 0 && (
                        <li className="p-2 text-sm text-muted-foreground">Brak zidentyfikowanych luk.</li>
                      )}
                    </ul>
                  </div>
                </section>
              </div>
            );
          })()}
        </section>
      </div>
    </div>
  );
}

function NotificationSettingsCard() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["seo-report-settings"],
    queryFn: () => getSeoReportSettings({}),
  });

  const [emailsText, setEmailsText] = useState<string>("");
  const [enabled, setEnabled] = useState(true);
  const [fallback, setFallback] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  if (q.data && !hydrated) {
    setEmailsText((q.data.notification_emails ?? []).join(", "));
    setEnabled(!!q.data.enabled);
    setFallback(q.data.fallback_to_admins !== false);
    setHydrated(true);
  }

  const saveMut = useMutation({
    mutationFn: () => {
      const emails = emailsText
        .split(/[,\n;\s]+/)
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
      const invalid = emails.filter((e) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
      if (invalid.length) {
        throw new Error(`Nieprawidłowe adresy: ${invalid.join(", ")}`);
      }
      return updateSeoReportSettings({
        data: {
          enabled,
          channel: "email",
          notificationEmails: emails,
          fallbackToAdmins: fallback,
        },
      });
    },
    onSuccess: async () => {
      toast.success("Zapisano ustawienia powiadomień");
      await qc.invalidateQueries({ queryKey: ["seo-report-settings"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Nie udało się zapisać"),
  });

  const configuredCount = emailsText
    .split(/[,\n;\s]+/)
    .map((s) => s.trim())
    .filter(Boolean).length;

  return (
    <section className="border border-border rounded-md p-4 space-y-4">
      <header className="flex items-baseline justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide">Powiadomienia</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Kanał i lista odbiorców dziennego raportu SEO. Zapisane adresy nadpisują
            domyślną wysyłkę do wszystkich administratorów.
          </p>
        </div>
        <span className="text-xs text-muted-foreground">
          {q.data?.updated_at
            ? `zaktualizowano ${new Date(q.data.updated_at).toLocaleString("pl-PL")}`
            : ""}
        </span>
      </header>

      <div className="grid gap-4 md:grid-cols-[160px_1fr]">
        <label className="text-sm">
          Kanał
          <select
            disabled
            value="email"
            className="mt-1 block w-full border border-border rounded px-2 py-1.5 bg-muted text-sm"
          >
            <option value="email">E-mail</option>
          </select>
          <span className="block text-[11px] text-muted-foreground mt-1">
            Inne kanały (Slack, webhook) — wkrótce.
          </span>
        </label>

        <label className="text-sm">
          Adresy e-mail odbiorców
          <textarea
            value={emailsText}
            onChange={(e) => setEmailsText(e.target.value)}
            placeholder="np. seo@bmclinics.ai, marketing@bmclinics.ai"
            rows={2}
            className="mt-1 block w-full border border-border rounded px-3 py-2 bg-background text-sm font-mono"
          />
          <span className="block text-[11px] text-muted-foreground mt-1">
            Oddziel przecinkami lub nowymi liniami. {configuredCount > 0
              ? `${configuredCount} adres(-y).`
              : "Brak — użyta zostanie lista adminów."}
          </span>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
          Wysyłaj codzienne raporty
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={fallback}
            onChange={(e) => setFallback(e.target.checked)}
          />
          Jeśli lista jest pusta, wyślij do wszystkich adminów/managerów
        </label>
        <div className="ml-auto">
          <Button
            onClick={() => saveMut.mutate()}
            disabled={saveMut.isPending || !hydrated}
            size="sm"
          >
            {saveMut.isPending ? "Zapisywanie…" : "Zapisz ustawienia"}
          </Button>
        </div>
      </div>
    </section>
  );
}
