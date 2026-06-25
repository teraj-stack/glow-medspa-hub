import { createFileRoute, useRouter, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  listAuditLog,
  listSuspiciousActivity,
  exportAuditLogCsv,
  exportSuspiciousCsv,
  checkAuditAccess,
  type AuditLogRow,
  type SuspiciousRow,
} from "@/lib/audit.functions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/admin/audyt")({
  beforeLoad: async () => {
    try {
      const { hasAccess } = await checkAuditAccess();
      if (!hasAccess) throw redirect({ to: "/admin" });
    } catch (e: any) {
      if (e?.isRedirect) throw e;
      throw redirect({ to: "/admin" });
    }
  },
  component: AuditPage,
  errorComponent: ({ error }) => (
    <div className="p-8 text-destructive">{(error as Error).message}</div>
  ),
});

function sevColor(s: string) {
  if (s === "critical") return "bg-destructive text-destructive-foreground";
  if (s === "warning") return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300";
  return "bg-muted text-muted-foreground";
}

function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function AuditPage() {
  const router = useRouter();
  const list = useServerFn(listAuditLog);
  const susp = useServerFn(listSuspiciousActivity);
  const exportLog = useServerFn(exportAuditLogCsv);
  const exportSusp = useServerFn(exportSuspiciousCsv);

  const [eventType, setEventType] = useState<string>("all");
  const [severity, setSeverity] = useState<string>("all");
  const [success, setSuccess] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [searchActive, setSearchActive] = useState<string>("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [exporting, setExporting] = useState(false);

  const filterPayload = {
    ...(eventType !== "all" ? { eventType } : {}),
    ...(severity !== "all" ? { severity: severity as "info" | "warning" | "critical" } : {}),
    ...(success !== "all" ? { success: success as "ok" | "fail" } : {}),
    ...(searchActive ? { search: searchActive } : {}),
  };

  const logsQ = useQuery({
    queryKey: ["audit", "log", filterPayload, page, pageSize],
    queryFn: () => list({ data: { ...filterPayload, page, pageSize } }),
  });

  const suspQ = useQuery({
    queryKey: ["audit", "suspicious"],
    queryFn: () => susp({}),
  });

  const total = logsQ.data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / pageSize));

  function resetPageAnd(fn: () => void) {
    setPage(1);
    fn();
  }

  async function handleExportLog() {
    setExporting(true);
    try {
      const csv = await exportLog({ data: filterPayload });
      downloadCsv(`audit-log-${new Date().toISOString().slice(0, 10)}.csv`, csv);
    } finally {
      setExporting(false);
    }
  }

  async function handleExportSusp() {
    setExporting(true);
    try {
      const csv = await exportSusp({});
      downloadCsv(`suspicious-${new Date().toISOString().slice(0, 10)}.csv`, csv);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Audyt bezpieczeństwa</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Akcje admina, dostęp publiczny, zdarzenia auth i webhooki. Retencja 90 dni.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            router.invalidate();
            logsQ.refetch();
            suspQ.refetch();
          }}
        >
          Odśwież
        </Button>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Podejrzana aktywność (24h)</h3>
          <Button variant="outline" size="sm" onClick={handleExportSusp} disabled={exporting}>
            Eksport CSV
          </Button>
        </div>
        {suspQ.isLoading && <div className="text-sm text-muted-foreground">Ładowanie…</div>}
        {suspQ.data && suspQ.data.length === 0 && (
          <div className="text-sm text-muted-foreground">Brak alertów. Wszystko spokojnie.</div>
        )}
        {suspQ.data && suspQ.data.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground">
                <tr>
                  <th className="py-2 pr-3">Minuta</th>
                  <th className="py-2 pr-3">Powód</th>
                  <th className="py-2 pr-3">Typ</th>
                  <th className="py-2 pr-3">IP</th>
                  <th className="py-2 pr-3">User</th>
                  <th className="py-2 pr-3">Hits</th>
                  <th className="py-2 pr-3">Błędy</th>
                </tr>
              </thead>
              <tbody>
                {suspQ.data.map((r: SuspiciousRow, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="py-2 pr-3 whitespace-nowrap">{new Date(r.minute).toLocaleString("pl-PL")}</td>
                    <td className="py-2 pr-3"><Badge variant="destructive">{r.reason}</Badge></td>
                    <td className="py-2 pr-3">{r.event_type}</td>
                    <td className="py-2 pr-3 font-mono text-xs">{r.actor_ip ?? "—"}</td>
                    <td className="py-2 pr-3 font-mono text-xs">{r.actor_user_id?.slice(0, 8) ?? "anon"}</td>
                    <td className="py-2 pr-3">{r.hits}</td>
                    <td className="py-2 pr-3">{r.failures}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card className="p-5">
        <div className="flex flex-wrap items-end gap-3 mb-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Typ zdarzenia</label>
            <Select value={eventType} onValueChange={(v) => resetPageAnd(() => setEventType(v))}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie</SelectItem>
                <SelectItem value="admin.write">admin.write</SelectItem>
                <SelectItem value="public.read">public.read</SelectItem>
                <SelectItem value="auth.event">auth.event</SelectItem>
                <SelectItem value="webhook.hit">webhook.hit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Waga</label>
            <Select value={severity} onValueChange={(v) => resetPageAnd(() => setSeverity(v))}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie</SelectItem>
                <SelectItem value="info">info</SelectItem>
                <SelectItem value="warning">warning</SelectItem>
                <SelectItem value="critical">critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Status</label>
            <Select value={success} onValueChange={(v) => resetPageAnd(() => setSuccess(v))}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie</SelectItem>
                <SelectItem value="ok">OK</SelectItem>
                <SelectItem value="fail">Błąd</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-muted-foreground block mb-1">Szukaj (akcja / zasób / IP)</label>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                resetPageAnd(() => setSearchActive(search.trim()));
              }}
            >
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="np. UPDATE, doctors, 1.2.3.4"
              />
            </form>
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Na stronę</label>
            <Select value={String(pageSize)} onValueChange={(v) => resetPageAnd(() => setPageSize(Number(v)))}>
              <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="200">200</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={handleExportLog} disabled={exporting}>
            Eksport CSV
          </Button>
        </div>

        {logsQ.isLoading && <div className="text-sm text-muted-foreground">Ładowanie…</div>}
        {logsQ.error && (
          <div className="text-sm text-destructive">{(logsQ.error as Error).message}</div>
        )}
        {logsQ.data && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground">
                  <tr>
                    <th className="py-2 pr-3">Czas</th>
                    <th className="py-2 pr-3">Waga</th>
                    <th className="py-2 pr-3">Typ</th>
                    <th className="py-2 pr-3">Akcja</th>
                    <th className="py-2 pr-3">Zasób</th>
                    <th className="py-2 pr-3">User</th>
                    <th className="py-2 pr-3">IP</th>
                    <th className="py-2 pr-3">OK</th>
                  </tr>
                </thead>
                <tbody>
                  {logsQ.data.rows.map((r: AuditLogRow) => (
                    <tr key={r.id} className="border-t border-border align-top">
                      <td className="py-2 pr-3 whitespace-nowrap">{new Date(r.occurred_at).toLocaleString("pl-PL")}</td>
                      <td className="py-2 pr-3">
                        <span className={`px-2 py-0.5 rounded text-xs ${sevColor(r.severity)}`}>{r.severity}</span>
                      </td>
                      <td className="py-2 pr-3">{r.event_type}</td>
                      <td className="py-2 pr-3 font-mono text-xs">{r.action ?? "—"}</td>
                      <td className="py-2 pr-3 font-mono text-xs">
                        {r.resource_type ?? "—"}
                        {r.resource_id ? `#${r.resource_id.slice(0, 8)}` : ""}
                      </td>
                      <td className="py-2 pr-3 font-mono text-xs">{r.actor_user_id?.slice(0, 8) ?? "anon"}</td>
                      <td className="py-2 pr-3 font-mono text-xs">{r.actor_ip ?? "—"}</td>
                      <td className="py-2 pr-3">{r.success ? "✓" : "✗"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {logsQ.data.rows.length === 0 && (
                <div className="text-sm text-muted-foreground py-4">Brak wpisów dla wybranych filtrów.</div>
              )}
            </div>
            <div className="flex items-center justify-between mt-4 text-sm">
              <div className="text-muted-foreground">
                {total === 0
                  ? "0 wpisów"
                  : `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, total)} z ${total}`}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1 || logsQ.isFetching}
                >
                  ← Poprzednia
                </Button>
                <span className="text-muted-foreground tabular-nums">
                  {page} / {pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  disabled={page >= pages || logsQ.isFetching}
                >
                  Następna →
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
