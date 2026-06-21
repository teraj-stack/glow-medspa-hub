import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { TechCard } from "@/components/site/TechCard";
import { BookingForm } from "@/components/site/BookingForm";
import { TECHNOLOGIES } from "@/data/technologies";
import { Sparkles, Shield, HeartHandshake, ArrowRight } from "lucide-react";
import bujokAsset from "@/assets/bujok.jpeg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Beauty & Mind Clinic — Medycyna estetyczna i laserowa | Siedlce" },
      {
        name: "description",
        content:
          "Klinika medycyny estetycznej i laserowej w Siedlcach. Dyskretne protokoły, sprawdzone technologie, naturalny efekt. Umów konsultację.",
      },
      { property: "og:title", content: "Beauty & Mind Clinic — Siedlce" },
      { property: "og:description", content: "Naturalny efekt. Dyskretna pamięć." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <ManifestSection />
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
          <div className="text-xs uppercase tracking-[0.3em] text-champagne">Beauty &amp; Mind Clinic · Siedlce</div>
          <h1 className="mt-6 font-serif text-ink">
            Piękno nie potrzebuje hałasu. Potrzebuje{" "}
            <span className="bg-gradient-to-r from-champagne-light via-gold to-champagne bg-clip-text text-transparent">
              zrozumienia
            </span>
            .
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            W mojej pracowni medycyna staje się sztuką proporcji,&nbsp;<br />
            a technologia służy naturze. Poznaj autorskie protokoły&nbsp;<br />
            zabiegowe skrojone pod Twoją anatomię.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/"
              hash="rezerwacja"
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
          <img
            src={bujokAsset.url}
            alt="Lekarz Beauty & Mind Clinic w gabinecie"
            width={1200}
            height={1500}
            loading="eager"
            className="aspect-[4/5] w-full rounded-lg object-cover shadow-elegant"
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
            Jestem twórcą „MySkinCode” — aplikacji AI, w której każda technologia jest dobierana jak nuta w kompozycji, 
            a nie jak produkt z katalogu. Aplikacja "MySkinCode" to jedno z wielu narzędzi, które zbudowałem, by ta opieka była spójna, 
            bezpieczna i osobista od pierwszego wdrożenia.
          </p>
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
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Rezerwacja"
            title="Umówmy konsultację"
            description="Zostawcie Państwo kontakt — oddzwonimy w godzinach pracy kliniki, aby ustalić dogodny termin."
          />
          <dl className="mt-8 space-y-4 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-[0.3em] text-champagne">Adres</dt>
              <dd className="mt-1 text-foreground">Siedlce, woj. mazowieckie</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.3em] text-champagne">Godziny</dt>
              <dd className="mt-1 text-foreground">pon.–pt. 9:00–20:00 · sob. 9:00–15:00</dd>
            </div>
          </dl>
        </div>
        <BookingForm />
      </div>
    </section>
  );
}
