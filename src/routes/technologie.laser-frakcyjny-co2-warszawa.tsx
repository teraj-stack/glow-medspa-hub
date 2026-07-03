import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { LocalWarsawSection } from "@/components/site/LocalWarsawSection";
import { CheckCircle2, AlertTriangle, Clock, Sparkles } from "lucide-react";
import { CLINIC_ADDRESS, CLINIC_POSTAL_ADDRESS_JSONLD } from "@/config/clinic";
import { withOgVersion } from "@/config/social-preview";
import ogCard from "@/assets/og/index.jpg";

const CANONICAL = "https://bmclinics.ai/technologie/laser-frakcyjny-co2-warszawa";
const TITLE = "Laser frakcyjny CO₂ Warszawa — protokół, wskazania, cena | BMClinics";
const DESCRIPTION =
  "Laser frakcyjny CO₂ w Warszawie (Wilanów, Klinika Ginekologii). Wskazania, przebieg zabiegu, rekonwalescencja dzień po dniu, bezpieczeństwo i cennik. Konsultacja lekarska.";

const FAQ = [
  {
    q: "Ile kosztuje laser frakcyjny CO₂ w Warszawie?",
    a: "Zabieg na obszar (twarz, szyja, dekolt) to koszt od 1 500 zł. Pakiety serii 2–3 zabiegów z rabatem. Ostateczna wycena po konsultacji lekarskiej.",
  },
  {
    q: "Ile trwa rekonwalescencja po laserze frakcyjnym CO₂?",
    a: "Rumień i obrzęk 3–5 dni, złuszczanie do 7–10 dni. Powrót do pracy biurowej zwykle po 5–7 dniach. Pełne wygojenie skóry: 3–4 tygodnie.",
  },
  {
    q: "Czy laser CO₂ jest bolesny?",
    a: "Zabieg wykonujemy w znieczuleniu miejscowym (krem EMLA + chłodzenie). Odczuwane jest ciepło i lekkie pieczenie, nie ostry ból.",
  },
  {
    q: "Ile zabiegów potrzeba, by zobaczyć efekt?",
    a: "Widoczna poprawa po pierwszej sesji. Pełny efekt (blizny, głębokie zmarszczki, rozstępy): seria 2–3 zabiegów co 6–8 tygodni.",
  },
  {
    q: "Kiedy nie można wykonać zabiegu?",
    a: "Świeża opalenizna, izotretynoina w ostatnich 6 miesiącach, ciąża i karmienie, aktywne infekcje skóry, skłonność do bliznowców, nawracająca opryszczka bez profilaktyki.",
  },
];

export const Route = createFileRoute("/technologie/laser-frakcyjny-co2-warszawa")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      {
        name: "keywords",
        content:
          "laser frakcyjny Warszawa, laser co2 Warszawa, laser frakcyjny co2 Warszawa, blizny potrądzikowe Warszawa, rozstępy Warszawa, Wilanów, klinika ginekologii",
      },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: CANONICAL },
      { property: "og:image", content: withOgVersion(`https://bmclinics.ai${ogCard}`) },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "BMClinics.ai — Warszawa (Wilanów), ul. Branickiego 10" },
      { name: "twitter:image", content: withOgVersion(`https://bmclinics.ai${ogCard}`) },
      { name: "geo.region", content: "PL-MZ" },
      { name: "geo.placename", content: "Warszawa" },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MedicalProcedure",
          name: "Laser frakcyjny CO₂",
          alternateName: ["Laser frakcyjny", "Laser CO2 ablacyjny"],
          procedureType: "https://schema.org/TherapeuticProcedure",
          bodyLocation: "Twarz, szyja, dekolt, dłonie, blizny",
          preparation:
            "Konsultacja lekarska, unikanie ekspozycji na UV 4 tyg. przed zabiegiem, profilaktyka przeciwwirusowa u pacjentów z nawracającą opryszczką.",
          followup: "Rekonwalescencja 5–7 dni, fotoprotekcja SPF 50+ przez 3 miesiące.",
          howPerformed:
            "Zabieg wykonywany w znieczuleniu miejscowym; wiązka lasera CO₂ o długości fali 10 600 nm frakcyjnie odparowuje mikrokolumny naskórka i pobudza remodeling kolagenu.",
          url: CANONICAL,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MedicalClinic",
          "@id": CANONICAL + "#clinic",
          name: "BMClinics — Klinika Ginekologii",
          url: "https://bmclinics.ai",
          address: {
            ...CLINIC_POSTAL_ADDRESS_JSONLD,
          },
          geo: { "@type": "GeoCoordinates", latitude: CLINIC_ADDRESS.latitude, longitude: CLINIC_ADDRESS.longitude },
          areaServed: { "@type": "City", name: "Warszawa" },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Strona główna", item: "https://bmclinics.ai/" },
            { "@type": "ListItem", position: 2, name: "Technologie", item: "https://bmclinics.ai/technologie" },
            { "@type": "ListItem", position: 3, name: "Laser frakcyjny CO₂ Warszawa", item: CANONICAL },
          ],
        }),
      },
    ],
  }),
  component: LaserCO2Page,
});

