import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { format, endOfDay } from "date-fns";
import { pl } from "date-fns/locale";
import { CalendarIcon, Search, X } from "lucide-react";
import {
  listAdminBookings,
  retryCalendarSync,
  retryManyCalendarSyncs,
  updateBookingStatus,
} from "@/lib/admin-bookings.functions";
import { listActiveDoctors } from "@/lib/doctors.functions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/rezerwacje")({
  component: AdminBookingsPage,
});

type Range = "upcoming" | "past" | "all";
type Status =
  | "all"
  | "pending_payment"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show";
type SyncStatus =
  | "all"
  | "synced"
  | "error"
  | "pending"
  | "skipped"
  | "not_required";
type SortBy = "starts_at" | "next_retry";

const STATUS_LABEL: Record<Exclude<Status, "all">, string> = {
  pending_payment: "Oczekuje płatności",
  confirmed: "Potwierdzona",
  cancelled: "Anulowana",
  completed: "Zakończona",
  no_show: "Nieobecność",
};

const PAYMENT_LABEL: Record<string, string> = {
  unpaid: "Nieopłacona",
  paid: "Opłacona",
  refunded: "Zwrot",
  failed: "Błąd płatności",
};

const SYNC_LABEL: Record<string, string> = {
  all: "Kalendarz: wszystkie",
  synced: "Kalendarz: zsynchronizowano",
  error: "Kalendarz: błąd synchronizacji",
  not_required: "Kalendarz: bez akcji",
  skipped: "Kalendarz: pominięto",
  pending: "Kalendarz: w toku…",
};

const SORT_LABEL: Record<SortBy, string> = {
  starts_at: "Data wizyty",
  next_retry: "Następna próba",
};

type BulkReportRow = {
  id: string;
  patient_name: string;
  starts_at: string | null;
  status: string;
  attempts: number;
  nextAt: string | null;
  error: string | null;
};

type BulkReport = {
  generatedAt: string;
  processed: number;
  succeeded: number;
  failed: number;
  rows: BulkReportRow[];
};

function csvCell(v: string | number | null | undefined) {
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

function buildReportFilename(report: BulkReport, ext: string) {
  const ts = report.generatedAt.replace(/[:.]/g, "-");
  return `calendar-retry-${ts}.${ext}`;
}

function downloadReportCsv(report: BulkReport) {
  const header = [
    "id",
    "patient_name",
    "starts_at",
    "sync_status",
    "attempts",
    "next_retry_at",
    "error",
  ];
  const lines = [header.join(",")];
  for (const r of report.rows) {
    lines.push(
      [
        r.id,
        r.patient_name,
        r.starts_at ?? "",
        r.status,
        r.attempts,
        r.nextAt ?? "",
        r.error ?? "",
      ]
        .map(csvCell)
        .join(","),
    );
  }
  const meta = [
    `# Wygenerowano: ${report.generatedAt}`,
    `# Przetworzono: ${report.processed}`,
    `# Sukcesy: ${report.succeeded}`,
    `# Błędy: ${report.failed}`,
    "",
  ].join("\n");
  const csv = "\uFEFF" + meta + lines.join("\n") + "\n";
  downloadBlob(
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
    buildReportFilename(report, "csv"),
  );
}

async function downloadReportPdf(report: BulkReport) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;
  let y = margin;
  doc.setFontSize(14);
  doc.text("Raport zbiorczego retry Google Calendar", margin, y);
  y += 20;
  doc.setFontSize(10);
  doc.text(`Wygenerowano: ${report.generatedAt}`, margin, y);
  y += 14;
  doc.text(
    `Przetworzono: ${report.processed}    Sukcesy: ${report.succeeded}    Błędy: ${report.failed}`,
    margin,
    y,
  );
  y += 20;
  doc.setFontSize(9);
  const pageHeight = doc.internal.pageSize.getHeight();
  for (const r of report.rows) {
    if (y > pageHeight - margin - 60) {
      doc.addPage();
      y = margin;
    }
    const date = r.starts_at
      ? new Date(r.starts_at).toLocaleString("pl-PL")
      : "—";
    const next = r.nextAt ? new Date(r.nextAt).toLocaleString("pl-PL") : "—";
    doc.setFont("helvetica", "bold");
    doc.text(`${r.patient_name} — ${r.status}`, margin, y);
    y += 12;
    doc.setFont("helvetica", "normal");
    doc.text(`ID: ${r.id}`, margin, y);
    y += 11;
    doc.text(`Wizyta: ${date}    Próby: ${r.attempts}    Następna: ${next}`, margin, y);
    y += 11;
    if (r.error) {
      const wrapped = doc.splitTextToSize(`Błąd: ${r.error}`, 515);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 11;
    }
    y += 6;
  }
  doc.save(buildReportFilename(report, "pdf"));
}

