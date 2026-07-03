import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Watermark } from "@/components/site/Watermark";
import { BookingFormLazy } from "@/components/site/BookingFormLazy";
import { getTechnology, type Technology } from "@/data/technologies";
import { formatCena } from "@/lib/format";
import { ArrowLeft, Check, Sparkles, ShieldCheck, Clock, Heart, Users } from "lucide-react";
import skoraZdrowaImg from "@/assets/plasma-skora-zdrowa.webp";
import skoraWiotkaAsset from "@/assets/plasma-skora-wiotka.jpg.asset.json";
import dzialanieImg from "@/assets/plasma-dzialanie.webp";
import zaawansowanaImg from "@/assets/plasma-zaawansowana.webp";
import heroVideoAsset from "@/assets/plasma-hero.mp4.asset.json";
import heroPosterWebp from "@/assets/plasma-poster.webp.asset.json";
import ba1Before from "@/assets/plasma-ba-1.png.asset.json";
import ba1After from "@/assets/plasma-ba-1a.png.asset.json";
import ba2Before from "@/assets/plasma-ba-2.png.asset.json";
import ba2After from "@/assets/plasma-ba-2a.png.asset.json";
import ba3Before from "@/assets/plasma-ba-3.png.asset.json";
import ba3After from "@/assets/plasma-ba-3a.png.asset.json";
import ba5Before from "@/assets/plasma-ba-5.png.asset.json";
import ba5After from "@/assets/plasma-ba-5a.png.asset.json";
import ba6Before from "@/assets/plasma-ba-6.png.asset.json";
import ba6After from "@/assets/plasma-ba-6a.png.asset.json";
import ba7Before from "@/assets/plasma-ba-7.png.asset.json";
import ba7After from "@/assets/plasma-ba-7a.png.asset.json";
import ba8Before from "@/assets/plasma-ba-8.png.asset.json";
import ba8After from "@/assets/plasma-ba-8a.png.asset.json";
import ba9Before from "@/assets/plasma-ba-9.png.asset.json";
import ba9After from "@/assets/plasma-ba-9a.png.asset.json";
import ba10Before from "@/assets/plasma-ba-10.png.asset.json";
import ba10After from "@/assets/plasma-ba-10a.png.asset.json";
import ba11Before from "@/assets/plasma-ba-11.png.asset.json";
import ba11After from "@/assets/plasma-ba-11a.png.asset.json";
import ba12Before from "@/assets/plasma-ba-12.png.asset.json";
import ba12After from "@/assets/plasma-ba-12a.png.asset.json";
import { CLINIC_POSTAL_ADDRESS_JSONLD } from "@/config/clinic";

const BEFORE_AFTER = [
  { before: ba1Before.url, after: ba1After.url, title: "Trądzik i niedoskonałości", desc: "Redukcja zmian zapalnych, wyrównanie kolorytu, zmniejszenie widoczności porów na policzku." },
  { before: ba2Before.url, after: ba2After.url, title: "Zmarszczki na czole", desc: "Wygładzenie linii poziomych, ujednolicenie tekstury skóry i poprawa napięcia." },
  { before: ba3Before.url, after: ba3After.url, title: "Rozszerzone pory i tekstura", desc: "Zwężenie porów w strefie T, wyraźna poprawa gładkości i jakości skóry." },
  { before: ba5Before.url, after: ba5After.url, title: "Przebarwienia i melasma", desc: "Wyraźne rozjaśnienie plam pigmentacyjnych, ujednolicenie kolorytu policzka." },
  { before: ba6Before.url, after: ba6After.url, title: "Rewitalizacja całej twarzy", desc: "Wygładzenie tekstury, zmniejszenie zaczerwienień, świeży i wypoczęty wygląd skóry." },
  { before: ba7Before.url, after: ba7After.url, title: "Dekolt — fotostarzenie", desc: "Redukcja przebarwień posłonecznych, wygładzenie skóry dekoltu i poprawa jej kolorytu." },
  { before: ba8Before.url, after: ba8After.url, title: "Trądzik różowaty i naczynka", desc: "Zmniejszenie zaczerwienienia, wyciszenie skóry naczyniowej, ujednolicenie tonu." },
  { before: ba9Before.url, after: ba9After.url, title: "Okolica ust i broda", desc: "Wygładzenie skóry wokół ust, redukcja drobnych niedoskonałości i poprawa napięcia." },
  { before: ba10Before.url, after: ba10After.url, title: "Blizny potrądzikowe", desc: "Spłycenie blizn atroficznych, wyrównanie tekstury i zmniejszenie zaczerwienienia policzka." },
  { before: ba11Before.url, after: ba11After.url, title: "Trądzik zapalny — policzek", desc: "Wyciszenie zmian zapalnych, ujednolicenie kolorytu i wyraźna poprawa kondycji skóry." },
  { before: ba12Before.url, after: ba12After.url, title: "Skóra dłoni — odmłodzenie", desc: "Wygładzenie naskórka, poprawa napięcia i nawilżenia skóry grzbietu dłoni." },
];

