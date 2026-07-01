import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getNapSettings, updateNapSettings, type NapSettings, type NapHours } from "@/lib/nap.functions";
import {
  CITATION_TARGETS,
  citationRowForTarget,
  citationsCsv,
  napToCsv,
  napToJsonLd,
  napToPlainText,
} from "@/lib/nap-citations";

export const Route = createFileRoute("/_authenticated/admin/nap")({
  codeSplitGroupings: [["loader", "component", "errorComponent", "notFoundComponent", "pendingComponent"]],
  component: NapAdminPage,
});

function NapAdminPage() {
  const qc = useQueryClient();
  const fetchNap = useServerFn(getNapSettings);
  const saveNap = useServerFn(updateNapSettings);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "nap-settings"],
    queryFn: () => fetchNap(),
  });

  const [form, setForm] = useState<NapSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data && !form) setForm(data);
  }, [data, form]);

  function setField<K extends keyof NapSettings>(key: K, value: NapSettings[K]) {
    setForm((f) => (f ? { ...f, [key]: value } : f));
  }

  function updateHour(i: number, patch: Partial<NapHours>) {
    setForm((f) => {
      if (!f) return f;
      const hours = f.hours_json.map((h, idx) => (idx === i ? { ...h, ...patch } : h));
      return { ...f, hours_json: hours };
    });
  }

  function addHourRow() {
    setForm((f) => (f ? { ...f, hours_json: [...f.hours_json, { day: "", opens: "09:00", closes: "18:00" }] } : f));
  }
  function removeHourRow(i: number) {
    setForm((f) => (f ? { ...f, hours_json: f.hours_json.filter((_, idx) => idx !== i) } : f));
  }

  async function handleSave() {
    if (!form) return;
    setSaving(true);
    try {
      await saveNap({ data: form });
      toast.success("Dane NAP zapisane.");
      await qc.invalidateQueries({ queryKey: ["admin", "nap-settings"] });
      await qc.invalidateQueries({ queryKey: ["nap-settings"] });
    } catch (e) {
      toast.error(`Nie udało się zapisać: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  }

  if (isLoading || !form) {
    return <div className="text-sm text-muted-foreground">Ładowanie…</div>;
  }
  if (error) {
    return <div className="text-sm text-destructive">Błąd: {(error as Error).message}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">NAP — dane firmy do cytowań lokalnych</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Trzymaj DOKŁADNIE ten sam Name / Address / Phone we wszystkich katalogach.
          Rozbieżności obniżają zaufanie Google Maps i miejscową widoczność.
        </p>
      </div>

      <Tabs defaultValue="edit">
        <TabsList>
          <TabsTrigger value="edit">Edycja</TabsTrigger>
          <TabsTrigger value="citations">Katalogi lokalne</TabsTrigger>
          <TabsTrigger value="exports">Eksporty</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-6">
          <section className="grid gap-4 md:grid-cols-2">
            <Field label="Nazwa (Name)">
              <Input value={form.business_name} onChange={(e) => setField("business_name", e.target.value)} />
            </Field>
            <Field label="Nazwa prawna (opcjonalna)">
              <Input value={form.legal_name ?? ""} onChange={(e) => setField("legal_name", e.target.value)} />
            </Field>
            <Field label="Ulica i numer (Address)">
              <Input value={form.street_address} onChange={(e) => setField("street_address", e.target.value)} />
            </Field>
            <Field label="Kod pocztowy">
              <Input value={form.postal_code} onChange={(e) => setField("postal_code", e.target.value)} />
            </Field>
            <Field label="Miasto">
              <Input value={form.city} onChange={(e) => setField("city", e.target.value)} />
            </Field>
            <Field label="Region / województwo">
              <Input value={form.region} onChange={(e) => setField("region", e.target.value)} />
            </Field>
            <Field label="Kraj (ISO)">
              <Input value={form.country_code} maxLength={2} onChange={(e) => setField("country_code", e.target.value.toUpperCase())} />
            </Field>
            <Field label="Telefon (do wyświetlenia)">
              <Input placeholder="+48 22 123 45 67" value={form.phone ?? ""} onChange={(e) => setField("phone", e.target.value)} />
            </Field>
            <Field label="Telefon E.164 (do tel:)">
              <Input placeholder="+48221234567" value={form.phone_e164 ?? ""} onChange={(e) => setField("phone_e164", e.target.value)} />
            </Field>
            <Field label="E-mail">
              <Input type="email" value={form.email ?? ""} onChange={(e) => setField("email", e.target.value)} />
            </Field>
            <Field label="Strona www">
              <Input value={form.website} onChange={(e) => setField("website", e.target.value)} />
            </Field>
            <Field label="Google Maps URL">
              <Input value={form.google_maps_url ?? ""} onChange={(e) => setField("google_maps_url", e.target.value)} />
            </Field>
            <Field label="Google Business Profile URL">
              <Input value={form.google_business_profile_url ?? ""} onChange={(e) => setField("google_business_profile_url", e.target.value)} />
            </Field>
            <Field label="Latitude">
              <Input inputMode="decimal" value={form.latitude ?? ""} onChange={(e) => setField("latitude", e.target.value === "" ? null : Number(e.target.value))} />
            </Field>
            <Field label="Longitude">
              <Input inputMode="decimal" value={form.longitude ?? ""} onChange={(e) => setField("longitude", e.target.value === "" ? null : Number(e.target.value))} />
            </Field>
          </section>

          <section>
            <Label className="text-sm">Kategorie (oddziel „,")</Label>
            <Input
              className="mt-1"
              value={form.categories.join(", ")}
              onChange={(e) => setField("categories", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
            />
          </section>

          <section>
            <Label className="text-sm">Krótki opis firmy (do katalogów)</Label>
            <Textarea
              className="mt-1"
              rows={3}
              maxLength={400}
              value={form.description ?? ""}
              onChange={(e) => setField("description", e.target.value)}
            />
          </section>

          <section>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Godziny otwarcia</Label>
              <Button type="button" size="sm" variant="outline" onClick={addHourRow}>
                Dodaj wiersz
              </Button>
            </div>
            <div className="mt-2 space-y-2">
              {form.hours_json.map((h, i) => (
                <div key={i} className="grid grid-cols-[1fr_120px_120px_auto] gap-2">
                  <Input placeholder="Mon-Fri" value={h.day} onChange={(e) => updateHour(i, { day: e.target.value })} />
                  <Input placeholder="09:00" value={h.opens} onChange={(e) => updateHour(i, { opens: e.target.value })} />
                  <Input placeholder="20:00" value={h.closes} onChange={(e) => updateHour(i, { closes: e.target.value })} />
                  <Button type="button" size="sm" variant="ghost" onClick={() => removeHourRow(i)}>
                    Usuń
                  </Button>
                </div>
              ))}
            </div>
          </section>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Zapisywanie…" : "Zapisz zmiany"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="citations">
          <CitationsList nap={form} />
        </TabsContent>

        <TabsContent value="exports">
          <ExportsPanel nap={form} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function CitationsList({ nap }: { nap: NapSettings }) {
  const rows = useMemo(() => CITATION_TARGETS.map((t) => ({ target: t, row: citationRowForTarget(t, nap) })), [nap]);
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Poniżej gotowe dane do wklejenia w formularzach 15 najważniejszych katalogów lokalnych i medycznych.
        Kliknij „Kopiuj wpis", żeby przenieść cały blok NAP do schowka, i „Otwórz katalog", żeby przejść od razu do formularza dodawania firmy.
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {rows.map(({ target, row }) => (
          <div key={target.id} className="rounded-lg border border-border p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium">{target.name}</div>
                <div className="mt-0.5 text-xs uppercase tracking-wide text-muted-foreground">{labelForCategory(target.category)}</div>
              </div>
              <a
                href={target.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs underline text-primary"
              >
                Otwórz katalog ↗
              </a>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{target.note}</p>
            <pre className="mt-3 max-h-40 overflow-auto rounded bg-muted/50 p-2 text-[11px] leading-relaxed">
{blockForRow(row)}
            </pre>
            <div className="mt-2 flex justify-end">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(blockForRow(row));
                  toast.success(`Skopiowano dane dla ${target.name}`);
                }}
              >
                Kopiuj wpis
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function blockForRow(row: ReturnType<typeof citationRowForTarget>) {
  return [
    row.name,
    row.street,
    `${row.postal_code} ${row.city}${row.region ? `, ${row.region}` : ""}`,
    row.country === "PL" ? "Polska" : row.country,
    row.phone ? `tel. ${row.phone}` : "",
    row.email ? `e-mail: ${row.email}` : "",
    row.website,
    "",
    `Kategorie: ${row.categories}`,
    `Godziny: ${row.hours}`,
    "",
    row.description,
  ]
    .filter((l) => l !== "" || true)
    .join("\n");
}

function labelForCategory(c: "map" | "pl-directory" | "medical" | "global") {
  switch (c) {
    case "map": return "Mapy / GBP";
    case "pl-directory": return "Katalog PL";
    case "medical": return "Katalog medyczny";
    case "global": return "Globalny";
  }
}

function ExportsPanel({ nap }: { nap: NapSettings }) {
  const jsonLd = useMemo(() => JSON.stringify(napToJsonLd(nap), null, 2), [nap]);
  const plain = useMemo(() => napToPlainText(nap), [nap]);
  const napCsv = useMemo(() => napToCsv(nap), [nap]);
  const dirCsv = useMemo(() => citationsCsv(nap), [nap]);

  return (
    <div className="space-y-6">
      <ExportBlock
        title="JSON-LD (schema.org MedicalClinic)"
        subtitle="Wklej w <script type='application/ld+json'>. Używane też na stronie głównej."
        content={jsonLd}
        download={{ filename: "nap-jsonld.json", mime: "application/ld+json" }}
      />
      <ExportBlock
        title="NAP — tekst do stopek e-maili / PDF-ów"
        subtitle="Ten sam blok wklejaj w podpisach mailowych i materiałach drukowanych."
        content={plain}
        download={{ filename: "nap.txt", mime: "text/plain" }}
      />
      <ExportBlock
        title="CSV — dane NAP (klucz/wartość)"
        subtitle="Do importu w wewnętrznych bazach / narzędziach zarządzania cytowaniami."
        content={napCsv}
        download={{ filename: "nap.csv", mime: "text/csv" }}
      />
      <ExportBlock
        title="CSV — wszystkie katalogi (15 wpisów)"
        subtitle="Jeden wiersz na katalog: URL + gotowe pola NAP + kategorie + godziny."
        content={dirCsv}
        download={{ filename: "nap-citations.csv", mime: "text/csv" }}
      />
    </div>
  );
}

function ExportBlock({
  title,
  subtitle,
  content,
  download,
}: {
  title: string;
  subtitle: string;
  content: string;
  download: { filename: string; mime: string };
}) {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-medium">{title}</div>
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              navigator.clipboard.writeText(content);
              toast.success("Skopiowano do schowka");
            }}
          >
            Kopiuj
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              const blob = new Blob([content], { type: `${download.mime};charset=utf-8` });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = download.filename;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
          >
            Pobierz .{download.filename.split(".").pop()}
          </Button>
        </div>
      </div>
      <pre className="mt-3 max-h-64 overflow-auto rounded bg-muted/50 p-2 text-[11px] leading-relaxed">{content}</pre>
    </div>
  );
}