function LaserCO2Page() {
  return (
    <main className="bg-background">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-16 md:pt-24">
        <nav aria-label="Ścieżka" className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          <Link to="/" className="hover:text-ink">Start</Link> ·{" "}
          <Link to="/technologie" className="hover:text-ink">Technologie</Link> · Laser frakcyjny CO₂
        </nav>
        <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-champagne/40 bg-champagne/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-champagne">
          Warszawa · Wilanów
        </span>
        <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-ink md:text-5xl">
          Laser frakcyjny CO₂ w Warszawie
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
          Ablacyjna technologia frakcyjna 10 600 nm — złoty standard w leczeniu blizn potrądzikowych,
          głębokich zmarszczek i rozstępów. Kwalifikacja lekarska, protokół dopasowany do fototypu,
          konsultacja w Klinice Ginekologii przy ul. Branickiego 10.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/konsultacja" className="inline-flex h-11 items-center justify-center rounded-md bg-ink px-6 text-sm tracking-wide text-alabaster hover:bg-ink/90">
            Rezerwuj konsultację
          </Link>
          <Link to="/cennik" className="inline-flex h-11 items-center justify-center rounded-md border border-border px-6 text-sm text-ink hover:bg-secondary">
            Zobacz cennik
          </Link>
        </div>
      </section>

      {/* Wskazania */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading eyebrow="Dla kogo" title="Wskazania do lasera frakcyjnego CO₂" />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { h3: "Blizny potrądzikowe i pozabiegowe", text: "Wygładzenie zagłębień typu ice-pick, rolling i boxcar; wyrównanie kolorytu." },
            { h3: "Zmarszczki okolic oczu i ust", text: "Kurze łapki, zmarszczki palacza, opadające kąciki ust — remodeling kolagenu." },
            { h3: "Fotostarzenie i utrata jędrności", text: "Poprawa gęstości i napięcia skóry, redukcja zmian posłonecznych." },
            { h3: "Rozstępy świeże i starsze", text: "Redukcja szerokości i głębokości rozstępów na brzuchu, biodrach, piersiach." },
            { h3: "Nierówna tekstura i rozszerzone pory", text: "Wygładzenie mikroreliefu skóry twarzy, szyi i dekoltu." },
            { h3: "Zmiany naskórkowe", text: "Rogowacenie słoneczne, przerośnięte gruczoły łojowe — po kwalifikacji lekarskiej." },
          ].map((i) => (
            <div key={i.h3} className="rounded-lg border border-border bg-card p-6 shadow-soft">
              <Sparkles className="size-5 text-champagne" aria-hidden />
              <h3 className="mt-3 font-serif text-lg text-ink">{i.h3}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{i.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-lg border border-border bg-card p-6">
          <h3 className="flex items-center gap-2 font-serif text-lg text-ink">
            <AlertTriangle className="size-5 text-champagne" aria-hidden />
            Kiedy laser CO₂ NIE jest wskazany
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Świeża opalenizna, izotretynoina w ostatnich 6 miesiącach, ciąża i karmienie,
            aktywne infekcje skóry, skłonność do bliznowców, nieustabilizowana melasma,
            fototyp VI bez wcześniejszego testu. Wszystkie te sytuacje weryfikujemy podczas konsultacji lekarskiej.
          </p>
        </div>
      </section>

      {/* Przebieg */}
      <section className="bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <SectionHeading
            eyebrow="Krok po kroku"
            title="Jak wygląda zabieg"
            description="Bez niespodzianek — każdy etap ma jasne ramy czasowe."
          />
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                h3: "Konsultacja i kwalifikacja lekarska",
                text: "Ocena fototypu, historia medyczna, dobór parametrów, zdjęcia baseline, plan sesji.",
              },
              {
                h3: "Przebieg zabiegu (30–60 min)",
                text: "Znieczulenie kremem EMLA (45 min), zabieg 15–25 min, chłodzenie skóry, opatrunek regenerujący.",
              },
              {
                h3: "Rekonwalescencja D0–D14",
                text: "D0–2: rumień i obrzęk. D3–5: złuszczanie. D6–10: różowa, gładka skóra. D14+: powrót aktywnej pielęgnacji.",
              },
            ].map((s) => (
              <li key={s.h3} className="rounded-lg border border-border bg-card p-6 shadow-soft">
                <Clock className="size-5 text-champagne" aria-hidden />
                <h3 className="mt-3 font-serif text-lg text-ink">{s.h3}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Szczegółowy dzień-po-dniu opisujemy w artykule{" "}
            <Link to="/blog/laser-frakcyjny-rekonwalescencja" className="text-champagne hover:underline">
              Laser frakcyjny — rekonwalescencja krok po kroku
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Efekty i seria */}
      <section className="mx-auto max-w-4xl px-4 py-16">
        <SectionHeading eyebrow="Efekty i seria" title="Kiedy widać rezultat" />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6 shadow-soft">
            <h3 className="font-serif text-lg text-ink">Pierwsze efekty</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Rozświetlenie i wygładzenie skóry po 2 tygodniach. Zmniejszenie zmarszczek i wyrównanie
              kolorytu widoczne po 4–6 tygodniach — wtedy zaczyna działać nowo powstały kolagen.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 shadow-soft">
            <h3 className="font-serif text-lg text-ink">Rekomendowana seria</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Blizny potrądzikowe: 2–3 zabiegi co 6–8 tygodni. Odmłodzenie: 1–2 zabiegi rocznie.
              Rozstępy: 3–4 zabiegi. Zabiegi planujemy w sezonie o niskim UV (październik–marzec).
            </p>
          </div>
        </div>
      </section>

      {/* Bezpieczeństwo */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <SectionHeading eyebrow="Bezpieczeństwo" title="Nasz protokół w Warszawie" />
        <ul className="mt-8 grid gap-3">
          {[
            "Kwalifikacja lekarska z analizą skóry twarzy przed każdą pierwszą sesją.",
            "Profilaktyka przeciwwirusowa u pacjentów z nawracającą opryszczką.",
            "Dobór parametrów wg fototypu Fitzpatricka — zminimalizowane ryzyko przebarwień pozapalnych.",
            "Zabieg w gabinecie zabiegowym z pełnym zapleczem medycznym Kliniki Ginekologii.",
            "Kontrola po 14 dniach i po 8 tygodniach — dokumentacja fotograficzna postępu.",
          ].map((s) => (
            <li key={s} className="flex items-start gap-3 rounded-md border border-border bg-card p-4 text-sm">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-champagne" aria-hidden />
              <span>{s}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm">
          Więcej o standardach bezpieczeństwa:{" "}
          <Link to="/bezpieczenstwo-zabiegow-laserowych" className="text-champagne hover:underline">
            Bezpieczeństwo zabiegów laserowych
          </Link>
          .
        </p>
      </section>

      {/* Cennik */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <SectionHeading eyebrow="Cennik" title="Ile kosztuje laser frakcyjny CO₂ w Warszawie" />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6 shadow-soft">
            <h3 className="font-serif text-lg text-ink">Cena za obszar</h3>
            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
              <li>Twarz — od 1 500 zł</li>
              <li>Twarz + szyja — od 2 200 zł</li>
              <li>Twarz + szyja + dekolt — od 2 800 zł</li>
              <li>Blizna miejscowa — od 600 zł</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 shadow-soft">
            <h3 className="font-serif text-lg text-ink">Pakiety serii</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Seria 2 zabiegów: −10%. Seria 3 zabiegów: −15%. Konsultacja lekarska (300 zł) jest
              odliczana od pierwszego zabiegu z serii.
            </p>
          </div>
        </div>
        <Link to="/cennik" className="mt-4 inline-block text-sm text-champagne hover:underline">
          Pełny cennik →
        </Link>
      </section>

      {/* Powiązane wskazania */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <SectionHeading eyebrow="Powiązane wskazania" title="Co jeszcze możemy leczyć" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { slug: "blizny-potradzikowe-warszawa", label: "Blizny potrądzikowe" },
            { slug: "przebarwienia-warszawa", label: "Przebarwienia" },
            { slug: "rozstepy-warszawa", label: "Rozstępy" },
          ].map((w) => (
            <Link
              key={w.slug}
              to="/wskazania/$slug"
              params={{ slug: w.slug }}
              className="rounded-lg border border-border bg-card p-5 text-sm shadow-soft hover:border-champagne/60"
            >
              {w.label} <span className="text-champagne">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <SectionHeading eyebrow="FAQ" title="Najczęstsze pytania" />
        <div className="mt-8 space-y-4">
          {FAQ.map((f) => (
            <details key={f.q} className="group rounded-lg border border-border bg-card p-5 shadow-soft">
              <summary className="cursor-pointer list-none font-serif text-lg text-ink">{f.q}</summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Local */}
      <LocalWarsawSection procedureLabel="laser frakcyjny CO₂" />

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 py-24 text-center">
        <div className="rounded-lg border border-champagne/40 bg-card p-8 shadow-soft md:p-12">
          <div className="text-xs uppercase tracking-[0.3em] text-champagne">Umów wizytę</div>
          <h2 className="mt-3 font-serif text-2xl text-ink md:text-3xl">
            Konsultacja lekarska — pierwszy krok do lasera frakcyjnego CO₂
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/konsultacja" className="inline-flex h-11 items-center justify-center rounded-md bg-ink px-6 text-sm text-alabaster hover:bg-ink/90">
              Umów konsultację
            </Link>
            <Link to="/lekarze" className="inline-flex h-11 items-center justify-center rounded-md border border-border px-6 text-sm text-ink hover:bg-secondary">
              Poznaj zespół
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
