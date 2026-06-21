import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/polityka-prywatnosci")({
  head: () => ({
    meta: [
      { title: "Polityka prywatności | Beauty & Mind Clinic" },
      { name: "description", content: "Polityka prywatności kliniki Beauty & Mind Clinic w Siedlcach." },
    ],
    links: [{ rel: "canonical", href: "https://glow-medspa-hub.lovable.app/polityka-prywatnosci" }],
  }),
  component: () => (
    <section className="container-luxury py-20">
      <h1 className="font-serif text-ink">Polityka prywatności</h1>
      <div className="prose prose-neutral mt-8 max-w-3xl text-foreground/85">
        <p>
          Administratorem Państwa danych osobowych jest Beauty &amp; Mind Clinic z siedzibą w Siedlcach.
          Dane przekazane przez formularz rezerwacyjny przetwarzamy wyłącznie w celu kontaktu w sprawie
          umówienia wizyty, na podstawie art. 6 ust. 1 lit. a RODO.
        </p>
        <p>
          Mają Państwo prawo dostępu do treści swoich danych, ich sprostowania, usunięcia, ograniczenia
          przetwarzania, przenoszenia oraz wniesienia sprzeciwu.
        </p>
        <p>Kontakt w sprawach RODO: rodo@beautymind.clinic</p>
      </div>
    </section>
  ),
});
