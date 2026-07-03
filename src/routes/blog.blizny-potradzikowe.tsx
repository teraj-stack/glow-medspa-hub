import { RelatedPosts } from "@/components/site/RelatedPosts";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Layers,
  Clock,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import ogCard from "@/assets/og/blog-blizny-potradzikowe.jpg";
import { withOgVersion } from "@/config/social-preview";

const FAQ = [
  {
    q: "Czy blizny potrądzikowe można całkowicie usunąć?",
    a: "W większości przypadków można uzyskać redukcję widoczności blizn o 60–90%, ale całkowite zniknięcie głębokich blizn atroficznych (typu ice-pick) jest rzadko możliwe. Realny cel to znaczne wygładzenie reliefu skóry, wyrównanie kolorytu i odzyskanie pewności siebie — a nie idealna skóra ‘bez śladu’. Najlepsze efekty daje protokół łączony: laser pikosekundowy z efektem fotoakustycznym + radiofrekwencja mikroigłowa w serii 4–6 zabiegów.",
  },
  {
    q: "Jaka technologia jest najskuteczniejsza na dziury po trądziku?",
    a: "Na blizny zanikowe (atroficzne) najskuteczniejszy jest laser pikosekundowy z soczewką frakcyjną typu Honeycomb — wytwarza on efekt LIOB (Laser-Induced Optical Breakdown), który pobudza fibroblasty do produkcji nowego kolagenu bez uszkodzenia naskórka. W cięższych przypadkach łączymy go z radiofrekwencją mikroigłową, która działa głębiej w skórze właściwej.",
  },
  {
    q: "Czy zabieg laserem pikosekundowym boli?",
    a: "Odczucia są umiarkowane — pacjentki opisują je jako mrowienie lub uczucie ‘pryskania gorącego oleju’. Przed zabiegiem stosujemy krem znieczulający (45 minut), a sam impuls 350 pikosekund jest zbyt krótki, by spowodować ból termiczny. Tryb Multipulse rozkłada energię na mikroimpulsy nieprzekraczające progu bólu. Większość pacjentek toleruje zabieg bardzo dobrze.",
  },
  {
    q: "Ile sesji potrzeba na widoczną poprawę blizn potrądzikowych?",
    a: "Standardowy protokół to 4–6 sesji w odstępach 4–6 tygodni. Pierwsze efekty widać już po 2–3 zabiegach, ale pełna odbudowa kolagenu trwa do 6 miesięcy po ostatniej sesji. W przypadku głębokich blizn lub skóry zaawansowanej wiekowo zalecamy 6–8 sesji.",
  },
  {
    q: "Jak długo trwa rekonwalescencja po zabiegu?",
    a: "Po laserze pikosekundowym skóra jest lekko zaczerwieniona przez 2–4 godziny — po tym czasie można wrócić do normalnej aktywności i nałożyć makijaż. Po radiofrekwencji mikroigłowej zaczerwienienie utrzymuje się 24–48 godzin, a mikrokorki na skórze zanikają w 3–5 dni. Pełna regeneracja zachodzi w 7 dni.",
  },
  {
    q: "Czy zabieg jest bezpieczny dla wszystkich fototypów skóry?",
    a: "Tak — laser pikosekundowy jest bezpieczny nawet dla ciemnych fototypów (III–V wg Fitzpatricka), ponieważ efekt fotoakustyczny nie generuje ciepła w naskórku. Dzięki temu ryzyko przebarwień pozapalnych (PIH) jest minimalne, w przeciwieństwie do starszych laserów Q-Switched lub ablacyjnych laserów frakcyjnych CO2.",
  },
  {
    q: "Czy mogę wykonać zabieg latem?",
    a: "Tak, ale wymaga to ścisłej fotoprotekcji — krem SPF 50+ co 2–3 godziny przez minimum 4 tygodnie po zabiegu, unikanie bezpośredniego słońca i solarium. W praktyce najlepsze efekty uzyskujemy jesienią i zimą, gdy ekspozycja na UV jest niższa. W okresie letnim sesje planujemy ostrożniej, z większymi odstępami.",
  },
  {
    q: "Jakie są przeciwwskazania do zabiegu?",
    a: "Główne przeciwwskazania to: aktywny stan zapalny trądziku (krosty, ropne zmiany), ciąża i karmienie piersią, świeża opalenizna (do 4 tygodni), terapia izotretynoiną w ciągu ostatnich 6 miesięcy, skłonność do bliznowców keloidowych, niekontrolowana cukrzyca, choroby autoimmunologiczne w fazie aktywnej, opryszczka w obrębie zabiegowym. Każda pacjentka przechodzi szczegółową kwalifikację przed pierwszą sesją.",
  },
  {
    q: "Ile kosztuje terapia blizn potrądzikowych?",
    a: "Pojedyncza sesja laserem pikosekundowym kosztuje od 600 zł, sesja radiofrekwencji mikroigłowej od 800 zł. Cena pełnego protokołu łączonego (6 sesji) to ok. 4 200–5 400 zł. Oferujemy pakiety zabiegowe z 15–20% zniżką. Standard warszawski w Warszawie — bez konieczności dojazdu do stolicy.",
  },
];

