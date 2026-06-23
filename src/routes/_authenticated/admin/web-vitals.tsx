import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCoreWebVitals, getCwvTrend } from "@/lib/web-vitals.functions";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";

export const Route = createFileRoute("/_authenticated/admin/web-vitals")({
  component: WebVitalsPanel,
});

type RangeKey = "4w" | "12w" | "all";
const RANGE_LABEL: Record<RangeKey, string> = {
  "4w": "Ostatnie 4 tyg.",
  "12w": "Ostatnie 12 tyg.",
  all: "Cały zakres",
};
function rangeWeeks(r: RangeKey): number | null {
  return r === "4w" ? 4 : r === "12w" ? 12 : null;
}

function csvEscape(v: unknown): string {
  const s = v == null ? "" : String(v);
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

type Strategy = "mobile" | "desktop";

const THRESHOLDS = {
  lcp: { good: 2500, ni: 4000, unit: "ms" },
  inp: { good: 200, ni: 500, unit: "ms" },
  cls: { good: 0.1, ni: 0.25, unit: "" },
};

function classify(metric: "lcp" | "inp" | "cls", value: number | null) {
  if (value == null) return { label: "—", color: "text-muted-foreground" };
  const t = THRESHOLDS[metric];
  if (value <= t.good) return { label: "Dobry", color: "text-emerald-500" };
  if (value <= t.ni) return { label: "Wymaga poprawy", color: "text-amber-500" };
  return { label: "Słaby", color: "text-red-500" };
}

function fmtMetric(metric: "lcp" | "inp" | "cls", value: number | null) {
  if (value == null) return "—";
  if (metric === "cls") return value.toFixed(3);
  return `${Math.round(value)} ms`;
}

function Sparkline({ values, threshold }: { values: (number | null)[]; threshold: number }) {
  const clean = values.map((v) => (v == null ? null : v));
  const nums = clean.filter((v): v is number => v != null);
  if (nums.length < 2) return <div className="text-xs text-muted-foreground">Za mało danych</div>;
  const min = Math.min(...nums, threshold);
  const max = Math.max(...nums, threshold);
  const range = max - min || 1;
  const w = 200;
  const h = 36;
  const stepX = w / (clean.length - 1);
  const pts = clean
    .map((v, i) => {
      if (v == null) return null;
      const x = i * stepX;
      const y = h - ((v - min) / range) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .filter(Boolean)
    .join(" ");
  const thresholdY = h - ((threshold - min) / range) * h;
  const last = nums[nums.length - 1];
  const first = nums[0];
  const trend = last - first;
  return (
    <div className="flex items-center gap-2">
      <svg width={w} height={h} className="overflow-visible">
        <line
          x1={0}
          x2={w}
          y1={thresholdY}
          y2={thresholdY}
          stroke="currentColor"
          strokeDasharray="2 3"
          className="text-muted-foreground/40"
        />
        <polyline
          points={pts}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-primary"
        />
      </svg>
      <span
        className={`text-xs ${trend > 0 ? "text-red-500" : trend < 0 ? "text-emerald-500" : "text-muted-foreground"}`}
      >
        {trend > 0 ? "▲" : trend < 0 ? "▼" : "·"} {Math.abs(trend).toFixed(trend < 1 && trend > -1 ? 3 : 0)}
      </span>
    </div>
  );
}

function WebVitalsPanel() {
  const [strategy, setStrategy] = useState<Strategy>("mobile");
  const [range, setRange] = useState<RangeKey>("12w");

  const vitals = useQuery({
    queryKey: ["cwv", strategy],
    queryFn: () => getCoreWebVitals({ data: { strategy } }),
    staleTime: 10 * 60 * 1000,
  });

  const trend = useQuery({
    queryKey: ["cwv-trend", strategy],
    queryFn: () => getCwvTrend({ data: { strategy } }),
    staleTime: 60 * 60 * 1000,
  });

  const filteredTrend = useMemo(() => {
    if (!trend.data || !trend.data.available) return null;
    const n = rangeWeeks(range);
    const pts = trend.data.trend;
    return n == null ? pts : pts.slice(-n);
  }, [trend.data, range]);

  const exportRows = useMemo(() => {
    const rows: Array<Record<string, string | number | null>> = [];
    if (vitals.data?.results) {
      for (const r of vitals.data.results) {
        rows.push({
          section: "snapshot",
          strategy,
          date: new Date().toISOString().slice(0, 10),
          label: r.label,
          url: r.url,
          source: r.source ?? "",
          lcp_ms: r.lcp.percentile ?? null,
          inp_ms: r.inp.percentile ?? null,
          cls: r.cls.percentile ?? null,
          lighthouse: r.performance ?? null,
        });
      }
    }
    if (filteredTrend) {
      for (const p of filteredTrend) {
        rows.push({
          section: "trend",
          strategy,
          date: p.date,
          label: "origin",
          url: "https://bmclinics.ai",
          source: "crux-history",
          lcp_ms: p.lcp ?? null,
          inp_ms: p.inp ?? null,
          cls: p.cls ?? null,
          lighthouse: null,
        });
      }
    }
    return rows;
  }, [vitals.data, filteredTrend, strategy]);

  const baseName = `web-vitals_${strategy}_${range}_${new Date().toISOString().slice(0, 10)}`;

  function exportCSV() {
    const headers = [
      "section", "strategy", "date", "label", "url", "source",
      "lcp_ms", "inp_ms", "cls", "lighthouse",
    ];
    const lines = [headers.join(",")];
    for (const r of exportRows) lines.push(headers.map((h) => csvEscape(r[h])).join(","));
    downloadBlob(new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8" }), `${baseName}.csv`);
  }

  function exportPDF() {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 36;
    let y = margin;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Core Web Vitals — bmclinics.ai", margin, y);
    y += 18;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(
      `Strategia: ${strategy === "mobile" ? "Mobile" : "Desktop"}  ·  Zakres trendu: ${RANGE_LABEL[range]}  ·  Wygenerowano: ${new Date().toLocaleString("pl-PL")}`,
      margin, y,
    );
    y += 16;

    const snapshot = exportRows.filter((r) => r.section === "snapshot");
    const trendRows = exportRows.filter((r) => r.section === "trend");

    const drawTable = (title: string, cols: { key: string; label: string; w: number; align?: "right" }[], rows: typeof exportRows) => {
      if (!rows.length) return;
      if (y > 760) { doc.addPage(); y = margin; }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(title, margin, y);
      y += 12;
      doc.setFontSize(9);
      let x = margin;
      for (const c of cols) {
        doc.text(c.label, c.align === "right" ? x + c.w - 2 : x, y, { align: c.align === "right" ? "right" : "left" });
        x += c.w;
      }
      y += 4;
      doc.setDrawColor(200);
      doc.line(margin, y, margin + cols.reduce((s, c) => s + c.w, 0), y);
      y += 10;
      doc.setFont("helvetica", "normal");
      for (const r of rows) {
        if (y > 800) { doc.addPage(); y = margin; }
        let cx = margin;
        for (const c of cols) {
          const raw = r[c.key];
          let txt = raw == null ? "—" : String(raw);
          if (c.key === "cls" && typeof raw === "number") txt = raw.toFixed(3);
          if ((c.key === "lcp_ms" || c.key === "inp_ms") && typeof raw === "number") txt = `${Math.round(raw)}`;
          if (c.key === "label" || c.key === "url") txt = txt.length > 38 ? txt.slice(0, 37) + "…" : txt;
          doc.text(txt, c.align === "right" ? cx + c.w - 2 : cx, y, { align: c.align === "right" ? "right" : "left" });
          cx += c.w;
        }
        y += 12;
      }
      y += 10;
    };

    drawTable(
      "Snapshot (PageSpeed Insights / CrUX 28d)",
      [
        { key: "label", label: "Strona", w: 150 },
        { key: "url", label: "URL", w: 180 },
        { key: "lcp_ms", label: "LCP", w: 50, align: "right" },
        { key: "inp_ms", label: "INP", w: 50, align: "right" },
        { key: "cls", label: "CLS", w: 50, align: "right" },
        { key: "lighthouse", label: "LH", w: 40, align: "right" },
      ],
      snapshot,
    );

    drawTable(
      `Trend (CrUX History · ${RANGE_LABEL[range]})`,
      [
        { key: "date", label: "Tydzień", w: 90 },
        { key: "lcp_ms", label: "LCP (ms)", w: 80, align: "right" },
        { key: "inp_ms", label: "INP (ms)", w: 80, align: "right" },
        { key: "cls", label: "CLS", w: 80, align: "right" },
      ],
      trendRows,
    );

    doc.save(`${baseName}.pdf`);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-semibold">Core Web Vitals</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Dane CrUX (Chrome User Experience Report) z PageSpeed Insights — pomiary rzeczywistych
            użytkowników z ostatnich 28 dni. Progi Google: LCP &lt; 2.5 s · INP &lt; 200 ms · CLS &lt; 0.1.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex rounded-md border border-border p-0.5">
            {(["mobile", "desktop"] as Strategy[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStrategy(s)}
                className={`px-3 py-1 text-sm rounded ${
                  strategy === s ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {s === "mobile" ? "Mobile" : "Desktop"}
              </button>
            ))}
          </div>
          <div className="flex rounded-md border border-border p-0.5">
            {(Object.keys(RANGE_LABEL) as RangeKey[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={`px-3 py-1 text-sm rounded ${
                  range === r ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {RANGE_LABEL[r]}
              </button>
            ))}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={exportCSV}
            disabled={!exportRows.length}
          >
            Eksport CSV
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={exportPDF}
            disabled={!exportRows.length}
          >
            Eksport PDF
          </Button>
        </div>
      </div>

      {vitals.data && !vitals.data.hasApiKey && (
        <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-600 dark:text-amber-400">
          Działa bez klucza API (limit ~25 zapytań/dzień). Dodaj sekret <code>PAGESPEED_API_KEY</code>{" "}
          dla wyższego limitu i danych historycznych CrUX.
        </div>
      )}

      <section className="rounded-lg border border-border overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs uppercase tracking-wide text-muted-foreground border-b border-border">
          <div className="col-span-4">Strona</div>
          <div className="col-span-2 text-right">LCP (p75)</div>
          <div className="col-span-2 text-right">INP (p75)</div>
          <div className="col-span-2 text-right">CLS (p75)</div>
          <div className="col-span-2 text-right">Lighthouse</div>
        </div>
        {vitals.isLoading && (
          <div className="px-4 py-6 text-sm text-muted-foreground">
            Pomiar trwa zwykle 5–15 s na stronę…
          </div>
        )}
        {vitals.data?.results.map((r) => {
          const lcp = classify("lcp", r.lcp.percentile);
          const inp = classify("inp", r.inp.percentile);
          const cls = classify("cls", r.cls.percentile);
          return (
            <div
              key={r.url}
              className="grid grid-cols-12 gap-2 px-4 py-3 text-sm border-b border-border last:border-0 items-center"
            >
              <div className="col-span-4 min-w-0">
                <div className="font-medium truncate">{r.label}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate hover:underline"
                  >
                    {r.url.replace("https://bmclinics.ai", "")}
                  </a>
                  {r.source && (
                    <span className="shrink-0 px-1.5 py-0.5 rounded bg-muted text-[10px] uppercase">
                      {r.source === "field" ? "URL" : "Origin"}
                    </span>
                  )}
                </div>
                {r.error && (
                  <div className="text-xs text-red-500 mt-0.5">{r.error}</div>
                )}
              </div>
              <div className="col-span-2 text-right">
                <div className="tabular-nums">{fmtMetric("lcp", r.lcp.percentile)}</div>
                <div className={`text-xs ${lcp.color}`}>{lcp.label}</div>
              </div>
              <div className="col-span-2 text-right">
                <div className="tabular-nums">{fmtMetric("inp", r.inp.percentile)}</div>
                <div className={`text-xs ${inp.color}`}>{inp.label}</div>
              </div>
              <div className="col-span-2 text-right">
                <div className="tabular-nums">{fmtMetric("cls", r.cls.percentile)}</div>
                <div className={`text-xs ${cls.color}`}>{cls.label}</div>
              </div>
              <div className="col-span-2 text-right">
                <div className="tabular-nums">{r.performance ?? "—"}</div>
                <div className="text-xs text-muted-foreground">/ 100</div>
              </div>
            </div>
          );
        })}
        <div className="px-4 py-3 border-t border-border flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            Strategia: {strategy === "mobile" ? "Smartphone" : "Desktop"}
          </div>
          <Button size="sm" variant="outline" onClick={() => vitals.refetch()} disabled={vitals.isFetching}>
            {vitals.isFetching ? "Aktualizuję…" : "Odśwież pomiary"}
          </Button>
        </div>
      </section>

      <section className="rounded-lg border border-border">
        <div className="border-b border-border px-4 py-3 text-sm font-medium flex items-center justify-between">
          <span>Trend (do 25 tygodni, źródło: CrUX History)</span>
          {trend.data && "scope" in trend.data && (
            <span className="text-xs text-muted-foreground">
              Zakres: {trend.data.scope === "url" ? "strona główna" : "cała domena"}
            </span>
          )}
        </div>
        {trend.isLoading && (
          <div className="px-4 py-4 text-sm text-muted-foreground">Pobieram historię…</div>
        )}
        {trend.data && !trend.data.available && (
          <div className="px-4 py-4 text-sm text-muted-foreground">{trend.data.reason}</div>
        )}
        {trend.data && trend.data.available && (() => {
          const trendData = trend.data.trend;
          return (
            <div className="grid gap-4 sm:grid-cols-3 px-4 py-4">
              {(["lcp", "inp", "cls"] as const).map((metric) => {
                const values = trendData.map((p) => p[metric]);
                const last = [...values].reverse().find((v) => v != null) ?? null;
                const c = classify(metric, last);
                return (
                  <div key={metric} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">
                        {metric.toUpperCase()}
                      </span>
                      <span className={`text-xs ${c.color}`}>{c.label}</span>
                    </div>
                    <div className="text-xl font-semibold tabular-nums">{fmtMetric(metric, last)}</div>
                    <Sparkline values={values} threshold={THRESHOLDS[metric].good} />
                    <div className="text-[11px] text-muted-foreground">
                      {trendData[0]?.date} → {trendData[trendData.length - 1]?.date}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </section>
    </div>
  );
}
