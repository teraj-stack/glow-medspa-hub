import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ORIGIN = "https://bmclinics.ai";

const KEY_PAGES = [
  { path: "/", label: "Strona główna" },
  { path: "/technologie", label: "Technologie" },
  { path: "/technologie/picoking", label: "PicoKing" },
  { path: "/technologie/fusion-plasma", label: "Fusion Plasma" },
  { path: "/technologie/laser-tulowy", label: "Laser tulowy" },
  { path: "/cennik", label: "Cennik" },
  { path: "/konsultacja", label: "Konsultacja" },
  { path: "/bezpieczenstwo-zabiegow-laserowych", label: "Bezpieczeństwo" },
];

type Strategy = "mobile" | "desktop";

interface CwvMetric {
  percentile: number | null;
  category: "FAST" | "AVERAGE" | "SLOW" | null;
}

interface CwvResult {
  url: string;
  label: string;
  strategy: Strategy;
  source: "field" | "origin" | null;
  lcp: CwvMetric;
  inp: CwvMetric;
  cls: CwvMetric;
  performance: number | null;
  error?: string;
}

async function assertAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden");
}

function readMetric(exp: any, key: string): CwvMetric {
  const m = exp?.metrics?.[key];
  if (!m) return { percentile: null, category: null };
  const raw = m.percentile;
  const value =
    key === "CUMULATIVE_LAYOUT_SHIFT_SCORE" && typeof raw === "number" ? raw / 100 : raw;
  return { percentile: typeof value === "number" ? value : null, category: m.category ?? null };
}

async function runPsi(url: string, strategy: Strategy, label: string): Promise<CwvResult> {
  const apiKey = process.env.PAGESPEED_API_KEY;
  const params = new URLSearchParams({
    url,
    strategy,
    category: "performance",
  });
  if (apiKey) params.set("key", apiKey);
  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`;
  try {
    const res = await fetch(endpoint);
    if (!res.ok) {
      return {
        url,
        label,
        strategy,
        source: null,
        lcp: { percentile: null, category: null },
        inp: { percentile: null, category: null },
        cls: { percentile: null, category: null },
        performance: null,
        error: `PSI ${res.status}`,
      };
    }
    const json = await res.json();
    const exp = json.loadingExperience?.metrics
      ? json.loadingExperience
      : json.originLoadingExperience;
    const source: "field" | "origin" | null = json.loadingExperience?.metrics
      ? "field"
      : json.originLoadingExperience?.metrics
        ? "origin"
        : null;
    const perfScore = json.lighthouseResult?.categories?.performance?.score;
    return {
      url,
      label,
      strategy,
      source,
      lcp: readMetric(exp, "LARGEST_CONTENTFUL_PAINT_MS"),
      inp: readMetric(exp, "INTERACTION_TO_NEXT_PAINT"),
      cls: readMetric(exp, "CUMULATIVE_LAYOUT_SHIFT_SCORE"),
      performance: typeof perfScore === "number" ? Math.round(perfScore * 100) : null,
    };
  } catch (e: any) {
    return {
      url,
      label,
      strategy,
      source: null,
      lcp: { percentile: null, category: null },
      inp: { percentile: null, category: null },
      cls: { percentile: null, category: null },
      performance: null,
      error: e?.message ?? "fetch failed",
    };
  }
}

export const getCoreWebVitals = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { strategy?: Strategy } | undefined) => d ?? {})
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const strategy: Strategy = data.strategy ?? "mobile";
    const results = await Promise.all(
      KEY_PAGES.map((p) => runPsi(`${ORIGIN}${p.path}`, strategy, p.label)),
    );
    return { strategy, results, hasApiKey: !!process.env.PAGESPEED_API_KEY };
  });

interface TrendPoint {
  date: string;
  lcp: number | null;
  inp: number | null;
  cls: number | null;
}

async function fetchCruxHistory(
  apiKey: string,
  body: Record<string, unknown>,
): Promise<TrendPoint[] | null> {
  const res = await fetch(
    `https://chromeuxreport.googleapis.com/v1/records:queryHistoryRecord?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  if (!res.ok) return null;
  const json = await res.json();
  const metrics = json.record?.metrics;
  const dates: any[] = json.record?.collectionPeriods ?? [];
  if (!metrics || !dates.length) return null;
  const lcp = metrics.largest_contentful_paint?.percentilesTimeseries?.p75s ?? [];
  const inp = metrics.interaction_to_next_paint?.percentilesTimeseries?.p75s ?? [];
  const cls = metrics.cumulative_layout_shift?.percentilesTimeseries?.p75s ?? [];
  return dates.map((d, i) => ({
    date: `${d.lastDate.year}-${String(d.lastDate.month).padStart(2, "0")}-${String(d.lastDate.day).padStart(2, "0")}`,
    lcp: lcp[i] != null ? Number(lcp[i]) : null,
    inp: inp[i] != null ? Number(inp[i]) : null,
    cls: cls[i] != null ? Number(cls[i]) : null,
  }));
}

export const getCwvTrend = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { path?: string; strategy?: Strategy } | undefined) => d ?? {})
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const apiKey = process.env.CRUX_API_KEY || process.env.PAGESPEED_API_KEY;
    if (!apiKey) {
      return { available: false as const, reason: "Brak klucza CrUX API." };
    }
    const strategy: Strategy = data.strategy ?? "mobile";
    const formFactor = strategy === "mobile" ? "PHONE" : "DESKTOP";
    const path = data.path;

    // Try URL-level first when path supplied, fall back to origin
    if (path) {
      const trend = await fetchCruxHistory(apiKey, {
        url: `${ORIGIN}${path}`,
        formFactor,
        metrics: [
          "largest_contentful_paint",
          "interaction_to_next_paint",
          "cumulative_layout_shift",
        ],
      });
      if (trend) return { available: true as const, scope: "url" as const, trend };
    }
    const originTrend = await fetchCruxHistory(apiKey, {
      origin: ORIGIN,
      formFactor,
      metrics: [
        "largest_contentful_paint",
        "interaction_to_next_paint",
        "cumulative_layout_shift",
      ],
    });
    if (originTrend) return { available: true as const, scope: "origin" as const, trend: originTrend };
    return { available: false as const, reason: "Brak danych w CrUX dla tej witryny." };
  });
