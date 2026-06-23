import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  gscOverview,
  gscListSitemaps,
  gscSubmitSitemap,
  gscDeleteSitemap,
  gscInspectUrl,
} from "@/lib/seo-gsc.functions";
import { validateSitemap, type SitemapValidationResult } from "@/lib/sitemap-validate.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/seo")({
  component: SeoPanel,
});

function fmtNum(n: number | undefined | null, digits = 0) {
  if (n == null) return "—";
  return n.toLocaleString("pl-PL", { maximumFractionDigits: digits });
}

function delta(curr?: number | null, prev?: number | null) {
  if (curr == null || prev == null || prev === 0) return null;
  const d = ((curr - prev) / prev) * 100;
  return d;
}

function DeltaBadge({ value }: { value: number | null }) {
  if (value == null) return null;
  const positive = value >= 0;
  return (
    <span
      className={`text-xs px-1.5 py-0.5 rounded ${
        positive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
      }`}
    >
      {positive ? "▲" : "▼"} {Math.abs(value).toFixed(1)}%
    </span>
  );
}

function StatBox({ label, count, tone }: { label: string; count: number; tone: "green" | "red" | "amber" }) {
  const toneCls =
    tone === "green"
      ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-500"
      : tone === "red"
        ? "border-red-500/30 bg-red-500/5 text-red-500"
        : "border-amber-500/30 bg-amber-500/5 text-amber-500";
  return (
    <div className={`rounded-md border p-3 ${toneCls}`}>
      <div className="text-xs uppercase tracking-wide opacity-80">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">{count}</div>
    </div>
  );
}

