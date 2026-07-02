import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { researchKeywords, researchKeywordSerp } from "@/lib/keyword-research.functions";
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
type ResearchResult = { database: string; appendLocation: string | null; rows: Row[] };
type SerpResult = { phrase: string; database: string; results: { position: number | null; domain: string; url: string }[] };

const DATABASES = [
  { value: "pl", label: "Polska (pl)" },
  { value: "us", label: "USA (us)" },
  { value: "uk", label: "Wielka Brytania (uk)" },
  { value: "de", label: "Niemcy (de)" },
];

function fmt(n: number | null, digits = 0, suffix = "") {
  if (n == null) return "—";
  return n.toLocaleString("pl-PL", { maximumFractionDigits: digits }) + suffix;
}

function kdTone(kd: number | null) {
  if (kd == null) return "text-muted-foreground";
  if (kd < 30) return "text-emerald-500";
  if (kd < 50) return "text-amber-500";
  if (kd < 70) return "text-orange-500";
  return "text-destructive";
}

function KeywordsPanel() {
  const researchFn = useServerFn(researchKeywords);
  const serpFn = useServerFn(researchKeywordSerp);

  const [input, setInput] = useState("");
  const [database, setDatabase] = useState("pl");
  const [appendMode, setAppendMode] = useState<"none" | "siedlce" | "warszawa" | "custom">("none");
  const [customLoc, setCustomLoc] = useState("");
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [serpMap, setSerpMap] = useState<Record<string, SerpResult | "loading">>({});

  const appendLocation =
    appendMode === "siedlce" ? "siedlce" :
    appendMode === "warszawa" ? "warszawa" :
    appendMode === "custom" ? customLoc.trim() : "";

  const phrases = useMemo(
    () =>
      input
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 50),
    [input],
  );

  const runMut = useMutation({
    mutationFn: async () => {
      if (!phrases.length) throw new Error("Wklej co najmniej jedną frazę");
      return researchFn({
        data: { phrases, database, appendLocation: appendLocation || undefined },
      }) as Promise<ResearchResult>;
    },
    onSuccess: (r) => {
      setResult(r);
      setSerpMap({});
      toast.success(`Pobrano dane dla ${r.rows.length} fraz`);
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

  const exportCsv = () => {
    if (!result) return;
    const header = ["fraza", "wolumen", "KD", "CPC (USD)", "konkurencja", "wyniki"];
    const rows = result.rows.map((r) =>
      [r.phrase, r.volume ?? "", r.difficulty ?? "", r.cpc ?? "", r.competition ?? "", r.resultsCount ?? ""]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    const blob = new Blob([header.join(",") + "\n" + rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `keyword-research-${result.database}${result.appendLocation ? "-" + result.appendLocation : ""}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">Research słów kluczowych</h2>
        <p className="text-sm text-muted-foreground">
          Wklej listę fraz lub nazw usług (po jednej w linii, max 50). Dane: wolumen wyszukiwań, trudność (KD), CPC i SERP — z Semrush dla wybranej bazy. Włącz filtr lokalizacji, żeby doliczyć „siedlce" lub „warszawa" do każdej frazy.
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
          {phrases.length} fraz{phrases.length === 1 ? "a" : phrases.length >= 2 && phrases.length <= 4 ? "y" : ""} do sprawdzenia (limit 50).
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-sm flex flex-col gap-1">
            <span className="text-muted-foreground">Baza Semrush</span>
            <select
              value={database}
              onChange={(e) => setDatabase(e.target.value)}
              className="border border-border rounded-md h-9 px-2 bg-background"
            >
              {DATABASES.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </label>

          <label className="text-sm flex flex-col gap-1">
            <span className="text-muted-foreground">Filtr lokalizacji (dopisze do każdej frazy)</span>
            <select
              value={appendMode}
              onChange={(e) => setAppendMode(e.target.value as any)}
              className="border border-border rounded-md h-9 px-2 bg-background"
            >
              <option value="none">Brak — badam frazy krajowo</option>
              <option value="siedlce">+ siedlce</option>
              <option value="warszawa">+ warszawa</option>
              <option value="custom">+ własne miasto / dzielnica…</option>
            </select>
          </label>

          {appendMode === "custom" && (
            <label className="text-sm flex flex-col gap-1">
              <span className="text-muted-foreground">Własna lokalizacja</span>
              <Input
                value={customLoc}
                onChange={(e) => setCustomLoc(e.target.value)}
                placeholder="np. bielany"
              />
            </label>
          )}
        </div>

        {appendLocation && (
          <div className="text-xs rounded-md bg-muted/50 px-3 py-2">
            Przykład zapytania: <code className="font-mono">{phrases[0] ?? "…"} {appendLocation}</code>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button disabled={runMut.isPending || !phrases.length} onClick={() => runMut.mutate()}>
            {runMut.isPending ? "Pobieram…" : "Uruchom research"}
          </Button>
          {result && (
            <Button variant="outline" onClick={exportCsv}>Eksport CSV</Button>
          )}
        </div>
      </section>

      {result && (
        <section className="rounded-lg border border-border p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div>
              Baza: <strong>{result.database}</strong>
              {result.appendLocation && (
                <span className="ml-2 text-muted-foreground">
                  · filtr: <code className="font-mono">+ {result.appendLocation}</code>
                </span>
              )}
            </div>
            <div className="text-muted-foreground">{result.rows.length} wierszy</div>
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
                </tr>
              </thead>
              <tbody>
                {result.rows.map((r) => {
                  const serp = serpMap[r.phrase];
                  return (
                    <>
                      <tr key={r.phrase} className="border-t border-border">
                        <td className="py-2 pr-3 font-mono text-xs">{r.phrase}</td>
                        <td className="py-2 pr-3 text-right tabular-nums">{fmt(r.volume)}</td>
                        <td className={`py-2 pr-3 text-right tabular-nums font-medium ${kdTone(r.difficulty)}`}>
                          {fmt(r.difficulty, 0)}
                        </td>
                        <td className="py-2 pr-3 text-right tabular-nums">{fmt(r.cpc, 2, " $")}</td>
                        <td className="py-2 pr-3 text-right tabular-nums">{fmt(r.competition, 2)}</td>
                        <td className="py-2 pr-3 text-right tabular-nums">{fmt(r.resultsCount)}</td>
                        <td className="py-2 pr-3 text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={serp === "loading"}
                            onClick={() => loadSerp(r.phrase)}
                          >
                            {serp === "loading" ? "…" : serp ? "Odśwież" : "Pokaż"}
                          </Button>
                        </td>
                      </tr>
                      {serp && serp !== "loading" && (
                        <tr key={r.phrase + "-serp"} className="border-t border-border/50 bg-muted/20">
                          <td colSpan={7} className="py-2 px-3">
                            <div className="text-xs text-muted-foreground mb-1">
                              Top 10 SERP dla <code className="font-mono">{r.phrase}</code>
                            </div>
                            <ol className="text-xs space-y-0.5">
                              {serp.results.map((s) => (
                                <li key={`${s.position}-${s.url}`} className="flex gap-2">
                                  <span className="w-6 text-muted-foreground tabular-nums">{s.position}.</span>
                                  <a href={s.url} target="_blank" rel="noreferrer" className="underline truncate">
                                    {s.domain}
                                  </a>
                                </li>
                              ))}
                              {!serp.results.length && <li className="text-muted-foreground">Brak wyników.</li>}
                            </ol>
                          </td>
                        </tr>
                      )}
                    </>
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
    </div>
  );
}
