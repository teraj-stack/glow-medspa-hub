import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { BookingForm } from "@/components/site/BookingForm";
import { getTechnology, type Technology } from "@/data/technologies";
import { formatCena } from "@/lib/format";
import { ArrowLeft, Check, MapPin, Sparkles, ShieldCheck, Clock, Heart } from "lucide-react";
import heroAsset from "@/assets/picoking-hero.jpg.asset.json";
import heroAvif from "@/assets/picoking-hero.avif.asset.json";
import heroWebp from "@/assets/picoking-hero.webp.asset.json";
import { HeroPicture } from "@/components/site/HeroPicture";
import comparisonAsset from "@/assets/picoking-comparison.jpg.asset.json";
import skinAsset from "@/assets/picoking-skin-cross-section.jpg.asset.json";
import pico532Img from "@/assets/pico-532-fractional.jpeg.asset.json";
import pico1064Img from "@/assets/pico-1064-fractional.jpeg.asset.json";
import applicatorsAsset from "@/assets/picoking-applicators.jpg.asset.json";
import { BeforeAfterSlider } from "@/components/site/BeforeAfterSlider";
import ba5 from "@/assets/piko-ba-5.webp.asset.json";
import ba5a from "@/assets/piko-ba-5a.webp.asset.json";
import ba6 from "@/assets/piko-ba-6.webp.asset.json";
import ba6a from "@/assets/piko-ba-6a.webp.asset.json";
import ba7 from "@/assets/piko-ba-7.webp.asset.json";
import ba7a from "@/assets/piko-ba-7a.webp.asset.json";
import ba8 from "@/assets/piko-ba-8.webp.asset.json";
import ba8a from "@/assets/piko-ba-8a.webp.asset.json";

const BA_GALLERY = [
  {
    before: ba5.url,
    after: ba5a.url,
    label: "Blizny potrądzikowe · seria 4 sesji",
    caption: "Soczewka Honeycomb 755 nm — efekt LIOB pobudza fibroblasty. Tekstura wygładzona, naskórek nienaruszony.",
  },
  {
    before: ba6.url,
    after: ba6a.url,
    label: "Przebarwienia okolicy ust · 3 sesje",
    caption: "Dual Pulse (PTP) rozbija ziarna melaniny bez efektu odbicia — koloryt ujednolicony.",
  },
  {
    before: ba7.url,
    after: ba7a.url,
    label: "Melasma policzka · 4 sesje",
    caption: "Fotoakustyka 1064 nm zamiast termiki — melanosomy rozbite, melanocyt nieuszkodzony.",
  },
  {
    before: ba8.url,
    after: ba8a.url,
    label: "Plamy posłoneczne dłoni · 3 sesje",
    caption: "Selektywne 532 nm na pigment powierzchowny — rewitalizacja skóry dłoni bez przerwy w aktywności.",
  },
];

const heroImg = heroAsset.url;
const comparisonImg = comparisonAsset.url;
const skinImg = skinAsset.url;
const applicatorsImg = applicatorsAsset.url;

const TECH_SLUG = "picoking";

export const Route = createFileRoute("/technologie/picoking")({
  loader: (): { tech: Technology } => {
    const tech = getTechnology(TECH_SLUG);
    if (!tech) throw new Error("Laser pikosekundowy — brak wpisu w bazie");
    return { tech };
  },
  head: ({ loaderData }) => {
    const url = "https://bmclinics.ai/technologie/picoking";
    const title = "Laser pikosekundowy — Siedlce | Beauty & Mind Clinic";
    const description =
      "Laser pikosekundowy 350 ps w Siedlcach: melasma, blizny potrądzikowe, przebarwienia, tatuaże, fotoodmładzanie. Standard premium klinik warszawskich.";


    const serviceSchema = loaderData
      ? {
          "@context": "https://schema.org",
          "@type": "MedicalTherapy",
          name: "Laser pikosekundowy 350 ps",
          description: loaderData.tech.shortDesc,
          url,
          provider: {
            "@type": "MedicalBusiness",
            name: "Beauty & Mind Clinic",
            url: "https://bmclinics.ai",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Siedlce",
              addressCountry: "PL",
            },
          },
          indication: loaderData.tech.indications,
        }
      : undefined;

    const faqSchema =
      loaderData && loaderData.tech.faq.length > 0
        ? {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: loaderData.tech.faq.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          }
        : undefined;

    const scripts: Array<{ type: string; children: string }> = [];
    if (serviceSchema) scripts.push({ type: "application/ld+json", children: JSON.stringify(serviceSchema) });
    if (faqSchema) scripts.push({ type: "application/ld+json", children: JSON.stringify(faqSchema) });

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:image", content: heroImg },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: heroImg },
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "preload", as: "image", href: heroAvif.url, type: "image/avif", fetchPriority: "high" },
      ],
      scripts: scripts.length > 0 ? scripts : undefined,
    };
  },
  component: PikosekundowyPage,
});