const TECH_SLUG = "fusion-plasma";

export const Route = createFileRoute("/technologie/fusion-plasma")({
  loader: (): { tech: Technology } => {
    const tech = getTechnology(TECH_SLUG);
    if (!tech) throw new Error("Zimna plazma — brak wpisu w bazie");
    return { tech };
  },
  head: ({ loaderData }) => {
    const url = "https://bmclinics.ai/technologie/fusion-plasma";
    const title = "Zimna plazma — rewitalizacja skóry | BMClinics.ai Warszawa";
    const description =
      "Zimna plazma to najczęściej wybierany zabieg rewitalizacyjny na świecie — bezbolesny, bez rekonwalescencji. Skóra od razu wygląda promiennie. Standard premium klinik warszawskich w Warszawie.";

    const serviceSchema = loaderData
      ? {
          "@context": "https://schema.org",
          "@type": "MedicalTherapy",
          name: "Zimna plazma — rewitalizacja",
          description: loaderData.tech.shortDesc,
          url,
          provider: {
            "@type": "MedicalBusiness",
            name: "BMClinics.ai",
            url: "https://bmclinics.ai",
            address: { ...CLINIC_POSTAL_ADDRESS_JSONLD },
          },
          indication: loaderData.tech.indications,
        }
      : undefined;

    const faqSchema = loaderData
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "Czy zabieg boli?", acceptedAnswer: { "@type": "Answer", text: "Nie. Zabieg jest całkowicie bezbolesny — odczuwasz delikatne ciepło i lekkie mrowienie." } },
            { "@type": "Question", name: "Czy potrzebuję rekonwalescencji?", acceptedAnswer: { "@type": "Answer", text: "Nie. Po zabiegu od razu wracasz do swoich zajęć, możesz nałożyć makijaż i wyjść do pracy." } },
            { "@type": "Question", name: "Kiedy zobaczę efekty?", acceptedAnswer: { "@type": "Answer", text: "Skóra wygląda promiennie już po pierwszej sesji. Pełna odbudowa kolagenu rozwija się przez 12 tygodni." } },
          ],
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
        { property: "og:image", content: dzialanieImg },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "preload", as: "image", href: heroPosterWebp.url, type: "image/webp", fetchPriority: "high" },
      ],
      scripts: scripts.length > 0 ? scripts : undefined,
    };
  },
  component: FusionPlasmaPage,
});

