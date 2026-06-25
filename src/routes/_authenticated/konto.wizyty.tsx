import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { SectionHeading } from "@/components/site/SectionHeading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  listMyVisitBookings,
  claimMyVisitBookingsByEmail,
  claimVisitBookingByToken,
  cancelMyVisitBooking,
  CANCEL_MIN_HOURS,
  type PortalVisitBooking,
} from "@/lib/visit-bookings.functions";

export const Route = createFileRoute("/_authenticated/konto/wizyty")({
  head: () => ({
    meta: [
      { title: "Moje wizyty | BMClinics.ai" },
      { name: "description", content: "Twoje wizyty, statusy płatności i możliwość odwołania terminu w portalu pacjenta BMClinics.ai." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: PortalPage,
});

const STATUS_LABEL: Record<string, string> = {
  pending_payment: "Oczekuje na płatność",
  confirmed: "Potwierdzona",
  cancelled: "Odwołana",
  completed: "Zrealizowana",
  no_show: "Niezrealizowana",
};

const PAYMENT_LABEL: Record<string, string> = {
  unpaid: "Nieopłacona",
  paid: "Opłacona",
  refunded: "Zwrócona",
  failed: "Nieudana",
};

function formatPLN(cents: number | null, currency: string | null) {
  if (cents == null) return "—";
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: (currency || "PLN").toUpperCase(),
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(d);
}

function canCancelClientSide(b: PortalVisitBooking) {
  if (b.status !== "pending_payment" && b.status !== "confirmed") return false;
  const ms = new Date(b.starts_at).getTime() - Date.now();
  return ms >= CANCEL_MIN_HOURS * 60 * 60 * 1000;
}

function PortalPage() {
  const queryClient = useQueryClient();
  const listFn = useServerFn(listMyVisitBookings);
  const claimByEmailFn = useServerFn(claimMyVisitBookingsByEmail);
  const claimByTokenFn = useServerFn(claimVisitBookingByToken);
  const cancelFn = useServerFn(cancelMyVisitBooking);

  const [email, setEmail] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState("");
  const [claimMsg, setClaimMsg] = useState<string | null>(null);
  const [cancelMsg, setCancelMsg] = useState<string | null>(null);

  // Filters / sort / pagination
  const [upcomingStatus, setUpcomingStatus] = useState<string>("all");
  const [upcomingPayment, setUpcomingPayment] = useState<string>("all");
  const [upcomingTreatment, setUpcomingTreatment] = useState<string>("all");
  const [upcomingSort, setUpcomingSort] = useState<"asc" | "desc">("asc");
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [upcomingPageSize, setUpcomingPageSize] = useState(10);

  const [pastStatus, setPastStatus] = useState<string>("all");
  const [pastPayment, setPastPayment] = useState<string>("all");
  const [pastTreatment, setPastTreatment] = useState<string>("all");
  const [pastSort, setPastSort] = useState<"asc" | "desc">("desc");
  const [pastPage, setPastPage] = useState(1);
  const [pastPageSize, setPastPageSize] = useState(10);

  const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

  useEffect(() => {
    let alive = true;
    supabase.auth.getUser().then(({ data }) => {
      if (alive) setEmail(data.user?.email ?? null);
    });
    return () => { alive = false; };
  }, []);

  // Reset pagination when filters/sort change
  useEffect(() => {
    setUpcomingPage(1);
  }, [upcomingStatus, upcomingPayment, upcomingTreatment, upcomingSort]);
  useEffect(() => {
    setPastPage(1);
  }, [pastStatus, pastPayment, pastTreatment, pastSort]);

  // Auto-claim by email once on mount, then load bookings
  const autoClaim = useMutation({
    mutationFn: () => claimByEmailFn(),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["my-visit-bookings"] }),
  });
  useEffect(() => {
    autoClaim.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bookingsQuery = useQuery({
    queryKey: ["my-visit-bookings"],
    queryFn: () => listFn(),
  });

  const claimByToken = useMutation({
    mutationFn: (token: string) => claimByTokenFn({ data: { cancel_token: token } }),
    onSuccess: (res) => {
      if (res.ok) {
        setClaimMsg("Wizyta została przypisana do Twojego konta.");
        setTokenInput("");
        queryClient.invalidateQueries({ queryKey: ["my-visit-bookings"] });
      } else {
        setClaimMsg("Nie znaleziono wizyty dla tego kodu. Sprawdź link w mailu potwierdzającym.");
      }
    },
    onError: () => setClaimMsg("Nie udało się przypisać wizyty. Spróbuj ponownie."),
  });

  const cancelMutation = useMutation({
    mutationFn: (vars: { booking_id: string; cancel_token: string }) =>
      cancelFn({ data: vars }),
    onSuccess: (res) => {
      if (res.ok) {
        setCancelMsg("Wizyta została odwołana.");
        queryClient.invalidateQueries({ queryKey: ["my-visit-bookings"] });
      } else if (res.error === "too_late") {
        setCancelMsg(`Wizytę można odwołać najpóźniej ${CANCEL_MIN_HOURS}h przed terminem. Skontaktuj się z recepcją: +48 514 002 868.`);
      } else if (res.error === "not_cancellable") {
        setCancelMsg("Tej wizyty nie można już odwołać z portalu.");
      } else {
        setCancelMsg("Nie udało się odwołać wizyty. Spróbuj ponownie lub zadzwoń do recepcji.");
      }
    },
    onError: () => setCancelMsg("Nie udało się odwołać wizyty. Spróbuj ponownie."),
  });

  const treatments = useMemo(() => {
    const set = new Set<string>();
    (bookingsQuery.data ?? []).forEach((b) => {
      if (b.treatment_slug) set.add(b.treatment_slug);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, "pl"));
  }, [bookingsQuery.data]);

  function isUpcoming(b: PortalVisitBooking) {
    return new Date(b.starts_at).getTime() > Date.now() && b.status !== "cancelled";
  }

  function matchesFilters(
    b: PortalVisitBooking,
    status: string,
    payment: string,
    treatment: string,
  ) {
    if (status !== "all" && b.status !== status) return false;
    if (payment !== "all" && b.payment_status !== payment) return false;
    if (treatment !== "all" && b.treatment_slug !== treatment) return false;
    return true;
  }

  const upcoming = useMemo(
    () =>
      (bookingsQuery.data ?? [])
        .filter((b) => isUpcoming(b))
        .filter((b) => matchesFilters(b, upcomingStatus, upcomingPayment, upcomingTreatment))
        .sort((a, b) => {
          const diff = new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime();
          return upcomingSort === "asc" ? diff : -diff;
        }),
    [bookingsQuery.data, upcomingStatus, upcomingPayment, upcomingTreatment, upcomingSort],
  );
  const past = useMemo(
    () =>
      (bookingsQuery.data ?? [])
        .filter((b) => !isUpcoming(b))
        .filter((b) => matchesFilters(b, pastStatus, pastPayment, pastTreatment))
        .sort((a, b) => {
          const diff = new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime();
          return pastSort === "asc" ? diff : -diff;
        }),
    [bookingsQuery.data, pastStatus, pastPayment, pastTreatment, pastSort],
  );

  const upcomingTotal = upcoming.length;
  const upcomingTotalPages = Math.max(1, Math.ceil(upcomingTotal / upcomingPageSize));
  const upcomingPageSafe = Math.min(upcomingPage, upcomingTotalPages);
  const upcomingPaged = upcoming.slice(
    (upcomingPageSafe - 1) * upcomingPageSize,
    upcomingPageSafe * upcomingPageSize,
  );

  const pastTotal = past.length;
  const pastTotalPages = Math.max(1, Math.ceil(pastTotal / pastPageSize));
  const pastPageSafe = Math.min(pastPage, pastTotalPages);
  const pastPaged = past.slice(
    (pastPageSafe - 1) * pastPageSize,
    pastPageSafe * pastPageSize,
  );

  async function onSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <section className="container-luxury py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Portal pacjenta"
          title="Moje wizyty"
          description={email ? `Zalogowano jako ${email}` : undefined}
        />

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Link
            to="/konsultacja"
            className="inline-flex h-10 items-center justify-center rounded-md bg-ink px-5 text-sm tracking-wide text-alabaster transition hover:bg-ink/90"
          >
            Umów nową wizytę
          </Link>
          <button
            type="button"
            onClick={onSignOut}
            className="inline-flex h-10 items-center justify-center rounded-md border border-border px-4 text-sm text-foreground/80 hover:bg-secondary"
          >
            Wyloguj
          </button>
        </div>

        {/* Claim by token */}
        <div className="mt-10 rounded-lg border border-border/70 bg-secondary/40 p-5">
          <h2 className="text-base font-medium">Brakuje wizyty? Dodaj ją kodem z maila</h2>
          <p className="mt-1 text-sm text-foreground/70">
            Jeśli rezerwacja była zrobiona na inny e-mail, wklej identyfikator z linku „Odwołaj wizytę” w mailu potwierdzającym.
          </p>
          <form
            className="mt-3 flex flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              setClaimMsg(null);
              if (tokenInput.trim()) claimByToken.mutate(tokenInput.trim());
            }}
          >
            <input
              type="text"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="np. 0a1b2c3d-…"
              className="h-10 flex-1 rounded-md border border-border bg-background px-3 text-sm"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={claimByToken.isPending || !tokenInput.trim()}
              className="inline-flex h-10 items-center justify-center rounded-md bg-ink px-5 text-sm text-alabaster disabled:opacity-60"
            >
              {claimByToken.isPending ? "Sprawdzam…" : "Przypisz wizytę"}
            </button>
          </form>
          {claimMsg && <p className="mt-2 text-sm text-foreground/80">{claimMsg}</p>}
        </div>

        {cancelMsg && (
          <div className="mt-6 rounded-md border border-border bg-background p-4 text-sm">
            {cancelMsg}
          </div>
        )}

        {/* Upcoming */}
        <div className="mt-10">
          <h2 className="text-lg font-medium">Nadchodzące wizyty</h2>
          <FilterBar
            status={upcomingStatus}
            onStatusChange={setUpcomingStatus}
            payment={upcomingPayment}
            onPaymentChange={setUpcomingPayment}
            treatment={upcomingTreatment}
            onTreatmentChange={setUpcomingTreatment}
            treatments={treatments}
            sort={upcomingSort}
            onSortChange={setUpcomingSort}
          />
          {bookingsQuery.isLoading ? (
            <p className="mt-4 text-sm text-foreground/70">Ładuję…</p>
          ) : upcomingTotal === 0 ? (
            <p className="mt-4 text-sm text-foreground/70">
              {upcomingStatus !== "all" || upcomingPayment !== "all" || upcomingTreatment !== "all"
                ? "Brak nadchodzących wizyt spełniających wybrane filtry."
                : "Brak nadchodzących wizyt powiązanych z Twoim kontem."}
            </p>
          ) : (
            <>
              <ul className="mt-4 space-y-4">
                {upcomingPaged.map((b) => (
                  <BookingCard
                    key={b.id}
                    booking={b}
                    onCancel={() => {
                      setCancelMsg(null);
                      if (!b.cancel_token) return;
                      cancelMutation.mutate({ booking_id: b.id, cancel_token: b.cancel_token });
                    }}
                    cancelling={cancelMutation.isPending}
                  />
                ))}
              </ul>
              <Pagination
                page={upcomingPageSafe}
                totalPages={upcomingTotalPages}
                totalItems={upcomingTotal}
                pageSize={upcomingPageSize}
                pageSizeOptions={PAGE_SIZE_OPTIONS}
                onPageChange={setUpcomingPage}
                onPageSizeChange={setUpcomingPageSize}
              />
            </>
          )}
        </div>

        {/* Past */}
        <div className="mt-12">
          <h2 className="text-lg font-medium">Historia</h2>
          <FilterBar
            status={pastStatus}
            onStatusChange={setPastStatus}
            payment={pastPayment}
            onPaymentChange={setPastPayment}
            treatment={pastTreatment}
            onTreatmentChange={setPastTreatment}
            treatments={treatments}
            sort={pastSort}
            onSortChange={setPastSort}
          />
          {bookingsQuery.isLoading ? (
            <p className="mt-4 text-sm text-foreground/70">Ładuję…</p>
          ) : pastTotal === 0 ? (
            <p className="mt-4 text-sm text-foreground/70">
              {pastStatus !== "all" || pastPayment !== "all" || pastTreatment !== "all"
                ? "Brak wizyt w historii spełniających wybrane filtry."
                : "Brak wizyt w historii."}
            </p>
          ) : (
            <>
              <ul className="mt-4 space-y-4">
                {pastPaged.map((b) => (
                  <BookingCard key={b.id} booking={b} />
                ))}
              </ul>
              <Pagination
                page={pastPageSafe}
                totalPages={pastTotalPages}
                totalItems={pastTotal}
                pageSize={pastPageSize}
                pageSizeOptions={PAGE_SIZE_OPTIONS}
                onPageChange={setPastPage}
                onPageSizeChange={setPastPageSize}
              />
            </>
          )}
        </div>

        <p className="mt-12 text-xs text-foreground/60">
          Wizytę z portalu można odwołać najpóźniej {CANCEL_MIN_HOURS}h przed terminem. W pilnych przypadkach prosimy o kontakt z recepcją.
        </p>
      </div>
    </section>
  );
}

function formatTreatmentSlug(slug: string) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function FilterBar({
  status,
  onStatusChange,
  payment,
  onPaymentChange,
  treatment,
  onTreatmentChange,
  treatments,
  sort,
  onSortChange,
}: {
  status: string;
  onStatusChange: (v: string) => void;
  payment: string;
  onPaymentChange: (v: string) => void;
  treatment: string;
  onTreatmentChange: (v: string) => void;
  treatments: string[];
  sort: "asc" | "desc";
  onSortChange: (v: "asc" | "desc") => void;
}) {
  const hasFilters = status !== "all" || payment !== "all" || treatment !== "all";
  return (
    <div className="mt-4 flex flex-col gap-3 rounded-lg border border-border/70 bg-secondary/40 p-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:flex-wrap">
        <label className="flex flex-col gap-1.5 text-xs font-medium text-foreground/70">
          Status
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className="h-9 w-full min-w-[10rem] bg-background sm:w-44">
              <SelectValue placeholder="Wszystkie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie</SelectItem>
              {Object.keys(STATUS_LABEL).map((key) => (
                <SelectItem key={key} value={key}>
                  {STATUS_LABEL[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-medium text-foreground/70">
          Płatność
          <Select value={payment} onValueChange={onPaymentChange}>
            <SelectTrigger className="h-9 w-full min-w-[10rem] bg-background sm:w-44">
              <SelectValue placeholder="Wszystkie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie</SelectItem>
              {Object.keys(PAYMENT_LABEL).map((key) => (
                <SelectItem key={key} value={key}>
                  {PAYMENT_LABEL[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        {treatments.length > 0 && (
          <label className="flex flex-col gap-1.5 text-xs font-medium text-foreground/70">
            Zabieg
            <Select value={treatment} onValueChange={onTreatmentChange}>
              <SelectTrigger className="h-9 w-full min-w-[10rem] bg-background sm:w-52">
                <SelectValue placeholder="Wszystkie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie</SelectItem>
                {treatments.map((t) => (
                  <SelectItem key={t} value={t}>
                    {formatTreatmentSlug(t)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
        )}

        <button
          type="button"
          disabled={!hasFilters}
          onClick={() => {
            onStatusChange("all");
            onPaymentChange("all");
            onTreatmentChange("all");
          }}
          className="inline-flex h-9 items-center justify-center rounded-md border border-border px-3 text-sm text-foreground/80 hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
        >
          Wyczyść filtry
        </button>
      </div>

      <label className="flex flex-col gap-1.5 text-xs font-medium text-foreground/70 sm:text-right">
        Sortowanie
        <Select value={sort} onValueChange={(v) => onSortChange(v as "asc" | "desc")}>
          <SelectTrigger className="h-9 w-full bg-background sm:w-44">
            <SelectValue placeholder="Data" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Od najwcześniejszej</SelectItem>
            <SelectItem value="desc">Od najpóźniejszej</SelectItem>
          </SelectContent>
        </Select>
      </label>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}: {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  pageSizeOptions: number[];
  onPageChange: (p: number) => void;
  onPageSizeChange: (size: number) => void;
}) {
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  function pageRange() {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    let left = Math.max(2, page - 1);
    let right = Math.min(totalPages - 1, page + 1);
    if (page <= 3) {
      left = 2;
      right = Math.min(totalPages - 1, maxVisible - 1);
    } else if (page >= totalPages - 2) {
      left = Math.max(2, totalPages - maxVisible + 2);
      right = totalPages - 1;
    }
    if (left > 2) pages.push("ellipsis");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push("ellipsis");
    pages.push(totalPages);
    return pages;
  }

  return (
    <div className="mt-6 flex flex-col gap-3 rounded-lg border border-border/70 bg-secondary/40 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-foreground/70">
        {start === 0 ? (
          "Brak wyników"
        ) : (
          <>
            {start}–{end} z {totalItems}
          </>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex items-center gap-2 text-sm text-foreground/70">
          Na stronie:
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              onPageSizeChange(Number(v));
              onPageChange(1);
            }}
          >
            <SelectTrigger className="h-8 w-20 bg-background">
              <SelectValue placeholder={String(pageSize)} />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-sm hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Poprzednia strona"
          >
            ‹
          </button>
          {pageRange().map((p, i) =>
            p === "ellipsis" ? (
              <span key={`ellipsis-${i}`} className="px-2 text-sm text-foreground/60">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-sm transition ${
                  p === page
                    ? "bg-ink text-alabaster"
                    : "border border-border hover:bg-background"
                }`}
                aria-label={`Strona ${p}`}
                aria-current={p === page ? "page" : undefined}
              >
                {p}
              </button>
            ),
          )}
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-sm hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Następna strona"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}

function BookingCard({
  booking,
  onCancel,
  cancelling,
}: {
  booking: PortalVisitBooking;
  onCancel?: () => void;
  cancelling?: boolean;
}) {
  const cancellable = onCancel && canCancelClientSide(booking);
  return (
    <li className="rounded-lg border border-border/70 bg-background p-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-sm font-medium">
            {booking.treatment_slug ?? "Wizyta"}
          </div>
          <div className="mt-1 text-sm text-foreground/80">
            {formatDateTime(booking.starts_at)}
          </div>
        </div>
        <div className="text-sm sm:text-right">
          <div>
            <span className="text-foreground/60">Status: </span>
            <span className="font-medium">{STATUS_LABEL[booking.status] ?? booking.status}</span>
          </div>
          <div>
            <span className="text-foreground/60">Płatność: </span>
            <span>{PAYMENT_LABEL[booking.payment_status ?? ""] ?? booking.payment_status ?? "—"}</span>
          </div>
          <div className="text-foreground/70">{formatPLN(booking.amount_cents, booking.currency)}</div>
        </div>
      </div>

      {onCancel && (
        <div className="mt-4 flex items-center justify-end gap-3">
          {!cancellable && booking.status !== "cancelled" && (
            <span className="text-xs text-foreground/60">
              Odwołanie tylko przez recepcję (mniej niż {CANCEL_MIN_HOURS}h do wizyty).
            </span>
          )}
          <button
            type="button"
            disabled={!cancellable || cancelling}
            onClick={onCancel}
            className="inline-flex h-9 items-center justify-center rounded-md border border-border px-4 text-sm text-foreground/80 hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelling ? "Odwołuję…" : "Odwołaj wizytę"}
          </button>
        </div>
      )}
    </li>
  );
}