function DiffList({ title, items, tone }: { title: string; items: string[]; tone: "red" | "amber" }) {
  const cls = tone === "red" ? "text-red-500" : "text-amber-500";
  return (
    <div>
      <div className={`text-xs uppercase tracking-wide mb-1 ${cls}`}>{title}</div>
      <div className="rounded-md border border-border divide-y divide-border max-h-60 overflow-auto">
        {items.map((p) => (
          <div key={p} className="px-3 py-1.5 text-xs font-mono truncate">
            {p}
          </div>
        ))}
      </div>
    </div>
  );

function SeoPanel() {
  const router = useRouter();
  const overview = useQuery({
    queryKey: ["gsc", "overview"],
    queryFn: () => gscOverview(),
    staleTime: 5 * 60 * 1000,
  });
  const sitemaps = useQuery({
    queryKey: ["gsc", "sitemaps"],
    queryFn: () => gscListSitemaps(),
    staleTime: 60 * 1000,
  });

  const submitFn = useServerFn(gscSubmitSitemap);
  const deleteFn = useServerFn(gscDeleteSitemap);
  const inspectFn = useServerFn(gscInspectUrl);

  const [sitemapPath, setSitemapPath] = useState("/sitemap.xml");
  const [inspectUrl, setInspectUrl] = useState("/");
  const [inspectResult, setInspectResult] = useState<any>(null);
  const [inspecting, setInspecting] = useState(false);

  const validateFn = useServerFn(validateSitemap);
  const [validation, setValidation] = useState<SitemapValidationResult | null>(null);
  const [validating, setValidating] = useState(false);
  const [validateBase, setValidateBase] = useState("https://bmclinics.ai");
  const [validateProbe, setValidateProbe] = useState(false);

  const t = overview.data?.totals;
  const p = overview.data?.previous;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">SEO & widoczność</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Dane z Google Search Console dla bmclinics.ai — okno 30 dni vs poprzednie 30 dni.
        </p>
      </div>

      {overview.isError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm">
          Błąd pobierania danych: {(overview.error as Error).message}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Kliknięcia", curr: t?.clicks, prev: p?.clicks, digits: 0 },
          { label: "Wyświetlenia", curr: t?.impressions, prev: p?.impressions, digits: 0 },
          {
            label: "CTR",
            curr: t?.ctr != null ? t.ctr * 100 : undefined,
            prev: p?.ctr != null ? p.ctr * 100 : undefined,
            digits: 2,
            suffix: "%",
          },
          { label: "Średnia pozycja", curr: t?.position, prev: p?.position, digits: 1, invert: true },
        ].map((card) => {
          const d = delta(card.curr, card.prev);
          return (
            <div key={card.label} className="rounded-lg border border-border p-4">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                {card.label}
              </div>
              <div className="mt-2 text-2xl font-semibold">
                {overview.isLoading ? "…" : `${fmtNum(card.curr, card.digits)}${card.suffix ?? ""}`}
              </div>
              <div className="mt-1">
                <DeltaBadge value={card.invert && d != null ? -d : d} />
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border">
          <div className="border-b border-border px-4 py-3 text-sm font-medium">
            Top zapytania (30 dni)
          </div>
          <div className="divide-y divide-border">
            {overview.isLoading && <div className="px-4 py-3 text-sm text-muted-foreground">Ładowanie…</div>}
            {overview.data?.topQueries.slice(0, 15).map((row: any) => (
              <div key={row.keys[0]} className="px-4 py-2 flex items-center justify-between gap-3 text-sm">
                <span className="truncate">{row.keys[0]}</span>
                <span className="text-muted-foreground tabular-nums whitespace-nowrap">
                  {fmtNum(row.clicks)} klik · {fmtNum(row.impressions)} wyśw · poz. {row.position.toFixed(1)}
                </span>
              </div>
            ))}
            {overview.data && overview.data.topQueries.length === 0 && (
              <div className="px-4 py-3 text-sm text-muted-foreground">Brak danych.</div>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-border">
          <div className="border-b border-border px-4 py-3 text-sm font-medium">
            Top strony (30 dni)
          </div>
          <div className="divide-y divide-border">
            {overview.isLoading && <div className="px-4 py-3 text-sm text-muted-foreground">Ładowanie…</div>}
            {overview.data?.topPages.slice(0, 15).map((row: any) => {
              const url = row.keys[0] as string;
              const path = url.replace(/^https?:\/\/[^/]+/, "") || "/";
              return (
                <div key={url} className="px-4 py-2 flex items-center justify-between gap-3 text-sm">
                  <a href={url} target="_blank" rel="noreferrer" className="truncate hover:underline">
                    {path}
                  </a>
                  <span className="text-muted-foreground tabular-nums whitespace-nowrap">
                    {fmtNum(row.clicks)} klik · {fmtNum(row.impressions)} wyśw
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border">
        <div className="border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="text-sm font-medium">Mapy witryny</div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => sitemaps.refetch()}
            disabled={sitemaps.isFetching}
          >
            Odśwież
          </Button>
        </div>
        <div className="divide-y divide-border">
          {sitemaps.data?.sitemaps.map((s: any) => (
            <div key={s.path} className="px-4 py-3 flex items-center justify-between gap-3 text-sm">
              <div className="min-w-0">
                <a href={s.path} target="_blank" rel="noreferrer" className="font-medium truncate block hover:underline">
                  {s.path}
                </a>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Ostatnie pobranie: {s.lastDownloaded ? new Date(s.lastDownloaded).toLocaleString("pl-PL") : "—"}
                  {" · "}URL-i: {s.contents?.[0]?.submitted ?? "—"} / zindeksowano: {s.contents?.[0]?.indexed ?? "—"}
                  {s.errors > 0 && <span className="text-destructive"> · błędy: {s.errors}</span>}
                  {s.warnings > 0 && <span className="text-amber-500"> · ostrzeżenia: {s.warnings}</span>}
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={async () => {
                  try {
                    await deleteFn({ data: { feedpath: s.path } });
                    toast.success("Usunięto mapę witryny.");
                    sitemaps.refetch();
                  } catch (e: any) {
                    toast.error(e.message);
                  }
                }}
              >
                Usuń
              </Button>
            </div>
          ))}
          {sitemaps.data && sitemaps.data.sitemaps.length === 0 && (
            <div className="px-4 py-3 text-sm text-muted-foreground">Brak zgłoszonych map witryny.</div>
          )}
        </div>
        <div className="border-t border-border px-4 py-3 flex flex-col sm:flex-row gap-2 sm:items-center">
          <Input
            value={sitemapPath}
            onChange={(e) => setSitemapPath(e.target.value)}
            placeholder="/sitemap.xml"
            className="sm:max-w-xs"
          />
          <Button
            size="sm"
            onClick={async () => {
              try {
                await submitFn({ data: { path: sitemapPath } });
                toast.success("Zgłoszono mapę witryny.");
                sitemaps.refetch();
              } catch (e: any) {
                toast.error(e.message);
              }
            }}
          >
            Zgłoś mapę
          </Button>
        </div>
      </section>

      <section className="rounded-lg border border-border">
        <div className="border-b border-border px-4 py-3 text-sm font-medium">
          Sprawdź indeksację URL
        </div>
        <div className="px-4 py-3 flex flex-col sm:flex-row gap-2 sm:items-center">
          <Input
            value={inspectUrl}
            onChange={(e) => setInspectUrl(e.target.value)}
            placeholder="/technologie/picoking"
            className="sm:max-w-md"
          />
          <Button
            size="sm"
            disabled={inspecting}
            onClick={async () => {
              setInspecting(true);
              setInspectResult(null);
              try {
                const r = await inspectFn({ data: { url: inspectUrl } });
                setInspectResult(r);
              } catch (e: any) {
                toast.error(e.message);
              } finally {
                setInspecting(false);
              }
            }}
          >
            {inspecting ? "Sprawdzam…" : "Sprawdź w Google"}
          </Button>
        </div>
        {inspectResult && (
          <div className="border-t border-border px-4 py-3 text-sm space-y-2">
            {(() => {
              const i = inspectResult.inspectionResult?.indexStatusResult;
              if (!i) return <pre className="text-xs overflow-auto">{JSON.stringify(inspectResult, null, 2)}</pre>;
              return (
                <>
                  <div>
                    <span className="text-muted-foreground">Werdykt: </span>
                    <span className="font-medium">{i.verdict ?? "—"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Pokrycie: </span>
                    {i.coverageState ?? "—"}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Stan indeksowania: </span>
                    {i.indexingState ?? "—"}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Ostatnie crawlowanie: </span>
                    {i.lastCrawlTime ? new Date(i.lastCrawlTime).toLocaleString("pl-PL") : "—"}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Robots.txt: </span>
                    {i.robotsTxtState ?? "—"}
                  </div>
                  {inspectResult.inspectionResult?.inspectionResultLink && (
                    <a
                      href={inspectResult.inspectionResult.inspectionResultLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline inline-block mt-2"
                    >
                      Otwórz w Search Console →
                    </a>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </section>

      <section className="rounded-lg border border-border">
        <div className="border-b border-border px-4 py-3 text-sm font-medium flex items-center justify-between">
          <span>Walidacja sitemap.xml</span>
          {validation && (
            <span className="text-xs text-muted-foreground">
              {validation.liveCount} URL-i w live · oczekiwano {validation.expectedCount}
            </span>
          )}
        </div>
        <div className="px-4 py-3 flex flex-col sm:flex-row gap-2 sm:items-center">
          <Input
            value={validateBase}
            onChange={(e) => setValidateBase(e.target.value)}
            placeholder="https://bmclinics.ai"
            className="sm:max-w-md"
          />
          <label className="flex items-center gap-2 text-xs text-muted-foreground whitespace-nowrap">
            <input
              type="checkbox"
              checked={validateProbe}
              onChange={(e) => setValidateProbe(e.target.checked)}
            />
            Sprawdź status HTTP każdego URL-a
          </label>
          <Button
            size="sm"
            disabled={validating}
            onClick={async () => {
              setValidating(true);
              try {
                const r = await validateFn({
                  data: { baseUrl: validateBase, checkUrls: validateProbe },
                });
                setValidation(r);
                if (!r.fetchOk) {
                  toast.error(`Nie udało się pobrać sitemap: ${r.fetchError ?? "błąd"}`);
                } else if (r.missing.length === 0 && r.extras.length === 0 && r.duplicates.length === 0) {
                  toast.success("Sitemap zgodna z oczekiwanymi wpisami.");
                } else {
                  toast.warning(
                    `Znaleziono rozbieżności: brak ${r.missing.length}, nadmiarowych ${r.extras.length}, duplikatów ${r.duplicates.length}.`,
                  );
                }
              } catch (e: any) {
                toast.error(e.message);
              } finally {
                setValidating(false);
              }
            }}
          >
            {validating ? "Sprawdzam…" : "Sprawdź sitemap"}
          </Button>
        </div>
        {validation && (
          <div className="border-t border-border px-4 py-3 text-sm space-y-4">
            <div className="text-xs text-muted-foreground">
              Źródło:{" "}
              <a href={validation.fetchedFrom} target="_blank" rel="noreferrer" className="hover:underline">
                {validation.fetchedFrom}
              </a>{" "}
              · {new Date(validation.fetchedAt).toLocaleString("pl-PL")}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <StatBox label="Brakujące" count={validation.missing.length} tone={validation.missing.length ? "red" : "green"} />
              <StatBox label="Nadmiarowe" count={validation.extras.length} tone={validation.extras.length ? "amber" : "green"} />
              <StatBox label="Duplikaty" count={validation.duplicates.length} tone={validation.duplicates.length ? "red" : "green"} />
            </div>

            {validation.missing.length > 0 && (
              <DiffList
                title="Brakujące w live sitemap"
                items={validation.missing.map((m) => `${m.path}`)}
                tone="red"
              />
            )}
            {validation.extras.length > 0 && (
              <DiffList
                title="Nadmiarowe (w live, nieoczekiwane)"
                items={validation.extras}
                tone="amber"
              />
            )}
            {validation.duplicates.length > 0 && (
              <DiffList title="Duplikaty" items={validation.duplicates} tone="red" />
            )}

            {validation.urlChecks.length > 0 && (
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                  Status HTTP ({validation.urlChecks.length})
                </div>
                <div className="rounded-md border border-border divide-y divide-border max-h-80 overflow-auto">
                  {validation.urlChecks.map((c) => (
                    <div
                      key={c.path}
                      className="px-3 py-1.5 flex items-center justify-between gap-3 text-xs"
                    >
                      <span className="truncate font-mono">{c.path}</span>
                      <span
                        className={`tabular-nums whitespace-nowrap ${
                          c.ok
                            ? "text-emerald-500"
                            : c.status && c.status >= 300 && c.status < 400
                              ? "text-amber-500"
                              : "text-red-500"
                        }`}
                      >
                        {c.status ?? c.error ?? "—"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>


      <div>
        <Button variant="ghost" size="sm" onClick={() => router.invalidate()}>
          Odśwież wszystkie dane
        </Button>
      </div>
    </div>
  );
}
