import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import PakietTile from "@/components/PakietTile";
import PakietETile from "@/components/PakietETile";
import konturyAsset from "@/assets/szkic-twarz-kontur.png.asset.json";
import sylwetkaAsset from "@/assets/szkic-sylwetka.png.asset.json";
import dlonieCialoAsset from "@/assets/dlonie-cialo-szkic.png.asset.json";
import okoAsset from "@/assets/oko-szkic-v2.png.asset.json";
import bodyContourAsset from "@/assets/sylwetka-body-contour-v2.png.asset.json";
import renesansAsset from "@/assets/renesans-szkic.png.asset.json";



export const Route = createFileRoute("/rozwiazania")({
  head: () => ({
    meta: [
      { title: "Rozwiązania — Beauty & Mind Clinic" },
      {
        name: "description",
        content:
          "Pięć obszarów naszej praktyki: lifting i owal, tekstura HD, rewitalizacja dłoni, okolica oka oraz komfort i pewność siebie.",
      },
      { property: "og:title", content: "Rozwiązania — Beauty & Mind Clinic" },
      { property: "og:description", content: "Pięć obszarów naszej praktyki w estetyce «cichego luksusu»." },
      { property: "og:url", content: "/rozwiazania" },
    ],
    links: [{ rel: "canonical", href: "/rozwiazania" }],
  }),
  component: RozwiazaniaPage,
});


