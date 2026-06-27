import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useCallback } from "react";

export const Route = createFileRoute("/_authenticated/admin/dns")({
  codeSplitGroupings: [["loader", "component", "errorComponent", "notFoundComponent", "pendingComponent"]],
  component: DnsStatusPage,
});

type Check = {
  id: string;
  label: string;
  name: string;
  type: "TXT" | "MX" | "A" | "CNAME" | "NS";
  match: (records: string[]) => { ok: boolean; detail: string };
  hint?: string;
};

type Result = {
  records: string[];
  ok: boolean;
  detail: string;
  status: "loading" | "ok" | "warn" | "fail" | "error";
  error?: string;
};

type HistoryEntry = {
  id: string;
  timestamp: string; // ISO
  domain: string;
  selector: string;
  allOk: boolean;
  checks: {
    id: string;
    label: string;
    name: string;
    type: string;
    status: Result["status"];
    detail: string;
    records: string[];
  }[];
};

const HISTORY_KEY = "admin.dns.history.v1";
const HISTORY_MAX = 50;

const TYPE_CODES: Record<Check["type"], number> = {
  A: 1, NS: 2, CNAME: 5, MX: 15, TXT: 16,
};

async function resolveDns(name: string, type: Check["type"]): Promise<string[]> {
  const url = `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${TYPE_CODES[type]}`;
  const res = await fetch(url, { headers: { Accept: "application/dns-json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const answers: { data: string; type: number }[] = data.Answer ?? [];
  return answers
    .filter((a) => a.type === TYPE_CODES[type])
    .map((a) => (type === "TXT" ? a.data.replace(/^"|"$/g, "").replace(/"\s+"/g, "") : a.data));
}

function buildChecks(domain: string, dkimSelector: string): Check[] {
  return [
    {
      id: "mx",
      label: "MX — Google Workspace",
      name: domain,
      type: "MX",
      match: (rs) => {
        const hasGoogle = rs.some((r) => /smtp\.google\.com/i.test(r) || /aspmx\.l\.google\.com/i.test(r));
        return { ok: hasGoogle, detail: rs.join(" • ") || "brak rekordów" };
      },
      hint: "Oczekiwane: smtp.google.com lub *.aspmx.l.google.com",
    },
    {
      id: "spf",
      label: "SPF (TXT @)",
      name: domain,
      type: "TXT",
      match: (rs) => {
        const spf = rs.find((r) => r.toLowerCase().startsWith("v=spf1"));
        if (!spf) return { ok: false, detail: "brak rekordu v=spf1" };
        const hasGoogle = /include:_spf\.google\.com/i.test(spf);
        const hasMailgun = /include:mailgun\.org/i.test(spf);
        return {
          ok: hasGoogle,
          detail: `${spf}${hasMailgun ? "" : " — brak include:mailgun.org (Lovable Emails)"}`,
        };
      },
      hint: "v=spf1 include:_spf.google.com include:mailgun.org ~all",
    },
    {
      id: "dkim",
      label: `DKIM (${dkimSelector}._domainkey)`,
      name: `${dkimSelector}._domainkey.${domain}`,
      type: "TXT",
      match: (rs) => {
        const dkim = rs.find((r) => /v=DKIM1/i.test(r));
        return dkim
          ? { ok: true, detail: dkim.slice(0, 80) + (dkim.length > 80 ? "…" : "") }
          : { ok: false, detail: "brak rekordu v=DKIM1" };
      },
      hint: "Google Workspace: domyślny selektor 'google'",
    },
    {
      id: "dmarc",
      label: "DMARC (_dmarc TXT)",
      name: `_dmarc.${domain}`,
      type: "TXT",
      match: (rs) => {
        const dmarc = rs.find((r) => /v=DMARC1/i.test(r));
        return dmarc
          ? { ok: true, detail: dmarc }
          : { ok: false, detail: "brak rekordu v=DMARC1" };
      },
      hint: "v=DMARC1; p=quarantine; rua=mailto:…",
    },
    {
      id: "notify-ns",
      label: "Lovable Emails — delegacja notify.*",
      name: `notify.${domain}`,
      type: "NS",
      match: (rs) => {
        const hasLovable = rs.some((r) => /lovable\.cloud/i.test(r));
        return {
          ok: hasLovable,
          detail: rs.join(" • ") || "brak delegacji",
        };
      },
      hint: "ns3.lovable.cloud / ns4.lovable.cloud",
    },
  ];
}

function StatusBadge({ status }: { status: Result["status"] }) {
  const map: Record<Result["status"], { label: string; cls: string }> = {
    loading: { label: "…", cls: "bg-muted text-muted-foreground" },
    ok: { label: "OK", cls: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" },
    warn: { label: "UWAGA", cls: "bg-amber-500/15 text-amber-400 border border-amber-500/30" },
    fail: { label: "BRAK", cls: "bg-red-500/15 text-red-400 border border-red-500/30" },
    error: { label: "BŁĄD", cls: "bg-red-500/15 text-red-400 border border-red-500/30" },
  };
  const m = map[status];
  return <span className={`text-xs px-2 py-1 rounded font-medium ${m.cls}`}>{m.label}</span>;
}

function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, HISTORY_MAX)));
  } catch {
    // ignore quota
  }
}

