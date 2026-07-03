import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, Fragment } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  researchKeywords,
  researchKeywordSerp,
  listKeywordResearchReports,
  getKeywordResearchReport,
  deleteKeywordResearchReport,
  generateContentClusters,
  type ContentCluster,
} from "@/lib/keyword-research.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/seo/keywords")({
  codeSplitGroupings: [["loader", "component", "errorComponent", "notFoundComponent", "pendingComponent"]],
  component: KeywordsPanel,
});

type Row = {
  phrase: string;
  volume: number | null;
  cpc: number | null;
  competition: number | null;
  resultsCount: number | null;
  difficulty: number | null;
};
type ResearchResult = {
  id?: string;
  createdAt?: string;
  database: string;
  appendLocation: string | null;
  label?: string | null;
  rows: Row[];
};
type SerpResult = { phrase: string; database: string; results: { position: number | null; domain: string; url: string }[] };
type ReportListRow = {
  id: string;
  created_at: string;
  triggered_by: string;
  database: string;
  append_location: string | null;
  phrase_count: number;
  label: string | null;
};

const DATABASES = [
  { value: "pl", label: "Polska (pl)" },
  { value: "us", label: "USA (us)" },
  { value: "uk", label: "Wielka Brytania (uk)" },
  { value: "de", label: "Niemcy (de)" },
];

function fmt(n: number | null | undefined, digits = 0, suffix = "") {
  if (n == null) return "—";
  return n.toLocaleString("pl-PL", { maximumFractionDigits: digits }) + suffix;
}

function kdTone(kd: number | null | undefined) {
  if (kd == null) return "text-muted-foreground";
  if (kd < 30) return "text-emerald-500";
  if (kd < 50) return "text-amber-500";
  if (kd < 70) return "text-orange-500";
  return "text-destructive";
}

function reportTitle(r: { label?: string | null; created_at?: string; createdAt?: string; database: string; append_location?: string | null; appendLocation?: string | null }) {
  const ts = r.created_at ?? r.createdAt ?? "";
  const loc = r.append_location ?? r.appendLocation ?? null;
  const base = r.label?.trim() || (ts ? new Date(ts).toLocaleString("pl-PL") : "raport");
  return `${base} · ${r.database}${loc ? " +" + loc : ""}`;
}

function recommend(r: Row): { priority: "high" | "medium" | "low" | "skip"; label: string; reason: string } {
  const v = r.volume ?? 0;
  const kd = r.difficulty ?? 100;
  if (v < 20) return { priority: "skip", label: "Pomiń", reason: "Wolumen zbyt niski (<20/mies.)" };
  if (kd < 30 && v >= 100) return { priority: "high", label: "Cel #1", reason: "Niska trudność + solidny wolumen — realny cel dla nowej strony" };
  if (kd < 30) return { priority: "high", label: "Szybka wygrana", reason: "Bardzo niska trudność — łatwo wejść w top" };
  if (kd < 50 && v >= 200) return { priority: "medium", label: "Warto", reason: "Umiarkowana trudność, dobry wolumen — content + linki" };
  if (kd < 50) return { priority: "medium", label: "Uzupełniające", reason: "Umiarkowana trudność, niski wolumen — bundle z innymi" };
  if (kd < 70) return { priority: "low", label: "Długofalowe", reason: "Wysoka trudność — dopiero po zbudowaniu autorytetu" };
  return { priority: "skip", label: "Odpuść", reason: "Teren dużych serwisów — użyj dłuższej, bardziej specyficznej frazy" };
}

function toCsv(header: string[], rows: (string | number | null | undefined)[][]) {
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return header.map(esc).join(",") + "\n" + rows.map((r) => r.map(esc).join(",")).join("\n");
}