export const Route = createFileRoute("/blog/blizny-potradzikowe")({
  head: () => ({
    meta: [
      { title: "Blizny potrądzikowe — usuwanie i zabiegi | BMClinics Warszawa" },
      {
        name: "description",
        content:
          "Usuwanie blizn potrądzikowych w Warszawie: laser pikosekundowy i radiofrekwencja mikroigłowa — metody, efekty, bezpieczeństwo zabiegów.",
      },
      {
        name: "keywords",
        content:
          "blizny potrądzikowe, usuwanie blizn potrądzikowych, dziury po trądziku, blizny po trądziku zabiegi, laser pikosekundowy blizny, radiofrekwencja mikroigłowa, Warszawa",
      },
      { property: "og:title", content: "Blizny potrądzikowe — kompletny przewodnik po usuwaniu" },
      {
        property: "og:description",
        content:
          "Jak skutecznie zredukować blizny po trądziku? Laser pikosekundowy z efektem fotoakustycznym i radiofrekwencja mikroigłowa — co działa, kiedy i u kogo.",
      },
      { property: "og:url", content: "https://bmclinics.ai/blog/blizny-potradzikowe" },
      { property: "og:image", content: withOgVersion(`https://bmclinics.ai${ogCard}`) },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "BMClinics.ai — Warszawa (Wilanów), ul. Branickiego 10" },
      { name: "twitter:image", content: withOgVersion(`https://bmclinics.ai${ogCard}`) },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "article" },
      { property: "article:published_time", content: "2026-06-22T10:00:00+02:00" },
      { property: "article:modified_time", content: "2026-06-22T10:00:00+02:00" },
      { property: "article:author", content: "BMClinics.ai" },
      { property: "article:section", content: "Medycyna estetyczna" },
      { property: "article:tag", content: "blizny potrądzikowe" },
      { property: "article:tag", content: "laser pikosekundowy" },
      { property: "article:tag", content: "radiofrekwencja mikroigłowa" },
      { property: "og:locale", content: "pl_PL" },
    ],
    links: [
      { rel: "canonical", href: "https://bmclinics.ai/blog/blizny-potradzikowe" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Blizny potrądzikowe — jak skutecznie zredukować dziury po trądziku",
          description:
            "Kompletny przewodnik po nowoczesnych metodach usuwania blizn potrądzikowych: laser pikosekundowy, radiofrekwencja mikroigłowa, protokoły łączone.",
          author: { "@type": "Organization", name: "BMClinics.ai" },
          publisher: {
            "@type": "Organization",
            name: "BMClinics.ai",
            logo: { "@type": "ImageObject", url: "https://bmclinics.ai/favicon.ico" },
          },
          datePublished: "2026-06-22T10:00:00+02:00",
          dateModified: "2026-06-22T10:00:00+02:00",
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": "https://bmclinics.ai/blog/blizny-potradzikowe",
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
              name: "Blizny potrądzikowe",
              item: "https://bmclinics.ai/blog/blizny-potradzikowe",
            },
          ],
        }),
      },
    ],
  }),
  component: AcneScarsGuide,
});