function RozwiazaniaPage() {
  return (
    <main className="min-h-screen bg-background pt-28 md:pt-36 pb-20">
      {/* HERO — Inteligentny Dobór Terapii */}
      <section>
        <div className="container">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-sm border border-champagne/30 bg-gradient-to-b from-background via-card to-background p-8 md:p-16">
              {/* Subtelny gradient radialny w prawym górnym rogu */}
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  background:
                    "radial-gradient(circle at top right, color-mix(in oklab, var(--champagne) 25%, transparent), transparent 60%)",
                }}
                aria-hidden
              />

              <div className="relative">
                {/* Etykieta nadtytułowa z ikoną Sparkles */}
                <p className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-champagne font-body">
                  <Sparkles className="size-4" aria-hidden />
                  Body Longevity · Inteligentny Dobór Terapii
                </p>

                {/* Główny nagłówek serif */}
                <h1 className="font-serif text-4xl md:text-6xl text-foreground leading-tight text-balance">
                  Twój personalny plan «&nbsp;Body Longevity&nbsp;» w 60 sekund
                </h1>

                {/* Akapit body */}
                <p className="mt-6 max-w-2xl text-muted-foreground text-lg font-body leading-relaxed">
                  Autorska metoda lek. Jana Bujok komponuje optymalne sekwencje «&nbsp;Body Longevity&nbsp;»
                  z naszego parku technologii na podstawie dokładnej diagnozy w gabinecie.
                  Koniec z metodą prób i błędów — Twój plan terapeutyczny jest
                  oparty na faktach, precyzyjnych danych i wieloletnim doświadczeniu klinicznym.
                </p>

                {/* Przycisk CTA */}
                <Link
                  to="/"
                  hash="rezerwacja"
                  className="mt-10 inline-flex items-center gap-3 bg-champagne text-accent-foreground rounded-sm px-8 py-4 hover:bg-champagne-light transition-colors duration-500 tracking-wide font-body"
                >
                  Nasz sekret — lek. Jan Bujok
                  <ArrowRight size={16} aria-hidden />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Filozofia Body Longevity */}
      <section className="container mt-20 md:mt-28">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-xs tracking-[0.3em] uppercase text-champagne mb-4 font-body">
              Filozofia « Body Longevity »
            </div>
            <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-6 leading-tight">
              Dlaczego łączymy technologie w sekwencje?
            </h2>
            <p className="text-muted-foreground text-lg font-body leading-relaxed">
              Ciało to wielowarstwowa struktura — a piękno to harmonia jego warstw.
              Lasery pracują nad skórą, HIFU zagęszcza i wzmacnia skórę głęboką
              i powięź SMAS nad, a HIFEM nad mięśniami pod obszarem. Aplikacja « MySkinCode »
              komponuje te elementy w autorskie sekwencje&nbsp;« Body Longevity »,
              które pracują razem na Twój wynik równocześnie.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Tile grid */}

      <section className="bg-background py-16 md:py-24">
        <div className="container-luxury">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            <PakietTile
              nr="01"
              tagline="LIFTING I OWAL"
              title="Przywrócenie konturów"
              icon={konturyAsset.url}
              bullets={[
                {
                  title: "Nieoperacyjny lifting",
                  text: "redukcja « chomików ». Wyostrzenie linii żuchwy, która z wiekiem traci swój zarys.",
                },
                {
                  title: "Bruzdy nosowo-wargowe i linie marionetki",
                  text: "powstają, gdy opadają policzki — zanika kolagen, a wraz z nim owal twarzy.",
                },
                {
                  title: "Szyja i dekolt",
                  text: "delikatna okolica, w której cienka, wiotka skóra z plamami starczymi najszybciej zdradza wiek.",
                },
              ]}
              technologies={[
                "Laser tulowy",
                "HIFU 4D",
                "Laser pikosekundowy",
                "RF Mikroigłowa",
              ]}
            />

            <PakietTile
              nr="02"
              tagline="REDUKCJA BLIZN I ZMARSZCZEK"
              title="Tekstura « HD »"
              icon={sylwetkaAsset.url}
              bullets={[
                {
                  title: "Redukcja blizn i przebarwień",
                  text: "tekstura skóry wymaga precyzyjnej przebudowy kolagenu i elastyny.",
                },
                {
                  title: "Zmarszczki i drobne linie",
                  text: "zanik elastyny sprawia, że skóra traci jędrność i gładkość powierzchni.",
                },
                {
                  title: "Nierówności i rozszerzone pory",
                  text: "frakcyjne technologie wygładzają powierzchnię bez uszkadzania naskórka.",
                },
              ]}
              technologies={[
                "Laser frakcyjny",
                "Laser pikosekundowy",
                "Mezoterapia",
                "RF Mikroigłowa",
              ]}
              protocol={{ label: "LADD", href: "/ladd" }}
            />

            <PakietTile
              nr="03"
              tagline="REWITALIZACJA DŁONI I CIAŁA"
              title="Gęstość, jędrność"
              icon={dlonieCialoAsset.url}
              bullets={[
                {
                  title: "Dłonie",
                  text: "skóra dłoni szybko traci gęstość i ujawnia wiek — wymaga odbudowy kolagenu i nawilżenia w głębokich warstwach.",
                },
                {
                  title: "Ramiona i wewnętrzna strona ud",
                  text: "obszary delikatnej, cienkiej skóry, gdzie wiotkość pojawia się najwcześniej.",
                },
                {
                  title: "Brzuch i pośladki",
                  text: "utrata jędrności i napięcia powięziowego — praca nad warstwą mięśniową i podskórną.",
                },
              ]}
              technologies={[
                "HIFU Body",
                "HIFEM",
                "RF Mikroigłowa",
                "Mezoterapia",
              ]}
            />

            <PakietTile
              nr="04"
              tagline="KONTUR OKA · BLASK SPOJRZENIA"
              title="Okolica oka"
              icon={okoAsset.url}
              bullets={[
                {
                  title: "Zmarszczki mimiczne",
                  text: "« kurze łapki » i linie wokół oczu — precyzyjna praca nad delikatną skórą powiek.",
                },
                {
                  title: "Cienie i worki pod oczami",
                  text: "rozjaśnienie okolicy i redukcja obrzęków — przywrócenie świeżego spojrzenia.",
                },
                {
                  title: "Opadająca powieka",
                  text: "nieinwazyjny lifting okolicy oka — uniesienie i napięcie skóry powieki górnej.",
                },
                {
                  title: "Plastyka powieki górnej",
                },
              ]}
            />

            <PakietTile
              nr="05"
              tagline="PAKIET D · BODY CONTOUR"
              title="Modelowanie sylwetki"
              icon={bodyContourAsset.url}
              bullets={[
                {
                  text: "« Body Management 360 » to trening mięśni bez siłowni — buduje gorset mięśniowy brzucha lub pośladków, redukując niechciany tłuszcz.",
                  boldParts: ["« Body Management 360 »"],
                },
                {
                  text: "Połączenie z fototerapią pozwala odpocząć, odprężyć się i zregenerować — Body Longevity Beauty & Mind.",
                },
              ]}
              technologies={["HIFEM+MSF+RF", "Fototerapia"]}
            />

            <div className="md:col-span-2">
              <ScrollReveal>
                <PakietETile
                  letter="E"
                  subtitle="Body Longevity · Signature"
                  title="Renesans\u00a0"
                  imageSrc={renesansAsset.url}
                  imageAlt="Minimalistyczna ilustracja line-art przedstawiająca sylwetkę kobiety od tyłu — symbol autorskiej filozofii « Body Longevity » lek. Jana Bujok, czyli Powrót do Renesansu"
                  protocolLabel="TWOJA SYGNATURA"
                  protocol="« Renesans » lek. Jan Bujok"
                  protocolDescription="Autorska narracja lek. Jana Bujok — protokoły « Renaissance » łączą wyselekcjonowane, zestrojone kombinacje technologii w sekwencjach niedostępnych w pojedynczych urządzeniach. Każdy plan jest projektowany przez lekarza dla pacjentek i pacjentów, których oczekiwania wykraczają poza schemat — w pełni oparty na wieloletnim doświadczeniu klinicznym. Ten projekt « Body Longevity » to powrót do złotej ery piękna, czyli Powrót do Renesansu: harmonia funkcjonalna, naturalna witalność i ponadczasowa elegancja."
                  technologiesLabel="Sygnatury Body Longevity"
                  technologies={[
                    { name: "Sekwencja Sygnatur Renesansowych" },
                    { name: "Body Longevity · podejście multi-technologiczne" },
                    { name: "Body Longevity · biostymulator premium" },
                    { name: "Konsultacja autorska — lek. Jan Bujok" },
                  ]}
                  ctaTeaser="« RENESANS\u00a0»\u00a0BODY LONGEVITY\u00a0"
                  ctaLabel="Umów konsultację autorską →"
                  ctaHref="#konsultacja"
                />
              </ScrollReveal>
            </div>



          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-background">
        <div className="container-luxury py-16 text-center md:py-20">
          <h2 className="font-serif text-foreground">Porozmawiajmy o Państwa potrzebach</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Konsultacja to pierwszy krok — wspólnie dobierzemy najlepsze rozwiązania.
          </p>
          <Link
            to="/"
            hash="rezerwacja"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-md bg-champagne px-8 text-sm tracking-wide text-accent-foreground transition hover:bg-champagne-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2"
          >
            Umów konsultację
          </Link>
        </div>
      </section>
    </main>
  );
}
