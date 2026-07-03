import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ScrollReveal from "@/components/ScrollReveal";
import PakietTile from "@/components/PakietTile";
import PakietETile from "@/components/PakietETile";
import konturyAsset from "@/assets/szkic-twarz-kontur.png.asset.json";
import iconProfilSzyja from "@/assets/profil-szyja-icon.png.asset.json";
import iconTwarzBok from "@/assets/twarz-bok-icon.png.asset.json";
import iconTwarzDlon from "@/assets/twarz-dlon-icon.png.asset.json";
import iconSzyjaDekolt from "@/assets/szyja-dekolt-icon.png.asset.json";
import iconUstaSzyja from "@/assets/usta-szyja-icon.png.asset.json";
import sylwetkaAsset from "@/assets/sylwetka-back-v3.png.asset.json";
import teksturaHdTwarzAsset from "@/assets/tekstura-hd-twarz.png.asset.json";
import dlonieCialoAsset from "@/assets/dlonie-cialo-szkic.png.asset.json";
import okoAsset from "@/assets/oko-szkic-v2.webp";
import bodyContourAsset from "@/assets/sylwetka-body-contour-v2.png.asset.json";
import renesansAsset from "@/assets/renesans-v2.png.asset.json";
import { withOgVersion } from "@/config/social-preview";
import ogCard from "@/assets/og/index.jpg";




