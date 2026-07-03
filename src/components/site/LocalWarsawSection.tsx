import { MapPin, Clock, Train, Car } from "lucide-react";

interface Props {
  procedureLabel?: string;
}

/**
 * Reużywalny blok „Gdzie w Warszawie" — spójny NAP na każdym landingu
 * lokalnym (technologia / wskazanie). Wzmacnia sygnały local SEO.
 */
export function LocalWarsawSection({ procedureLabel = "zabieg" }: Props) {
  return (
    <section className="bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-champagne">Warszawa · Wilanów</div>
            <h2 className="mt-3 font-serif text-3xl text-ink md:text-4xl">
              Gdzie wykonujemy {procedureLabel} w Warszawie
            </h2>
            <p className="mt-3 text-sm text-muted-foreground md:text-base">
              Konsultacje i zabiegi prowadzimy w Klinice Ginekologii na warszawskich Bielanach —
              spokojna, kameralna lokalizacja z pełnym zapleczem medycznym i parkingiem dla pacjentów.
            </p>

            <address className="mt-6 not-italic space-y-2 text-sm text-foreground/90">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-champagne" aria-hidden />
                <div>
                  <div className="font-medium">Klinika Ginekologii</div>
                  <div>ul. Branickiego 10, 02-972 Warszawa (Wilanów)</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="mt-0.5 size-4 shrink-0 text-champagne" aria-hidden />
                <div>Pon–Pt 09:00–19:00 · Sob 10:00–15:00</div>
              </div>
              <div className="flex items-start gap-2">
                <Train className="mt-0.5 size-4 shrink-0 text-champagne" aria-hidden />
                <div>Metro Młociny 8 min autobusem · przystanek Wólczyńska 3 min pieszo</div>
              </div>
              <div className="flex items-start gap-2">
                <Car className="mt-0.5 size-4 shrink-0 text-champagne" aria-hidden />
                <div>Bezpłatny parking dla pacjentów przy klinice</div>
              </div>
            </address>

            <p className="mt-6 text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Obsługujemy pacjentów z: Wilanów · Bemowo · Żoliborz · Śródmieście · Łomianki · Nowy Dwór Mazowiecki
            </p>
          </div>

          <div className="overflow-hidden rounded-lg border border-border shadow-soft">
            <iframe
              title="Mapa lokalizacji Klinika Ginekologii, ul. Branickiego 10, Warszawa"
              src="https://www.google.com/maps?q=Klinika%20klinika ginekologii%20W%C3%B3jcickiego%204%20Warszawa&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[320px] w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
