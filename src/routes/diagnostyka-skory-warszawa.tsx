import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ScanFace, Microscope, ClipboardList, Sparkles, MapPin, Clock, CheckCircle2, Waves, Layers, LineChart, Grid3x3 } from "lucide-react";
import { CLINIC_ADDRESS, CLINIC_POSTAL_ADDRESS_JSONLD } from "@/config/clinic";
import { withOgVersion } from "@/config/social-preview";
import ogCard from "@/assets/og/index.jpg";

const CANONICAL = "https://bmclinics.ai/diagnostyka-skory-warszawa";
const TITLE = "Diagnostyka skóry Warszawa — analiza skóry twarzy i badanie skóry | BMClinics";
const DESCRIPTION =
  "Profesjonalna diagnostyka skóry w Warszawie (Klinika Ginekologii, ul. Branickiego 10): analiza skóry twarzy i badanie skóry z obrazowaniem wielospektralnym, konsultacja lekarska i spersonalizowany plan leczenia.";

export const Route = createFileRoute("/diagnostyka-skory-warszawa")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "keywords", content: "diagnostyka skóry Warszawa, analiza skóry twarzy, badanie skóry, analiza skóry Warszawa, dermatoskopia Warszawa, Wilanów, klinika ginekologii" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
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
          "@type": ["MedicalClinic", "LocalBusiness"],
          "@id": CANONICAL + "#business",
          name: "BMClinics — Diagnostyka skóry Warszawa (Klinika Ginekologii)",
          url: CANONICAL,
          image: "https://bmclinics.ai/og-image.jpg",
          telephone: "+48 570 570 100",
          priceRange: "$$$",
          areaServed: { "@type": "City", name: "Warszawa" },
          address: {
            ...CLINIC_POSTAL_ADDRESS_JSONLD,
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: CLINIC_ADDRESS.latitude,
            longitude: CLINIC_ADDRESS.longitude,
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              opens: "09:00",
              closes: "19:00",
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: "Saturday",
              opens: "10:00",
              closes: "15:00",
            },
          ],
          medicalSpecialty: ["Dermatology", "CosmeticProcedure"],
          availableService: [
            {
              "@type": "MedicalProcedure",
              name: "Analiza skóry twarzy",
              procedureType: "Diagnostic",
            },
            {
              "@type": "MedicalProcedure",
              name: "Badanie skóry — obrazowanie wielospektralne",
              procedureType: "Diagnostic",
            },
          ],
        }),
      },

      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Ile trwa analiza skóry twarzy?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Pełna analiza skóry twarzy wraz z konsultacją lekarską trwa od 45 do 60 minut. W tym czasie wykonujemy obrazowanie, omawiamy wyniki i przygotowujemy plan pielęgnacji lub leczenia.",
              },
            },
            {
              "@type": "Question",
              name: "Czy badanie skóry jest bezpieczne?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Tak. Diagnostyka jest w pełni bezinwazyjna — używamy światła w bezpiecznym zakresie widzialnym i UV do obrazowania warstw skóry. Nie ma rekonwalescencji.",
              },
            },
            {
              "@type": "Question",
              name: "Gdzie odbywa się diagnostyka w Warszawie?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Konsultacje i diagnostykę prowadzimy w Klinice Ginekologii przy ul. Branickiego 10 w warszawskim Wilanowie. Dogodny dojazd komunikacją miejską i parking dla pacjentów na miejscu.",
              },
            },
            {
              "@type": "Question",
              name: "Co otrzymuję po badaniu?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Raport z obrazowaniem, ocenę parametrów skóry (nawilżenie, pory, przebarwienia, naczynia, zmarszczki) oraz spersonalizowany plan działań z rekomendacjami zabiegów i pielęgnacji domowej.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: DiagnostykaSkoryPage,
});