const WAVELENGTHS: Array<{ nm: string; targets: string; color: string }> = [
  { nm: "1064 nm", targets: "tatuaż czarny i granat, znamiona głębokie, toning", color: "from-zinc-700 to-zinc-900" },
  { nm: "755 nm", targets: "tatuaż zielony i błękit, melasma, blizny (Honeycomb)", color: "from-rose-900 to-amber-900" },
  { nm: "532 nm", targets: "tatuaż czerwony, żółty, rumień — najskuteczniejsza długość fali do usuwania rumienia, plamy soczewicowate, piegi", color: "from-emerald-700 to-emerald-900" },
  { nm: "650 nm", targets: "tatuaż zielony, ciemnoniebieski, niebieski (Green tattoo)", color: "from-red-700 to-rose-900" },
  { nm: "585 nm", targets: "naczyniaki, rumień, teleangiektazje (Hemangioma treatment)", color: "from-amber-500 to-orange-700" },
];

const MODES = [
  { name: "Standard Pulse", role: "Toning, tatuaże, zmiany barwnikowe", body: "Pojedynczy impuls o szczytowej mocy do 1200 mJ. Profil Flat-top — równomierna dystrybucja energii na plamce 2–10 mm." },
  { name: "Dual Pulse (PTP)", role: "Oporna melasma", body: "Ładunek rozdzielony na dwa sub-impulsy (~80 µs). Selektywnie rozbija melanosomy bez letalnego uszkodzenia melanocytu — radykalnie obniża ryzyko rebound hyperpigmentation." },
  { name: "Multipulse (MPTP)", role: "Komfort i okolice wrażliwe", body: "Seria 3–6 mikroimpulsów w nanosekundowych odstępach. Pigment wprowadzany w rezonans bez przekroczenia progu bólu — zabieg niemal bezbolesny." },
  { name: "Long Pulse", role: "Fotoodmładzanie i lifting", body: "Mechanizm fototermiczny — objętościowe podgrzanie skóry właściwej do 55–65 °C. Indukuje neokolagenezę przez TGF-β. Zagęszczenie i napięcie skóry." },
];

const BENEFITS = [
  { icon: ShieldCheck, title: "Bezpieczne dla fototypów III–V", body: "Brak ciepła w naskórku → minimalne ryzyko PIH i przebarwień pozapalnych." },
  { icon: Clock, title: "Zero śladów po 2–4 godzinach", body: "Czas impulsu 350 ps jest zbyt krótki, by spowodować oparzenie tkanki. Po zabiegu nie ma śladu już po 2–4 h — powrót do aktywności natychmiastowy." },
  { icon: Heart, title: "Niemal bezbolesny", body: "Tryb Multipulse rozkłada energię na mikroimpulsy nieprzekraczające progu bólu." },
  { icon: Sparkles, title: "Mniej sesji niż Q-Switched", body: "Pigment rozbity na mikropył jest szybciej fagocytowany przez układ limfatyczny." },
];