export const Route = createFileRoute("/rozwiazania")({
  head: () => ({
    meta: [
      { title: "Rozwiązania — BMClinics.ai" },
      {
        name: "description",
        content:
          "Pięć obszarów naszej praktyki: lifting i owal, tekstura HD, rewitalizacja dłoni, okolica oka oraz komfort i pewność siebie.",
      },
      { property: "og:title", content: "Rozwiązania — BMClinics.ai" },
      { property: "og:description", content: "Pięć obszarów naszej praktyki w estetyce «cichego luksusu»." },
      { property: "og:url", content: "https://bmclinics.ai/rozwiazania" },
      { property: "og:image", content: withOgVersion(`https://bmclinics.ai${ogCard}`) },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "BMClinics.ai — Warszawa (Wilanów), ul. Branickiego 10" },
      { name: "twitter:image", content: withOgVersion(`https://bmclinics.ai${ogCard}`) },
    ],
    links: [{ rel: "canonical", href: "https://bmclinics.ai/rozwiazania" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.flatMap((group) =>
            group.items.map((item) => ({
              "@type": "Question",
              name: `${group.title} — ${item.q}`,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.a,
              },
            })),
          ),
        }),
      },
    ],
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
              i powięź SMAS nad, a HIFEM nad mięśniami pod obszarem. Komponujemy
              te elementy w autorskie sekwencje&nbsp;« Body Longevity », które
              pracują razem na Twój wynik równocześnie.
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
              id="przywrocenie-konturow"
              iconHref="/technologie#przywrocenie-konturow"
              iconTooltip="Przejdź do technologii liftingu i konturowania — umów konsultację, by dobrać odpowiedni protokół."
              tagline="LIFTING I OWAL"
              title="Przywrócenie konturów"
              icon={konturyAsset.url}
              topIcons={[
                { src: iconTwarzBok.url, alt: "Profil twarzy" },
                { src: iconTwarzDlon.url, alt: "Twarz i dłoń" },
                { src: iconProfilSzyja.url, alt: "Profil szyi" },
                { src: iconSzyjaDekolt.url, alt: "Szyja i dekolt" },
                { src: iconUstaSzyja.url, alt: "Usta, szyja i dekolt" },
              ]}
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
              id="tekstura-hd"
              iconHref="/technologie#tekstura-hd"
              iconTooltip="Przejdź do technologii tekstury HD — zarezerwuj konsultację, by wygładzić skórę."
              tagline="REDUKCJA BLIZN I ZMARSZCZEK"
              title="Tekstura « HD »"
              icon={teksturaHdTwarzAsset.url}
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
              id="rewitalizacja-dloni"
              iconHref="/technologie#rewitalizacja-dloni"
              iconTooltip="Przejdź do technologii dłoni i ciała — konsultacja pomoże przywrócić gęstość skóry."
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
              id="okolica-oka"
              iconHref="/technologie#okolica-oka"
              iconTooltip="Przejdź do technologii okolicy oka — umów wizytę, by odświeżyć spojrzenie."
              tagline="KONTUR OKA · BLASK SPOJRZENIA"
              title="Okolica oka"
              icon={okoAsset}
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
              id="modelowanie-sylwetki"
              iconHref="/technologie#modelowanie-sylwetki"
              iconTooltip="Przejdź do technologii modelowania sylwetki — zarezerwuj konsultację, by zaplanować zmianę."
              tagline="PAKIET D · BODY CONTOUR"
              title="Modelowanie sylwetki"
              icon={bodyContourAsset.url}
              bullets={[
                {
                  text: "« Body Management 360 » to trening mięśni bez siłowni — buduje gorset mięśniowy brzucha lub pośladków, redukując niechciany tłuszcz.",
                  boldParts: ["« Body Management 360 »"],
                },
                {
                  text: "Połączenie z fototerapią pozwala odpocząć, odprężyć się i zregenerować — Body Longevity BMClinics.ai.",
                },
              ]}
              technologies={["HIFEM+MSF+RF", "Fototerapia"]}
            />

            <div className="md:col-span-2">
              <ScrollReveal>
                <PakietETile
                  letter="E"
                  id="renesans"
                  iconHref="#konsultacja"
                  iconTooltip="Przejdź do konsultacji autorskiej « Renesans » — lekarz dobierze sygnaturę Body Longevity."
                  subtitle="Body Longevity · Signature"
                  title="Renesans"
                  imageSrc={renesansAsset.url}
                  imageAlt="Minimalistyczna ilustracja line-art przedstawiająca sylwetkę kobiety od tyłu — symbol autorskiej filozofii « Body Longevity » lek. Jana Bujok, czyli Powrót do Renesansu"
                  protocolLabel="TWOJA SYGNATURA"
                  protocol="« Renesans » lek. Jan Bujok"
                  protocolDescription="Autorska narracja lek. Jana Bujok — protokoły « Renesans » łączą wyselekcjonowane, zestrojone kombinacje technologii w sekwencjach niedostępnych w pojedynczych urządzeniach. Każdy plan jest projektowany przez lekarza dla pacjentek i pacjentów, których oczekiwania wykraczają poza schemat — w pełni oparty na wieloletnim doświadczeniu klinicznym. Ten projekt « Body Longevity » to powrót do złotej ery piękna, czyli Powrót do Renesansu: harmonia funkcjonalna, naturalna witalność i ponadczasowa elegancja."
                  technologiesLabel="Sygnatury Body Longevity"
                  technologies={[
                    { name: "Sekwencja Sygnatur Renesansowych" },
                    { name: "Body Longevity · podejście multi-technologiczne" },
                    { name: "Body Longevity · biostymulator premium" },
                    { name: "Konsultacja autorska — lek. Jan Bujok" },
                  ]}
                  ctaTeaser="Body Longevity · Signature"
                  ctaLabel="Umów konsultację autorską →"
                  ctaHref="#konsultacja"
                />
              </ScrollReveal>
            </div>



          </div>
        </div>
      </section>

      {/* Protokół LADD */}
      <LaddProtocolSection />

      {/* FAQ per protokół */}
      <FaqSection />


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

