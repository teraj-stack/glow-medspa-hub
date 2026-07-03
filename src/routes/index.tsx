import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { TechCard } from "@/components/site/TechCard";

import { TECHNOLOGIES } from "@/data/technologies";
import { Sparkles, Shield, HeartHandshake, ArrowRight } from "lucide-react";
import bujokAsset from "@/assets/bujok.jpeg.asset.json";
import bujokAvif from "@/assets/bujok.avif.asset.json";
import bujokWebp from "@/assets/bujok.webp.asset.json";
import { HeroPicture } from "@/components/site/HeroPicture";
import { cfImage } from "@/lib/cf-image";
import { CLINIC_POSTAL_ADDRESS_JSONLD } from "@/config/clinic";
import { withOgVersion } from "@/config/social-preview";
import ogCard from "@/assets/og/index.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Medycyna estetyczna Warszawa — BMClinics.ai (Wilanów, klinika ginekologii)" },
      {
        name: "description",
        content:
          "Medycyna estetyczna w Warszawie w Wilanowie — konsultacje w Klinice Ginekologii, ul. Branickiego 10. Autorskie protokoły, sprawdzone technologie, naturalny efekt. Umów konsultację.",
      },
      { property: "og:title", content: "Medycyna estetyczna Warszawa — BMClinics.ai" },
      { property: "og:description", content: "Klinika medycyny estetycznej i laserowej w Warszawie (Wilanów, klinika ginekologii). Dyskretne, autorskie protokoły i naturalny efekt." },
      { property: "og:url", content: "https://bmclinics.ai/" },
      { property: "og:image", content: withOgVersion(`https://bmclinics.ai${ogCard}`) },
      { name: "twitter:image", content: withOgVersion(`https://bmclinics.ai${ogCard}`) },
      { name: "geo.region", content: "PL-MZ" },
      { name: "geo.placename", content: "Warszawa" },
      { name: "geo.position", content: "52.16850;21.09000" },
      { name: "ICBM", content: "52.16850, 21.09000" },
    ],
    links: [
      { rel: "canonical", href: "https://bmclinics.ai/" },
      {
        rel: "preload",
        as: "image",
        href: cfImage(bujokAvif.url, { width: 1200, format: "avif" }),
        type: "image/avif",
        fetchPriority: "high",
        imagesrcset: [480, 768, 1024, 1200]
          .map((w) => `${cfImage(bujokAvif.url, { width: w, format: "avif" })} ${w}w`)
          .join(", "),
        imagesizes: "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "BMClinics.ai",
          alternateName: "BMClinics.ai",
          url: "https://bmclinics.ai/",
          logo: "https://bmclinics.ai/favicon.ico",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MedicalClinic",
          "@id": "https://bmclinics.ai/#clinic",
          name: "BMClinics.ai — Medycyna estetyczna Warszawa",
          url: "https://bmclinics.ai/",
          image: bujokAsset.url,
          priceRange: "$$$",
          medicalSpecialty: ["CosmeticProcedure", "Dermatology"],
          areaServed: [
            { "@type": "City", name: "Warszawa" },
            { "@type": "AdministrativeArea", name: "mazowieckie" },
          ],
          address: {
            ...CLINIC_POSTAL_ADDRESS_JSONLD,
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 52.1685,
            longitude: 21.0900,
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              opens: "09:00",
              closes: "20:00",
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: "Saturday",
              opens: "09:00",
              closes: "15:00",
            },
          ],
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <ManifestSection />
      <LocalWarsawSection />
      <TechnologiesPreview />
      <Testimonials />
      <BookingSection />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-alabaster">
      <div className="container-luxury grid items-center gap-12 py-20 md:grid-cols-2 md:py-32">
        <div className="rise-in">
          <div className="text-xs uppercase tracking-[0.3em] text-champagne">Medycyna estetyczna · Warszawa · Wilanów</div>
          <h1 className="mt-6 font-serif text-ink">
            Piękno nie potrzebuje hałasu. Potrzebuje{" "}
            <span className="bg-gradient-to-r from-champagne-light via-gold to-champagne bg-clip-text text-transparent">
              zrozumienia.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            W mojej pracowni medycyna staje się sztuką proporcji,&nbsp;<br />
            a technologia służy naturze. Poznaj autorskie protokoły&nbsp;<br />
            zabiegowe skrojone pod Twoją anatomię.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/konsultacja"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-ink px-6 text-sm tracking-wide text-alabaster transition hover:bg-ink/90"
            >
              Umów konsultację <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/technologie"
              className="inline-flex h-12 items-center justify-center rounded-md border border-ink/20 px-6 text-sm tracking-wide text-ink hover:bg-secondary"
            >
              Poznaj technologie
            </Link>
          </div>
        </div>

        <div className="relative">
          <HeroPicture
            avifUrl={bujokAvif.url}
            webpUrl={bujokWebp.url}
            fallbackUrl={bujokAsset.url}
            alt="Lekarz BMClinics.ai w gabinecie"
            width={1200}
            height={1500}
            eager
            responsiveWidths={[480, 768, 1024, 1200]}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
            imgClassName="aspect-[4/5] w-full rounded-lg object-cover shadow-elegant"
          />
          <div className="absolute -bottom-6 -left-6 hidden rounded-lg border border-border bg-card p-5 shadow-soft md:block">
            <div className="mt-1 text-lg text-ink">"Najlepsza technologia jest bezwartościowa&nbsp;<br />bez empatii i partnerskiej relacji z pacjentem."</div>
            <div className="text-xs uppercase tracking-[0.3em] text-champagne">AUTOR: JAN BUJOK</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ManifestSection() {
  return (
    <section className="bg-secondary/30 py-20 md:py-28">
      <div className="container-luxury max-w-4xl">
        <div className="text-xs uppercase tracking-[0.3em] text-champagne">Manifest / O twórcy</div>
        <h2 className="mt-4 font-serif text-ink">Spójrz na czystą linię obojczyka,&nbsp;<br />na cień pod dolną wargą, na układ rzęs...</h2>
        
        <div className="mt-10 space-y-8 text-foreground">
          <p>
            Jako chirurg i człowiek, który kocha tworzyć, spędziłem tysiące godzin, badając strukturę ludzkiego ciała. 
            Wiem, jak reaguje tkanka, jak starzeje się skóra i jak światło potrafi zmienić odbiór całej twarzy. 
            Moja pracownia powstała po to, by tę wiedzę zamienić w bezpieczną rzeczywistość.
          </p>
          
          <p>
            Nie znajdziesz tu taśmowej pracy. Każdy protokół zabiegowy traktuję jak unikalny projekt — skrojony pod Twoją anatomię, 
            Twoje emocje i Twój styl życia. Lasery i zaawansowana technologia, którymi dysponuję, dają mi absolutną kontrolę nad procesem, 
            ale to ludzkie oko i bezpieczna ręka chirurga decydują o ostatecznym efekcie. Tworzę to miejsce jako przestrzeń absolutnego zaufania i dyskrecji.
          </p>
          
          <p>
            Każdą technologię dobieram jak nutę w kompozycji — nie jak produkt z katalogu.
            Buduję tę opiekę tak, by była spójna, bezpieczna i osobista od pierwszego wdrożenia.
          </p>
        </div>
      </div>
    </section>
  );
}

function LocalWarsawSection() {
  return (
    <section id="medycyna-estetyczna-warszawa" className="container-luxury py-20 md:py-28">
      <div className="mx-auto max-w-4xl">
        <div className="text-xs uppercase tracking-[0.3em] text-champagne">Lokalizacja · Warszawa Wilanów</div>
        <h2 className="mt-4 font-serif text-ink">
          Medycyna estetyczna w Warszawie — konsultacje w Wilanowie
        </h2>
        <p className="mt-6 text-foreground/85">
          Przyjmuję w <strong>Klinice Ginekologii</strong> przy ul. Branickiego 10 w Warszawie (Wilanów).
          Dziesięć lat doświadczenia w premium klinikach stolicy przekładam na autorskie
          protokoły oparte na diagnostyce skóry i sprawdzonych technologiach laserowych.
        </p>

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <div>
            <h3 className="font-serif text-xl text-ink">Dla kogo</h3>
            <ul className="mt-4 space-y-2 text-sm text-foreground/85">
              <li>· Pacjenci szukający medycyny estetycznej w Warszawie i okolic Wilanowa</li>
              <li>· Osoby ceniące dyskrecję i konsultację lekarską, nie sprzedaż zabiegu</li>
              <li>· Skóra dojrzała, przebarwienia, ptoza tkanek, naczynia, blizny potrądzikowe</li>
            </ul>
          </div>
          <div>
            <h3 className="font-serif text-xl text-ink">Jak wygląda pierwsza wizyta</h3>
            <ul className="mt-4 space-y-2 text-sm text-foreground/85">
              <li>· Wywiad medyczny i cele pacjenta (~20 min)</li>
              <li>
                · <Link to="/diagnostyka-skory-warszawa" className="underline decoration-champagne/60 underline-offset-4 hover:text-ink">Diagnostyka skóry twarzy</Link> — mapping, analiza spektralna
              </li>
              <li>
                · Indywidualny plan leczenia i wybór <Link to="/technologie" className="underline decoration-champagne/60 underline-offset-4 hover:text-ink">technologii</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="font-serif text-lg text-ink">Zakres zabiegów</h3>
            <p className="mt-3 text-sm text-foreground/80">
              Lasery frakcyjne, laser tulowy, terapia LED, fusion plasma, peeling węglowy —
              zobacz <Link to="/technologie" className="underline decoration-champagne/60 underline-offset-4 hover:text-ink">wszystkie technologie</Link>.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-lg text-ink">Zespół</h3>
            <p className="mt-3 text-sm text-foreground/80">
              Poznaj <Link to="/lekarze" className="underline decoration-champagne/60 underline-offset-4 hover:text-ink">lekarzy i specjalistów</Link> prowadzących
              konsultacje w Warszawie.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-lg text-ink">Bezpieczeństwo</h3>
            <p className="mt-3 text-sm text-foreground/80">
              Standardy pracy i przeciwwskazania opisujemy w sekcji
              {" "}
              <Link to="/bezpieczenstwo-zabiegow-laserowych" className="underline decoration-champagne/60 underline-offset-4 hover:text-ink">bezpieczeństwo zabiegów</Link>.
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-lg border border-border bg-card p-6 md:p-8">
          <h3 className="font-serif text-lg text-ink">Adres i dojazd</h3>
          <p className="mt-3 text-sm text-foreground/85">
            Klinika Ginekologii, ul. Branickiego 10, 02-972 Warszawa (Wilanów).
            Dogodny dojazd z Mokotowa, Ursynowa, Śródmieścia i całej Warszawy;
            parking na terenie kliniki.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/konsultacja"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-ink px-6 text-sm tracking-wide text-alabaster transition hover:bg-ink/90"
            >
              Umów konsultację w Warszawie <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/cennik"
              className="inline-flex h-11 items-center justify-center rounded-md border border-ink/20 px-6 text-sm tracking-wide text-ink hover:bg-secondary"
            >
              Zobacz cennik
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


function TechnologiesPreview() {
  const featured = TECHNOLOGIES.slice(0, 6);
  return (
    <section className="container-luxury py-20 md:py-28">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="Technologie"
          title="Sprawdzone urządzenia, świadomie dobrane"
          description="Pracujemy wyłącznie na technologiach o udokumentowanej skuteczności. Opisujemy je technicznie — bez marketingowego szumu."
        />
        <Link to="/technologie" className="inline-flex items-center gap-2 text-sm tracking-wide text-ink hover:gap-3 transition-all">
          Wszystkie technologie <ArrowRight className="size-4" />
        </Link>
      </div>
      <div className="tile-grid mt-12">
        {featured.map((t) => <TechCard key={t.slug} tech={t} />)}
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    {
      q: "Zadbano o każdy szczegół. Po raz pierwszy poczułam, że to medycyna, a nie sprzedaż.",
      a: "Pacjentka, lat 42",
    },
    {
      q: "Efekt naturalny, nie « zrobiony ». Tego szukałam.",
      a: "Pacjentka, lat 35",
    },
    {
      q: "Konsultacja trwała godzinę. Doceniam taką uważność.",
      a: "Pacjent, lat 51",
    },
  ];
  return (
    <section className="bg-ink py-20 text-alabaster md:py-28">
      <div className="container-luxury">
        <div className="text-xs uppercase tracking-[0.3em] text-champagne">Opinie pacjentów</div>
        <h2 className="mt-4 max-w-3xl font-serif text-alabaster">Słowa, które zostają z nami.</h2>
        <div className="tile-grid mt-12">
          {items.map((it) => (
            <blockquote key={it.q} className="rounded-lg border border-white/10 bg-white/5 p-6">
              <p className="font-serif text-lg leading-relaxed">« {it.q} »</p>
              <footer className="mt-4 text-xs uppercase tracking-[0.25em] text-champagne">{it.a}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookingSection() {
  return (
    <section id="rezerwacja" className="container-luxury py-20 md:py-28">
      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        <div>
          <SectionHeading
            eyebrow="Rezerwacja"
            title="Umówmy konsultację"
            description="Rezerwacja online z natychmiastową płatnością. Po opłaceniu otrzymasz e-mailem formularz wstępnej diagnostyki."
          />
          <dl className="mt-8 space-y-4 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-[0.3em] text-champagne">Adres</dt>
              <dd className="mt-1 text-foreground">Klinika Ginekologii, ul. Branickiego 10, Warszawa (Wilanów)</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.3em] text-champagne">Godziny</dt>
              <dd className="mt-1 text-foreground">pon.–pt. 9:00–20:00 · sob. 9:00–15:00</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.3em] text-champagne">Cena</dt>
              <dd className="mt-1 text-foreground">500 zł — konsultacja online lub w klinice</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-lg border border-border bg-card p-8 md:p-10">
          <h3 className="font-serif text-2xl text-ink">Zarezerwuj termin</h3>
          <p className="mt-3 text-sm text-foreground/75">
            Wybierz formę spotkania, podaj kontakt i opłać rezerwację kartą. Po płatności
            otrzymasz e-mail z linkiem do formularza diagnostycznego.
          </p>
          <Link
            to="/konsultacja"
            className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-ink px-6 text-sm tracking-wide text-alabaster transition hover:bg-ink/90"
          >
            Przejdź do rezerwacji <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