function PikosekundowyPage() {
  const { tech } = Route.useLoaderData() as { tech: Technology };

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink text-alabaster">
        <HeroPicture
          avifUrl={heroAvif.url}
          webpUrl={heroWebp.url}
          fallbackUrl={heroImg}
          alt="Impuls pikosekundowy rozbijający pigment falą fotoakustyczną"
          width={1600}
          height={900}
          eager
          className="absolute inset-0 h-full w-full"
          imgClassName="h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-transparent" />
        <div className="container-luxury relative py-20 md:py-32">
          <Link to="/technologie" className="inline-flex items-center gap-2 text-sm text-alabaster/70 hover:text-champagne">
            <ArrowLeft className="size-4" /> Wszystkie technologie
          </Link>
          <div className="mt-6 max-w-2xl">
            <div className="text-xs uppercase tracking-[0.3em] text-champagne-light">Laser pikosekundowy · 350 ps</div>
            <h1 className="mt-4 font-serif text-4xl leading-tight md:text-5xl lg:text-6xl">
              350 pikosekund. Bez ciepła. Bez kompromisów.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-alabaster/85">
              Najnowsza generacja laserów pikosekundowych. Skutecznie usuwa melasmę, przebarwienia, blizny potrądzikowe i tatuaże każdego koloru — z bezpieczeństwem, na które starsze lasery Q-Switched nie były gotowe.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/"
                hash="rezerwacja"
                className="inline-flex h-12 items-center justify-center rounded-md bg-champagne px-7 text-sm tracking-wide text-ink hover:bg-champagne-light"
              >
                Umów konsultację
              </Link>
              <a href="#cennik" className="inline-flex h-12 items-center justify-center rounded-md border border-alabaster/30 px-6 text-sm text-alabaster hover:bg-alabaster/10">
                Zobacz cennik
              </a>
            </div>
            <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-champagne/30 bg-ink/40 px-4 py-2 text-sm text-champagne-light">
              <MapPin className="size-4" />
              Jedyne urządzenie tej klasy w promieniu 120 km od Siedlec
            </div>
          </div>
        </div>
      </section>

      {/* PRZEWAGA TECHNOLOGICZNA */}
      <section className="bg-alabaster py-16 md:py-24">
        <div className="container-luxury grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <SectionHeading
              eyebrow="Przewaga technologiczna"
              title="Ciśnienie zamiast ciepła"
              description="Starsze lasery Q-Switched podgrzewały pigment i otaczające tkanki. Pikolaser dostarcza energię tak szybko, że nie zdąży zamienić się w ciepło — pigment rozpada się pod wpływem fali uderzeniowej."
            />
            <ul className="mt-8 space-y-4 text-foreground/85">
              <li className="flex items-start gap-3">
                <Check className="mt-1 size-4 shrink-0 text-champagne" />
                <span><strong className="text-ink">Czas impulsu 350 ps</strong> — około 1000× krótszy niż w technologiach nanosekundowych.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-1 size-4 shrink-0 text-champagne" />
                <span><strong className="text-ink">Efekt fotoakustyczny</strong> — pigment rozbity na mikropył, szybciej usuwany przez makrofagi układu limfatycznego.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-1 size-4 shrink-0 text-champagne" />
                <span><strong className="text-ink">Chłodne tkanki sąsiednie</strong> — bezpieczeństwo u fototypów III, IV i V; znikome ryzyko przebarwień pozapalnych.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-1 size-4 shrink-0 text-champagne" />
                <span><strong className="text-ink">Wiązka Flat-top</strong> — równomierna energia na całej plamce, brak oparzeń punktowych na obwodzie.</span>
              </li>
            </ul>
          </div>
          <div className="overflow-hidden rounded-lg border border-border shadow-soft">
            <img
              src={comparisonImg}
              alt="Porównanie efektu nanosekundowego (termiczny, czerwony) i pikosekundowego (fotoakustyczny, chłodny)"
              width={1600}
              height={900}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="grid grid-cols-2 divide-x divide-border bg-card text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <div className="p-3">Stara technologia<br /><span className="text-foreground/60 normal-case tracking-normal">nanosekunda · ciepło</span></div>
              <div className="p-3 text-champagne">Pikolaser<br /><span className="text-foreground/60 normal-case tracking-normal">350 ps · ciśnienie</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* FOTOAKUSTYKA — BEZ OPARZEŃ */}
      <section className="bg-ink py-16 md:py-24 text-background">
        <div className="container-luxury">
          <SectionHeading
            eyebrow="Mechanizm fotoakustyczny"
            title="Ciśnienie zamiast ciepła — dlatego skóra się nie poparza"
            description="Impuls 350 pikosekund jest zbyt krótki, by przekazać tkance energię cieplną. Zamiast oparzenia powstaje mikro-fala ciśnienia (efekt fotoakustyczny), która rozbija pigment i pobudza fibroblasty — bez uszkodzenia termicznego naskórka. Po zabiegu nie ma śladu już po 2–4 godzinach."
          />
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <figure className="overflow-hidden rounded-lg border border-white/10 bg-white">
              <img
                src={pico1064Img.url}
                alt="Model anatomiczny — frakcyjny picolaser 1064 nm: punktowe mikro-rozpady fotoakustyczne (LIOB) w skórze właściwej, bez strefy termicznego oparzenia"
                width={1920}
                height={1440}
                loading="lazy"
                className="h-full w-full object-contain"
              />
              <figcaption className="border-t border-border bg-card p-4 text-sm text-foreground">
                <div className="text-xs uppercase tracking-[0.2em] text-champagne">Tryb frakcyjny 1064 nm</div>
                <p className="mt-2 leading-relaxed">Mikro-wiązki tworzą punktowe ogniska LIOB w skórze właściwej. Fala uderzeniowa rozprzestrzenia się mechanicznie — nie cieplnie. Naskórek pozostaje nienaruszony.</p>
              </figcaption>
            </figure>
            <figure className="overflow-hidden rounded-lg border border-white/10 bg-white">
              <img
                src={pico532Img.url}
                alt="Model anatomiczny — frakcyjny picolaser 532 nm: pole mikro-kawitacji fotoakustycznej, fragmentacja pigmentu i mikro-przerwy w naczyniach bez termicznego oparzenia tkanki"
                width={1920}
                height={1440}
                loading="lazy"
                className="h-full w-full object-contain"
              />
              <figcaption className="border-t border-border bg-card p-4 text-sm text-foreground">
                <div className="text-xs uppercase tracking-[0.2em] text-champagne">Tryb frakcyjny 532 nm · siatka 10×10</div>
                <p className="mt-2 leading-relaxed">Pole mikro-kawitacji fotoakustycznej rozbija ziarna melaniny i pobudza remodeling kolagenu. Brak rozległej strefy koagulacji — gojenie liczone w godzinach, nie tygodniach.</p>
              </figcaption>
            </figure>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { k: "350 ps", v: "Impuls krótszy niż czas relaksacji termicznej melanosomu (~1 ns)" },
              { k: "0 °C Δ", v: "Brak akumulacji ciepła w naskórku — bez ryzyka oparzenia i przebarwień pozapalnych" },
              { k: "Ciśnienie", v: "Energia zamieniana w falę mechaniczną, która kruszy pigment fizycznie" },
            ].map((s) => (
              <div key={s.k} className="rounded-lg border border-white/10 bg-white/5 p-5">
                <div className="font-serif text-2xl text-champagne">{s.k}</div>
                <p className="mt-2 text-sm leading-relaxed text-background/80">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CO ROZWIĄZUJEMY — EFEKTY */}
      <section className="container-luxury py-16 md:py-24">
        <SectionHeading
          eyebrow="Efekty"
          title="Z czym pacjentki przychodzą najczęściej"
          description="Każdy z tych problemów ma dedykowany protokół i tryb pracy. Dobieramy go indywidualnie po konsultacji z analizą skóry."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Melasma", body: "Tryb Dual Pulse (PTP) rozbija melanosomy bez niszczenia melanocytu — bez efektu odbicia.", sessions: "3–5 sesji" },
            { title: "Przebarwienia posłoneczne", body: "Plamy soczewicowate, posłoneczne dyschromie, znamię Oty — selektywne rozbijanie ziaren melaniny.", sessions: "2–4 sesje" },
            { title: "Blizny potrądzikowe", body: "Soczewka Honeycomb 755 nm — efekt LIOB pobudza fibroblasty do nowego kolagenu bez ablacji naskórka.", sessions: "4–6 sesji" },
            { title: "Tatuaże wielokolorowe", body: "Trzy długości fali (1064/755/532 nm) — każdy kolor pigmentu ma swoją odpowiedź. Mniej sesji niż Q-Switched.", sessions: "4–8 sesji" },
            { title: "Rozszerzone pory · łojotok", body: "Hollywood Peel z maską węglową — oczyszcza pory, redukuje sebum, ujednolica teksturę. Zero downtime.", sessions: "1 sesja / seria 4" },
            { title: "Fotoodmładzanie", body: "Tryb Long Pulse + toning — neokolageneza, wyrównanie kolorytu, świeży, jednolity ton skóry.", sessions: "seria 4–6" },
          ].map((item) => (
            <div key={item.title} className="group rounded-lg border border-border bg-card p-7 transition hover:border-champagne/60 hover:shadow-soft">
              <div className="text-xs uppercase tracking-[0.25em] text-champagne">{item.sessions}</div>
              <h3 className="mt-3 font-serif text-2xl text-ink">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/75">{item.body}</p>
            </div>
          ))}
        </div>

        {/* GALERIA PRZED / PO */}
        <div className="mt-20">
          <SectionHeading
            eyebrow="Przed / Po"
            title="Realne efekty — przesuń suwak"
            description="Zdjęcia pacjentek wykonane w tym samym ustawieniu światła, bez retuszu. Przeciągnij linię na środku, aby porównać stan skóry przed pierwszą sesją i po zakończonej serii."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {BA_GALLERY.map((g) => (
              <BeforeAfterSlider
                key={g.label}
                beforeSrc={g.before}
                afterSrc={g.after}
                beforeAlt={`Skóra przed zabiegiem — ${g.label}`}
                afterAlt={`Skóra po zabiegu — ${g.label}`}
                label={g.label}
                caption={g.caption}
              />
            ))}
          </div>
          <p className="mt-6 text-xs text-foreground/55">
            Indywidualne rezultaty mogą się różnić w zależności od typu skóry, fototypu i przestrzegania zaleceń pozabiegowych.
          </p>
        </div>
      </section>

      {/* MECHANIZM — SKÓRA */}
      <section className="bg-secondary/40 py-16 md:py-24">
        <div className="container-luxury grid gap-12 md:grid-cols-2 md:items-center">
          <div className="order-2 md:order-1 overflow-hidden rounded-lg border border-border bg-ink shadow-soft">
            <img
              src={skinImg}
              alt="Schemat anatomiczny — trzy długości fali lasera penetrują różne warstwy skóry"
              width={1600}
              height={900}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <SectionHeading
              eyebrow="Trzy długości fali"
              title="Każdy kolor ma swoją odpowiedź"
              description="Jeden laser, trzy precyzyjnie dobrane długości fali. Dlatego pikolaser radzi sobie z patologiami, które dla jednofalowych laserów pozostają niedostępne."
            />
            <div className="mt-8 space-y-3">
              {WAVELENGTHS.map((w) => (
                <div key={w.nm} className="flex items-start gap-4 rounded-lg border border-border bg-card p-4">
                  <div className={`mt-1 h-10 w-2 shrink-0 rounded-full bg-gradient-to-b ${w.color}`} />
                  <div>
                    <div className="font-serif text-lg text-ink">{w.nm}</div>
                    <div className="text-sm text-foreground/70">{w.targets}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRYBY PRACY */}
      <section className="container-luxury py-16 md:py-24">
        <SectionHeading
          eyebrow="Cztery tryby pracy"
          title="Jeden laser, cztery zupełnie różne zabiegi"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {MODES.map((m, idx) => (
            <div key={m.name} className="relative rounded-lg border border-border bg-card p-7">
              <div className="absolute right-6 top-6 font-serif text-3xl text-champagne/30">0{idx + 1}</div>
              <div className="text-xs uppercase tracking-[0.25em] text-champagne">{m.role}</div>
              <h3 className="mt-2 font-serif text-2xl text-ink">{m.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/75">{m.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROTOKOŁY ZŁOŻONE */}
      <section className="bg-secondary/40 py-16 md:py-24">
        <div className="container-luxury">
          <SectionHeading
            eyebrow="Protokoły złożone"
            title="Laser pikosekundowy tylko w protokołach łączonych"
            description="Obecnie nie wykonuję zabiegów laserem pikosekundowym jako izolowanej terapii. Urządzenie pracuje wyłącznie w protokołach złożonych, gdzie efekty poszczególnych technologii wzmacniają się wzajemnie — skóra otrzymuje kompleksową regenerację w jednej sesji."
          />
          <div className="mt-12 rounded-lg border border-champagne/40 bg-card p-8 md:p-10">
            <div className="text-xs uppercase tracking-[0.25em] text-champagne">Najpowszechniejszy protokół</div>
            <h3 className="mt-3 font-serif text-2xl text-ink">Zimna plazma → Rewitalizacja pikosekundowa → Fototerapia LED</h3>
            <p className="mt-4 max-w-3xl text-foreground/75">
              Sekwencja rozpoczyna się od zimnej plazmy, która przygotowuje skórę i inicjuje proces regeneracji. Następnie laser pikosekundowy w trybie rewitalizacyjnym poprawia teksturę, stymuluje neokolagenezę i wyrównuje koloryt. Bezpośrednio po zabiegu laserowym — fototerapia LED, która łagodzi, przyspiesza gojenie i wzmacnia efekt końcowy.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-border bg-secondary/40 p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-champagne">Krok 1</div>
                <div className="mt-2 font-serif text-lg text-ink">Zimna plazma</div>
                <p className="mt-2 text-sm text-foreground/70">Przygotowanie skóry, sublimacja powierzchniowa, otwarcie kanałów absorpcyjnych.</p>
              </div>
              <div className="rounded-lg border border-border bg-secondary/40 p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-champagne">Krok 2</div>
                <div className="mt-2 font-serif text-lg text-ink">Rewitalizacja 350 ps</div>
                <p className="mt-2 text-sm text-foreground/70">Stymulacja kolagenu, wyrównanie tekstury, fotoakustyczne oczyszczenie pigmentu.</p>
              </div>
              <div className="rounded-lg border border-border bg-secondary/40 p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-champagne">Krok 3</div>
                <div className="mt-2 font-serif text-lg text-ink">Fototerapia LED</div>
                <p className="mt-2 text-sm text-foreground/70">Łagodzenie, redukcja zaczerwienienia, przyspieszenie regeneracji tkankowej.</p>
              </div>
            </div>
            <div className="mt-8 flex items-start gap-3 rounded-lg border border-champagne/30 bg-champagne/5 p-5">
              <Clock className="mt-0.5 size-5 shrink-0 text-champagne" />
              <div>
                <div className="font-serif text-ink">Planowanie rekonwalescencji jest niepotrzebne</div>
                <p className="mt-1 text-sm text-foreground/75">
                  Dzięki ultrakrótkiemu impulsowi 350 ps tkanka nie ulega oparzeniu termicznemu. Połączenie z plazmą i fototerapią sprawia, że skóra regeneruje się w czasie rzeczywistym podczas samego zabiegu. Możesz wrócić do aktywności zawodowej i społecznej natychmiast — bez planowania urlopu czy rezygnacji z ważnych spotkań.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GŁOWICE — VISUAL */}
      <section className="bg-ink py-16 text-alabaster md:py-24">
        <div className="container-luxury grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-champagne-light">Wymienne głowice</div>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl">Siedem niezależnych narzędzi — jeden cel: Twoja skóra</h2>
            <p className="mt-4 text-alabaster/80">
              Dla każdej z trzech głównych długości fali (1064 / 755 / 532 nm) mamy zarówno rękojeść z jednorodną plamką, jak i rękojeść frakcyjną. Ta druga oprócz dedykowanych funkcji (usuwanie pigmentu, melasma, przebarwienia) dodatkowo poprawia teksturę skóry i rewitalizuje — efekt znany w warszawskich klinikach jako „Total look” lub „Baby face lift”.
            </p>
            <ul className="mt-8 space-y-3 text-alabaster/85">
              <li className="flex items-start gap-3"><Check className="mt-1 size-4 shrink-0 text-champagne" /><span><strong className="text-alabaster">1064 nm — jednorodna plamka</strong> — tatuaże czarne/granatowe, toning, zmiany głębokie.</span></li>
              <li className="flex items-start gap-3"><Check className="mt-1 size-4 shrink-0 text-champagne" /><span><strong className="text-alabaster">1064 nm — rękojeść frakcyjna</strong> — rewitalizacja, poprawa tekstury skóry, efekt „Total look”.</span></li>
              <li className="flex items-start gap-3"><Check className="mt-1 size-4 shrink-0 text-champagne" /><span><strong className="text-alabaster">755 nm — jednorodna plamka</strong> — zielone/niebieskie tatuaże, melasma, fotoodmładzanie.</span></li>
              <li className="flex items-start gap-3"><Check className="mt-1 size-4 shrink-0 text-champagne" /><span><strong className="text-alabaster">755 nm — rękojeść frakcyjna Honeycomb</strong> — blizny potrądzikowe, frakcyjna rewitalizacja, „Baby face lift”.</span></li>

              <li className="flex items-start gap-3"><Check className="mt-1 size-4 shrink-0 text-champagne" /><span><strong className="text-alabaster">532 nm — jednorodna plamka</strong> — czerwone/żółte tatuaże, plamy soczewicowate, piegi, rumień (najskuteczniejsza długość fali).</span></li>
              <li className="flex items-start gap-3"><Check className="mt-1 size-4 shrink-0 text-champagne" /><span><strong className="text-alabaster">532 nm — rękojeść frakcyjna</strong> — przebarwienia powierzchowne, fotoodmładzanie, poprawa tekstury, rumień.</span></li>
              <li className="flex items-start gap-3"><Check className="mt-1 size-4 shrink-0 text-champagne" /><span><strong className="text-alabaster">Rękojeść 650 nm</strong> — zielone tatuaże i trudne do usunięcia barwniki niebieskie.</span></li>
              <li className="flex items-start gap-3"><Check className="mt-1 size-4 shrink-0 text-champagne" /><span><strong className="text-alabaster">Rękojeść 585 nm</strong> — naczyniaki (hemangiomy), rumień, drobne teleangiektazje.</span></li>
            </ul>
            <p className="mt-6 text-sm text-champagne-light">
              Rękojeść frakcyjna = podstawowe działanie długości fali + bonusowy efekt odmłodzenia i wyrównania tekstury skóry. Dlatego warszawskie kliniki nazywają te zabiegi "Total look" lub "Baby face lift".
            </p>
          </div>
          <div className="overflow-hidden rounded-lg border border-champagne/20">
            <img
              src={applicatorsImg}
              alt="Wzory wiązki głowic laserowych: jednorodna plamka i rękojeści frakcyjne 1064/755/532 nm, Honeycomb, Red Grid, Golden Grid"
              width={1200}
              height={1200}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* KORZYŚCI / BEZPIECZEŃSTWO */}
      <section className="container-luxury py-16 md:py-24">
        <SectionHeading eyebrow="Dlaczego pacjentki wracają" title="Komfort, bezpieczeństwo, przewidywalność" />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <div key={b.title} className="rounded-lg border border-border bg-card p-6">
              <b.icon className="size-7 text-champagne" />
              <h3 className="mt-4 font-serif text-lg text-ink">{b.title}</h3>
              <p className="mt-2 text-sm text-foreground/70">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CENNIK */}
      <section id="cennik" className="bg-secondary/40 py-16 md:py-24">
        <div className="container-luxury">
          <SectionHeading
            eyebrow="Cennik"
            title="Standard warszawski — bez dojeżdżania do stolicy"
            description="Od 10 lat pracuję w premium klinikach Warszawy. Ten sam standard zabiegu, protokoły i bezpieczeństwo — teraz w Siedlcach. Oszczędzasz pół dnia, paliwo i parking."
          />
          <div className="mt-12 grid gap-8 md:grid-cols-[2fr_1fr]">
            <div className="overflow-hidden rounded-lg border border-border bg-card shadow-soft">
              <table className="w-full text-sm">
                <thead className="bg-secondary/60 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium">Zabieg</th>
                    <th className="px-6 py-4 text-right font-medium">Cena</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tech.pricing.map((p) => (
                    <tr key={p.label} className="transition hover:bg-secondary/30">
                      <td className="px-6 py-4 text-foreground/85">{p.label}</td>
                      <td className="px-6 py-4 text-right font-medium text-ink">{formatCena(p.price, { prefix: "od" })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="border-t border-border bg-secondary/40 p-5 text-xs text-muted-foreground">
                Ceny orientacyjne. Ostateczna wycena ustalana jest na konsultacji w oparciu o indywidualny protokół, powierzchnię zabiegową i liczbę sesji.
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-champagne/40 bg-card p-6">
                <div className="text-xs uppercase tracking-[0.25em] text-champagne">Region Siedlce</div>
                <h3 className="mt-2 font-serif text-xl text-ink">Najbliższy laser tej klasy — 120 km</h3>
                <p className="mt-3 text-sm text-foreground/75">
                  Do tej pory pacjentki z Siedlec, Mińska Mazowieckiego, Łukowa, Łosic, Sokołowa i Białej Podlaskiej musiały jeździć do Warszawy. Teraz nie muszą.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-ink p-6 text-alabaster">
                <div className="font-serif text-lg">Zaplanuj swoją serię</div>
                <p className="mt-2 text-sm text-alabaster/75">
                  Pakiety 4 zabiegów z preferencyjną wyceną. Plan zabiegowy ustalamy na bezpłatnej konsultacji.
                </p>
                <Link
                  to="/"
                  hash="rezerwacja"
                  className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-champagne px-6 text-sm text-ink hover:bg-champagne-light"
                >
                  Umów konsultację
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-luxury py-16 md:py-24">
        <SectionHeading eyebrow="FAQ" title="Najczęstsze pytania" />
        <div className="mt-10 divide-y divide-border rounded-lg border border-border bg-card">
          {tech.faq.map((f) => (
            <details key={f.q} className="group p-6 open:bg-secondary/30">
              <summary className="cursor-pointer list-none font-serif text-lg text-ink">{f.q}</summary>
              <p className="mt-3 text-foreground/75">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* REZERWACJA */}
      <section className="bg-ink py-16 text-alabaster md:py-24">
        <div className="container-luxury grid gap-12 md:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Rezerwacja" title={<span className="text-alabaster">Konsultacja, zanim cokolwiek zaczniemy</span>} />
            <p className="mt-4 text-alabaster/80">
              Każdy protokół laserowy zaczyna się od rozmowy i analizy skóry. Bez presji, bez sprzedaży. Wskażemy, czy laser pikosekundowy jest dla Ciebie, ile sesji potrzebujesz i jakiego efektu możesz się spodziewać.
            </p>
            <div className="mt-8 space-y-2 text-sm text-alabaster/70">
              <div>· Bezpłatna konsultacja</div>
              <div>· Plan zabiegowy na piśmie</div>
              <div>· Zalecenia pre- i post-procedure</div>
            </div>
          </div>
          <BookingForm defaultTechnology={TECH_SLUG} />
        </div>
      </section>
    </>
  );
}