function LaddProtocolSection() {
  return (
    <section className="border-t border-border bg-background">
      <div className="container-luxury py-16 md:py-24">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <div className="text-xs tracking-[0.3em] uppercase text-champagne mb-4 font-body">
              Autorski protokół Body Longevity
            </div>
            <h2 className="font-serif text-3xl md:text-5xl text-foreground leading-tight mb-6">
              Autorski Protokół LADD: Plazma + PRP + DEP
            </h2>
            <p className="text-muted-foreground text-lg font-body leading-relaxed">
              Inżynieria tkankowa oparta na Twojej własnej biologii. W procesie głębokiej regeneracji skóry najpotężniejszym narzędziem, jakim dysponujemy, jest Twój własny organizm. Protokół LADD to synergia zaawansowanej technologii i medycyny regeneracyjnej, w której kluczową rolę odgrywa osocze bogatopłytkowe (PRP). Nie maskujemy tu objawów starzenia — dostarczamy Twojej skórze biologicznych instrukcji do całkowitej przebudowy.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="mb-12 md:mb-16">
            <h3 className="font-serif text-2xl md:text-3xl text-foreground text-center mb-8">
              Jak działa ten proces?
            </h3>
            <p className="text-center text-muted-foreground font-body max-w-2xl mx-auto mb-10">
              Twoje własne płytki krwi to naturalne magazyny życiodajnych substancji, które na co dzień odpowiadają za gojenie i naprawę tkanek. W trakcie procedury uwalniamy ich ukryty potencjał, w tym:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <article className="rounded-sm border border-champagne/30 bg-card p-6 md:p-8">
                <div className="text-xs tracking-[0.3em] uppercase text-champagne font-body mb-4">
                  01 · Komunikatory komórkowe
                </div>
                <h4 className="font-serif text-xl text-foreground mb-3">
                  Skoncentrowane czynniki wzrostu
                </h4>
                <p className="text-muted-foreground font-body leading-relaxed">
                  Białka sygnałowe (m.in. PDGF, VEGF, TGF) działają jak komunikatory. Nakazują one uśpionym komórkom skóry natychmiastowe podziały, stymulując tworzenie nowych naczyń krwionośnych i wzmacniając strukturę tkanki.
                </p>
              </article>

              <article className="rounded-sm border border-champagne/30 bg-card p-6 md:p-8">
                <div className="text-xs tracking-[0.3em] uppercase text-champagne font-body mb-4">
                  02 · Paliwo dla komórek
                </div>
                <h4 className="font-serif text-xl text-foreground mb-3">
                  Witalna energia komórkowa
                </h4>
                <p className="text-muted-foreground font-body leading-relaxed">
                  Związki takie jak ATP i ADP dostarczają komórkom „paliwa” niezbędnego do intensywnej produkcji nowego kolagenu, kwasu hialuronowego i elastyny.
                </p>
              </article>

              <article className="rounded-sm border border-champagne/30 bg-card p-6 md:p-8">
                <div className="text-xs tracking-[0.3em] uppercase text-champagne font-body mb-4">
                  03 · Rusztowanie nowej skóry
                </div>
                <h4 className="font-serif text-xl text-foreground mb-3">
                  Naturalne białka adhezyjne
                </h4>
                <p className="text-muted-foreground font-body leading-relaxed">
                  Elementy takie jak fibronektyna tworzą stabilne rusztowanie, wokół którego formuje się nowa, napięta skóra.
                </p>
              </article>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="rounded-sm border border-champagne/30 bg-gradient-to-b from-card via-background to-card p-8 md:p-12">
            <h3 className="font-serif text-2xl md:text-3xl text-foreground text-center mb-4">
              Siła potrójnej synergii
            </h3>
            <p className="text-center text-muted-foreground font-body max-w-2xl mx-auto mb-10">
              Samo osocze to zaledwie początek. Aby w pełni wykorzystać jego potencjał medyczny bez konieczności inwazyjnego nakłuwania, opracowałem sekwencję technologiczną:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="relative">
                <div className="text-xs tracking-[0.3em] uppercase text-champagne font-body mb-3">
                  Krok 1
                </div>
                <h4 className="font-serif text-xl text-foreground mb-3">Zimna Plazma</h4>
                <p className="text-muted-foreground font-body leading-relaxed">
                  Otwiera mikroskopijne kanały w warstwie rogowej naskórka i sterylizuje środowisko, przygotowując tkankę na przyjęcie substancji aktywnych.
                </p>
              </div>

              <div className="relative">
                <div className="text-xs tracking-[0.3em] uppercase text-champagne font-body mb-3">
                  Krok 2
                </div>
                <h4 className="font-serif text-xl text-foreground mb-3">PRP (Osocze bogatopłytkowe)</h4>
                <p className="text-muted-foreground font-body leading-relaxed">
                  Dostarcza wysoce skoncentrowane, autologiczne składniki odżywcze.
                </p>
              </div>

              <div className="relative">
                <div className="text-xs tracking-[0.3em] uppercase text-champagne font-body mb-3">
                  Krok 3
                </div>
                <h4 className="font-serif text-xl text-foreground mb-3">DEP (DermoElectroPoration)</h4>
                <p className="text-muted-foreground font-body leading-relaxed">
                  Wykorzystując bezpieczne impulsy elektryczne, bezboleśnie wtłacza czynniki wzrostu z osocza głęboko do skóry właściwej – dokładnie tam, gdzie są najbardziej potrzebne.
                </p>
              </div>
            </div>

            <div className="mt-10 max-w-3xl mx-auto text-center">
              <p className="text-muted-foreground font-body leading-relaxed">
                To rozwiązanie stworzone z myślą o najwyższym komforcie i absolutnym bezpieczeństwie. Zapewnia spektakularne odżywienie, wyrównanie tekstury i głęboki blask, wykorzystując w 100% naturalne procesy Twojego ciała.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

const FAQS: Array<{
  id: string;
  tagline: string;
  title: string;
  items: Array<{ q: string; a: string }>;
}> = [
  {
    id: "faq-przywrocenie-konturow",
    tagline: "01 · Lifting i owal",
    title: "Przywrócenie konturów",
    items: [
      {
        q: "Jak się przygotować?",
        a: "Na 2 tygodnie przed wizytą odstawiamy retinoidy i silne kwasy oraz unikamy intensywnej ekspozycji na słońce i solarium. W dniu zabiegu przychodzimy z oczyszczoną skórą, bez makijażu. Lekarz na konsultacji zweryfikuje przyjmowane leki i wskaże ewentualne dodatkowe zalecenia.",
      },
      {
        q: "Jak wygląda przebieg?",
        a: "Sesja trwa zwykle 45–90 minut. Po dokładnej analizie owalu nakładamy znieczulenie miejscowe, a następnie pracujemy sekwencyjnie nad skórą głęboką, powięzią i konturem żuchwy. Odczucia są komfortowe — opisywane jako ciepło i delikatne mikrowibracje. Po zabiegu możliwe jest zaróżowienie skóry, które ustępuje w kilka–kilkanaście godzin.",
      },
      {
        q: "Czy to bezpieczne?",
        a: "Tak — protokół prowadzi lekarz, parametry dobierane są indywidualnie do fototypu i kondycji skóry. Przeciwwskazaniem są m.in. ciąża, karmienie, aktywne stany zapalne skóry oraz wybrane schorzenia ogólne, które weryfikujemy w wywiadzie. Po wizycie zalecamy ochronę SPF50 i unikanie sauny przez 3–5 dni.",
      },
    ],
  },
  {
    id: "faq-tekstura-hd",
    tagline: "02 · Tekstura « HD »",
    title: "Redukcja blizn i zmarszczek",
    items: [
      {
        q: "Jak się przygotować?",
        a: "Na 2–4 tygodnie przed sesją unikamy opalania oraz mocnych preparatów złuszczających. Przy skłonności do opryszczki włączamy profilaktykę przeciwwirusową zaleconą przez lekarza. W dniu zabiegu skóra powinna być czysta, bez kosmetyków i perfum.",
      },
      {
        q: "Jak wygląda przebieg?",
        a: "Po znieczuleniu w kremie pracujemy frakcyjnie nad teksturą skóry, łącząc kilka technik w jednej sesji, by zoptymalizować przebudowę kolagenu. Bezpośrednio po zabiegu skóra jest zaczerwieniona i ciepła; przez 2–5 dni utrzymuje się delikatne łuszczenie. Pełny efekt rozwija się stopniowo w ciągu 8–12 tygodni.",
      },
      {
        q: "Czy to bezpieczne?",
        a: "Protokół jest dobrze tolerowany przy odpowiedniej kwalifikacji. Nie wykonujemy go w ciąży, przy aktywnym opalaniu, infekcji skóry czy przyjmowaniu izotretynoiny w ostatnich 6 miesiącach. Po zabiegu obowiązkowa jest pielęgnacja regenerująca i SPF50 przez minimum 4 tygodnie.",
      },
    ],
  },
  {
    id: "faq-rewitalizacja-dloni",
    tagline: "03 · Rewitalizacja dłoni i ciała",
    title: "Gęstość i jędrność",
    items: [
      {
        q: "Jak się przygotować?",
        a: "Na tydzień przed wizytą rezygnujemy z silnych peelingów na obszarze planowanej pracy oraz z intensywnej ekspozycji na słońce. Warto być dobrze nawodnioną/nawodnionym i zjeść lekki posiłek przed sesją, zwłaszcza przy pracy nad ciałem.",
      },
      {
        q: "Jak wygląda przebieg?",
        a: "Sesja trwa od 30 do 90 minut w zależności od obszaru. Pracujemy warstwowo — najpierw nad strukturą głęboką i powięzią, następnie nad jakością skóry. Zabieg jest komfortowy, bez przestoju społecznego. Pierwsze efekty napięcia widać po kilku dniach, pełny rezultat — po serii 3–4 sesji.",
      },
      {
        q: "Czy to bezpieczne?",
        a: "Tak — pracujemy na parametrach klinicznych, pod nadzorem lekarza. Przeciwwskazania to m.in. ciąża, implanty elektroniczne w obszarze pracy, stany zapalne i aktywne choroby skóry. Po wizycie zalecamy nawodnienie i unikanie intensywnego treningu przez 24 godziny.",
      },
    ],
  },
  {
    id: "faq-okolica-oka",
    tagline: "04 · Okolica oka",
    title: "Kontur i blask spojrzenia",
    items: [
      {
        q: "Jak się przygotować?",
        a: "Na wizytę przychodzimy bez makijażu oczu i bez soczewek kontaktowych — najlepiej w okularach. Tydzień przed zabiegiem odstawiamy mocne kosmetyki z retinolem i kwasami w okolicy oczu. Informujemy lekarza o przebytych zabiegach okulistycznych.",
      },
      {
        q: "Jak wygląda przebieg?",
        a: "Pracujemy bardzo precyzyjnie nad delikatną skórą powiek i okolicą skroni. Sesja trwa 30–60 minut, prowadzona jest w komfortowych warunkach, ze znieczuleniem dopasowanym do techniki. Po zabiegu może pojawić się przejściowy obrzęk lub zaróżowienie, które ustępuje w 1–3 dni.",
      },
      {
        q: "Czy to bezpieczne?",
        a: "Tak — okolica oka wymaga doświadczenia i właściwego doboru technologii, dlatego zawsze prowadzi ją lekarz. Stosujemy osłony ochronne oka oraz parametry bezpieczne dla cienkiej skóry powiek. Przeciwwskazaniem są m.in. aktywne stany zapalne, ciąża i wybrane schorzenia okulistyczne.",
      },
    ],
  },
  {
    id: "faq-modelowanie-sylwetki",
    tagline: "05 · Modelowanie sylwetki",
    title: "Body Contour",
    items: [
      {
        q: "Jak się przygotować?",
        a: "Sesję planujemy 2–3 godziny po lekkim posiłku, dobrze nawodnione/nawodnieni. Na wizytę zakładamy wygodną bieliznę bawełnianą — bez elementów metalowych w obszarze pracy. Informujemy o implantach, rozruszniku serca czy wkładce wewnątrzmacicznej.",
      },
      {
        q: "Jak wygląda przebieg?",
        a: "Sesja trwa około 30 minut i przypomina intensywny trening — bez wysiłku fizycznego, w pozycji leżącej. Mięśnie pracują w cyklach skurczu i relaksacji, a praca uzupełniana jest komponentem regenerującym. Bez przestoju społecznego — po zabiegu wracamy do codziennych aktywności.",
      },
      {
        q: "Czy to bezpieczne?",
        a: "Tak — protokół jest dobrze tolerowany i prowadzony pod kontrolą personelu medycznego. Przeciwwskazania to m.in. ciąża, implanty elektroniczne, metalowe implanty w obszarze pracy, przepukliny i wybrane choroby ogólne. Najlepsze efekty osiągamy w serii 4–6 sesji uzupełnionej zdrowym stylem życia.",
      },
    ],
  },
  {
    id: "faq-renesans",
    tagline: "E · Renesans",
    title: "Konsultacja autorska lek. Jana Bujok",
    items: [
      {
        q: "Jak się przygotować?",
        a: "Na konsultację warto przyjść z listą oczekiwań, historią dotychczasowych zabiegów oraz informacją o przyjmowanych lekach i suplementach. Mile widziane są zdjęcia archiwalne — pomagają zaprojektować plan szanujący Państwa naturalne rysy.",
      },
      {
        q: "Jak wygląda przebieg?",
        a: "Spotkanie trwa do 60 minut i obejmuje analizę twarzy oraz sylwetki, omówienie filozofii « Body Longevity » i zaprojektowanie autorskiej sygnatury rozłożonej w czasie. Otrzymują Państwo plan etapów, kosztorys oraz rekomendacje pielęgnacji pomiędzy wizytami.",
      },
      {
        q: "Czy to bezpieczne?",
        a: "Każdy etap planowany jest przez lekarza w oparciu o pełen wywiad medyczny, z poszanowaniem indywidualnych przeciwwskazań. Sygnatura « Renesans » zakłada sekwencje rozłożone w czasie, by skóra i tkanki regenerowały się w fizjologicznym tempie — bez efektu przerysowania.",
      },
    ],
  },
];

// Walidacja treści publicznej FAQ — nie używamy nazw handlowych urządzeń
// medycznych ani ich producentów (zgodnie z polityką contentową).
// Lista terminów zakazanych — rozszerzaj w razie potrzeby.
const FORBIDDEN_FAQ_TERMS = [
  // Urządzenia / linie sprzętowe
  "picoking", "pico king", "fusion plasma", "plasmage", "plexr",
  "morpheus", "morpheus8", "thermage", "ultherapy", "ulthera",
  "fraxel", "clear + brilliant", "clear and brilliant",
  "emsculpt", "emsella", "coolsculpting", "cooltone",
  "hifu", "sofwave", "sylfirm", "secret rf", "vivace",
  "genius rf", "potenza", "agnes", "intracel",
  "lumenis", "m22", "stellar", "splendor",
  "candela", "gentlemax", "gentlelase", "vbeam",
  "alma", "harmony", "soprano", "accent",
  "cynosure", "picosure", "picoway", "elite",
  "syneron", "venus", "exilis", "legend",
  "fotona", "starwalker", "dynamis",
  "btl", "inmode", "lutronic", "asclepion",
  // Toksyny / wypełniacze (marki)
  "botox", "dysport", "azzalure", "bocouture", "xeomin",
  "juvederm", "restylane", "belotero", "teosyal", "stylage",
  "radiesse", "sculptra", "ellanse", "profhilo",
  // Lasery tulowe (marki)
  "lasemd", "tulowy 1927",
];

function validateFaqContent() {
  const found = new Set<string>();
  for (const group of FAQS) {
    const haystack = [
      group.title,
      group.tagline,
      ...group.items.flatMap((i) => [i.q, i.a]),
    ]
      .join(" \n ")
      .toLowerCase();
    for (const term of FORBIDDEN_FAQ_TERMS) {
      if (haystack.includes(term)) found.add(term);
    }
  }
  if (found.size > 0) {
    const list = Array.from(found).join(", ");
    const msg = `[rozwiazania FAQ] Treść zawiera zakazane nazwy handlowe / producentów: ${list}. Usuń je z FAQS.`;
    if (import.meta.env.DEV) {
      throw new Error(msg);
    } else {
      console.error(msg);
    }
  }
}

validateFaqContent();



function FaqSection() {
  return (
    <section className="border-t border-border bg-background">
      <div className="container-luxury py-16 md:py-24">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <div className="text-xs tracking-[0.3em] uppercase text-champagne mb-4 font-body">
              Najczęstsze pytania
            </div>
            <h2 className="font-serif text-3xl md:text-5xl text-foreground leading-tight">
              Przygotowanie, przebieg i bezpieczeństwo
            </h2>
            <p className="mt-4 text-muted-foreground font-body">
              Krótkie odpowiedzi dla każdego z protokołów — szczegóły zawsze
              omawiamy indywidualnie podczas konsultacji.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {FAQS.map((group) => (
            <ScrollReveal key={group.id}>
              <article
                id={group.id}
                className="h-full rounded-sm border border-champagne/30 bg-card p-6 md:p-8"
              >
                <div className="text-xs tracking-[0.3em] uppercase text-champagne font-body">
                  {group.tagline}
                </div>
                <h3 className="font-serif text-2xl md:text-3xl text-foreground mt-2 mb-4 leading-tight">
                  {group.title}
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {group.items.map((item, idx) => (
                    <AccordionItem key={idx} value={`${group.id}-${idx}`}>
                      <AccordionTrigger className="text-left font-body text-foreground">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground font-body leading-relaxed">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