function triggerDownload(csv: string, filename: string) {
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadCsv(result: ResearchResult) {
  const header = ["fraza", "wolumen", "KD", "CPC (USD)", "konkurencja", "wyniki", "priorytet", "rekomendacja"];
  const rows = result.rows.map((r) => {
    const rec = recommend(r);
    return [r.phrase, r.volume ?? "", r.difficulty ?? "", r.cpc ?? "", r.competition ?? "", r.resultsCount ?? "", rec.label, rec.reason];
  });
  const stamp = (result.createdAt ?? new Date().toISOString()).slice(0, 19).replace(/[:T]/g, "-");
  triggerDownload(toCsv(header, rows), `keyword-research-${result.database}${result.appendLocation ? "-" + result.appendLocation : ""}-${stamp}.csv`);
}

function downloadRecommendationsCsv(result: ResearchResult) {
  const header = ["priorytet", "fraza", "wolumen", "KD", "uzasadnienie"];
  const order = { high: 0, medium: 1, low: 2, skip: 3 } as const;
  const rows = result.rows
    .map((r) => ({ r, rec: recommend(r) }))
    .sort((a, b) => order[a.rec.priority] - order[b.rec.priority] || (b.r.volume ?? 0) - (a.r.volume ?? 0))
    .map(({ r, rec }) => [rec.label, r.phrase, r.volume ?? "", r.difficulty ?? "", rec.reason]);
  const stamp = (result.createdAt ?? new Date().toISOString()).slice(0, 19).replace(/[:T]/g, "-");
  triggerDownload(toCsv(header, rows), `keyword-recommendations-${result.database}${result.appendLocation ? "-" + result.appendLocation : ""}-${stamp}.csv`);
}

function downloadComparisonCsv(reports: ResearchResult[], rows: { phrase: string; perReport: (Row | null)[] }[]) {
  const header = ["fraza", ...reports.flatMap((r) => [`${reportTitle(r)} · wolumen`, `${reportTitle(r)} · KD`])];
  const csvRows = rows.map((cr) => [cr.phrase, ...cr.perReport.flatMap((row) => [row?.volume ?? "", row?.difficulty ?? ""])]);
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  triggerDownload(toCsv(header, csvRows), `keyword-comparison-${stamp}.csv`);
}

function downloadClustersCsv(clusters: ContentCluster[]) {
  const header = ["klaster", "intent", "usluga", "typ", "tytul", "slug", "fraza_glowna", "frazy_wspierajace", "wolumen", "kd", "angle"];
  const rows: (string | number | null)[][] = [];
  for (const c of clusters) {
    rows.push([c.cluster, c.intent, c.targetService, "PILLAR", c.pillarTitle, c.pillarSlug, "", "", "", "", ""]);
    for (const a of c.supportingArticles) {
      rows.push([c.cluster, c.intent, c.targetService, "SUPPORT", a.title, a.slug, a.primaryKeyword, a.supportingKeywords.join("; "), a.estimatedVolume ?? "", a.estimatedKd ?? "", a.angle]);
    }
  }
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  triggerDownload(toCsv(header, rows), `content-clusters-${stamp}.csv`);
}

function clustersToMarkdown(clusters: ContentCluster[]): string {
  return clusters.map((c) => {
    const support = c.supportingArticles.map((a) =>
      `- **${a.title}** \`/${a.slug}\`\n  - fraza główna: \`${a.primaryKeyword}\`${a.estimatedVolume ? ` · vol ${a.estimatedVolume}` : ""}${a.estimatedKd != null ? ` · KD ${a.estimatedKd}` : ""}\n  - wspierające: ${a.supportingKeywords.map((k) => `\`${k}\``).join(", ")}\n  - angle: ${a.angle}`,
    ).join("\n");
    return `## ${c.cluster} · ${c.intent}\n**Usługa docelowa:** ${c.targetService}\n\n### Pillar\n- **${c.pillarTitle}** \`/${c.pillarSlug}\`\n\n### Artykuły wspierające\n${support}\n\n**Linkowanie wewnętrzne:** ${c.internalLinking}\n**CTA:** ${c.cta}\n`;
  }).join("\n---\n\n");
}

