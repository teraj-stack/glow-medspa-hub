import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/polityka-prywatnosci")({
  head: () => ({
    meta: [
      { title: "Polityka prywatności | BMClinics.ai" },
      { name: "description", content: "Polityka prywatności BMClinics.ai — zasady przetwarzania danych osobowych pacjentów i użytkowników formularza rezerwacji." },
      { property: "og:title", content: "Polityka prywatności | BMClinics.ai" },
      { property: "og:description", content: "Jak przetwarzamy Państwa dane osobowe — podstawa prawna, zakres, prawa pacjenta." },
      { property: "og:url", content: "https://bmclinics.ai/polityka-prywatnosci" },
    ],
    links: [{ rel: "canonical", href: "https://bmclinics.ai/polityka-prywatnosci" }],
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
