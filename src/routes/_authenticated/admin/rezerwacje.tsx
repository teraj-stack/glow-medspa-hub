import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  listAdminBookings,
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
  const list = useServerFn(listAdminBookings);
  const update = useServerFn(updateBookingStatus);
  const qc = useQueryClient();

  const queryKey = ["admin-bookings", range, status] as const;
  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () =>
      list({
        data: {
          range,
          status: status === "all" ? undefined : status,
        },
      }),
  });

  async function changeStatus(id: string, newStatus: Exclude<Status, "all">) {
    try {
      const res = await update({ data: { id, status: newStatus } });
      toast.success(`Status zmieniony: ${STATUS_LABEL[newStatus]}`);
      if (res?.calendarWarning) {
        toast.warning(`Kalendarz Google: ${res.calendarWarning}`);
      }
      qc.invalidateQueries({ queryKey: ["admin-bookings"] });
    } catch (e: any) {
      toast.error(e?.message || "Nie udało się zmienić statusu");
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
      </div>

      {isLoading && (
        <div className="text-sm text-muted-foreground">Ładowanie…</div>
      )}
      {error && (
        <div className="text-sm text-red-600">
          {(error as Error).message || "Błąd wczytywania"}
        </div>
      )}

      {data && data.length === 0 && (
        <div className="rounded-lg border border-border p-8 text-center text-sm text-muted-foreground">
          Brak rezerwacji w wybranym zakresie.
        </div>
      )}

      <div className="space-y-3">
        {data?.map((b: any) => (
          <div
            key={b.id}
            className="rounded-lg border border-border p-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between"
          >
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
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
              {b.notes && (
                <div className="text-xs text-muted-foreground italic">
                  „{b.notes}"
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              {b.status !== "confirmed" && b.status !== "cancelled" && (
                <ActionButton onClick={() => changeStatus(b.id, "confirmed")}>
                  Potwierdź
                </ActionButton>
              )}
              {b.status !== "completed" && b.status !== "cancelled" && (
                <ActionButton
                  variant="muted"
                  onClick={() => changeStatus(b.id, "completed")}
                >
                  Zakończ
                </ActionButton>
              )}
              {b.status !== "no_show" && b.status !== "cancelled" && (
                <ActionButton
                  variant="muted"
                  onClick={() => changeStatus(b.id, "no_show")}
                >
                  Nieobecność
                </ActionButton>
              )}
              {b.status !== "cancelled" && (
                <ActionButton
                  variant="danger"
                  onClick={() => {
                    if (confirm("Anulować tę rezerwację? Wydarzenie zostanie usunięte z kalendarza."))
                      changeStatus(b.id, "cancelled");
                  }}
                >
                  Anuluj
                </ActionButton>
              )}
            </div>
          </div>
        ))}
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
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "muted" | "danger";
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
      className={`px-3 py-1.5 rounded-md text-xs transition-colors ${cls}`}
    >
      {children}
    </button>
  );
}
