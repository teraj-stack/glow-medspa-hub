import { RelatedPosts } from "@/components/site/RelatedPosts";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ArrowLeft, ShieldAlert, CheckCircle2, Stethoscope } from "lucide-react";

const FAQ = [
  {
    q: "Czy mezoterapia igłowa jest bezpieczna?",
    a: "Tak, mezoterapia igłowa jest uznawana za bezpieczny zabieg, pod warunkiem że wykonuje ją doświadczony lekarz medycyny estetycznej w sterylnych warunkach, z użyciem certyfikowanych preparatów i jednorazowych igieł. Ryzyko powikłań jest minimalne, ale niezerowe — dlatego każdy pacjent powinien zostać poinformowany o możliwych skutkach ubocznych przed zabiegiem.",
  },
  {
    q: "Jakie są najczęstsze powikłania po mezoterapii igłowej?",
    a: "Najczęstsze, przemijające powikłania to: zaczerwienienie i obrzęk w miejscu nakłuć, drobne siniaki (krwiaki), swędzenie, uczucie napięcia skóry oraz przejściowe zgrubienia w punkcie wstrzyknięcia. Objawy te zazwyczaj ustępują samoistnie w ciągu 24–72 godzin.",
  },
  {
    q: "Czy powikłania po mezoterapii igłowej są groźne?",
    a: "Poważne powikłania są rzadkie, ale możliwe. Należą do nich: alergiczna reakcja na preparat (w tym anafilaksja), infekcja bakteryjna, reakcja gruźlicza (np. zgrubienia, stany zapalne), naczyniowe powikłania (zatory), oraz w rzadkich przypadkach — martwica skóry w wyniku nieprawidłowej techniki. Dlatego kluczowe jest wybranie doświadczonego lekarza i certyfikowanego preparatu.",
  },
  {
    q: "Jak długo utrzymują się zaczerwienienia i siniaki po mezoterapii?",
    a: "Zaczerwienienie i drobne obrzęki zazwyczaj znikają w ciągu 1–3 dni. Siniaki (krwiaki) mogą utrzymywać się nieco dłużej — zwykle 3–7 dni, w zależności od predyspozycji pacjenta i miejsca zabiegowego. Aby przyspieszyć gojenie, zaleca się stosowanie preparatów z witaminą K i unikanie intensywnego wysiłku fizycznego przez 24–48 godzin po zabiegu.",
  },
  {
    q: "Jak uniknąć powikłań po mezoterapii igłowej?",
    a: "Aby zminimalizować ryzyko: wybieraj wyłącznie certyfikowane kliniki z doświadczonymi lekarzami, upewnij się że preparat jest oryginalny i dopuszczony do obrotu, przestrzegaj zaleceń przedzabiegowych (unikanie alkoholu, aspiryny, niesteroidowych leków przeciwzapalnych), po zabiegu nie dotykaj twarzy brudnymi rękoma, unikaj sauny, basenu i makijażu przez 24 godziny, oraz zgłoś wszystkie przyjmowane leki i alergie lekarzowi przed zabiegiem.",
  },
  {
    q: "Czy można wykonywać mezoterapię igłową w czasie ciąży lub karmienia piersią?",
    a: "Mezoterapia igłowa jest przeciwwskazana w ciąży i podczas karmienia piersią. Brak wystarczających badań potwierdzających bezpieczeństwo preparatów dla płodu i noworodka, dlatego lekarze medycyny estetycznej nie wykonują tego zabiegu u pacjentek w tym okresie.",
  },
  {
    q: "Co zrobić, jeśli po mezoterapii pojawi się infekcja?",
    a: "W przypadku podejrzenia infekcji — nasilone zaczerwienienie, bolesność, gorączka, ropne wycieki lub zgrubienia — należy natychmiast skontaktować się z lekarzem wykonującym zabieg. Nie stosuj samodzielnie antybiotyków ani nie próbuj wyciskać zmian. Szybka interwencja medyczna zapobiega rozwojowi poważniejszych powikłań, takich jak zgorzelina czy bliznowce.",
  },
  {
    q: "Czy powikłania po mezoterapii igłowej mogą prowadzić do trwałych uszkodzeń skóry?",
    a: "Przy prawidłowej technice i stosowaniu certyfikowanych preparatów ryzyko trwałych uszkodzeń jest marginalne. Powikłania przeważnie mają charakter przejściowy. Jedynie w przypadku zakażenia, zatoru lub reakcji autoimmunologicznej istnieje ryzyko trwałych zmian — dlatego tak istotna jest odpowiednia kwalifikacja do zabiegu i postępowanie w sterylnych warunkach.",
  },
];

