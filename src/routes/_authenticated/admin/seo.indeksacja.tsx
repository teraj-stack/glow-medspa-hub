import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  submitIndexationNow,
  listIndexationSubmissions,
  inspectIndexation,
  bulkInspectIndexation,
  indexNowStatus,
} from "@/lib/seo-indexation.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type BulkRow = {
  url: string;
  ok: boolean;
  verdict: string | null;
  coverageState: string | null;
  indexingState: string | null;
  robotsTxtState: string | null;
  lastCrawlTime: string | null;
  googleCanonical: string | null;
  error: string | null;
};
type BulkResult = {
  results: BulkRow[];
  summary: { total: number; passing: number; neutral: number; failing: number; errors: number };
};

export const Route = createFileRoute("/_authenticated/admin/seo/indeksacja")({
  codeSplitGroupings: [["loader", "component", "errorComponent", "notFoundComponent", "pendingComponent"]],
  component: IndeksacjaPanel,
});

function IndeksacjaPanel() {
  const qc = useQueryClient();
  const submitFn = useServerFn(submitIndexationNow);
  const listFn = useServerFn(listIndexationSubmissions);
  const inspectFn = useServerFn(inspectIndexation);
  const bulkFn = useServerFn(bulkInspectIndexation);
  const statusFn = useServerFn(indexNowStatus);

  const status = useQuery({ queryKey: ["indexnow-status"], queryFn: () => statusFn() });
  const list = useQuery({ queryKey: ["indexation-submissions"], queryFn: () => listFn() });

  const [urls, setUrls] = useState("");
  const [inspectUrl, setInspectUrl] = useState("https://bmclinics.ai/");
  const [inspectResult, setInspectResult] = useState<any>(null);
  const [bulkUrls, setBulkUrls] = useState("");
  const [bulkResult, setBulkResult] = useState<BulkResult | null>(null);

  const submitMut = useMutation({
    mutationFn: async () => {
      const list = urls
        .split(/\s+/)
        .map((u) => u.trim())
        .filter(Boolean);
      return submitFn({ data: { urls: list } });
    },
    onSuccess: () => {
      toast.success("Zgłoszenia wysłane");
      qc.invalidateQueries({ queryKey: ["indexation-submissions"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const inspectMut = useMutation({
    mutationFn: async () => inspectFn({ data: { url: inspectUrl } }),
    onSuccess: (data) => {
      setInspectResult(data);
      qc.invalidateQueries({ queryKey: ["indexation-submissions"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const idx = inspectResult?.inspectionResult?.indexStatusResult;

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">Indeksacja & sitemap</h2>
        <p className="text-sm text-muted-foreground">
          Automatyczne zgłoszenia mapy witryny do Google Search Console i Bing (IndexNow) oraz weryfikacja statusu indeksacji.
        </p>
      </header>

      <section className="rounded-lg border border-border p-4 space-y-3">
        <h3 className="font-medium">Status konfiguracji</h3>
        <div className="text-sm space-y-1 text-muted-foreground">
          <div>
            Google Search Console:{" "}
            <span className="text-foreground">połączone przez konektor</span>
          </div>
          <div>
            Bing IndexNow:{" "}
            {status.data?.configured ? (
              <span className="text-foreground">
                aktywny (klucz {status.data.keyPrefix}), plik weryfikacyjny:{" "}
                <a href={status.data.keyLocation!} className="underline" target="_blank" rel="noreferrer">
                  {status.data.keyLocation}
                </a>
              </span>
            ) : (
              <span className="text-destructive">brak klucza INDEXNOW_KEY</span>
            )}
          </div>
          <div>Cron: codziennie o 06:15 (zgłoszenie sitemap do obu wyszukiwarek)</div>
        </div>
      </section>

      <section className="rounded-lg border border-border p-4 space-y-3">
        <h3 className="font-medium">Zgłoś teraz</h3>
        <p className="text-xs text-muted-foreground">
          Puste pole → wyślij samą sitemap. Wpisz jedno lub więcej URL-i (po jednym w linii), aby dodatkowo zgłosić je do IndexNow.
        </p>
        <Textarea
          rows={4}
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          placeholder="https://bmclinics.ai/blog/nowy-artykul"
        />
        <Button disabled={submitMut.isPending} onClick={() => submitMut.mutate()}>
          {submitMut.isPending ? "Wysyłam…" : "Zgłoś do Google + Bing"}
        </Button>
      </section>

      <section className="rounded-lg border border-border p-4 space-y-3">
        <h3 className="font-medium">Weryfikacja statusu indeksacji (Google URL Inspection)</h3>
        <div className="flex gap-2">
          <Input value={inspectUrl} onChange={(e) => setInspectUrl(e.target.value)} />
          <Button disabled={inspectMut.isPending} onClick={() => inspectMut.mutate()}>
            {inspectMut.isPending ? "Sprawdzam…" : "Sprawdź"}
          </Button>
        </div>
        {idx && (
          <div className="text-sm rounded-md bg-muted/50 p-3 space-y-1">
            <div>Werdykt: <span className="font-medium">{idx.verdict}</span></div>
            <div>Status pokrycia: {idx.coverageState}</div>
            <div>Robots: {idx.robotsTxtState}</div>
            <div>Indeksowanie: {idx.indexingState}</div>
            {idx.lastCrawlTime && <div>Ostatni crawl: {new Date(idx.lastCrawlTime).toLocaleString("pl-PL")}</div>}
            {idx.googleCanonical && <div>Kanoniczny wg Google: {idx.googleCanonical}</div>}
          </div>
        )}
      </section>

      <section className="rounded-lg border border-border p-4">
        <h3 className="font-medium mb-3">Historia zgłoszeń (50 ostatnich)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr>
                <th className="py-1 pr-3">Data</th>
                <th className="py-1 pr-3">Provider</th>
                <th className="py-1 pr-3">Typ</th>
                <th className="py-1 pr-3">Cel</th>
                <th className="py-1 pr-3">HTTP</th>
                <th className="py-1 pr-3">Status</th>
                <th className="py-1 pr-3">Źródło</th>
              </tr>
            </thead>
            <tbody>
              {list.data?.rows.map((r: any) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="py-1 pr-3 whitespace-nowrap">{new Date(r.created_at).toLocaleString("pl-PL")}</td>
                  <td className="py-1 pr-3">{r.provider}</td>
                  <td className="py-1 pr-3">{r.kind}</td>
                  <td className="py-1 pr-3 max-w-xs truncate" title={r.target}>{r.target}</td>
                  <td className="py-1 pr-3">{r.http_status ?? "—"}</td>
                  <td className={`py-1 pr-3 ${r.status === "ok" ? "text-emerald-500" : "text-destructive"}`}>{r.status}</td>
                  <td className="py-1 pr-3 text-muted-foreground">{r.triggered_by}</td>
                </tr>
              ))}
              {!list.data?.rows.length && (
                <tr><td colSpan={7} className="py-4 text-center text-muted-foreground">Brak zgłoszeń.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