function statusColor(s: string) {
  switch (s) {
    case "confirmed":
      return "bg-green-500/15 text-green-700 dark:text-green-400";
    case "pending_payment":
      return "bg-amber-500/15 text-amber-700 dark:text-amber-400";
    case "cancelled":
      return "bg-red-500/15 text-red-700 dark:text-red-400";
    case "completed":
      return "bg-blue-500/15 text-blue-700 dark:text-blue-400";
    case "no_show":
      return "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function syncColor(s: string | null | undefined) {
  switch (s) {
    case "synced":
      return "bg-green-500/15 text-green-700 dark:text-green-400";
    case "error":
      return "bg-red-500/15 text-red-700 dark:text-red-400";
    case "pending":
      return "bg-amber-500/15 text-amber-700 dark:text-amber-400";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function formatPLN(cents: number | null | undefined, currency: string) {
  if (cents == null) return "—";
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: currency || "PLN",
  }).format(cents / 100);
}

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function AdminBookingsPage() {
  const [range, setRange] = useState<Range>("upcoming");
  const [status, setStatus] = useState<Status>("all");
  const [sync, setSync] = useState<SyncStatus>("all");
  const [sortBy, setSortBy] = useState<SortBy>("starts_at");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [doctorId, setDoctorId] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkRetrying, setBulkRetrying] = useState(false);
  const [lastReport, setLastReport] = useState<BulkReport | null>(null);
  const retryingRef = useRef<Set<string>>(new Set());
  const [retryingTick, setRetryingTick] = useState(0);
  const isRetrying = (id: string) => retryingRef.current.has(id);
  const setRetrying = (id: string, active: boolean) => {
    const next = new Set(retryingRef.current);
    if (active) next.add(id);
    else next.delete(id);
    retryingRef.current = next;
    setRetryingTick((t) => t + 1);
  };
  const list = useServerFn(listAdminBookings);
  const update = useServerFn(updateBookingStatus);
  const retry = useServerFn(retryCalendarSync);
  const retryMany = useServerFn(retryManyCalendarSyncs);
  const listDoctors = useServerFn(listActiveDoctors);
  const qc = useQueryClient();

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data: doctors } = useQuery({
    queryKey: ["active-doctors"],
    queryFn: () => listDoctors({ data: undefined }),
  });

  const queryKey = [
    "admin-bookings",
    range,
    status,
    sync,
    sortBy,
    doctorId,
    debouncedSearch,
    dateFrom?.toISOString(),
    dateTo?.toISOString(),
  ] as const;
  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () =>
      list({
        data: {
          range,
          status: status === "all" ? undefined : status,
          sync: sync === "all" ? undefined : sync,
          sortBy,
          doctorId: doctorId === "all" ? undefined : doctorId,
          search: debouncedSearch || undefined,
          dateFrom: dateFrom?.toISOString(),
          dateTo: dateTo ? endOfDay(dateTo).toISOString() : undefined,
        },
      }),
  });

  useEffect(() => {
    setSelected(new Set());
  }, [range, status, sync, sortBy]);

  function reportSync(sync: { calendar_sync_status: string; calendar_sync_error: string | null }) {
    if (sync.calendar_sync_status === "synced") {
      toast.success("Kalendarz Google zsynchronizowany");
    } else if (sync.calendar_sync_status === "error") {
      toast.error(`Kalendarz Google: ${sync.calendar_sync_error || "błąd synchronizacji"}`);
    }
  }

  async function changeStatus(id: string, newStatus: Exclude<Status, "all">) {
    setPendingId(id);
    try {
      const res = await update({ data: { id, status: newStatus } });
      toast.success(`Status zmieniony: ${STATUS_LABEL[newStatus]}`);
      if (res?.sync) reportSync(res.sync);
      qc.invalidateQueries({ queryKey: ["admin-bookings"] });
    } catch (e: any) {
      toast.error(e?.message || "Nie udało się zmienić statusu");
    } finally {
      setPendingId(null);
    }
  }

  async function retrySync(id: string) {
    if (isRetrying(id)) return;
    setRetrying(id, true);
    setPendingId(id);
    // Optimistic: mark badge as "pending" across cached queries
    qc.setQueriesData({ queryKey: ["admin-bookings"] }, (old: any) => {
      if (!Array.isArray(old)) return old;
      return old.map((b: any) =>
        b.id === id
          ? { ...b, calendar_sync_status: "pending", calendar_sync_error: null }
          : b,
      );
    });
    try {
      const res = await retry({ data: { id } });
      if (res?.sync) reportSync(res.sync);
      // Patch cache immediately with returned booking so badge flips live
      if (res?.booking) {
        qc.setQueriesData({ queryKey: ["admin-bookings"] }, (old: any) => {
          if (!Array.isArray(old)) return old;
          return old.map((b: any) =>
            b.id === id ? { ...b, ...res.booking } : b,
          );
        });
      }
      await qc.invalidateQueries({ queryKey: ["admin-bookings"] });
    } catch (e: any) {
      toast.error(e?.message || "Nie udało się ponowić synchronizacji");
      await qc.invalidateQueries({ queryKey: ["admin-bookings"] });
    } finally {
      setRetrying(id, false);
      setPendingId(null);
    }
  }

  const errorBookingIds =
    data?.filter((b: any) => b.calendar_sync_status === "error").map((b: any) => b.id as string) ?? [];

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAllErrors() {
    setSelected(new Set(errorBookingIds));
  }

  function clearSelection() {
    setSelected(new Set());
  }

  async function bulkRetry() {
    if (selected.size === 0 || bulkRetrying) return;
    setBulkRetrying(true);
    selected.forEach((id) => setRetrying(id, true));
    qc.setQueriesData({ queryKey: ["admin-bookings"] }, (old: any) => {
      if (!Array.isArray(old)) return old;
      return old.map((b: any) =>
        selected.has(b.id)
          ? { ...b, calendar_sync_status: "pending", calendar_sync_error: null }
          : b,
      );
    });
    try {
      const ids = Array.from(selected);
      const snapshot = new Map(
        (Array.isArray(data) ? data : []).map((b: any) => [
          b.id,
          { patient_name: b.patient_name as string, starts_at: b.starts_at as string },
        ]),
      );
      const res = await retryMany({ data: { ids } });
      if (res?.bookings?.length) {
        qc.setQueriesData({ queryKey: ["admin-bookings"] }, (old: any) => {
          if (!Array.isArray(old)) return old;
          const updatedById = new Map(res.bookings.map((b: any) => [b.id, b]));
          return old.map((b: any) => (updatedById.has(b.id) ? { ...b, ...updatedById.get(b.id) } : b));
        });
      }
      const updatedById = new Map((res.bookings ?? []).map((b: any) => [b.id, b]));
      const report: BulkReport = {
        generatedAt: new Date().toISOString(),
        processed: res.processed,
        succeeded: res.succeeded,
        failed: res.failed,
        rows: res.results.map((r) => {
          const snap = snapshot.get(r.id);
          const updated = updatedById.get(r.id) as any;
          return {
            id: r.id,
            patient_name: snap?.patient_name ?? updated?.patient_name ?? "—",
            starts_at: snap?.starts_at ?? updated?.starts_at ?? null,
            status: r.status,
            attempts: r.attempts,
            nextAt: r.nextAt,
            error: r.error,
          };
        }),
      };
      setLastReport(report);
      setSelected(new Set());
      toast.success(`Zsynchronizowano ${res.succeeded} z ${res.processed} rezerwacji`);

      if (res.failed > 0) {
        toast.error(`${res.failed} rezerwacji nadal z błędem`);
      }
      await qc.invalidateQueries({ queryKey: ["admin-bookings"] });
    } catch (e: any) {
      toast.error(e?.message || "Nie udało się ponowić synchronizacji wybranych rezerwacji");
      await qc.invalidateQueries({ queryKey: ["admin-bookings"] });
    } finally {
      selected.forEach((id) => setRetrying(id, false));
      setBulkRetrying(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Rezerwacje</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Przeglądaj wizyty, potwierdzaj, anuluj lub oznaczaj jako zakończone.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="relative min-w-[16rem] flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Szukaj po imieniu, e-mailu, telefonie lub zabiegu…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-9"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Wyczyść wyszukiwanie"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Select value={doctorId} onValueChange={setDoctorId}>
            <SelectTrigger className="w-[14rem]">
              <SelectValue placeholder="Wszyscy lekarze" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszyscy lekarze</SelectItem>
              {doctors?.map((d: any) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DatePicker label="Od" value={dateFrom} onChange={setDateFrom} />
          <DatePicker label="Do" value={dateTo} onChange={setDateTo} />

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setRange("upcoming");
              setStatus("all");
              setSync("all");
              setSortBy("starts_at");
              setSearch("");
              setDoctorId("all");
              setDateFrom(undefined);
              setDateTo(undefined);
            }}
          >
            Wyczyść filtry
          </Button>
        </div>

        <div className="flex flex-wrap gap-3">
          <FilterGroup
            label="Zakres"
            value={range}
            onChange={(v) => setRange(v as Range)}
            options={[
              { value: "upcoming", label: "Nadchodzące" },
              { value: "past", label: "Minione" },
              { value: "all", label: "Wszystkie" },
            ]}
          />
          <FilterGroup
            label="Status"
            value={status}
            onChange={(v) => setStatus(v as Status)}
            options={[
              { value: "all", label: "Wszystkie" },
              { value: "pending_payment", label: "Oczekuje płatności" },
              { value: "confirmed", label: "Potwierdzone" },
              { value: "cancelled", label: "Anulowane" },
              { value: "completed", label: "Zakończone" },
              { value: "no_show", label: "Nieobecność" },
            ]}
          />
          <FilterGroup
            label="Synchronizacja"
            value={sync}
            onChange={(v) => setSync(v as SyncStatus)}
            options={[
              { value: "all", label: "Wszystkie" },
              { value: "error", label: "Błąd" },
              { value: "pending", label: "W toku" },
              { value: "synced", label: "Zsynchronizowane" },
              { value: "skipped", label: "Pominięto" },
              { value: "not_required", label: "Bez akcji" },
            ]}
          />
          <FilterGroup
            label="Sortuj według"
            value={sortBy}
            onChange={(v) => setSortBy(v as SortBy)}
            options={[
              { value: "starts_at", label: "Data wizyty" },
              { value: "next_retry", label: "Następna próba" },
            ]}
          />
        </div>
      </div>

      {isLoading && (
        <div className="text-sm text-muted-foreground">Ładowanie…</div>
      )}
      {error && (() => {
        const msg = (error as Error).message || "";
        const isForbidden = /forbidden|admin role|unauthorized|401|403/i.test(msg);
        if (isForbidden) {
          return (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-6 space-y-3">
              <h3 className="text-base font-semibold text-foreground">
                Brak uprawnień administratora
              </h3>
              <p className="text-sm text-muted-foreground">
                Twoje konto jest zalogowane, ale nie ma roli{" "}
                <code className="px-1 py-0.5 rounded bg-muted text-foreground">admin</code>,
                wymaganej do zarządzania rezerwacjami.
              </p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">Co zrobić w dev:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>
                    Wyloguj się i zaloguj jako{" "}
                    <code className="px-1 py-0.5 rounded bg-muted text-foreground">
                      mlasers0110@gmail.com
                    </code>{" "}
                    (hasło w{" "}
                    <code className="px-1 py-0.5 rounded bg-muted text-foreground">
                      README.md
                    </code>
                    ) — trigger automatycznie nada rolę admina.
                  </li>
                  <li>
                    Albo nadaj rolę swojemu kontu ręcznie w bazie:{" "}
                    <code className="px-1 py-0.5 rounded bg-muted text-foreground">
                      insert into user_roles (user_id, role) values
                      ('&lt;twoj-user-id&gt;', 'admin')
                    </code>
                    .
                  </li>
                </ol>
              </div>
            </div>
          );
        }
        return (
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-700 dark:text-red-400">
            <div className="font-medium">Błąd wczytywania rezerwacji</div>
            <div className="mt-1 text-xs opacity-80">{msg || "Nieznany błąd"}</div>
          </div>
        );
      })()}

      {errorBookingIds.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-3 bg-card">
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-primary"
              checked={selected.size === errorBookingIds.length && errorBookingIds.length > 0}
              onChange={(e) => {
                if (e.target.checked) selectAllErrors();
                else clearSelection();
              }}
            />
            <span className="text-foreground">
              Zaznaczono {selected.size} z {errorBookingIds.length} z błędem
            </span>
          </label>
          <div className="flex-1" />
          <ActionButton
            variant="muted"
            onClick={selectAllErrors}
            disabled={bulkRetrying}
          >
            Zaznacz wszystkie błędy
          </ActionButton>
          <ActionButton
            variant="muted"
            onClick={clearSelection}
            disabled={selected.size === 0 || bulkRetrying}
          >
            Wyczyść
          </ActionButton>
          <ActionButton
            onClick={bulkRetry}
            disabled={selected.size === 0 || bulkRetrying}
          >
            {bulkRetrying
              ? "Ponawianie…"
              : `Ponów synchronizację (${selected.size})`}
          </ActionButton>
        </div>
      )}

      {lastReport && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-3 bg-card">
          <div className="text-sm">
            <div className="font-medium text-foreground">
              Raport zbiorczego retry ·{" "}
              {new Date(lastReport.generatedAt).toLocaleString("pl-PL")}
            </div>
            <div className="text-muted-foreground">
              Przetworzono {lastReport.processed} · Sukcesy {lastReport.succeeded} · Błędy {lastReport.failed}
            </div>
          </div>
          <div className="flex-1" />
          <ActionButton variant="muted" onClick={() => downloadReportCsv(lastReport)}>
            Pobierz CSV
          </ActionButton>
          <ActionButton variant="muted" onClick={() => downloadReportPdf(lastReport)}>
            Pobierz PDF
          </ActionButton>
          <ActionButton variant="muted" onClick={() => setLastReport(null)}>
            Ukryj
          </ActionButton>
        </div>
      )}

      {data && data.length === 0 && !error && (
        <div className="rounded-lg border border-border p-8 text-center space-y-3">
          <div className="text-2xl">📅</div>
          <h3 className="text-base font-semibold text-foreground">
            Brak rezerwacji w wybranym zakresie
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Zmień filtry powyżej (np. „Zakres: Wszystkie") albo dodaj testową
            rezerwację w dev, żeby zobaczyć akcje{" "}
            <span className="text-foreground">Potwierdź</span>,{" "}
            <span className="text-foreground">Zakończ</span>,{" "}
            <span className="text-foreground">Nieobecność</span> i{" "}
            <span className="text-foreground">Anuluj</span>.
          </p>
          <details className="text-xs text-muted-foreground max-w-md mx-auto text-left">
            <summary className="cursor-pointer hover:text-foreground">
              Jak dodać testową rezerwację w dev?
            </summary>
            <pre className="mt-2 p-3 rounded bg-muted overflow-x-auto whitespace-pre-wrap break-words text-[11px]">
{`insert into visit_bookings (
  doctor_id, treatment_slug, starts_at, ends_at,
  patient_name, patient_email, patient_phone,
  status, payment_status, amount_cents, currency, rodo_consent
) values (
  (select id from doctors limit 1),
  'konsultacja',
  now() + interval '1 day',
  now() + interval '1 day 30 minutes',
  'Jan Testowy', 'test@example.com', '+48500000000',
  'pending_payment', 'unpaid', 20000, 'PLN', true
);`}
            </pre>
          </details>
        </div>
      )}

      <div className="space-y-3">
        {data?.map((b: any) => {
          const busy = pendingId === b.id;
          const syncStatus = b.calendar_sync_status as string | null;
          const showSync = !!syncStatus && syncStatus !== "not_required";
          return (
            <div
              key={b.id}
              className="rounded-lg border border-border p-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between"
            >
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  {syncStatus === "error" && (
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-primary"
                      checked={selected.has(b.id)}
                      onChange={() => toggleSelect(b.id)}
                      disabled={bulkRetrying || isRetrying(b.id)}
                      aria-label={`Zaznacz rezerwację ${b.patient_name}`}
                    />
                  )}
                  <span className="font-medium">
                    {formatDateTime(b.starts_at)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    → {new Intl.DateTimeFormat("pl-PL", { timeStyle: "short" }).format(new Date(b.ends_at))}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${statusColor(b.status)}`}
                  >
                    {STATUS_LABEL[b.status as keyof typeof STATUS_LABEL] || b.status}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {PAYMENT_LABEL[b.payment_status] || b.payment_status}
                  </span>
                  {showSync && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${syncColor(syncStatus)}`}
                      title={b.calendar_sync_error || undefined}
                    >
                      {SYNC_LABEL[syncStatus!] || `Kalendarz: ${syncStatus}`}
                    </span>
                  )}
                </div>
                <div className="text-sm">
                  <span className="font-medium">{b.patient_name}</span>
                  <span className="text-muted-foreground"> · {b.patient_email} · {b.patient_phone}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Lekarz: {b.doctors?.full_name || "—"}
                  {b.treatment_slug ? ` · Zabieg: ${b.treatment_slug}` : ""}
                  {" · "}
                  {formatPLN(b.amount_cents, b.currency)}
                </div>
                {syncStatus === "error" && b.calendar_sync_error && (
                  <div className="text-xs text-red-600">
                    Błąd kalendarza: {b.calendar_sync_error}
                  </div>
                )}
                {syncStatus === "error" && (
                  <div className="text-xs text-muted-foreground">
                    Próby wykonane: {b.calendar_sync_attempts ?? 0}
                    {b.calendar_sync_next_at && ` · Następna próba: ${formatDateTime(b.calendar_sync_next_at)}`}
                  </div>
                )}
                {b.notes && (
                  <div className="text-xs text-muted-foreground italic">
                    „{b.notes}"
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 shrink-0">
                {b.status !== "confirmed" && b.status !== "cancelled" && (
                  <ActionButton disabled={busy} onClick={() => changeStatus(b.id, "confirmed")}>
                    Potwierdź
                  </ActionButton>
                )}
                {b.status !== "completed" && b.status !== "cancelled" && (
                  <ActionButton
                    disabled={busy}
                    variant="muted"
                    onClick={() => changeStatus(b.id, "completed")}
                  >
                    Zakończ
                  </ActionButton>
                )}
                {b.status !== "no_show" && b.status !== "cancelled" && (
                  <ActionButton
                    disabled={busy}
                    variant="muted"
                    onClick={() => changeStatus(b.id, "no_show")}
                  >
                    Nieobecność
                  </ActionButton>
                )}
                {b.status !== "cancelled" && (
                  <ActionButton
                    disabled={busy}
                    variant="danger"
                    onClick={() => {
                      if (confirm("Anulować tę rezerwację? Wydarzenie zostanie usunięte z kalendarza."))
                        changeStatus(b.id, "cancelled");
                    }}
                  >
                    Anuluj
                  </ActionButton>
                )}
                {(syncStatus === "error" || syncStatus === "pending") && (
                  <ActionButton
                    disabled={busy || isRetrying(b.id) || syncStatus === "pending"}
                    variant="muted"
                    onClick={() => retrySync(b.id)}
                  >
                    {isRetrying(b.id) || syncStatus === "pending"
                      ? "Ponawianie…"
                      : "Ponów synchronizację"}
                  </ActionButton>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DatePicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Date | undefined;
  onChange: (d: Date | undefined) => void;
}) {
  return (
    <Popover>
      <div className="flex flex-col gap-1">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[11rem] justify-start text-left font-normal",
              !value && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "d MMM yyyy", { locale: pl }) : <span>wybierz datę</span>}
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
          className="p-3 pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
}

function FilterGroup({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-wrap gap-1">
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
              value === o.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  variant = "primary",
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "muted" | "danger";
  disabled?: boolean;
}) {
  const cls =
    variant === "danger"
      ? "bg-red-600 text-white hover:bg-red-700"
      : variant === "muted"
        ? "bg-muted text-foreground hover:bg-muted/70"
        : "bg-primary text-primary-foreground hover:opacity-90";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1.5 rounded-md text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${cls}`}
    >
      {children}
    </button>
  );
}
