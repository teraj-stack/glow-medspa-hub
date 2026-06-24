import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { useSuspenseQuery, queryOptions, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

const TOKEN_RE = /^[a-f0-9]{16,128}$/;

function getServiceClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

const loadOrderByToken = createServerFn({ method: "GET" })
  .inputValidator((data: { token: string }) => {
    if (!TOKEN_RE.test(data.token)) throw new Error("Invalid token");
    return data;
  })
  .handler(async ({ data }) => {
    const supabase = getServiceClient();
    const { data: order } = await supabase
      .from("consultation_orders")
      .select(
        "id,full_name,email,consultation_type,preferred_date,intake_completed_at,status,intake_data",
      )
      .eq("intake_token", data.token)
      .maybeSingle();
    return order;
  });

const IntakeInput = z.object({
  token: z.string().regex(TOKEN_RE),
  dateOfBirth: z.string().trim().max(40).optional().or(z.literal("")),
  height: z.string().trim().max(20).optional().or(z.literal("")),
  weight: z.string().trim().max(20).optional().or(z.literal("")),
  mainConcern: z.string().trim().min(3).max(2000),
  goals: z.string().trim().max(2000).optional().or(z.literal("")),
  medicalConditions: z.string().trim().max(2000).optional().or(z.literal("")),
  allergies: z.string().trim().max(1000).optional().or(z.literal("")),
  medications: z.string().trim().max(2000).optional().or(z.literal("")),
  previousTreatments: z.string().trim().max(2000).optional().or(z.literal("")),
  pregnancy: z.enum(["nie", "tak", "nie_dotyczy"]).optional(),
  smoking: z.enum(["nie", "tak", "okazjonalnie"]).optional(),
  skinType: z.string().trim().max(200).optional().or(z.literal("")),
  consent: z.literal(true),
});

const submitIntake = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => IntakeInput.parse(data))
  .handler(async ({ data }) => {
    const supabase = getServiceClient();
    const { data: order, error: loadErr } = await supabase
      .from("consultation_orders")
      .select("id,status,intake_completed_at")
      .eq("intake_token", data.token)
      .maybeSingle();
    if (loadErr || !order) return { error: "Nie znaleziono zamówienia." };
    if (order.status !== "paid") return { error: "Zamówienie nie jest opłacone." };

    const { token, consent: _consent, ...intake } = data;
    const { error: updErr } = await supabase
      .from("consultation_orders")
      .update({
        intake_data: { ...intake, submittedAt: new Date().toISOString() },
        intake_completed_at: order.intake_completed_at ?? new Date().toISOString(),
      })
      .eq("id", order.id);
    if (updErr) return { error: "Nie udało się zapisać formularza." };
    return { ok: true as const };
  });

