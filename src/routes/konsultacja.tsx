import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { createConsultationCheckout } from "@/lib/payments.functions";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { SectionHeading } from "@/components/site/SectionHeading";

export const Route = createFileRoute("/konsultacja")({
  head: () => ({
    meta: [
      { title: "Umów konsultację | BMClinics.ai" },
      {
        name: "description",
        content:
          "Zarezerwuj konsultację online lub w klinice w Warszawie. Po opłaceniu otrzymasz e-mail z formularzem diagnostycznym.",
      },
      { property: "og:title", content: "Umów konsultację — BMClinics.ai" },
      { property: "og:url", content: "https://bmclinics.ai/konsultacja" },
    ],
    links: [{ rel: "canonical", href: "https://bmclinics.ai/konsultacja" }],
  }),
  component: ConsultationPage,
});

type ConsultationType = "online" | "clinic";

function ConsultationPage() {
  const [type, setType] = useState<ConsultationType>("online");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [notes, setNotes] = useState("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await createConsultationCheckout({
        data: {
          consultationType: type,
          fullName,
          email,
          phone,
          preferredDate,
          notes,
          returnUrl: `${window.location.origin}/konsultacja-dziekujemy?session_id={CHECKOUT_SESSION_ID}`,
          environment: getStripeEnvironment(),
        },
      });
      if ("error" in result) throw new Error(result.error);
      if (!result.clientSecret) throw new Error("Brak client secret");
      setClientSecret(result.clientSecret);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił błąd");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PaymentTestModeBanner />
      <section className="bg-secondary/40 py-12 md:py-20">
        <div className="container-luxury">
          <SectionHeading
            eyebrow="Konsultacja"
            title="Umów konsultację z lekarzem"
            description="Wybierz formę spotkania i opłać rezerwację. Po opłaceniu prześlemy e-mailem formularz wstępnej diagnostyki."
            as="h1"
          />
        </div>
      </section>

      <section className="container-luxury py-12 md:py-16">
        {clientSecret ? (
          <div className="mx-auto max-w-2xl">
            <EmbeddedCheckoutProvider
              stripe={getStripe()}
              options={{ fetchClientSecret: async () => clientSecret }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto grid max-w-xl gap-5 rounded-lg border border-border bg-card p-6 md:p-8"
          >
            <div>
              <label className="mb-2 block text-sm font-medium">Forma konsultacji</label>
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    { v: "online", l: "Online", d: "Wideokonferencja" },
                    { v: "clinic", l: "W klinice", d: "Warszawa" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.v}
                    type="button"
                    onClick={() => setType(opt.v)}
                    className={`rounded-lg border p-4 text-left transition ${
                      type === opt.v
                        ? "border-ink bg-ink/5"
                        : "border-border hover:border-ink/40"
                    }`}
                  >
                    <div className="font-medium">{opt.l}</div>
                    <div className="text-sm text-muted-foreground">{opt.d}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Imię i nazwisko" required value={fullName} onChange={setFullName} />
              <Field label="E-mail" type="email" required value={email} onChange={setEmail} />
              <Field label="Telefon" value={phone} onChange={setPhone} />
              <Field
                label="Preferowany termin"
                placeholder="np. wtorek po 16:00"
                value={preferredDate}
                onChange={setPreferredDate}
              />
            </div>

            <div>
              <label htmlFor="consultation-notes" className="mb-1 block text-sm font-medium">Uwagi (opcjonalnie)</label>
              <textarea
                id="consultation-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="flex items-center justify-between rounded-md bg-secondary/40 px-4 py-3 text-sm">
              <span>Cena konsultacji</span>
              <span className="font-medium text-ink">500 zł</span>
            </div>

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-ink px-5 py-3 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Przygotowuję płatność…" : "Przejdź do płatności"}
            </button>
          </form>
        )}
      </section>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
      />
    </label>
  );
}