export const Route = createFileRoute("/blog/powiklania-mezoterapia-iglowa")({
  head: () => ({
    meta: [
      { title: "Powikłania po mezoterapii igłowej — jak ich unikać | Beauty & Mind Clinic Siedlce" },
      {
        name: "description",
        content:
          "Kompletny przewodnik po powikłaniach po mezoterapii igłowej: jakie są najczęstsze skutki uboczne, kiedy należy się martwić i jak unikać komplikacji. Beauty & Mind Clinic Siedlce.",
      },
      {
        name: "keywords",
        content:
          "powikłania po mezoterapii igłowej, skutki uboczne mezoterapii, bezpieczeństwo mezoterapii, zaczerwienienie po mezoterapii, siniaki po mezoterapii, mezoterapia igłowa Siedlce",
      },
      { property: "og:title", content: "Powikłania po mezoterapii igłowej — jak ich unikać" },
      {
        property: "og:description",
        content:
          "Kompletny przewodnik po powikłaniach po mezoterapii igłowej: jakie są najczęstsze skutki uboczne, kiedy należy się martwić i jak unikać komplikacji.",
      },
      { property: "og:url", content: "https://bmclinics.ai/blog/powiklania-mezoterapia-iglowa" },
      { property: "og:type", content: "article" },
      { property: "article:published_time", content: "2025-06-22T10:00:00+02:00" },
      { property: "article:modified_time", content: "2025-06-22T10:00:00+02:00" },
      { property: "article:author", content: "Beauty & Mind Clinic" },
      { property: "article:section", content: "Medycyna estetyczna" },
      { property: "article:tag", content: "mezoterapia igłowa" },
      { property: "article:tag", content: "bezpieczeństwo zabiegów" },
      { property: "article:tag", content: "powikłania" },
      { property: "og:locale", content: "pl_PL" },
    ],
    links: [
      { rel: "canonical", href: "https://bmclinics.ai/blog/powiklania-mezoterapia-iglowa" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Powikłania po mezoterapii igłowej — jakich można się spodziewać i jak ich unikać",
          description:
            "Kompletny przewodnik po powikłaniach po mezoterapii igłowej: jakie są najczęstsze skutki uboczne, kiedy należy się martwić i jak unikać komplikacji.",
          author: { "@type": "Organization", name: "Beauty & Mind Clinic" },
          publisher: {
            "@type": "Organization",
            name: "Beauty & Mind Clinic",
            logo: { "@type": "ImageObject", url: "https://bmclinics.ai/favicon.ico" },
          },
          datePublished: "2025-06-22T10:00:00+02:00",
          dateModified: "2025-06-22T10:00:00+02:00",
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": "https://bmclinics.ai/blog/powiklania-mezoterapia-iglowa",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
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
            {
              "@type": "ListItem",
              position: 2,
              name: "Powikłania po mezoterapii igłowej",
              item: "https://bmclinics.ai/blog/powiklania-mezoterapia-iglowa",
            },
          ],
        }),
      },
    ],
  }),
  component: ComplicationsGuide,
});