function downloadClustersMarkdown(clusters: ContentCluster[]) {
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  const md = "# Klastry contentowe — propozycje\n\n" + clustersToMarkdown(clusters);
  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `content-clusters-${stamp}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

function KeywordsPanel() {
  const qc = useQueryClient();
  const researchFn = useServerFn(researchKeywords);
  const serpFn = useServerFn(researchKeywordSerp);
  const listFn = useServerFn(listKeywordResearchReports);
  const getFn = useServerFn(getKeywordResearchReport);
  const deleteFn = useServerFn(deleteKeywordResearchReport);
  const clustersFn = useServerFn(generateContentClusters);


  const [input, setInput] = useState("");
  const [database, setDatabase] = useState("pl");
  const [appendMode, setAppendMode] = useState<"none" | "siedlce" | "warszawa" | "custom">("none");
  const [customLoc, setCustomLoc] = useState("");
  const [label, setLabel] = useState("");
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [serpMap, setSerpMap] = useState<Record<string, SerpResult | "loading">>({});
  const [reportFrom, setReportFrom] = useState("");
  const [reportTo, setReportTo] = useState("");
  const [comparedIds, setComparedIds] = useState<string[]>([]);
  const [comparedReports, setComparedReports] = useState<ResearchResult[]>([]);
  const [clusters, setClusters] = useState<{ reportId: string; database: string; clusters: ContentCluster[] } | null>(null);

  const appendLocation =
    appendMode === "siedlce" ? "siedlce" :
    appendMode === "warszawa" ? "warszawa" :
    appendMode === "custom" ? customLoc.trim() : "";

  const phrases = useMemo(
    () => input.split(/\r?\n/).map((s) => s.trim()).filter(Boolean).slice(0, 50),
    [input],
  );

  const reports = useQuery({
    queryKey: ["keyword-research-reports", reportFrom, reportTo],
    queryFn: () =>
      listFn({
        data: {
          from: reportFrom ? new Date(reportFrom).toISOString() : undefined,
          to: reportTo ? new Date(reportTo + "T23:59:59").toISOString() : undefined,
        },
      }),
  });

  const runMut = useMutation({
    mutationFn: async () => {
      if (!phrases.length) throw new Error("Wklej co najmniej jedną frazę");
      return researchFn({
        data: {
          phrases,
          database,
          appendLocation: appendLocation || undefined,
          label: label.trim() || undefined,
        },
      }) as Promise<ResearchResult>;
    },
    onSuccess: (r) => {
      setResult(r);
      setSerpMap({});
      qc.invalidateQueries({ queryKey: ["keyword-research-reports"] });
      toast.success(`Pobrano dane dla ${r.rows.length} fraz — zapisano w historii.`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const openMut = useMutation({
    mutationFn: async (id: string) => getFn({ data: { id } }) as Promise<ResearchResult>,
    onSuccess: (r) => {
      setResult(r);
      setSerpMap({});
      toast.success(`Otwarto raport z ${r.createdAt ? new Date(r.createdAt).toLocaleString("pl-PL") : ""}`);
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["keyword-research-reports"] });
      toast.success("Raport usunięty.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const clustersMut = useMutation({
    mutationFn: async (reportId: string) =>
      clustersFn({ data: { reportId } }) as Promise<{ reportId: string; database: string; clusters: ContentCluster[] }>,
    onSuccess: (r) => {
      setClusters(r);
      toast.success(`Wygenerowano ${r.clusters.length} klastrów.`);
      if (typeof window !== "undefined") setTimeout(() => document.getElementById("clusters-section")?.scrollIntoView({ behavior: "smooth" }), 100);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const loadSerp = async (phrase: string) => {
    if (!result) return;
    setSerpMap((m) => ({ ...m, [phrase]: "loading" }));
    try {
      const r = (await serpFn({ data: { phrase, database: result.database } })) as SerpResult;
      setSerpMap((m) => ({ ...m, [phrase]: r }));
    } catch (e) {
      setSerpMap((m) => {
        const { [phrase]: _, ...rest } = m;
        return rest;
      });
      toast.error(e instanceof Error ? e.message : String(e));
    }
  };

  const toggleCompare = (id: string) => {
    setComparedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 4) {
        toast.warning("Maksymalnie 4 raporty naraz.");
        return prev;
      }
      return [...prev, id];
    });
  };

  const runCompareMut = useMutation({
    mutationFn: async () => {
      if (comparedIds.length < 2) throw new Error("Zaznacz przynajmniej 2 raporty.");
      const results = await Promise.all(
        comparedIds.map((id) => getFn({ data: { id } }) as Promise<ResearchResult>),
      );
      return results;
    },
    onSuccess: (rs) => {
      setComparedReports(rs);
      toast.success(`Porównuję ${rs.length} raporty.`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const comparisonRows = useMemo(() => {
    if (comparedReports.length < 2) return [];
    const phraseSet = new Set<string>();
    for (const r of comparedReports) for (const row of r.rows) phraseSet.add(row.phrase);
    return Array.from(phraseSet).map((phrase) => ({
      phrase,
      perReport: comparedReports.map((r) => r.rows.find((x) => x.phrase === phrase) ?? null),
    }));
  }, [comparedReports]);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">Research słów kluczowych</h2>
        <p className="text-sm text-muted-foreground">
          Wklej listę fraz lub nazw usług (po jednej w linii, max 50). Każde uruchomienie trafia do historii — możesz do niego wrócić, filtrować po dacie i porównać wolumeny między dwoma raportami.
        </p>
      </header>

      <section className="rounded-lg border border-border p-4 space-y-3">
        <Textarea
          rows={8}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"mezoterapia igłowa\nlaser frakcyjny co2\nlifting bez skalpela\nbiostymulator kolagenu"}
        />
        <div className="text-xs text-muted-foreground">
          {phrases.length} pozycji do sprawdzenia (limit 50).
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm flex flex-col gap-1">
            <span className="text-muted-foreground">Baza Semrush</span>
            <select
              value={database}
              onChange={(e) => setDatabase(e.target.value)}
              className="border border-border rounded-md h-9 px-2 bg-background"
            >
              {DATABASES.map((d) => (<option key={d.value} value={d.value}>{d.label}</option>))}
            </select>
          </label>

          <label className="text-sm flex flex-col gap-1">
            <span className="text-muted-foreground">Filtr lokalizacji</span>
            <select
              value={appendMode}
              onChange={(e) => setAppendMode(e.target.value as any)}
              className="border border-border rounded-md h-9 px-2 bg-background"
            >
              <option value="none">Brak — krajowo</option>
              <option value="siedlce">+ siedlce</option>
              <option value="warszawa">+ warszawa</option>
              <option value="custom">+ własne miasto / dzielnica…</option>
            </select>
          </label>

          {appendMode === "custom" && (
            <label className="text-sm flex flex-col gap-1">
              <span className="text-muted-foreground">Własna lokalizacja</span>
              <Input value={customLoc} onChange={(e) => setCustomLoc(e.target.value)} placeholder="np. wilanów" />
            </label>
          )}

          <label className="text-sm flex flex-col gap-1">
            <span className="text-muted-foreground">Etykieta (opcjonalna)</span>
            <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="np. baseline usług 07/2026" />
          </label>
        </div>

        {appendLocation && (
          <div className="text-xs rounded-md bg-muted/50 px-3 py-2">
            Przykład zapytania: <code className="font-mono">{phrases[0] ?? "…"} {appendLocation}</code>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button disabled={runMut.isPending || !phrases.length} onClick={() => runMut.mutate()}>
            {runMut.isPending ? "Pobieram…" : "Uruchom research i zapisz"}
          </Button>
          {result && (<Button variant="outline" onClick={() => downloadCsv(result)}>Eksport CSV (pełny)</Button>)}
          {result && (<Button variant="outline" onClick={() => downloadRecommendationsCsv(result)}>Eksport rekomendacji CSV</Button>)}
          {result?.id && (
            <Button
              variant="default"
              disabled={clustersMut.isPending}
              onClick={() => clustersMut.mutate(result.id!)}
            >
              {clustersMut.isPending ? "Generuję klastry…" : "✨ Wygeneruj klastry artykułów"}
            </Button>
          )}
        </div>
      </section>

      {result && (
        <section className="rounded-lg border border-border p-4 space-y-3">
          <div className="flex items-center justify-between text-sm flex-wrap gap-2">
            <div>
              <div className="font-medium">{reportTitle(result)}</div>
              <div className="text-xs text-muted-foreground">
                Baza: <strong>{result.database}</strong>
                {result.appendLocation && <span className="ml-2">· filtr: <code className="font-mono">+ {result.appendLocation}</code></span>}
                {result.id && <span className="ml-2">· id: <code className="font-mono">{result.id.slice(0, 8)}</code></span>}
              </div>
            </div>
            <div className="text-muted-foreground text-xs">{result.rows.length} wierszy</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground">
                <tr>
                  <th className="py-2 pr-3">Fraza</th>
                  <th className="py-2 pr-3 text-right">Wolumen / mies.</th>
                  <th className="py-2 pr-3 text-right">KD</th>
                  <th className="py-2 pr-3 text-right">CPC</th>
                  <th className="py-2 pr-3 text-right">Konkurencja</th>
                  <th className="py-2 pr-3 text-right">Wyniki</th>
                  <th className="py-2 pr-3 text-right">SERP</th>
                  <th className="py-2 pr-3">Rekomendacja</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.map((r) => {
                  const serp = serpMap[r.phrase];
                  const rec = recommend(r);
                  const recTone =
                    rec.priority === "high" ? "text-emerald-500" :
                    rec.priority === "medium" ? "text-amber-500" :
                    rec.priority === "low" ? "text-orange-500" : "text-muted-foreground";
                  return (
                    <Fragment key={r.phrase}>
                      <tr className="border-t border-border">
                        <td className="py-2 pr-3 font-mono text-xs">{r.phrase}</td>
                        <td className="py-2 pr-3 text-right tabular-nums">{fmt(r.volume)}</td>
                        <td className={`py-2 pr-3 text-right tabular-nums font-medium ${kdTone(r.difficulty)}`}>{fmt(r.difficulty)}</td>
                        <td className="py-2 pr-3 text-right tabular-nums">{fmt(r.cpc, 2, " $")}</td>
                        <td className="py-2 pr-3 text-right tabular-nums">{fmt(r.competition, 2)}</td>
                        <td className="py-2 pr-3 text-right tabular-nums">{fmt(r.resultsCount)}</td>
                        <td className="py-2 pr-3 text-right">
                          <Button size="sm" variant="ghost" disabled={serp === "loading"} onClick={() => loadSerp(r.phrase)}>
                            {serp === "loading" ? "…" : serp ? "Odśwież" : "Pokaż"}
                          </Button>
                        </td>
                        <td className="py-2 pr-3">
                          <div className={`text-xs font-medium ${recTone}`}>{rec.label}</div>
                          <div className="text-xs text-muted-foreground">{rec.reason}</div>
                        </td>
                      </tr>
                      {serp && serp !== "loading" && (
                        <tr className="border-t border-border/50 bg-muted/20">
                          <td colSpan={8} className="py-2 px-3">
                            <div className="text-xs text-muted-foreground mb-1">Top 10 SERP dla <code className="font-mono">{r.phrase}</code></div>
                            <ol className="text-xs space-y-0.5">
                              {serp.results.map((s) => (
                                <li key={`${s.position}-${s.url}`} className="flex gap-2">
                                  <span className="w-6 text-muted-foreground tabular-nums">{s.position}.</span>
                                  <a href={s.url} target="_blank" rel="noreferrer" className="underline truncate">{s.domain}</a>
                                </li>
                              ))}
                              {!serp.results.length && <li className="text-muted-foreground">Brak wyników.</li>}
                            </ol>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-muted-foreground">
            KD (Keyword Difficulty): &lt;30 realne dla nowej strony · 30–50 wymaga dobrego contentu · 50–70 ambitne · 70+ teren dużych serwisów.
          </p>
        </section>
      )}

      <section className="rounded-lg border border-border p-4 space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="font-medium">Historia analiz</h3>
            <p className="text-xs text-muted-foreground">Zaznacz 2–4 raporty i kliknij „Porównaj", aby zestawić frazy między nimi.</p>
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <label className="text-xs text-muted-foreground flex flex-col">
              Od
              <Input type="date" value={reportFrom} onChange={(e) => setReportFrom(e.target.value)} className="w-40" />
            </label>
            <label className="text-xs text-muted-foreground flex flex-col">
              Do
              <Input type="date" value={reportTo} onChange={(e) => setReportTo(e.target.value)} className="w-40" />
            </label>
            {(reportFrom || reportTo) && (
              <Button variant="ghost" onClick={() => { setReportFrom(""); setReportTo(""); }}>Wyczyść</Button>
            )}
            <Button
              disabled={comparedIds.length < 2 || runCompareMut.isPending}
              onClick={() => runCompareMut.mutate()}
            >
              {runCompareMut.isPending ? "Ładuję…" : `Porównaj (${comparedIds.length})`}
            </Button>
            {comparedReports.length > 0 && (
              <Button variant="outline" onClick={() => { setComparedReports([]); setComparedIds([]); }}>
                Wyczyść porównanie
              </Button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr>
                <th className="py-1 pr-3 w-8"></th>
                <th className="py-1 pr-3">Data</th>
                <th className="py-1 pr-3">Etykieta</th>
                <th className="py-1 pr-3">Baza</th>
                <th className="py-1 pr-3">Filtr</th>
                <th className="py-1 pr-3 text-right">Fraz</th>
                <th className="py-1 pr-3 text-right">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {reports.data?.rows.map((r: ReportListRow) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="py-1 pr-3">
                    <input
                      type="checkbox"
                      checked={comparedIds.includes(r.id)}
                      onChange={() => toggleCompare(r.id)}
                    />
                  </td>
                  <td className="py-1 pr-3 whitespace-nowrap">{new Date(r.created_at).toLocaleString("pl-PL")}</td>
                  <td className="py-1 pr-3">{r.label ?? <span className="text-muted-foreground">—</span>}</td>
                  <td className="py-1 pr-3">{r.database}</td>
                  <td className="py-1 pr-3 text-muted-foreground">{r.append_location ? "+ " + r.append_location : "—"}</td>
                  <td className="py-1 pr-3 text-right tabular-nums">{r.phrase_count}</td>
                  <td className="py-1 pr-3 text-right whitespace-nowrap">
                    <Button variant="ghost" size="sm" disabled={openMut.isPending} onClick={() => openMut.mutate(r.id)}>Otwórz</Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        try {
                          const full = (await getFn({ data: { id: r.id } })) as ResearchResult;
                          downloadCsv(full);
                        } catch (e) {
                          toast.error(e instanceof Error ? e.message : String(e));
                        }
                      }}
                    >
                      CSV
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => {
                        if (confirm("Usunąć ten raport?")) deleteMut.mutate(r.id);
                      }}
                    >
                      Usuń
                    </Button>
                  </td>
                </tr>
              ))}
              {!reports.data?.rows.length && (
                <tr><td colSpan={7} className="py-4 text-center text-muted-foreground">Brak zapisanych analiz w wybranym zakresie.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {comparedReports.length >= 2 && (
        <section className="rounded-lg border border-border p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-medium">Porównanie ({comparedReports.length} raportów)</h3>
              <p className="text-xs text-muted-foreground">Frazy, które występują tylko w części raportów, mają „—" w brakujących kolumnach.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => downloadComparisonCsv(comparedReports, comparisonRows)}>
              Eksport porównania CSV
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground">
                <tr>
                  <th className="py-2 pr-3">Fraza</th>
                  {comparedReports.map((r, i) => (
                    <th key={r.id ?? i} colSpan={2} className="py-2 pr-3 border-l border-border">
                      <div className="font-medium text-foreground">{reportTitle(r)}</div>
                    </th>
                  ))}
                </tr>
                <tr>
                  <th></th>
                  {comparedReports.map((r, i) => (
                    <Fragment key={(r.id ?? i) + "-h"}>
                      <th className="py-1 pr-3 border-l border-border text-right">Wolumen</th>
                      <th className="py-1 pr-3 text-right">KD</th>
                    </Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((cr) => (
                  <tr key={cr.phrase} className="border-t border-border">
                    <td className="py-1 pr-3 font-mono text-xs">{cr.phrase}</td>
                    {cr.perReport.map((row, i) => (
                      <Fragment key={i}>
                        <td className="py-1 pr-3 text-right tabular-nums border-l border-border">{fmt(row?.volume ?? null)}</td>
                        <td className={`py-1 pr-3 text-right tabular-nums ${kdTone(row?.difficulty ?? null)}`}>{fmt(row?.difficulty ?? null)}</td>
                      </Fragment>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {clusters && clusters.clusters.length > 0 && (
        <section id="clusters-section" className="rounded-lg border border-border p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-medium">Propozycje klastrów artykułów ({clusters.clusters.length})</h3>
              <p className="text-xs text-muted-foreground">Wygenerowane przez AI na bazie fraz z raportu. Każdy klaster = pillar + wspierające, gotowe do publikacji.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => downloadClustersCsv(clusters.clusters)}>Eksport klastrów CSV</Button>
              <Button variant="outline" size="sm" onClick={() => downloadClustersMarkdown(clusters.clusters)}>Eksport Markdown</Button>
              <Button variant="ghost" size="sm" onClick={() => setClusters(null)}>Zamknij</Button>
            </div>
          </div>

          <div className="space-y-4">
            {clusters.clusters.map((c, idx) => (
              <div key={idx} className="rounded-md border border-border/70 p-4 space-y-3 bg-muted/20">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <h4 className="font-semibold">{c.cluster}</h4>
                    <div className="text-xs text-muted-foreground">
                      Usługa: <strong>{c.targetService}</strong> · intent: <code className="font-mono">{c.intent}</code>
                    </div>
                  </div>
                </div>

                <div className="rounded bg-background border border-border/50 p-3">
                  <div className="text-xs uppercase text-muted-foreground mb-1">Pillar</div>
                  <div className="font-medium">{c.pillarTitle}</div>
                  <code className="text-xs text-muted-foreground font-mono">/{c.pillarSlug}</code>
                </div>

                <div>
                  <div className="text-xs uppercase text-muted-foreground mb-2">Artykuły wspierające</div>
                  <ul className="space-y-2">
                    {c.supportingArticles.map((a, i) => (
                      <li key={i} className="text-sm border-l-2 border-border pl-3">
                        <div className="font-medium">{a.title}</div>
                        <code className="text-xs text-muted-foreground font-mono">/{a.slug}</code>
                        <div className="text-xs text-muted-foreground mt-1">
                          <span className="font-mono">{a.primaryKeyword}</span>
                          {a.estimatedVolume != null && <span> · vol {fmt(a.estimatedVolume)}</span>}
                          {a.estimatedKd != null && <span className={kdTone(a.estimatedKd)}> · KD {fmt(a.estimatedKd)}</span>}
                        </div>
                        {a.supportingKeywords.length > 0 && (
                          <div className="text-xs mt-1 flex flex-wrap gap-1">
                            {a.supportingKeywords.map((k, j) => (
                              <span key={j} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">{k}</span>
                            ))}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground mt-1 italic">{a.angle}</div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-xs grid gap-2 sm:grid-cols-2">
                  <div><span className="text-muted-foreground">Linkowanie: </span>{c.internalLinking}</div>
                  <div><span className="text-muted-foreground">CTA: </span>{c.cta}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