function DiagnostykaSkoryPage() {
  return (
    <main className="bg-background">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-16 md:pt-24">
        <div className="flex flex-col items-start gap-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-champagne/40 bg-champagne/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-champagne">
            <MapPin className="size-3.5" aria-hidden /> Warszawa · Wilanów
          </span>
          <h1 className="max-w-3xl font-serif text-4xl leading-tight text-ink md:text-5xl">
            Diagnostyka skóry w Warszawie — analiza skóry twarzy i badanie skóry
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
            Zaczynamy od zrozumienia. Precyzyjne badanie skóry i analiza skóry twarzy pozwalają nam
            zaproponować leczenie, które faktycznie działa — bez zgadywania i bez zbędnych zabiegów.
            Konsultacje w Klinice Ginekologii przy ul. Branickiego 10.
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Link
              to="/konsultacja"
              className="inline-flex h-11 items-center justify-center rounded-md bg-ink px-6 text-sm tracking-wide text-alabaster transition hover:bg-ink/90"
            >
              Umów diagnostykę
            </Link>
            <Link
              to="/technologie"
              className="inline-flex h-11 items-center justify-center rounded-md border border-border px-6 text-sm text-ink hover:bg-secondary"
            >
              Poznaj technologie
            </Link>
          </div>
        </div>
      </section>

      {/* Co badamy */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading
          eyebrow="Analiza skóry twarzy"
          title="Co dokładnie badamy"
          description="Wielowarstwowe obrazowanie pokazuje to, czego nie widać gołym okiem — struktury głębokie i wczesne oznaki zmian."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: ScanFace, title: "Przebarwienia i melasma", text: "Mapowanie skupisk melaniny w naskórku i skórze właściwej." },
            { icon: Sparkles, title: "Nawilżenie i bariera", text: "Ocena stopnia nawilżenia oraz kondycji płaszcza hydrolipidowego." },
            { icon: Microscope, title: "Naczynia i zaczerwienienia", text: "Mapa mikrokrążenia i teleangiektazji w świetle spolaryzowanym." },
            { icon: ClipboardList, title: "Pory i tekstura", text: "Ocena rozszerzonych porów, gładkości i mikroreliefu skóry." },
            { icon: CheckCircle2, title: "Zmarszczki i utrata jędrności", text: "Analiza głębokości zmarszczek statycznych i mimicznych." },
            { icon: Clock, title: "Wiek biologiczny skóry", text: "Porównanie parametrów z normami wiekowymi — realny punkt startu." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-lg border border-border bg-card p-6 shadow-soft">
              <Icon className="size-6 text-champagne" aria-hidden />
              <h3 className="mt-4 font-serif text-lg text-ink">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Jak wygląda konsultacja */}
      <section className="bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <SectionHeading
            eyebrow="Jak wygląda konsultacja"
            title="Cztery kroki spokojnej diagnostyki"
            description="Bez presji, bez sprzedaży zabiegów na siłę. Wychodzisz z konkretnym planem — nie z listą propozycji."
          />
          <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                n: "01",
                title: "Wywiad medyczny",
                text: "Rozmawiamy o oczekiwaniach, historii leczenia, przyjmowanych lekach i pielęgnacji domowej.",
              },
              {
                n: "02",
                title: "Obrazowanie skóry",
                text: "Wielospektralne zdjęcia twarzy w świetle widzialnym, UV i spolaryzowanym — komfortowe, kilka minut.",
              },
              {
                n: "03",
                title: "Omówienie wyników",
                text: "Pokazujemy warstwa po warstwie, co dzieje się w Twojej skórze i co jest priorytetem.",
              },
              {
                n: "04",
                title: "Spersonalizowany plan",
                text: "Otrzymujesz raport i plan działań — zabiegi, kolejność, odstępy, pielęgnacja domowa, koszt.",
              },
            ].map((s) => (
              <li key={s.n} className="rounded-lg border border-border bg-card p-6 shadow-soft">
                <div className="text-xs uppercase tracking-[0.3em] text-champagne">Krok {s.n}</div>
                <h3 className="mt-3 font-serif text-lg text-ink">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Jak to działa technologicznie */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading
          eyebrow="Jak to działa"
          title="Diagnostyka od strony technologicznej"
          description="Bez nazw handlowych — zasady fizyczne i metody obrazowania, które składają się na wiarygodny raport skóry."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {[
            {
              icon: Layers,
              title: "Obrazowanie wielospektralne",
              text: "Twarz jest fotografowana w kilku kanałach światła — widzialnym, ultrafioletowym (UV) i podczerwonym (NIR). Każde spektrum przenika naskórek na inną głębokość i uwidacznia różne struktury: powierzchnię, warstwę barwnikową, sieć naczyń, ślady fotostarzenia.",
            },
            {
              icon: Waves,
              title: "Polaryzacja krzyżowa i równoległa",
              text: "Filtry polaryzacyjne oddzielają światło odbite od powierzchni od światła rozproszonego w głębi skóry. Polaryzacja krzyżowa odsłania naczynia i rumień, równoległa uwypukla teksturę, pory i mikrorelief.",
            },
            {
              icon: Grid3x3,
              title: "Mapping skóry i topografia 3D",
              text: "Zdjęcia są łączone w cyfrową mapę twarzy z zachowaniem tej samej geometrii, kadru i oświetlenia. Dzięki temu kolejne badania są porównywalne — a różnica między nimi jest efektem leczenia, nie zmiany warunków.",
            },
            {
              icon: LineChart,
              title: "Analiza ilościowa i normy wiekowe",
              text: "Algorytm koloryzuje intensywność melaniny, gęstość naczyń, głębokość zmarszczek i liczbę porów, a następnie porównuje wyniki z wartościami typowymi dla Twojego wieku i fototypu. Otrzymujesz liczby, nie ogólniki.",
            },
            {
              icon: Sparkles,
              title: "Pomiary biofizyczne bariery",
              text: "Bezkontaktowe sondy oceniają nawilżenie warstwy rogowej (korneometria), przeznaskórkową utratę wody (TEWL) i elastyczność (kutometria). To trzy niezależne wskaźniki kondycji bariery skórnej.",
            },
            {
              icon: Microscope,
              title: "Dermatoskopia zmian ogniskowych",
              text: "Wybrane zmiany barwnikowe oceniamy dodatkowo w powiększeniu z polaryzacją — do klasyfikacji łagodnych znamion i wychwycenia zmian, które wymagają kontroli dermatologicznej.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-lg border border-border bg-card p-6 shadow-soft">
              <Icon className="size-6 text-champagne" aria-hidden />
              <h3 className="mt-4 font-serif text-lg text-ink">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Świadomie nie podajemy tu nazw handlowych urządzeń — liczą się metoda, powtarzalność i interpretacja lekarska.
        </p>
      </section>


      {/* Dla kogo */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading
          eyebrow="Dla kogo"
          title="Kiedy warto zrobić badanie skóry"
        />
        <ul className="mt-8 grid gap-3 md:grid-cols-2">
          {[
            "Zauważasz pierwsze przebarwienia, naczynka lub utratę jędrności.",
            "Chcesz zaplanować sensowną kolejność zabiegów zamiast działać reaktywnie.",
            "Kończysz jedną kurację i chcesz obiektywnie ocenić efekt.",
            "Wybierasz się na zabieg laserowy i potrzebujesz kwalifikacji.",
            "Masz mieszane rekomendacje z różnych gabinetów i chcesz drugą opinię.",
            "Zależy Ci na porównywalnych zdjęciach „przed i po” w standardzie klinicznym.",
          ].map((t) => (
            <li key={t} className="flex items-start gap-3 rounded-md border border-border bg-card p-4">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-champagne" aria-hidden />
              <span className="text-sm text-foreground/90">{t}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Subtelne CTA */}
      <section className="mx-auto max-w-4xl px-4 pb-24">
        <div className="rounded-lg border border-champagne/40 bg-card p-8 text-center shadow-soft md:p-12">
          <div className="text-xs uppercase tracking-[0.3em] text-champagne">Zarezerwuj wizytę</div>
          <h2 className="mt-3 font-serif text-2xl text-ink md:text-3xl">
            Zacznij od diagnostyki, nie od zabiegu
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
            45–60 minut spokojnej rozmowy i badania, po którym wiesz dokładnie, co i w jakiej kolejności robić.
            Terminy w Warszawie (Klinika Ginekologii, ul. Branickiego 10) zwykle w ciągu tygodnia.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/konsultacja"
              className="inline-flex h-11 items-center justify-center rounded-md bg-ink px-6 text-sm tracking-wide text-alabaster transition hover:bg-ink/90"
            >
              Umów diagnostykę skóry
            </Link>
            <Link
              to="/cennik"
              className="inline-flex h-11 items-center justify-center rounded-md border border-border px-6 text-sm text-ink hover:bg-secondary"
            >
              Zobacz cennik
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
