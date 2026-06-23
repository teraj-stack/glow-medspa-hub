import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCoreWebVitals, getCwvTrend } from "@/lib/web-vitals.functions";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/web-vitals")({
  component: WebVitalsPanel,
});

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
