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

function DnsStatusPage() {
  const [domain, setDomain] = useState("bmclinics.ai");
  const [selector, setSelector] = useState("google");
  const [results, setResults] = useState<Record<string, Result>>({});
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const checks = useMemo(() => buildChecks(domain.trim(), selector.trim() || "google"), [domain, selector]);

  const runChecks = useCallback(async () => {
    setResults((prev) => {
      const next: Record<string, Result> = { ...prev };
      for (const c of checks) next[c.id] = { records: [], ok: false, detail: "", status: "loading" };
      return next;
    });
    await Promise.all(
      checks.map(async (c) => {
        try {
          const records = await resolveDns(c.name, c.type);
          const m = c.match(records);
          setResults((prev) => ({
            ...prev,
            [c.id]: { records, ok: m.ok, detail: m.detail, status: m.ok ? "ok" : records.length ? "warn" : "fail" },
          }));
        } catch (e) {
          setResults((prev) => ({
            ...prev,
            [c.id]: { records: [], ok: false, detail: "", status: "error", error: (e as Error).message },
          }));
        }
      }),
    );
    setLastCheck(new Date());
  }, [checks]);

  useEffect(() => {
    void runChecks();
  }, [runChecks]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => void runChecks(), 30_000);
    return () => clearInterval(id);
  }, [autoRefresh, runChecks]);

  const allOk = checks.every((c) => results[c.id]?.status === "ok");

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

      <p className="text-xs text-muted-foreground">
        Propagacja DNS może trwać do 72 godzin. Jeśli rekord został dopiero dodany u rejestratora,
        odśwież po kilku minutach.
      </p>
    </div>
  );
}