function FusionPlasmaPage() {
  const { tech } = Route.useLoaderData() as { tech: Technology };

  return (
    <>
      {/* HERO */}
      <section className="bg-secondary/40 py-12 md:py-20">
        <div className="container-luxury">
          <Link to="/technologie" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Wszystkie technologie
          </Link>
          <div className="mt-6 grid gap-10 md:grid-cols-[1.3fr_1fr] md:items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-champagne">Zabieg rewitalizujący</div>
              <h1 className="mt-4 font-serif text-ink">Zimna plazma — skóra, która od razu wygląda promiennie</h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                Bezbolesny, bezinwazyjny zabieg, po którym możesz od razu wrócić do pracy. To dziś najczęściej wybierany zabieg rewitalizacyjny na świecie — co miesiąc poddaje się mu ponad 1 200 000 kobiet.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/"
                  hash="rezerwacja"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-ink px-6 text-sm tracking-wide text-alabaster"
                >
                  Umów konsultację
                </Link>
                <a
                  href="#dzialanie"
                  className="inline-flex h-12 items-center justify-center rounded-md border border-ink/20 px-6 text-sm tracking-wide text-ink hover:bg-secondary"
                >
                  Zobacz jak działa
                </a>
              </div>
            </div>
            <div className="relative rounded-lg overflow-hidden bg-white shadow-soft">
              <video
                src={heroVideoAsset.url}
                poster={heroPosterWebp.url}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full h-auto block"
                aria-label="Zabieg zimnej plazmy — pokaz w gabinecie"
              />
              <Watermark size="md" />
            </div>
          </div>
        </div>
      </section>

      {/* DLACZEGO TEN ZABIEG */}
      <section className="container-luxury py-16 md:py-24">
        <SectionHeading eyebrow="Dlaczego pacjentki wybierają zimną plazmę" title="Cztery powody, dla których ten zabieg podbił świat" />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Heart, title: "Bezbolesny", desc: "Czujesz tylko delikatne ciepło i lekkie mrowienie — bez znieczulenia, bez dyskomfortu." },
            { icon: Clock, title: "Bez rekonwalescencji", desc: "Po zabiegu od razu wracasz do pracy. Możesz nałożyć makijaż i wyjść na spotkanie." },
            { icon: Sparkles, title: "Efekt od pierwszej sesji", desc: "Skóra wygląda promiennie, świeżo i wypoczęcie już po wyjściu z gabinetu." },
            { icon: ShieldCheck, title: "Bezpieczny", desc: "Pracuje w temperaturze ciała (35–40°C). Nie powoduje strupów, oparzeń ani odbarwień." },
          ].map((b) => (
            <div key={b.title} className="rounded-lg border border-border bg-card p-6 shadow-soft">
              <b.icon className="size-7 text-champagne" />
              <div className="mt-4 font-serif text-xl text-ink">{b.title}</div>
              <p className="mt-2 text-sm text-foreground/75">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* JAK SKÓRA SIĘ ZMIENIA */}
      <section className="bg-secondary/40 py-16 md:py-24">
        <div className="container-luxury">
          <SectionHeading
            eyebrow="Co dzieje się ze skórą z czasem"
            title="Od skóry zdrowej do skóry wymagającej regeneracji"
          />
          <p className="mt-4 max-w-3xl text-foreground/80">
            Z wiekiem, pod wpływem słońca, stresu i przewlekłych stanów zapalnych, skóra traci swoje rusztowanie — siatkę włókien kolagenowych i naczyń krwionośnych. Staje się cieńsza, mniej elastyczna, szorstka. To naturalny proces, który można cofnąć.
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <figure className="rounded-lg overflow-hidden border border-border bg-white shadow-soft">
              <img src={skoraZdrowaImg} alt="Model skóry zdrowej — gęsta siatka kolagenu, mieszki włosowe, naczynia krwionośne" className="w-full h-auto" />
              <figcaption className="p-5">
                <div className="text-xs uppercase tracking-[0.3em] text-champagne">Skóra zdrowa</div>
                <h3 className="mt-2 font-serif text-xl text-ink">Gęsta, elastyczna, ukrwiona</h3>
                <p className="mt-2 text-sm text-foreground/75">
                  Naskórek jest gładki i równy. Pod nim — gęsta siatka kolagenu, sprawne naczynia i mieszki włosowe. Skóra dobrze się nawilża i szybko regeneruje.
                </p>
              </figcaption>
            </figure>
            <figure className="rounded-lg overflow-hidden border border-border bg-white shadow-soft">
              <img src={skoraWiotkaAsset.url} alt="Model skóry wiotkiej i cienkiej — rzadka siatka kolagenu, oznaki przewlekłego zapalenia" className="w-full h-auto" />
              <figcaption className="p-5">
                <div className="text-xs uppercase tracking-[0.3em] text-champagne">Skóra wiotka i cienka</div>
                <h3 className="mt-2 font-serif text-xl text-ink">Ścieńczała, bez podparcia</h3>
                <p className="mt-2 text-sm text-foreground/75">
                  Włókna kolagenowe są rzadkie i pofragmentowane. Naskórek robi się szorstki, pojawiają się drobne zmarszczki, skóra wygląda na zmęczoną i traci sprężystość.
                </p>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* JAK DZIAŁA ZIMNA PLAZMA */}
      <section id="dzialanie" className="container-luxury py-16 md:py-24">
        <SectionHeading eyebrow="Jak to działa" title="Zimna plazma budzi skórę do pracy" />
        <div className="mt-10 grid gap-12 md:grid-cols-[1fr_1.2fr] md:items-center">
          <figure className="rounded-lg overflow-hidden bg-white shadow-soft border border-border">
            <img src={zaawansowanaImg} alt="Strumień zimnej plazmy aktywujący odbudowę kolagenu w głębi skóry" className="w-full h-auto" />
          </figure>
          <div className="space-y-6">
            <p className="text-foreground/85 md:text-lg">
              Aplikator wytwarza delikatny, świetlisty strumień — to właśnie plazma. W skórze uruchamia naturalne mechanizmy odbudowy, ale bez nagrzewania ani uszkadzania tkanki.
            </p>
            <ul className="space-y-4">
              {[
                { t: "Pobudza fibroblasty", d: "Komórki odpowiedzialne za produkcję kolagenu zaczynają pracować intensywniej. Po 12 tygodniach gęstość kolagenu rośnie średnio o 40%." },
                { t: "Otwiera skórę na pielęgnację", d: "Kosmetyki i serum aplikowane bezpośrednio po zabiegu wnikają nawet kilkadziesiąt razy głębiej niż zwykle." },
                { t: "Działa antybakteryjnie", d: "Naturalnie eliminuje bakterie odpowiedzialne za trądzik i stany zapalne — bez antybiotyków i bez ryzyka oporności." },
                { t: "Wspiera gojenie", d: "Idealny dla skóry wrażliwej, atopowej, naczyniowej i po innych zabiegach (lasery, mikronakłuwanie)." },
              ].map((x) => (
                <li key={x.t} className="flex gap-3">
                  <Check className="mt-1 size-5 shrink-0 text-champagne" />
                  <div>
                    <div className="font-serif text-lg text-ink">{x.t}</div>
                    <p className="text-sm text-foreground/75">{x.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="bg-ink py-16 text-alabaster md:py-20">
        <div className="container-luxury">
          <Users className="size-8 text-champagne" />
          <h2 className="mt-4 font-serif text-3xl md:text-4xl">Zimna plazma podbija świat</h2>
          <p className="mt-4 max-w-3xl text-alabaster/80">
            To obecnie najczęściej wybierany zabieg rewitalizacyjny na świecie. Rośnie na popularności w Azji Południowo-Wschodniej, Stanach Zjednoczonych i na Bliskim Wschodzie.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-champagne/30 bg-white/5 p-6">
              <div className="font-serif text-3xl text-champagne">1 200 000+</div>
              <p className="mt-2 text-sm text-alabaster/85">kobiet wykonuje zabieg zimną plazmą każdego miesiąca</p>
            </div>
            <div className="rounded-lg border border-champagne/30 bg-white/5 p-6">
              <div className="font-serif text-3xl text-champagne">2 400 000</div>
              <p className="mt-2 text-sm text-alabaster/85">zabiegów wykonywanych co godzinę na całym świecie</p>
            </div>
            <div className="rounded-lg border border-champagne/30 bg-white/5 p-6">
              <div className="font-serif text-3xl text-champagne">Trendy światowe</div>
              <p className="mt-2 text-sm text-alabaster/85">Azja Południowo-Wschodnia, Stany Zjednoczone, Bliski Wschód</p>
            </div>
          </div>
          <div className="mt-6 rounded-lg border border-champagne/30 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.3em] text-champagne">Standard premium</div>
            <p className="mt-3 text-sm text-alabaster/85">
              10 lat doświadczenia w warszawskich klinikach premium. Ten sam protokół, to samo bezpieczeństwo — bez konieczności jazdy do stolicy.
            </p>
          </div>
        </div>
      </section>

      {/* WSKAZANIA */}
      <section className="container-luxury py-16 md:py-24">
        <SectionHeading eyebrow="Dla kogo" title="Kiedy warto sięgnąć po zimną plazmę" />
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {[
            "Skóra zmęczona, szara, bez blasku",
            "Skóra wrażliwa, naczyniowa, atopowa",
            "Trądzik i ślady po trądziku",
            "Rozszerzone pory i nierówna tekstura",
            "Pierwsze oznaki starzenia",
            "Skóra po lecie, po laserach, po peelingach",
            "Profilaktyka — gdy chcesz zatrzymać czas",
            "Przygotowanie skóry przed ważnym wydarzeniem",
          ].map((i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
              <Check className="mt-0.5 size-5 shrink-0 text-champagne" />
              <span className="text-foreground/85">{i}</span>
            </div>
          ))}
        </div>
      </section>

      {/* PRZECIWWSKAZANIA + CENNIK */}
      <section className="bg-secondary/40 py-16 md:py-24">
        <div className="container-luxury grid gap-10 md:grid-cols-[1fr_1fr]">
          <div>
            <SectionHeading eyebrow="Bezpieczeństwo" title="Przeciwwskazania" />
            <ul className="mt-6 list-disc space-y-2 pl-5 text-foreground/85">
              <li>Rozrusznik serca i implanty elektroniczne</li>
              <li>Ciąża</li>
              <li>Aktywna choroba nowotworowa skóry w miejscu zabiegu</li>
            </ul>
            <p className="mt-6 text-sm text-muted-foreground">
              Każdy zabieg poprzedza konsultacja — wspólnie ustalamy, czy zimna plazma jest dla Ciebie najlepszym wyborem.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 shadow-soft">
            <div className="text-xs uppercase tracking-[0.3em] text-champagne">Cennik</div>
            <h3 className="mt-2 font-serif text-2xl text-ink">Wycena zabiegu</h3>
            <ul className="mt-4 divide-y divide-border">
              {tech.pricing.map((p) => (
                <li key={p.label} className="flex items-center justify-between py-3 text-sm">
                  <span className="text-foreground/80">{p.label}</span>
                  <span className="font-medium text-ink">{formatCena(p.price, { prefix: "od" })}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              Ceny zgodne ze standardem premium klinik warszawskich. Ostateczna wycena ustalana jest na konsultacji.
            </p>
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section className="bg-secondary/40 py-16 md:py-24">
        <div className="container-luxury">
          <SectionHeading
            eyebrow="Efekty"
            title="Przed i po — galeria pacjentek"
            description="Realne rezultaty po serii zabiegów zimnej plazmy. Zdjęcia publikujemy za zgodą pacjentek."
          />
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {BEFORE_AFTER.map((item) => (
              <figure key={item.title} className="overflow-hidden rounded-lg border border-border bg-card">
                <div className="grid grid-cols-2">
                  <div className="relative">
                    <img src={item.before} alt={`${item.title} — przed zabiegiem`} loading="lazy" className="aspect-square w-full object-cover" />
                    <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white">Przed</span>
                  </div>
                  <div className="relative">
                    <img src={item.after} alt={`${item.title} — po zabiegu`} loading="lazy" className="aspect-square w-full object-cover" />
                    <span className="absolute left-3 top-3 rounded-full bg-champagne px-3 py-1 text-xs uppercase tracking-[0.2em] text-ink">Po</span>
                  </div>
                </div>
                <figcaption className="border-t border-border p-5">
                  <div className="font-serif text-lg text-ink">{item.title}</div>
                  <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Efekty zabiegu mogą się różnić w zależności od kondycji skóry, wieku, stylu życia i liczby sesji.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-luxury py-16 md:py-24">

        <SectionHeading eyebrow="FAQ" title="Najczęstsze pytania pacjentek" />
        <div className="mt-8 divide-y divide-border rounded-lg border border-border bg-card">
          {[
            { q: "Czy zabieg boli?", a: "Nie. Zabieg jest całkowicie bezbolesny — odczuwasz delikatne ciepło i lekkie mrowienie. Nie potrzebujesz żadnego znieczulenia." },
            { q: "Czy będę musiała brać wolne?", a: "Nie. Po zabiegu od razu wracasz do swoich zajęć. Możesz nałożyć makijaż, wyjść do pracy, na spotkanie czy na trening." },
            { q: "Kiedy zobaczę efekty?", a: "Skóra wygląda promiennie i wypoczęcie już po pierwszej sesji. Pełna odbudowa kolagenu rozwija się przez 12 tygodni — wtedy efekt jest najbardziej widoczny." },
            { q: "Ile zabiegów potrzeba?", a: "Najczęściej rekomendujemy serię 4–6 zabiegów co 2–3 tygodnie. Dla efektu „na ważne wydarzenie” wystarczy jedna sesja na 2–3 dni przed." },
            { q: "Czy to jest ta sama plazma, co przy nieoperacyjnej blefaroplastyce?", a: "Nie. Tamten zabieg używa gorącej plazmy, która tworzy strupki i wymaga gojenia. Nasza zimna plazma pracuje w temperaturze ciała — bez strupów, bez śladów, bez rekonwalescencji." },
            { q: "Czy mogę połączyć zimną plazmę z innymi zabiegami?", a: "Tak — i tak właśnie wygląda nasz najczęstszy protokół: zimna plazma + laser pikosekundowy + fototerapia LED w jednej wizycie. To pełna regeneracja bez planowania urlopu." },
            { q: "Czy zabieg jest bezpieczny dla skóry wrażliwej?", a: "Tak. Zimna plazma to jeden z najbezpieczniejszych zabiegów na rynku — polecany szczególnie dla skóry wrażliwej, naczyniowej, atopowej (AZS) i z trądzikiem." },
          ].map((f) => (
            <details key={f.q} className="group p-5 open:bg-secondary/30">
              <summary className="cursor-pointer list-none font-serif text-lg text-ink">{f.q}</summary>
              <p className="mt-3 text-foreground/80">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* REZERWACJA */}
      <section className="bg-secondary/40 py-16 md:py-24">
        <div className="container-luxury grid gap-12 md:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Rezerwacja" title="Umówmy konsultację" />
            <p className="mt-4 text-muted-foreground">
              Każdy zabieg zaczynamy od rozmowy — bez presji, bez sprzedaży. Wspólnie ustalimy, czy zimna plazma to najlepszy wybór dla Twojej skóry.
            </p>
          </div>
          <BookingFormLazy defaultTechnology={tech.slug} />
        </div>
      </section>
    </>
  );
}
