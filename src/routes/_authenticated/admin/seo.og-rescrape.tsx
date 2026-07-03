import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listOgRescrapeRuns, getOgRescrapeRun } from "@/lib/og-rescrape.functions";

export const Route = createFileRoute("/_authenticated/admin/seo/og-rescrape")({
  codeSplitGroupings: [["loader", "component", "errorComponent", "notFoundComponent", "pendingComponent"]],
  component: OgRescrapePanel,
});

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("pl-PL");
}

function StatusBadge({ ok, skipped, label }: { ok: boolean; skipped?: boolean; label: string }) {
  const cls = skipped
    ? "bg-muted text-muted-foreground border-border"
    : ok
      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
      : "bg-red-500/10 text-red-500 border-red-500/30";
  const text = skipped ? "pominięto" : ok ? "OK" : "błąd";
  return (
    <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-xs ${cls}`}>
      <span className="font-medium">{label}:</span> {text}
    </span>
  );
}

function OgRescrapePanel() {
  const listFn = useServerFn(listOgRescrapeRuns);
  const getFn = useServerFn(getOgRescrapeRun);

  const runs = useQuery({
    queryKey: ["og-rescrape-runs"],
    queryFn: () => listFn({ data: { limit: 30 } }),
    staleTime: 30_000,
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "errors">("all");

  const detail = useQuery({
    queryKey: ["og-rescrape-run", selectedId],
    queryFn: () => getFn({ data: { runId: selectedId! } }),
    enabled: !!selectedId,
    staleTime: 60_000,
  });

  const rows = runs.data?.rows ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Odświeżanie kart OG / Twitter</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Historia wywołań hooka <code>/api/public/hooks/og-rescrape</code> po deployu — pinguje
          Facebook Graph API i LinkedIn Post Inspector dla każdego URL-a z sitemap, żeby
          crawlerzy pobrali nowe obrazki i opisy od razu.
        </p>
      </div>

      {runs.isError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm">
          Błąd pobierania: {(runs.error as Error).message}
        </div>
      )}

      <section className="rounded-lg border border-border">
        <div className="border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="text-sm font-medium">Ostatnie uruchomienia</div>
          <button
            className="text-xs px-2 py-1 rounded border border-border hover:bg-muted"
            onClick={() => runs.refetch()}
            disabled={runs.isFetching}
          >
            {runs.isFetching ? "Odświeżam…" : "Odśwież"}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted-foreground bg-muted/40">
              <tr>
                <th className="text-left px-3 py-2">Kiedy</th>
                <th className="text-left px-3 py-2">Wyzwolenie</th>
                <th className="text-left px-3 py-2">Commit</th>
                <th className="text-right px-3 py-2">URL-i</th>
                <th className="text-right px-3 py-2">FB OK</th>
                <th className="text-right px-3 py-2">LI OK</th>
                <th className="text-right px-3 py-2">Czas</th>
                <th className="text-right px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {runs.isLoading && (
                <tr>
                  <td colSpan={8} className="px-3 py-4 text-muted-foreground">Ładowanie…</td>
                </tr>
              )}
              {!runs.isLoading && rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3 py-4 text-muted-foreground">
                    Brak historii. Pierwszy wpis pojawi się po najbliższym deployu.
                  </td>
                </tr>
              )}
              {rows.map((r) => {
                const fbPct = r.facebook_skipped ? "—" : `${r.facebook_ok}/${r.total}`;
                const liPct = `${r.linkedin_ok}/${r.total}`;
                const isSelected = selectedId === r.id;
                return (
                  <tr key={r.id} className={isSelected ? "bg-muted/60" : ""}>
                    <td className="px-3 py-2 whitespace-nowrap">{fmtDate(r.started_at)}</td>
                    <td className="px-3 py-2">{r.triggered_by}</td>
                    <td className="px-3 py-2 font-mono text-xs">
                      {r.commit_sha ? r.commit_sha.slice(0, 7) : "—"}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">{r.total}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{fbPct}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{liPct}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                      {(r.duration_ms / 1000).toFixed(1)}s
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        className="text-xs px-2 py-1 rounded border border-border hover:bg-muted"
                        onClick={() => setSelectedId(isSelected ? null : r.id)}
                      >
                        {isSelected ? "Zwiń" : "Szczegóły"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {selectedId && (
        <section className="rounded-lg border border-border">
          <div className="border-b border-border px-4 py-3 flex items-center justify-between gap-3">
            <div className="text-sm font-medium">Wynik per URL</div>
            <div className="flex items-center gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as "all" | "errors")}
                className="text-xs px-2 py-1 rounded border border-border bg-background"
              >
                <option value="all">Wszystkie</option>
                <option value="errors">Tylko błędy</option>
              </select>
            </div>
          </div>
          {detail.isLoading && (
            <div className="px-4 py-4 text-sm text-muted-foreground">Ładowanie…</div>
          )}
          {detail.isError && (
            <div className="px-4 py-3 text-sm text-destructive">
              {(detail.error as Error).message}
            </div>
          )}
          {detail.data && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase tracking-wide text-muted-foreground bg-muted/40">
                  <tr>
                    <th className="text-left px-3 py-2">URL</th>
                    <th className="text-left px-3 py-2">Facebook</th>
                    <th className="text-left px-3 py-2">LinkedIn</th>
                    <th className="text-left px-3 py-2">Błąd</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {detail.data.results
                    .filter((r) =>
                      filter === "errors"
                        ? (!r.facebook_ok && !r.facebook_skipped) || !r.linkedin_ok
                        : true,
                    )
                    .map((r) => {
                      const err =
                        [
                          r.facebook_error ? `FB: ${r.facebook_error}` : null,
                          r.linkedin_error ? `LI: ${r.linkedin_error}` : null,
                        ]
                          .filter(Boolean)
                          .join(" · ") || "—";
                      return (
                        <tr key={r.id}>
                          <td className="px-3 py-2 max-w-md">
                            <a
                              href={r.url}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:underline break-all"
                            >
                              {r.url.replace(/^https?:\/\/[^/]+/, "") || "/"}
                            </a>
                          </td>
                          <td className="px-3 py-2">
                            <StatusBadge
                              ok={r.facebook_ok}
                              skipped={r.facebook_skipped}
                              label={
                                r.facebook_status != null ? `FB ${r.facebook_status}` : "FB"
                              }
                            />
                          </td>
                          <td className="px-3 py-2">
                            <StatusBadge
                              ok={r.linkedin_ok}
                              label={
                                r.linkedin_status != null ? `LI ${r.linkedin_status}` : "LI"
                              }
                            />
                          </td>
                          <td className="px-3 py-2 text-xs text-muted-foreground max-w-sm truncate" title={err}>
                            {err}
                          </td>
                        </tr>
                      );
                    })}
                  {detail.data.results.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-3 py-4 text-muted-foreground">
                        Brak wyników per URL dla tego wywołania.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
