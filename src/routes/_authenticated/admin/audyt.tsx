import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  listAuditLog,
  listSuspiciousActivity,
  type AuditLogRow,
  type SuspiciousRow,
} from "@/lib/audit.functions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/admin/audyt")({
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

function AuditPage() {
  const router = useRouter();
  const list = useServerFn(listAuditLog);
  const susp = useServerFn(listSuspiciousActivity);

  const [eventType, setEventType] = useState<string>("all");
  const [severity, setSeverity] = useState<string>("all");

  const logsQ = useQuery({
    queryKey: ["audit", "log", eventType, severity],
    queryFn: () =>
      list({
        data: {
          ...(eventType !== "all" ? { eventType } : {}),
          ...(severity !== "all" ? { severity: severity as "info" | "warning" | "critical" } : {}),
          limit: 200,
        },
      }),
  });

  const suspQ = useQuery({
    queryKey: ["audit", "suspicious"],
    queryFn: () => susp({}),
  });

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
        <h3 className="font-medium mb-3">Podejrzana aktywność (24h)</h3>
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
            <Select value={eventType} onValueChange={setEventType}>
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
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie</SelectItem>
                <SelectItem value="info">info</SelectItem>
                <SelectItem value="warning">warning</SelectItem>
                <SelectItem value="critical">critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {logsQ.isLoading && <div className="text-sm text-muted-foreground">Ładowanie…</div>}
        {logsQ.error && (
          <div className="text-sm text-destructive">{(logsQ.error as Error).message}</div>
        )}
        {logsQ.data && (
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
                {logsQ.data.map((r: AuditLogRow) => (
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
            {logsQ.data.length === 0 && (
              <div className="text-sm text-muted-foreground py-4">Brak wpisów dla wybranych filtrów.</div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