function ComplicationsGuide() {
  return (
    <>
      {/* Hero */}
      <section className="bg-secondary/40 py-12 md:py-20">
        <div className="container-luxury">
          <Link
            to="/technologie"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Technologie
          </Link>
          <div className="mt-6 max-w-3xl">
            <div className="text-xs uppercase tracking-[0.3em] text-champagne">
              Bezpieczeństwo zabiegów
            </div>
            <h1 className="mt-4 font-serif text-ink">
              Powikłania po mezoterapii igłowej — jakich można się spodziewać i jak ich unikać
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Mezoterapia igłowa to jeden z najpopularniejszych zabiegów medycyny estetycznej. Jest
              bezpieczna, ale nie bez ryzyka. Poniżej kompletny przewodnik po powikłaniach — od
              najczęstszych, przemijających reakcji po rzadkie, wymagające interwencji.
            </p>
          </div>
        </div>
      </section>

      <div className="container-luxury grid gap-12 py-16 md:grid-cols-3 md:py-24">
        {/* Main content */}
        <article className="md:col-span-2 space-y-16">
          {/* Section 1: Normalne reakcje */}
          <section>
            <SectionHeading
              eyebrow="Przejściowe skutki"
              title="Co jest normalne po mezoterapii igłowej"
            />
            <p className="mt-4 text-base text-foreground/85 md:text-lg leading-relaxed">
              Po mezoterapii igłowej skóra reaguje — i to jest jej naturalna odpowiedź na kontrolowane
              mikrouszkodzenia. Większość objawów ustępuje w ciągu 1–3 dni i nie wymaga interwencji.
              Oto co możesz zaobserwować bez obaw:
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="tile-card">
                <div className="tile-icon">
                  <CheckCircle2 className="size-5" />
                </div>
                <div className="tile-title text-base">Zaczerwienienie (erytema)</div>
                <p className="tile-text">
                  Przejściowe zaczerwienienie w miejscu nakłuć, zazwyczaj ustępujące w ciągu 24–48 h.
                </p>
              </div>
              <div className="tile-card">
                <div className="tile-icon">
                  <CheckCircle2 className="size-5" />
                </div>
                <div className="tile-title text-base">Obrzęk (edema)</div>
                <p className="tile-text">
                  Lekki obrzęk wokół punktów wstrzyknięcia — efekt wprowadzenia preparatu i miejscowego
                  procesu zapalnego.
                </p>
              </div>
              <div className="tile-card">
                <div className="tile-icon">
                  <CheckCircle2 className="size-5" />
                </div>
                <div className="tile-title text-base">Drobne siniaki (krwiaki)</div>
                <p className="tile-text">
                  Mikrokrwiaki wokół naczyń włosowatych, szczególnie w okolicach z cieńszą skórą.
                  Znikają w 3–7 dni.
                </p>
              </div>
              <div className="tile-card">
                <div className="tile-icon">
                  <CheckCircle2 className="size-5" />
                </div>
                <div className="tile-title text-base">Uczucie napięcia i swędzenie</div>
                <p className="tile-text">
                  Przejściowe uczucie napięcia lub delikatne swędzenie — oznaka aktywacji skóry do
                  regeneracji.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Poważne powikłania */}
          <section>
            <SectionHeading
              eyebrow="Wymagają uwagi"
              title="Poważniejsze powikłania i kiedy się martwić"
            />
            <p className="mt-4 text-base text-foreground/85 md:text-lg leading-relaxed">
              Choć rzadkie, istnieją powikłania wymagające kontaktu z lekarzem. Odróżnienie normalnej
              reakcji od alarmującej jest kluczowe dla szybkiej interwencji:
            </p>

            <div className="mt-8 divide-y divide-border rounded-lg border border-border bg-card">
              <div className="p-5">
                <h3 className="font-serif text-lg text-ink">Alergia i reakcja nadwrażliwości</h3>
                <p className="mt-2 text-foreground/80">
                  Nagły obrzęk, pokrzywka, trudności w oddychaniu lub wstrząs anafilaktyczny. Ryzyko
                  alergii na kwas hialuronowy lub inne składniki preparatu jest niskie, ale każdy
                  pacjent powinien zostać poddany wywiadowi alergicznemu przed zabiegiem.
                </p>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-lg text-ink">Infekcja bakteryjna</h3>
                <p className="mt-2 text-foreground/80">
                  Nasilające się zaczerwienienie, bolesność, gorączka, ropne wycieki lub zgrubienia
                  wskazują na zakażenie. Infekcja może prowadzić do poważnych powikłań, w tym
                  zgorzeliny, jeśli nie zostanie szybko zdiagnozowana.
                </p>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-lg text-ink">Reakcja gruźlicza (granulomatozna)</h3>
                <p className="mt-2 text-foreground/80">
                  Zgrubienia, stwardnienia i stany zapalne w miejscu wstrzyknięcia, czasem z
                  opóźnionym wystąpieniem. Mogą wynikać z reakcji na nośnik preparatu lub
                  zanieczyszczenia biologicznego pochodzenia.
                </p>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-lg text-ink">Powikłania naczyniowe</h3>
                <p className="mt-2 text-foreground/80">
                  Zator tłuszczowy lub zator z powietrza w wyniku nieprawidłowej techniki
                  wstrzyknięcia. Objawia się bledną skórą, silnym bólem, a w skrajnych przypadkach —
                  martwicą tkanek. Wymaga natychmiastowej interwencji.
                </p>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-lg text-ink">Nierówności i zgrubienia skóry</h3>
                <p className="mt-2 text-foreground/80">
                  Przebarwienia, bliznowce lub nierównomierne rozprowadzenie preparatu w skórze.
                  Często skutek zbyt płytkiego lub zbyt głębokiego wstrzyknięcia lub złej jakości
                  preparatu.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Jak unikać */}
          <section>
            <SectionHeading
              eyebrow="Profilaktyka"
              title="Jak unikać powikłań po mezoterapii igłowej"
            />
            <p className="mt-4 text-base text-foreground/85 md:text-lg leading-relaxed">
              Większość powikłań można zapobiec, przestrzegając kilku zasad — zarówno przed, jak i po
              zabiegu:
            </p>

            <ul className="mt-8 space-y-6">
              <li className="flex items-start gap-4">
                <div className="tile-icon shrink-0">
                  <Stethoscope className="size-5" />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-ink">
                    Wybierz certyfikowanego lekarza medycyny estetycznej
                  </h4>
                  <p className="mt-1 text-foreground/80">
                    Technika nakłuć, głębokość wstrzyknięcia i znajomość anatomii naczyniowej są
                    kluczowe. Nie ryzykuj zabiegu w salonach kosmetycznych bez nadzoru lekarskiego.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="tile-icon shrink-0">
                  <ShieldAlert className="size-5" />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-ink">
                    Upewnij się, że preparat jest oryginalny i certyfikowany
                  </h4>
                  <p className="mt-1 text-foreground/80">
                    Używaj wyłącznie preparatów dopuszczonych do obrotu w Polsce (CE lub UDI).
                    Nieautoryzowane produkty to najczęstsza przyczyna infekcji i reakcji
                    autoimmunologicznych.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="tile-icon shrink-0">
                  <CheckCircle2 className="size-5" />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-ink">
                    Przestrzegaj zaleceń przedzabiegowych
                  </h4>
                  <p className="mt-1 text-foreground/80">
                    Na 3–5 dni przed zabiegiem unikaj alkoholu, aspiryny, ibuprofenu i innych
                    leków przeciwzapalnych (zwiększają ryzyko krwawienia i siniaków). Zgłoś lekarzowi
                    wszystkie przyjmowane leki i alergie.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="tile-icon shrink-0">
                  <CheckCircle2 className="size-5" />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-ink">Pielęgnuj skórę po zabiegu</h4>
                  <p className="mt-1 text-foreground/80">
                    Przez 24 godziny nie dotykaj twarzy brudnymi rękami, nie nakładaj makijażu,
                    unikaj sauny, basenu, solarium i intensywnego wysiłku fizycznego. Stosuj tylko
                    zalecone przez lekarza preparaty do pielęgnacji.
                  </p>
                </div>
              </li>
            </ul>
          </section>

          {/* Section 4: Tabela przeciwwskazań */}
          <section>
            <SectionHeading eyebrow="Kto nie powinien" title="Przeciwwskazania do mezoterapii igłowej" />
            <p className="mt-4 text-base text-foreground/85 md:text-lg leading-relaxed">
              Nie każdy kwalifikuje się do zabiegu. Przeciwwskazania bezwzględne oznaczają całkowity
              zakaz wykonania mezoterapii w danym momencie:
            </p>

            <div className="mt-8 overflow-hidden rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-secondary/60">
                  <tr>
                    <th className="px-5 py-3 font-medium text-ink">Przeciwwskazanie</th>
                    <th className="px-5 py-3 font-medium text-ink">Uwagi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  <tr>
                    <td className="px-5 py-3 font-medium text-foreground">Ciąża i karmienie piersią</td>
                    <td className="px-5 py-3 text-foreground/80">
                      Brak badań bezpieczeństwa — zabieg wykonywany dopiero po zakończeniu karmienia.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3 font-medium text-foreground">Infekcja skóry w miejscu zabiegu</td>
                    <td className="px-5 py-3 text-foreground/80">
                      Wirusowa (opryszczka), bakteryjna lub grzybicza — zabieg odroczyć do
                      całkowitego wyleczenia.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3 font-medium text-foreground">Autoimmunologiczne choroby skóry</td>
                    <td className="px-5 py-3 text-foreground/80">
                      Łuszczyca, toczeń, trądzik różowaty w fazie aktywnej — ryzyko zaostrzenia.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3 font-medium text-foreground">Skłonność do bliznowców (keloidów)</td>
                    <td className="px-5 py-3 text-foreground/80">
                      Mikrouszkodzenia mogą prowadzić do nadmiernego bliznowacenia.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3 font-medium text-foreground">Stosowanie leków przeciwzakrzepowych</td>
                    <td className="px-5 py-3 text-foreground/80">
                      Warfaryna, NOAC — zwiększone ryzyko krwiaków. Wymaga konsultacji z lekarzem
                      prowadzącym.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3 font-medium text-foreground">Nowotwór aktywny</td>
                    <td className="px-5 py-3 text-foreground/80">
                      Zabieg przeciwwskazany w trakcie leczenia onkologicznego.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 5: FAQ */}
          <section>
            <SectionHeading eyebrow="Najczęstsze pytania" title="FAQ — powikłania po mezoterapii igłowej" />
            <div className="mt-8 divide-y divide-border rounded-lg border border-border bg-card">
              {FAQ.map((item) => (
                <details key={item.q} className="group p-5 open:bg-secondary/30">
                  <summary className="cursor-pointer list-none font-serif text-lg text-ink">
                    {item.q}
                  </summary>
                  <p className="mt-3 text-foreground/80">{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-xl border border-champagne/30 bg-gradient-to-br from-secondary/60 to-secondary/30 p-8 md:p-10">
            <h3 className="font-serif text-2xl text-ink">
              Masz wątpliwości co do bezpieczeństwa zabiegu?
            </h3>
            <p className="mt-3 text-foreground/80">
              Podczas konsultacji przeprowadzamy szczegółowy wywiad medyczny, omawiamy Twoją historię
              alergiczną i dobieramy protokół zabiegowy tak, aby ryzyko było zminimalizowane. Żaden
              zabieg nie rozpoczyna się bez pełnej akceptacji i zrozumienia przez pacjenta.
            </p>
            <Link
              to="/konsultacja"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-md bg-ink px-8 text-sm tracking-wide text-alabaster"
            >
              Umów konsultację bezpieczeństwa
            </Link>
          </section>
        </article>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6 shadow-soft">
            <div className="text-xs uppercase tracking-[0.3em] text-champagne">W tym artykule</div>
            <ul className="mt-4 space-y-3 text-sm text-foreground/80">
              <li>→ Co jest normalne po zabiegu</li>
              <li>→ Poważniejsze powikłania</li>
              <li>→ Jak unikać komplikacji</li>
              <li>→ Przeciwwskazania</li>
              <li>→ Najczęstsze pytania (FAQ)</li>
            </ul>
          </div>

          <div className="rounded-lg border border-champagne/40 bg-secondary/40 p-6">
            <div className="font-serif text-lg text-ink">Beauty & Mind Clinic</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Klinika medycyny estetycznej i laserowej w Siedlcach. Bezpieczeństwo pacjenta jest
              naszym priorytetem — każdy zabieg wykonuje wyłącznie doświadczony lekarz z
              certyfikowanymi preparatami.
            </p>
            <Link
              to="/technologie"
              className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-ink px-5 text-sm text-alabaster"
            >
              Przeglądaj technologie
            </Link>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="text-xs uppercase tracking-[0.3em] text-champagne">Poradniki</div>
            <div className="mt-4 space-y-3 text-sm">
              <Link to="/technologie" className="block text-foreground/80 hover:text-foreground">
                → Katalog technologii medycyny estetycznej
              </Link>
              <Link to="/cennik" className="block text-foreground/80 hover:text-foreground">
                → Cennik zabiegów w Siedlcach
              </Link>
              <Link to="/konsultacja" className="block text-foreground/80 hover:text-foreground">
                → Umów konsultację online
              </Link>
            </div>
          </div>
        </aside>
      </div>

      <RelatedPosts currentSlug="powiklania-mezoterapia-iglowa" />
    </>
  );
}
