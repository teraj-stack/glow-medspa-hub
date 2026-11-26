import { createFileRoute } from "@tanstack/react-router";
import { withOgVersion } from "@/config/social-preview";
import ogCard from "@/assets/og/index.jpg";

const OG_IMAGE = withOgVersion(`https://bmclinics.ai${ogCard}`);

export const Route = createFileRoute("/polityka-prywatnosci")({
  head: () => ({
    meta: [
      { title: "Polityka prywatności | BMClinics.ai" },
      { name: "description", content: "Polityka prywatności BMClinics.ai — zasady przetwarzania danych osobowych pacjentów i użytkowników formularza rezerwacji." },
      { property: "og:title", content: "Polityka prywatności | BMClinics.ai" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:description", content: "Jak przetwarzamy Państwa dane osobowe — podstawa prawna, zakres, prawa pacjenta." },
      { property: "og:url", content: "https://bmclinics.ai/polityka-prywatnosci" },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: "https://bmclinics.ai/polityka-prywatnosci" }],
  }),
  component: () => (
    <section className="container-luxury py-20">
      <h1 className="font-serif text-ink">Polityka prywatności</h1>
      <div className="prose prose-neutral mt-8 max-w-3xl text-foreground/85">
        <p>
          Administratorem Państwa danych osobowych jest BMClinics.ai z siedzibą w Warszawie.
          Dane przekazane przez formularz rezerwacyjny przetwarzamy wyłącznie w celu kontaktu w sprawie
          umówienia wizyty, na podstawie art. 6 ust. 1 lit. a RODO.
        </p>
        <p>
          Mają Państwo prawo dostępu do treści swoich danych, ich sprostowania, usunięcia, ograniczenia
          przetwarzania, przenoszenia oraz wniesienia sprzeciwu.
        </p>
        <h2 className="mt-8 font-serif text-2xl text-ink">Pytania przed konsultacją z pomocą AI</h2>
        <p>
          Skorzystanie z tej funkcji jest dobrowolne i nie jest warunkiem rezerwacji wizyty.
          Po udzieleniu wyraźnej zgody opis potrzeb, który może zawierać dane dotyczące zdrowia,
          jest przekazywany do Lovable AI Gateway i dostawcy modelu w celu przygotowania pytań
          do specjalisty. Podstawą przetwarzania jest art. 6 ust. 1 lit. a oraz, dla danych o zdrowiu,
          art. 9 ust. 2 lit. a RODO.
        </p>
        <p>
          Prosimy nie wpisywać danych identyfikujących ani dokumentacji medycznej. Opis i odpowiedź
          nie są zapisywane w bazie aplikacji ani automatycznie przekazywane lekarzowi.
          Dane są przetwarzane także przez usługę AI zgodnie z jej zasadami przetwarzania i retencji;
          brak zapisu w aplikacji nie oznacza braku przetwarzania przez usługę AI.
          Zgodę można wycofać, kontaktując się z administratorem; nie wpływa to na zgodność
          wcześniejszego przetwarzania z prawem. Listę pytań należy samodzielnie zachować przed opuszczeniem strony.
        </p>
        <p>Kontakt w sprawach RODO: rodo@beautymind.clinic</p>
      </div>
    </section>
  ),
});