function csvEscape(v: string): string {
  if (/[",\n;]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

function entriesToCsv(entries: HistoryEntry[]): string {
  const header = ["timestamp", "domain", "selector", "all_ok", "check_id", "check_label", "type", "name", "status", "detail", "records"];
  const rows: string[] = [header.join(",")];
  for (const e of entries) {
    for (const c of e.checks) {
      rows.push([
        e.timestamp,
        e.domain,
        e.selector,
        e.allOk ? "true" : "false",
        c.id,
        c.label,
        c.type,
        c.name,
        c.status,
        c.detail,
        c.records.join(" | "),
      ].map((x) => csvEscape(String(x))).join(","));
    }
  }
  return rows.join("\n");
}

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function exportPdf(entries: HistoryEntry[]) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 36;
  let y = margin;

  const newPageIfNeeded = (needed: number) => {
    if (y + needed > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Historia sprawdzeń DNS", margin, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Wygenerowano: ${new Date().toLocaleString("pl-PL")}`, margin, y);
  y += 18;

  for (const e of entries) {
    newPageIfNeeded(60);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(
      `${new Date(e.timestamp).toLocaleString("pl-PL")} — ${e.domain} [${e.allOk ? "OK" : "UWAGA"}]`,
      margin,
      y,
    );
    y += 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Selektor DKIM: ${e.selector}`, margin, y);
    y += 14;

    for (const c of e.checks) {
      const detailLines = doc.splitTextToSize(`  ${c.detail || "—"}`, pageW - margin * 2);
      newPageIfNeeded(14 + detailLines.length * 11 + 4);
      doc.setFont("helvetica", "bold");
      doc.text(`[${c.status.toUpperCase()}] ${c.label}  (${c.type} ${c.name})`, margin, y);
      y += 12;
      doc.setFont("helvetica", "normal");
      doc.text(detailLines, margin, y);
      y += detailLines.length * 11 + 4;
    }
    y += 8;
    doc.setDrawColor(200);
    doc.line(margin, y, pageW - margin, y);
    y += 10;
  }

  doc.save(`dns-historia-${new Date().toISOString().slice(0, 10)}.pdf`);
}

function DnsStatusPage() {
  const [domain, setDomain] = useState("bmclinics.ai");
  const [selector, setSelector] = useState("google");
  const [results, setResults] = useState<Record<string, Result>>({});
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [compareA, setCompareA] = useState<{ name: string; data: HistoryEntry } | null>(null);
  const [compareB, setCompareB] = useState<{ name: string; data: HistoryEntry } | null>(null);
  const [compareError, setCompareError] = useState<string | null>(null);

  const checks = useMemo(() => buildChecks(domain.trim(), selector.trim() || "google"), [domain, selector]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const recordHistory = useCallback(
    (snapshot: Record<string, Result>, currentChecks: Check[], dom: string, sel: string) => {
      const entry: HistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp: new Date().toISOString(),
        domain: dom,
        selector: sel,
        allOk: currentChecks.every((c) => snapshot[c.id]?.status === "ok"),
        checks: currentChecks.map((c) => {
          const r = snapshot[c.id];
          return {
            id: c.id,
            label: c.label,
            name: c.name,
            type: c.type,
            status: r?.status ?? "error",
            detail: r?.detail ?? r?.error ?? "",
            records: r?.records ?? [],
          };
        }),
      };
      setHistory((prev) => {
        const next = [entry, ...prev].slice(0, HISTORY_MAX);
        saveHistory(next);
        return next;
      });
    },
    [],
  );

  const runChecks = useCallback(async () => {
    const currentChecks = checks;
    const dom = domain.trim();
    const sel = selector.trim() || "google";
    const loadingState: Record<string, Result> = {};
    for (const c of currentChecks) loadingState[c.id] = { records: [], ok: false, detail: "", status: "loading" };
    setResults((prev) => ({ ...prev, ...loadingState }));

    const snapshot: Record<string, Result> = { ...loadingState };
    await Promise.all(
      currentChecks.map(async (c) => {
        try {
          const records = await resolveDns(c.name, c.type);
          const m = c.match(records);
          snapshot[c.id] = {
            records, ok: m.ok, detail: m.detail,
            status: m.ok ? "ok" : records.length ? "warn" : "fail",
          };
        } catch (e) {
          snapshot[c.id] = { records: [], ok: false, detail: "", status: "error", error: (e as Error).message };
        }
      }),
    );
    setResults((prev) => ({ ...prev, ...snapshot }));
    setLastCheck(new Date());
    recordHistory(snapshot, currentChecks, dom, sel);
  }, [checks, domain, selector, recordHistory]);

  useEffect(() => {
    void runChecks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => void runChecks(), 30_000);
    return () => clearInterval(id);
  }, [autoRefresh, runChecks]);

  const allOk = checks.every((c) => results[c.id]?.status === "ok");

  const handleExportCsv = () => {
    if (!history.length) return;
    const csv = entriesToCsv(history);
    downloadBlob(
      `dns-historia-${new Date().toISOString().slice(0, 10)}.csv`,
      new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }),
    );
  };

  const handleExportJson = () => {
    if (!history.length) return;
    const payload = {
      exportedAt: new Date().toISOString(),
      domain,
      selector,
      entries: history,
    };
    downloadBlob(
      `dns-historia-${new Date().toISOString().slice(0, 10)}.json`,
      new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" }),
    );
  };

  const handleExportPdf = async () => {
    if (!history.length) return;
    await exportPdf(history);
  };

  const handleClearHistory = () => {
    if (!confirm("Wyczyścić całą historię sprawdzeń DNS?")) return;
    saveHistory([]);
    setHistory([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Status DNS</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Weryfikacja propagacji rekordów MX, SPF, DKIM, DMARC oraz delegacji Lovable Emails. Zapytania
          kierowane są do publicznego resolvera DNS Google (dns.google).
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_220px_auto] items-end">
        <label className="block text-sm">
          <span className="text-muted-foreground">Domena</span>
          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="mt-1 w-full bg-background border border-border rounded px-3 py-2"
            placeholder="example.com"
          />
        </label>
        <label className="block text-sm">
          <span className="text-muted-foreground">Selektor DKIM</span>
          <input
            value={selector}
            onChange={(e) => setSelector(e.target.value)}
            className="mt-1 w-full bg-background border border-border rounded px-3 py-2"
            placeholder="google"
          />
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => void runChecks()}
            className="px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90"
          >
            Odśwież
          </button>
          <button
            onClick={() => setAutoRefresh((v) => !v)}
            className={`px-3 py-2 rounded border ${autoRefresh ? "border-primary text-primary" : "border-border"}`}
            title="Automatyczne odświeżanie co 30 s"
          >
            Auto {autoRefresh ? "✓" : ""}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 text-sm">
        <StatusBadge status={allOk ? "ok" : "warn"} />
        <span className="text-muted-foreground">
          {allOk ? "Wszystkie rekordy aktywne." : "Część rekordów wymaga uwagi lub jeszcze się propaguje."}
        </span>
        {lastCheck && (
          <span className="ml-auto text-muted-foreground text-xs">
            Sprawdzono: {lastCheck.toLocaleTimeString("pl-PL")}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {checks.map((c) => {
          const r = results[c.id];
          return (
            <div key={c.id} className="rounded-lg border border-border p-4">
              <div className="flex items-start gap-3">
                <StatusBadge status={r?.status ?? "loading"} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-medium">{c.label}</h3>
                    <code className="text-xs text-muted-foreground">{c.type} {c.name}</code>
                  </div>
                  {c.hint && <p className="text-xs text-muted-foreground mt-0.5">{c.hint}</p>}
                  {r?.status === "error" && (
                    <p className="text-sm text-red-400 mt-2">Błąd zapytania DNS: {r.error}</p>
                  )}
                  {r && r.status !== "loading" && r.status !== "error" && (
                    <div className="mt-2 text-sm">
                      <p className="text-foreground break-all">{r.detail}</p>
                      {r.records.length > 1 && (
                        <details className="mt-2">
                          <summary className="text-xs text-muted-foreground cursor-pointer">
                            Wszystkie rekordy ({r.records.length})
                          </summary>
                          <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                            {r.records.map((rec, i) => (
                              <li key={i} className="break-all font-mono">{rec}</li>
                            ))}
                          </ul>
                        </details>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <section className="pt-4 border-t border-border space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-lg font-semibold">Historia sprawdzeń</h3>
          <span className="text-xs text-muted-foreground">
            {history.length} {history.length === 1 ? "wpis" : "wpisów"} (max {HISTORY_MAX})
          </span>
          <div className="ml-auto flex gap-2">
            <button
              onClick={handleExportCsv}
              disabled={!history.length}
              className="px-3 py-1.5 text-sm rounded border border-border hover:bg-muted disabled:opacity-50"
            >
              Eksport CSV
            </button>
            <button
              onClick={handleExportJson}
              disabled={!history.length}
              className="px-3 py-1.5 text-sm rounded border border-border hover:bg-muted disabled:opacity-50"
            >
              Eksport JSON
            </button>
            <button
              onClick={() => void handleExportPdf()}
              disabled={!history.length}
              className="px-3 py-1.5 text-sm rounded border border-border hover:bg-muted disabled:opacity-50"
            >
              Eksport PDF
            </button>
            <button
              onClick={handleClearHistory}
              disabled={!history.length}
              className="px-3 py-1.5 text-sm rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 disabled:opacity-50"
            >
              Wyczyść
            </button>
          </div>
        </div>

        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground">Brak zapisanych sprawdzeń.</p>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground">
                <tr>
                  <th className="text-left px-3 py-2">Data</th>
                  <th className="text-left px-3 py-2">Domena</th>
                  <th className="text-left px-3 py-2">DKIM</th>
                  <th className="text-left px-3 py-2">Status</th>
                  <th className="text-left px-3 py-2">Szczegóły</th>
                </tr>
              </thead>
              <tbody>
                {history.flatMap((e) => [
                  <tr key={e.id} className="border-t border-border">
                    <td className="px-3 py-2 whitespace-nowrap">
                      {new Date(e.timestamp).toLocaleString("pl-PL")}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">{e.domain}</td>
                    <td className="px-3 py-2 font-mono text-xs">{e.selector}</td>
                    <td className="px-3 py-2">
                      <StatusBadge status={e.allOk ? "ok" : "warn"} />
                      <span className="ml-2 text-xs text-muted-foreground">
                        {e.checks.filter((c) => c.status === "ok").length}/{e.checks.length}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => setExpanded((id) => (id === e.id ? null : e.id))}
                        className="text-xs text-primary hover:underline"
                      >
                        {expanded === e.id ? "Ukryj" : "Pokaż"}
                      </button>
                    </td>
                  </tr>,
                  expanded === e.id ? (
                    <tr key={`${e.id}-detail`} className="border-t border-border bg-muted/20">
                      <td colSpan={5} className="px-3 py-3">
                        <ul className="space-y-2 text-xs">
                          {e.checks.map((c) => (
                            <li key={c.id} className="flex items-start gap-2">
                              <StatusBadge status={c.status} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-2 flex-wrap">
                                  <span className="font-medium text-sm">{c.label}</span>
                                  <code className="text-[10px] text-muted-foreground">{c.type} {c.name}</code>
                                </div>
                                <p className="break-all text-foreground/80">{c.detail || "—"}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ) : null,
                ])}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="text-xs text-muted-foreground">
        Propagacja DNS może trwać do 72 godzin. Historia zapisywana jest lokalnie w przeglądarce
        (do {HISTORY_MAX} ostatnich sprawdzeń).
      </p>
    </div>
  );
}