export const Route = createFileRoute("/formularz/$token")({
  head: () => ({
    meta: [
      { title: "Formularz wstępnej diagnostyki | BM Clinics" },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: ({ params, context }) =>
    context.queryClient.ensureQueryData(
      queryOptions({
        queryKey: ["intake", params.token],
        queryFn: () => loadOrderByToken({ data: { token: params.token } }),
      }),
    ),
  component: IntakeForm,
  errorComponent: () => (
    <div className="container-luxury py-20 text-center">
      <p>Nie udało się wczytać formularza.</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="container-luxury py-20 text-center">
      <p>Nie znaleziono.</p>
    </div>
  ),
});

function IntakeForm() {
  const { token } = Route.useParams();
  const qc = useQueryClient();
  const { data: order } = useSuspenseQuery(
    queryOptions({
      queryKey: ["intake", token],
      queryFn: () => loadOrderByToken({ data: { token } }),
    }),
  );

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!order) {
    return (
      <section className="container-luxury py-20 text-center">
        <h1 className="font-serif text-2xl text-ink">Link jest nieprawidłowy lub wygasł</h1>
        <p className="mt-3 text-foreground/70">
          Skontaktuj się z kliniką, abyśmy wysłali nowy formularz.
        </p>
      </section>
    );
  }

  if (success || order.intake_completed_at) {
    return (
      <section className="container-luxury py-20 text-center">
        <h1 className="font-serif text-3xl text-ink">Dziękujemy!</h1>
        <p className="mx-auto mt-4 max-w-lg text-foreground/75">
          Twój formularz został zapisany. Lekarz zapozna się z odpowiedziami przed
          {" "}
          {order.consultation_type === "online" ? "konsultacją online" : "wizytą w klinice"}.
          W razie pytań skontaktujemy się mailowo na <strong>{order.email}</strong>.
        </p>
      </section>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      token,
      dateOfBirth: String(fd.get("dateOfBirth") ?? ""),
      height: String(fd.get("height") ?? ""),
      weight: String(fd.get("weight") ?? ""),
      mainConcern: String(fd.get("mainConcern") ?? ""),
      goals: String(fd.get("goals") ?? ""),
      medicalConditions: String(fd.get("medicalConditions") ?? ""),
      allergies: String(fd.get("allergies") ?? ""),
      medications: String(fd.get("medications") ?? ""),
      previousTreatments: String(fd.get("previousTreatments") ?? ""),
      pregnancy: (fd.get("pregnancy") || undefined) as "nie" | "tak" | "nie_dotyczy" | undefined,
      smoking: (fd.get("smoking") || undefined) as "nie" | "tak" | "okazjonalnie" | undefined,
      skinType: String(fd.get("skinType") ?? ""),
      consent: fd.get("consent") === "on",
    };
    if (!payload.consent) {
      setError("Wymagana jest zgoda na przetwarzanie danych medycznych.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await submitIntake({ data: payload as never });
      if ("error" in res) throw new Error(res.error);
      setSuccess(true);
      qc.invalidateQueries({ queryKey: ["intake", token] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił błąd");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="container-luxury py-12 md:py-20">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-serif text-3xl text-ink">Formularz wstępnej diagnostyki</h1>
        <p className="mt-2 text-foreground/70">
          Cześć {order.full_name}! Wypełnij formularz najpóźniej 24 godziny przed wizytą
          ({order.consultation_type === "online" ? "konsultacja online" : "konsultacja w klinice"}
          {order.preferred_date ? `, ${order.preferred_date}` : ""}). Wszystkie dane są
          poufne i służą wyłącznie lekarzowi prowadzącemu.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 grid gap-5 rounded-lg border border-border bg-card p-6 md:p-8"
        >
          <div className="grid gap-4 md:grid-cols-3">
            <Field name="dateOfBirth" label="Data urodzenia" placeholder="RRRR-MM-DD" />
            <Field name="height" label="Wzrost (cm)" />
            <Field name="weight" label="Waga (kg)" />
          </div>

          <Textarea
            name="mainConcern"
            label="Główny problem / powód konsultacji"
            required
            rows={3}
          />
          <Textarea
            name="goals"
            label="Cele estetyczne i oczekiwany efekt"
            rows={3}
          />
          <Textarea
            name="medicalConditions"
            label="Choroby przewlekłe i istotne schorzenia"
            rows={3}
          />
          <Textarea name="allergies" label="Alergie (leki, kosmetyki, inne)" rows={2} />
          <Textarea
            name="medications"
            label="Aktualnie przyjmowane leki i suplementy"
            rows={3}
          />
          <Textarea
            name="previousTreatments"
            label="Przebyte zabiegi medycyny estetycznej / laserowe / chirurgiczne"
            rows={3}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Select
              name="pregnancy"
              label="Ciąża / karmienie"
              options={[
                { v: "", l: "— wybierz —" },
                { v: "nie", l: "Nie" },
                { v: "tak", l: "Tak" },
                { v: "nie_dotyczy", l: "Nie dotyczy" },
              ]}
            />
            <Select
              name="smoking"
              label="Palenie tytoniu"
              options={[
                { v: "", l: "— wybierz —" },
                { v: "nie", l: "Nie" },
                { v: "okazjonalnie", l: "Okazjonalnie" },
                { v: "tak", l: "Tak" },
              ]}
            />
          </div>

          <Field name="skinType" label="Typ / kondycja skóry (jeśli znana)" />

          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              name="consent"
              required
              className="mt-1 size-4 rounded border-border"
            />
            <span>
              Wyrażam zgodę na przetwarzanie danych medycznych przez BM Clinics
              w celu przygotowania konsultacji. *
            </span>
          </label>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-ink px-5 py-3 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Zapisuję…" : "Wyślij formularz"}
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({
  name,
  label,
  placeholder,
  required,
}: {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      <input
        name={name}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
      />
    </label>
  );
}

function Textarea({
  name,
  label,
  rows = 3,
  required,
}: {
  name: string;
  label: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      <textarea
        name={name}
        rows={rows}
        required={required}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
      />
    </label>
  );
}

function Select({
  name,
  label,
  options,
}: {
  name: string;
  label: string;
  options: { v: string; l: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <select
        name={name}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
      >
        {options.map((o) => (
          <option key={o.v} value={o.v}>
            {o.l}
          </option>
        ))}
      </select>
    </label>
  );
}
