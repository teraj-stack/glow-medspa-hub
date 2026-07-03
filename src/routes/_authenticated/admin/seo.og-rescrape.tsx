import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  listOgRescrapeRuns,
  getOgRescrapeRun,
  startOgRescrape,
  listSitemapPaths,
} from "@/lib/og-rescrape.functions";

export const Route = createFileRoute("/_authenticated/admin/seo/og-rescrape")({
  codeSplitGroupings: [["loader", "component", "errorComponent", "notFoundComponent", "pendingComponent"]],
  component: OgRescrapePanel,
});

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("pl-PL");
}

function StatusBadge({
  status,
  ok,
  skipped,
  label,
}: {
  status?: string;
  ok?: boolean;
  skipped?: boolean;
  label: string;
}) {
  let cls = "bg-muted text-muted-foreground border-border";
  let text = "—";
  if (status === "pending") {
    cls = "bg-amber-500/10 text-amber-500 border-amber-500/30";
    text = "oczekuje";
  } else if (skipped) {
    text = "pominięto";
  } else if (ok) {
    cls = "bg-emerald-500/10 text-emerald-500 border-emerald-500/30";
    text = "OK";
  } else {
    cls = "bg-red-500/10 text-red-500 border-red-500/30";
    text = "błąd";
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-xs ${cls}`}>
      <span className="font-medium">{label}:</span> {text}
    </span>
  );
}

function RunStatePill({ status }: { status: string }) {
  const map: Record<string, string> = {
    running: "bg-blue-500/10 text-blue-500 border-blue-500/30",
    done: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
    error: "bg-red-500/10 text-red-500 border-red-500/30",
  };
  const label: Record<string, string> = {
    running: "w toku",
    done: "zakończone",
    error: "błąd",
  };
  const cls = map[status] ?? "bg-muted text-muted-foreground border-border";
  return (
    <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-xs ${cls}`}>
      {status === "running" && (
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
      )}
      {label[status] ?? status}
    </span>
  );
}

