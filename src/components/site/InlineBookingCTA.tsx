import { useState } from "react";
import { CalendarDays } from "lucide-react";

/**
 * Subtelny inline CTA — mini formularz preferowanego terminu.
 * Po submicie przewija do głównego formularza rezerwacji (#rezerwacja)
 * i prefill-uje pole `preferred_date` oraz select `technology_slug`.
 */
export function InlineBookingCTA({
  technologySlug,
  heading = "Zarezerwuj termin",
  copy = "Wybierz preferowaną datę — resztę uzupełnimy w formularzu poniżej.",
}: {
  technologySlug: string;
  heading?: string;
  copy?: string;
}) {
  const [date, setDate] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const target = document.getElementById("rezerwacja");
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    // Poll for the lazy-loaded form fields, then prefill.
    let tries = 0;
    const iv = window.setInterval(() => {
      tries++;
      const form = target.querySelector("form");
      const dateInput = form?.querySelector<HTMLInputElement>(
        'input[name="preferred_date"]',
      );
      const techSelect = form?.querySelector<HTMLSelectElement>(
        'select[name="technology_slug"]',
      );
      if (dateInput && techSelect) {
        if (date) dateInput.value = date;
        techSelect.value = technologySlug;
        dateInput.dispatchEvent(new Event("input", { bubbles: true }));
        techSelect.dispatchEvent(new Event("change", { bubbles: true }));
        window.clearInterval(iv);
      } else if (tries > 40) {
        window.clearInterval(iv);
      }
    }, 100);
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <aside
      aria-label="Zarezerwuj termin"
      className="mt-12 rounded-lg border border-champagne/40 bg-secondary/30 p-6 md:p-8"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-lg">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-champagne">
            <CalendarDays className="size-4" aria-hidden />
            Termin
          </div>
          <h3 className="mt-3 font-serif text-2xl text-ink">{heading}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{copy}</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="grid gap-1.5 text-sm">
            <span className="text-foreground/80">Preferowana data</span>
            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-11 rounded-md border border-input bg-background px-3"
            />
          </label>
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-md bg-ink px-6 text-sm tracking-wide text-alabaster transition hover:bg-ink/90"
          >
            Umów wizytę
          </button>
        </form>
      </div>
    </aside>
  );
}
