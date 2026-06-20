import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { submitBooking } from "@/lib/bookings.functions";
import { TECHNOLOGIES } from "@/data/technologies";

export function BookingForm({ defaultTechnology }: { defaultTechnology?: string }) {
  const send = useServerFn(submitBooking);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const f = new FormData(e.currentTarget);
    try {
      await send({
        data: {
          full_name: String(f.get("full_name") ?? ""),
          phone: String(f.get("phone") ?? ""),
          email: String(f.get("email") ?? ""),
          technology_slug: String(f.get("technology_slug") ?? ""),
          message: String(f.get("message") ?? ""),
          preferred_date: String(f.get("preferred_date") ?? ""),
          preferred_time: String(f.get("preferred_time") ?? ""),
          consent_rodo: f.get("consent_rodo") === "on" ? true : (false as never),
          website: String(f.get("website") ?? ""),
          source: "web-form",
        },
      });
      setStatus("ok");
      e.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Nie udało się wysłać formularza.");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-lg border border-champagne/40 bg-card p-8 text-center shadow-soft">
        <div className="text-xs uppercase tracking-[0.3em] text-champagne">Dziękujemy</div>
        <h3 className="mt-3 font-serif text-2xl text-ink">Zgłoszenie zostało przyjęte</h3>
        <p className="mt-2 text-muted-foreground">
          Skontaktujemy się z Państwem telefonicznie, aby potwierdzić dogodny termin wizyty.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md border border-border px-5 text-sm hover:bg-secondary"
        >
          Wypełnij ponownie
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-lg border border-border bg-card p-6 shadow-soft md:p-8">
      {/* honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Imię i nazwisko" name="full_name" required autoComplete="name" />
        <Field label="Telefon" name="phone" required type="tel" autoComplete="tel" />
      </div>
      <Field label="E-mail (opcjonalnie)" name="email" type="email" autoComplete="email" />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1.5 text-sm">
          <span className="text-foreground/80">Interesujący zabieg</span>
          <select
            name="technology_slug"
            defaultValue={defaultTechnology ?? ""}
            className="h-11 rounded-md border border-input bg-background px-3"
          >
            <option value="">— wybierz —</option>
            {TECHNOLOGIES.map((t) => (
              <option key={t.slug} value={t.slug}>{t.name}</option>
            ))}
          </select>
        </label>
        <Field label="Preferowana data" name="preferred_date" type="date" />
      </div>

      <label className="grid gap-1.5 text-sm">
        <span className="text-foreground/80">Wiadomość (opcjonalnie)</span>
        <textarea
          name="message"
          rows={4}
          maxLength={2000}
          className="rounded-md border border-input bg-background p-3"
          placeholder="Krótki opis potrzeb lub pytania."
        />
      </label>

      <label className="flex items-start gap-3 text-sm text-muted-foreground">
        <input type="checkbox" name="consent_rodo" required className="mt-1 size-4" />
        <span>
          Wyrażam zgodę na przetwarzanie moich danych osobowych w celu kontaktu w sprawie umówienia wizyty,
          zgodnie z polityką prywatności kliniki.
        </span>
      </label>

      {error && <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-2 inline-flex h-12 items-center justify-center rounded-md bg-ink px-6 text-sm tracking-wide text-alabaster transition hover:bg-ink/90 disabled:opacity-60"
      >
        {status === "sending" ? "Wysyłanie…" : "Wyślij zgłoszenie"}
      </button>
    </form>
  );
}

function Field({
  label, name, type = "text", required, autoComplete,
}: { label: string; name: string; type?: string; required?: boolean; autoComplete?: string }) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="text-foreground/80">{label}{required && <span className="text-champagne"> *</span>}</span>
      <input
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        className="h-11 rounded-md border border-input bg-background px-3"
      />
    </label>
  );
}