function OgRescrapePanel() {
  const listFn = useServerFn(listOgRescrapeRuns);
  const getFn = useServerFn(getOgRescrapeRun);

  const runs = useQuery({
    queryKey: ["og-rescrape-runs"],
    queryFn: () => listFn({ data: { limit: 30 } }),
    staleTime: 5_000,
    refetchInterval: (q) => {
      const anyRunning = q.state.data?.rows?.some((r) => r.status === "running");
      return anyRunning ? 3_000 : false;
    },
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "done" | "errors">("all");

  const detail = useQuery({
    queryKey: ["og-rescrape-run", selectedId],
    queryFn: () => getFn({ data: { runId: selectedId! } }),
    enabled: !!selectedId,
    staleTime: 2_000,
    refetchInterval: (q) => (q.state.data?.run?.status === "running" ? 2_000 : false),
  });

  const rows = runs.data?.rows ?? [];

  const detailStats = useMemo(() => {
    const results = detail.data?.results ?? [];
    const pending = results.filter((r) => r.status === "pending").length;
    const errored = results.filter((r) => r.status === "error").length;
    const done = results.filter((r) => r.status === "done").length;
    return { pending, errored, done, total: results.length };
  }, [detail.data]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Odświeżanie kart OG / Twitter</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Historia wywołań hooka <code>/api/public/hooks/og-rescrape</code> po deployu — pinguje
          Facebook Graph API i LinkedIn Post Inspector dla każdego URL-a z sitemap, żeby
          crawlerzy pobrali nowe obrazki i opisy od razu. Postęp aktualizuje się na żywo.
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
                <th className="text-left px-3 py-2">Status</th>
                <th className="text-left px-3 py-2">Wyzwolenie</th>
                <th className="text-left px-3 py-2">Commit</th>
                <th className="text-left px-3 py-2 min-w-[180px]">Postęp</th>
                <th className="text-right px-3 py-2">FB OK</th>
                <th className="text-right px-3 py-2">LI OK</th>
                <th className="text-right px-3 py-2">Czas</th>
                <th className="text-right px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {runs.isLoading && (
                <tr>
                  <td colSpan={9} className="px-3 py-4 text-muted-foreground">Ładowanie…</td>
                </tr>
              )}
              {!runs.isLoading && rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-3 py-4 text-muted-foreground">
                    Brak historii. Pierwszy wpis pojawi się po najbliższym deployu.
                  </td>
                </tr>
              )}
              {rows.map((r) => {
                const fbPct = r.facebook_skipped ? "—" : `${r.facebook_ok}/${r.total}`;
                const liPct = `${r.linkedin_ok}/${r.total}`;
                const isSelected = selectedId === r.id;
                const pct = r.total > 0 ? Math.round((r.processed / r.total) * 100) : 0;
                const isRunning = r.status === "running";
                return (
                  <tr key={r.id} className={isSelected ? "bg-muted/60" : ""}>
                    <td className="px-3 py-2 whitespace-nowrap">{fmtDate(r.started_at)}</td>
                    <td className="px-3 py-2"><RunStatePill status={r.status} /></td>
                    <td className="px-3 py-2">{r.triggered_by}</td>
                    <td className="px-3 py-2 font-mono text-xs">
                      {r.commit_sha ? r.commit_sha.slice(0, 7) : "—"}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 rounded bg-muted overflow-hidden min-w-[80px]">
                          <div
                            className={`h-full ${isRunning ? "bg-blue-500" : "bg-emerald-500"} transition-all`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="tabular-nums text-xs text-muted-foreground whitespace-nowrap">
                          {r.processed}/{r.total}
                        </span>
                      </div>
                    </td>
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
          <div className="border-b border-border px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="text-sm font-medium">Wynik per URL</div>
              {detail.data?.run && <RunStatePill status={detail.data.run.status} />}
              {detail.data?.run?.status === "running" && (
                <span className="text-xs text-muted-foreground">
                  auto-odświeżanie co 2 s
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-3 text-xs text-muted-foreground">
                <span>
                  <span className="text-amber-500 font-medium">{detailStats.pending}</span> oczekuje
                </span>
                <span>
                  <span className="text-emerald-500 font-medium">{detailStats.done}</span> gotowe
                </span>
                <span>
                  <span className="text-red-500 font-medium">{detailStats.errored}</span> błąd
                </span>
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as typeof filter)}
                className="text-xs px-2 py-1 rounded border border-border bg-background"
              >
                <option value="all">Wszystkie</option>
                <option value="pending">Tylko oczekujące</option>
                <option value="done">Tylko gotowe</option>
                <option value="errors">Tylko błędy</option>
              </select>
            </div>
          </div>

          {detail.data?.run && detail.data.run.total > 0 && (
            <div className="px-4 py-3 border-b border-border">
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-1">
                <span>
                  Postęp: <span className="text-foreground font-medium tabular-nums">{detail.data.run.processed}/{detail.data.run.total}</span>
                </span>
                {detail.data.run.last_progress_at && (
                  <span>· ostatnia aktualizacja {fmtDate(detail.data.run.last_progress_at)}</span>
                )}
              </div>
              <div className="h-2 rounded bg-muted overflow-hidden">
                <div
                  className={`h-full ${detail.data.run.status === "running" ? "bg-blue-500" : "bg-emerald-500"} transition-all`}
                  style={{ width: `${Math.round((detail.data.run.processed / detail.data.run.total) * 100)}%` }}
                />
              </div>
            </div>
          )}

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
                    <th className="text-left px-3 py-2">Status</th>
                    <th className="text-left px-3 py-2">Facebook</th>
                    <th className="text-left px-3 py-2">LinkedIn</th>
                    <th className="text-left px-3 py-2">Zakończono</th>
                    <th className="text-left px-3 py-2">Błąd</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {detail.data.results
                    .slice()
                    .sort((a, b) => {
                      // Pending first when running, so user sees "co jeszcze zostało"
                      const rank = (s: string) => (s === "pending" ? 0 : s === "error" ? 1 : 2);
                      return rank(a.status) - rank(b.status);
                    })
                    .filter((r) => {
                      if (filter === "pending") return r.status === "pending";
                      if (filter === "done") return r.status === "done";
                      if (filter === "errors") return r.status === "error";
                      return true;
                    })
                    .map((r) => {
                      const err =
                        [
                          r.facebook_error ? `FB: ${r.facebook_error}` : null,
                          r.linkedin_error ? `LI: ${r.linkedin_error}` : null,
                        ]
                          .filter(Boolean)
                          .join(" · ") || "—";
                      return (
                        <tr
                          key={r.id}
                          className={r.status === "pending" ? "bg-amber-500/5" : ""}
                        >
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
                            <RunStatePill
                              status={
                                r.status === "pending"
                                  ? "running"
                                  : r.status === "error"
                                    ? "error"
                                    : "done"
                              }
                            />
                          </td>
                          <td className="px-3 py-2">
                            <StatusBadge
                              status={r.status === "pending" ? "pending" : undefined}
                              ok={r.facebook_ok}
                              skipped={r.facebook_skipped}
                              label={r.facebook_status != null ? `FB ${r.facebook_status}` : "FB"}
                            />
                          </td>
                          <td className="px-3 py-2">
                            <StatusBadge
                              status={r.status === "pending" ? "pending" : undefined}
                              ok={r.linkedin_ok}
                              label={r.linkedin_status != null ? `LI ${r.linkedin_status}` : "LI"}
                            />
                          </td>
                          <td className="px-3 py-2 text-xs text-muted-foreground whitespace-nowrap">
                            {r.processed_at ? fmtDate(r.processed_at) : "—"}
                          </td>
                          <td
                            className="px-3 py-2 text-xs text-muted-foreground max-w-sm truncate"
                            title={err}
                          >
                            {err}
                          </td>
                        </tr>
                      );
                    })}
                  {detail.data.results.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-3 py-4 text-muted-foreground">
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
