import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  listAdminBookings,
  retryCalendarSync,
  retryManyCalendarSyncs,
  updateBookingStatus,
} from "@/lib/admin-bookings.functions";

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
  const qc = useQueryClient();

  const queryKey = ["admin-bookings", range, status, sync, sortBy] as const;
  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () =>
      list({
        data: {
          range,
          status: status === "all" ? undefined : status,
          sync: sync === "all" ? undefined : sync,
          sortBy,
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

      {isLoading && (
        <div className="text-sm text-muted-foreground">Ładowanie…</div>
      )}
      {error && (
        <div className="text-sm text-red-600">
          {(error as Error).message || "Błąd wczytywania"}
        </div>
      )}

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

      {data && data.length === 0 && (
        <div className="rounded-lg border border-border p-8 text-center text-sm text-muted-foreground">
          Brak rezerwacji w wybranym zakresie.
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