function AcneScarsGuide() {
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
              Dermatologia estetyczna
            </div>
            <h1 className="mt-4 font-serif text-ink">
              Blizny potrądzikowe — jak skutecznie zredukować dziury po trądziku
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Trądzik mija, ale blizny zostają — czasem na dekady. Dobra wiadomość: nowoczesna
              dermatologia estetyczna pozwala zredukować ich widoczność o 60–90%. Poniżej kompletny
              przewodnik po metodach, które naprawdę działają — bez marketingowych obietnic.
            </p>
          </div>
        </div>
      </section>

      <div className="container-luxury grid gap-12 py-16 md:grid-cols-3 md:py-24">
        {/* Main content */}
        <article className="md:col-span-2 space-y-16">
          {/* Section 1: Rodzaje blizn */}
          <section>
            <SectionHeading
              eyebrow="Typologia"
              title="Trzy główne rodzaje blizn potrądzikowych"
            />
            <p className="mt-4 text-base text-foreground/85 md:text-lg leading-relaxed">
              Zanim wybierzesz zabieg, trzeba wiedzieć, z jakim typem blizn masz do czynienia.
              Różne typy reagują na różne technologie — uniwersalna terapia nie istnieje. Podczas
              konsultacji analizuję skórę w powiększeniu i ustalam protokół indywidualnie.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="tile-card">
                <div className="tile-icon">
                  <Layers className="size-5" />
                </div>
                <div className="tile-title text-base">Ice-pick (szpilki)</div>
                <p className="tile-text">
                  Wąskie, głębokie (do 2 mm) dziury jak nakłucia szpilką. Najtrudniejsze do leczenia
                  — sięgają skóry właściwej i często wymagają protokołów łączonych.
                </p>
              </div>
              <div className="tile-card">
                <div className="tile-icon">
                  <Layers className="size-5" />
                </div>
                <div className="tile-title text-base">Boxcar (prostokątne)</div>
                <p className="tile-text">
                  Szersze blizny o ostrych, pionowych brzegach — przypominają ślady po ospie.
                  Reagują bardzo dobrze na laser pikosekundowy z soczewką Honeycomb.
                </p>
              </div>
              <div className="tile-card">
                <div className="tile-icon">
                  <Layers className="size-5" />
                </div>
                <div className="tile-title text-base">Rolling (faliste)</div>
                <p className="tile-text">
                  Płytkie, faliste wgłębienia tworzące efekt „pomarańczowej skórki”. Wymagają
                  remodellingu kolagenu w skórze właściwej — idealnie radzi sobie radiofrekwencja
                  mikroigłowa.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Laser pikosekundowy */}
          <section>
            <SectionHeading
              eyebrow="Technologia #1"
              title="Laser pikosekundowy — fotoakustyka zamiast spalania"
            />
            <p className="mt-4 text-base text-foreground/85 md:text-lg leading-relaxed">
              To obecnie złoty standard w leczeniu blizn potrądzikowych, szczególnie typu boxcar
              i ice-pick. Kluczowa różnica wobec starszych laserów: impuls trwa 350 pikosekund
              (350 bilionowych części sekundy) — jest zbyt krótki, by zamienić się w ciepło.
              Zamiast oparzenia powstaje mikro-fala ciśnienia, która rozbija pigment i pobudza
              fibroblasty do produkcji nowego kolagenu.
            </p>

            <h3 className="mt-8 font-serif text-2xl text-ink">Jak działa soczewka Honeycomb?</h3>
            <p className="mt-3 text-base text-foreground/85 leading-relaxed">
              Specjalna soczewka frakcyjna typu plaster miodu rozdziela wiązkę lasera na setki
              mikropunktów wysokoenergetycznych. W każdym z nich powstaje zjawisko LIOB
              (Laser-Induced Optical Breakdown) — kontrolowane mikropęknięcie w skórze właściwej.
              Naskórek pozostaje nienaruszony, więc nie ma rany, strupów ani downtime. Tymczasem
              w głębszych warstwach uruchamia się kaskada naprawcza: fibroblasty produkują nowy
              kolagen typu III, który stopniowo wypełnia dno blizny.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="tile-card">
                <div className="tile-icon">
                  <ShieldCheck className="size-5" />
                </div>
                <div className="tile-title text-base">Bezpieczne dla fototypów III–V</div>
                <p className="tile-text">
                  Brak ciepła w naskórku → minimalne ryzyko przebarwień pozapalnych (PIH).
                </p>
              </div>
              <div className="tile-card">
                <div className="tile-icon">
                  <Clock className="size-5" />
                </div>
                <div className="tile-title text-base">Zero śladów po 2–4 godzinach</div>
                <p className="tile-text">
                  Lekkie zaczerwienienie ustępuje przed wieczorem — można wrócić do pracy tego
                  samego dnia.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Radiofrekwencja mikroigłowa */}
          <section>
            <SectionHeading
              eyebrow="Technologia #2"
              title="Radiofrekwencja mikroigłowa — głębiej, niż sięga laser"
            />
            <p className="mt-4 text-base text-foreground/85 md:text-lg leading-relaxed">
              Tam, gdzie laser pikosekundowy działa głównie w warstwach powierzchownych skóry
              właściwej, radiofrekwencja mikroigłowa (RF Microneedling) sięga 0,5–3,5 mm w głąb.
              Cienkie, izolowane igły dostarczają energię cieplną dokładnie tam, gdzie znajduje się
              dno blizny, omijając naskórek. To idealna technologia na blizny typu rolling i głębokie
              ice-pick, gdzie remodelling musi zajść w skórze właściwej.
            </p>

            <h3 className="mt-8 font-serif text-2xl text-ink">Mechanizm działania</h3>
            <p className="mt-3 text-base text-foreground/85 leading-relaxed">
              Igły dostarczają fale radiowe o częstotliwości ok. 1–2 MHz, które podgrzewają tkankę
              do 65–75°C w precyzyjnie określonej głębokości. Powstaje kontrolowana mikro-strefa
              koagulacji, która uruchamia neokolagenezę i neoelastogenezę. Po 8–12 tygodniach od
              zabiegu skóra staje się gęstsza, napięta, a dno blizny zostaje wypchnięte ku górze.
            </p>
          </section>

          {/* Section 4: Protokół łączony */}
          <section>
            <SectionHeading
              eyebrow="Synergia"
              title="Protokół łączony — dlaczego dwie technologie działają lepiej niż jedna"
            />
            <p className="mt-4 text-base text-foreground/85 md:text-lg leading-relaxed">
              W BMClinics.ai laser pikosekundowy pracuje wyłącznie w protokołach
              złożonych. Powód jest prosty: laser świetnie pobudza fibroblasty i wygładza
              powierzchnię, ale radiofrekwencja mikroigłowa sięga głębiej. Połączenie obu technologii
              w jednej sesji daje efekt synergii — kolagen powstaje na dwóch poziomach jednocześnie.
            </p>

            <div className="mt-8 rounded-lg border border-border bg-card p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-champagne">
                Standardowy protokół
              </div>
              <h3 className="mt-2 font-serif text-2xl text-ink">6 sesji co 4–6 tygodni</h3>
              <ul className="mt-4 space-y-3 text-base text-foreground/85">
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-1 size-4 shrink-0 text-champagne" />
                  <span>
                    <strong>Sesja 1–2:</strong> Wprowadzenie — laser pikosekundowy z soczewką
                    Honeycomb na całą strefę. Pierwsza ocena reaktywności skóry.
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-1 size-4 shrink-0 text-champagne" />
                  <span>
                    <strong>Sesja 3–4:</strong> Intensyfikacja — laser + radiofrekwencja mikroigłowa
                    na obszary z głębszymi bliznami. Czas zabiegu ok. 90 minut.
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-1 size-4 shrink-0 text-champagne" />
                  <span>
                    <strong>Sesja 5–6:</strong> Finalizacja i wykończenie — toning pikolaserem +
                    booster mezoterapii skoncentrowanej na regenerację (peptydy, witamina C).
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-1 size-4 shrink-0 text-champagne" />
                  <span>
                    <strong>Po protokole:</strong> Ocena efektów po 6 miesiącach (kolagen dojrzewa
                    do 9 miesięcy). Sesje przypominające co 12–18 miesięcy.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 5: Czego unikać */}
          <section>
            <SectionHeading
              eyebrow="Pułapki"
              title="Czego unikać — najczęstsze błędy w leczeniu blizn potrądzikowych"
            />
            <div className="mt-8 space-y-4">
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-1 size-5 shrink-0 text-champagne" />
                  <div>
                    <h3 className="font-serif text-lg text-ink">Niepełne serie zabiegów</h3>
                    <p className="mt-2 text-base text-foreground/85">
                      Pojedyncza sesja nigdy nie da satysfakcjonującego efektu na blizny atroficzne.
                      Pacjentki, które przerywają terapię po 1–2 zabiegach, są rozczarowane — ale
                      odpowiedzialność leży po stronie braku komunikacji o realistycznych
                      oczekiwaniach.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-1 size-5 shrink-0 text-champagne" />
                  <div>
                    <h3 className="font-serif text-lg text-ink">Zabieg na aktywnym trądziku</h3>
                    <p className="mt-2 text-base text-foreground/85">
                      Najpierw trzeba opanować aktywny stan zapalny — w przeciwnym razie zabieg
                      może nasilić objawy i wywołać kolejne blizny. Dermatolog i dermatolog estetyczny
                      powinni współpracować.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-1 size-5 shrink-0 text-champagne" />
                  <div>
                    <h3 className="font-serif text-lg text-ink">Brak fotoprotekcji</h3>
                    <p className="mt-2 text-base text-foreground/85">
                      Bez codziennego SPF 50+ przez minimum 4 tygodnie po zabiegu ryzyko przebarwień
                      pozapalnych rośnie wielokrotnie. To najczęstszy powód, dla którego efekty
                      laserowe nie są takie, jak powinny.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-1 size-5 shrink-0 text-champagne" />
                  <div>
                    <h3 className="font-serif text-lg text-ink">Wybór taniego, źle dobranego sprzętu</h3>
                    <p className="mt-2 text-base text-foreground/85">
                      Nie każdy laser nazywany „pikosekundowym” faktycznie pracuje w pełnym zakresie
                      350 ps. Część urządzeń na rynku to lasery nano-sekundowe z marketingową etykietą.
                      Realny czas impulsu i moc wiązki mają fundamentalne znaczenie dla efektu i
                      bezpieczeństwa.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: Efekty */}
          <section>
            <SectionHeading
              eyebrow="Czego się spodziewać"
              title="Realne efekty — co mówią dane kliniczne"
            />
            <p className="mt-4 text-base text-foreground/85 md:text-lg leading-relaxed">
              W badaniach klinicznych nad laserem pikosekundowym z soczewką frakcyjną redukcja
              widoczności blizn po serii 4–6 sesji wynosi:
            </p>
            <ul className="mt-6 space-y-3 text-base text-foreground/85">
              <li className="flex gap-3">
                <Sparkles className="mt-1 size-4 shrink-0 text-champagne" />
                <span>
                  <strong>Blizny boxcar:</strong> redukcja o 70–90% — najlepiej reagujący typ.
                </span>
              </li>
              <li className="flex gap-3">
                <Sparkles className="mt-1 size-4 shrink-0 text-champagne" />
                <span>
                  <strong>Blizny rolling:</strong> redukcja o 60–80% — wymagają dłuższego czasu na
                  odbudowę kolagenu.
                </span>
              </li>
              <li className="flex gap-3">
                <Sparkles className="mt-1 size-4 shrink-0 text-champagne" />
                <span>
                  <strong>Blizny ice-pick:</strong> redukcja o 40–60% — najtrudniejsze, często
                  wymagają punktowego subcision lub TCA CROSS.
                </span>
              </li>
              <li className="flex gap-3">
                <Sparkles className="mt-1 size-4 shrink-0 text-champagne" />
                <span>
                  <strong>Przebarwienia pozapalne (PIH):</strong> redukcja o 80–95% — pikolaser to
                  złoty standard w tej kategorii.
                </span>
              </li>
            </ul>
            <p className="mt-6 text-base text-foreground/85 leading-relaxed">
              Efekt utrzymuje się wiele lat — odbudowany kolagen typu I/III to trwała zmiana
              strukturalna skóry, nie tymczasowe wypełnienie. Sesje przypominające co 12–18
              miesięcy podtrzymują rezultat.
            </p>
          </section>

          {/* FAQ */}
          <section>
            <SectionHeading eyebrow="FAQ" title="Najczęstsze pytania" />
            <div className="mt-8 space-y-4">
              {FAQ.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-lg border border-border bg-card p-6 open:shadow-soft"
                >
                  <summary className="cursor-pointer font-serif text-lg text-ink">
                    {item.q}
                  </summary>
                  <p className="mt-3 text-base text-foreground/85 leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        </article>

        {/* Sidebar */}
        <aside className="md:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-lg border border-border bg-secondary/30 p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-champagne">
                Standard warszawski
              </div>
              <h3 className="mt-2 font-serif text-xl text-ink">
                Bez dojeżdżania do stolicy
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Od 10 lat pracuję w premium klinikach Warszawy. Ten sam protokół, te same urządzenia,
                ten sam standard bezpieczeństwa — teraz w Warszawie.
              </p>
              <Link
                to="/konsultacja"
                className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-ink px-5 text-sm text-alabaster"
              >
                Umów konsultację
              </Link>
            </div>

            <div className="rounded-lg border border-border p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-champagne">
                Powiązane technologie
              </div>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link
                    to="/technologie/picoking"
                    className="text-foreground hover:text-champagne"
                  >
                    → Laser pikosekundowy 350 ps
                  </Link>
                </li>
                <li>
                  <Link
                    to="/technologie"
                    className="text-foreground hover:text-champagne"
                  >
                    → Wszystkie technologie kliniki
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>

      <RelatedPosts currentSlug="blizny-potradzikowe" />
    </>
  );
}
