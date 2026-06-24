import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getDoctorBySlug } from "@/lib/doctors.functions";
import bujokAsset from "@/assets/bujok.jpeg.asset.json";
import bujokAvif from "@/assets/bujok.avif.asset.json";
import bujokWebp from "@/assets/bujok.webp.asset.json";
import { ArrowRight, ExternalLink } from "lucide-react";

const CANONICAL = "https://bmclinics.ai/lekarze/jan-bujok";

export const Route = createFileRoute("/lekarze/jan-bujok")({
  head: () => ({
    meta: [
      { title: "dr Jan Bujok — Innowator i Ekspert MedTech" },
      {
        name: "description",
        content:
          "dr Jan Bujok — chirurg, twórca platformy MySkinCode i marki Bujok Medical. Autorskie protokoły medycyny estetycznej i regeneracyjnej w BMClinics.ai Siedlce.",
      },
      { property: "og:title", content: "dr Jan Bujok — Innowator i Ekspert MedTech" },
      {
        property: "og:description",
        content:
          "Twórca MySkinCode, Mazowieckiego Centrum Medycyny Laserowej i Bujok Medical. Łączy chirurgię z zaawansowaną inżynierią biomedyczną.",
      },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: CANONICAL },
      { property: "og:image", content: bujokAsset.url },
      { name: "twitter:title", content: "dr Jan Bujok — Innowator i Ekspert MedTech" },
      { name: "twitter:description", content: "Twórca MySkinCode i Bujok Medical. Autorskie protokoły medycyny estetycznej i regeneracyjnej." },
      { name: "twitter:image", content: bujokAsset.url },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Physician",
          name: "dr Jan Bujok",
          medicalSpecialty: "Aesthetic Medicine",
          worksFor: {
            "@type": "MedicalClinic",
            name: "BMClinics.ai",
            address: { "@type": "PostalAddress", addressLocality: "Siedlce", addressCountry: "PL" },
          },
          url: CANONICAL,
          image: bujokAsset.url,
        }),
      },
    ],
  }),
  component: JanBujokPage,
});

const TECHNOLOGIES = [
  "Zaawansowane platformy laserowe Bujok Medical (laser pikosekundowy 350 ps działający w domenie fotoakustycznej, laser tulowo-erbowy Er:Glass oraz laser Nd:YAG long pulse z dedykowanymi programami anti-aging w domenie submilisekundowej 0,1 ms)",
  "Fuzję zimnej i ciepłej plazmy atmosferycznej (CAP)",
  "Trójwymiarową stymulację falami akustycznymi (HIFU oraz LipoHIFU)",
  "Frakcyjną radiofrekwencję (RF) mikroigłową",
  "Selektywną fototerapię, fotobiomodulację oraz systemy DPL",
  "Głęboką stymulację struktur powięziowych polem magnetycznym",
];

const ECOSYSTEM_LINKS = [
  { label: "System diagnostyczny AI", url: "https://myskincode.ai", domain: "myskincode.ai" },
  { label: "Pracownia medyczna", url: "https://bmclinics.ai", domain: "bmclinics.ai" },
];

function JanBujokPage() {
  const fetchDoctor = useServerFn(getDoctorBySlug);
  const { data: doctor } = useQuery({
    queryKey: ["doctor", "jan-bujok"],
    queryFn: () => fetchDoctor({ data: { slug: "jan-bujok" } }),
    staleTime: 60_000,
  });

  const professionalTitle = doctor?.professional_title?.trim() || "chirurg · innowator MedTech";

  return (
    <main className="bg-background">
      {/* Hero */}
      <section className="container-luxury pt-16 pb-12 md:pt-24 md:pb-20 lg:pt-28 lg:pb-24">
        <nav aria-label="Okruszki" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Link to="/lekarze" className="transition-colors hover:text-foreground">
            Zespół kliniki
          </Link>
          <span aria-hidden className="mx-2">/</span>
          <span className="text-foreground/70">dr Jan Bujok</span>
        </nav>

        <div className="mt-10 grid gap-10 md:mt-12 md:grid-cols-[1fr,auto] md:items-center md:gap-12 lg:gap-16">
          <div className="min-w-0 order-2 md:order-1">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Innowator i Ekspert MedTech</p>
            <h1 className="mt-4 font-serif text-4xl tracking-tight text-foreground md:mt-5 md:text-5xl">
              Jan Bujok
            </h1>
            <p className="mt-4 text-sm text-muted-foreground md:mt-5">{professionalTitle}</p>
            <p className="mt-8 max-w-2xl text-balance text-base leading-relaxed text-foreground/85 md:mt-10 md:text-lg">
              Jestem chirurgiem i twórcą technologicznym, którego pasją jest projektowanie nowoczesnych rozwiązań
              dla medycyny estetycznej i regeneracyjnej. Moja działalność opiera się na bezkompromisowym łączeniu
              kunsztu operacyjnego z zaawansowaną inżynierią biomedyczną.
            </p>
          </div>
          <figure className="order-1 md:order-2 flex justify-center md:justify-end">
            <picture>
              <source srcSet={bujokAvif.url} type="image/avif" />
              <source srcSet={bujokWebp.url} type="image/webp" />
              <img
                src={bujokAsset.url}
                alt="dr Jan Bujok — portret"
                className="h-auto max-h-[320px] w-auto max-w-[280px] rounded-lg object-cover shadow-sm md:max-h-[380px] md:max-w-[340px]"
                loading="eager"
              />
            </picture>
          </figure>
        </div>
      </section>

      {/* Innowator / Ekspert */}
      <section className="border-t border-border/60 bg-card/40">
        <div className="container-luxury py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-[1fr,2fr] md:gap-16">
            <h2 className="font-serif text-2xl tracking-tight text-foreground md:text-3xl">
              Innowator i Ekspert MedTech
            </h2>
            <div className="space-y-5 text-base leading-relaxed text-foreground/85">
              <p>
                Jestem chirurgiem i twórcą technologicznym, którego pasją jest projektowanie nowoczesnych rozwiązań
                dla medycyny estetycznej i regeneracyjnej. Moja działalność opiera się na bezkompromisowym łączeniu
                kunsztu operacyjnego z zaawansowaną inżynierią biomedyczną.
              </p>
              <p>
                Twórca platformy MySkinCode – zaawansowanego systemu SaaS wykorzystującego autorski silnik sztucznej
                inteligencji (AI engine) do tworzenia spersonalizowanych, wielotechnologicznych protokołów zabiegowych,
                dedykowanych nowoczesnym centrom estetycznym hi-tech.
              </p>
              <p>
                Inicjator projektu Mazowieckie Centrum Medycyny Laserowej – autorskiej koncepcji, która redefiniuje
                standardy wczesnej opieki pooperacyjnej i prehabilitacji tkankowej.
              </p>
              <p>
                Twórca i dystrybutor marki Bujok Medical – autorskiej linii certyfikowanych urządzeń medycznych i
                platform zabiegowych hi-tech.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technologie i protokoły */}
      <section className="container-luxury py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-[1fr,2fr] md:gap-16">
          <h2 className="font-serif text-2xl tracking-tight text-foreground md:text-3xl">
            Technologie i Autorskie Protokoły
          </h2>
          <div className="space-y-5 text-base leading-relaxed text-foreground/85">
            <p>
              W codziennej praktyce klinicznej odrzucam powtarzalne, schematyczne podejście. Projektuję złożone
              terapie rewitalizujące i opóźniające procesy starzenia (anti-aging / longevity), opierając się na
              unikalnej synergii najskuteczniejszych fizykalnych bodźców komórkowych. Moje autorskie protokoły
              terapeutyczne łączą:
            </p>
            <ul className="grid gap-x-10 gap-y-4">
              {TECHNOLOGIES.map((t) => (
                <li key={t} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground/40" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Cytat */}
      <section className="border-t border-border/60 bg-ink py-20 text-alabaster md:py-28">
        <div className="container-luxury max-w-4xl text-center">
          <blockquote>
            <p className="font-serif text-2xl leading-relaxed md:text-3xl">
              „Najwyższej klasy technologia zyskuje medyczną wartość dopiero wtedy, gdy połączymy ją z empatią,
              bezpieczeństwem i partnerską relacją z pacjentem”
            </p>
            <footer className="mt-6 text-xs uppercase tracking-[0.25em] text-champagne">— dr Jan Bujok</footer>
          </blockquote>
        </div>
      </section>

      {/* Ekosystem / CTA */}
      <section className="container-luxury py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Ekosystem innowacji</p>
          <h2 className="mt-4 font-serif text-3xl tracking-tight text-foreground md:text-4xl">
            Poznaj ekosystem innowacji i zarezerwuj osobistą konsultację
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {ECOSYSTEM_LINKS.map((link) => (
              <a
                key={link.domain}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-lg border border-border bg-card p-5 transition hover:shadow-md"
              >
                <div className="text-left">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{link.label}</p>
                  <p className="mt-1 font-medium text-foreground">{link.domain}</p>
                </div>
                <ExternalLink className="size-4 text-muted-foreground transition group-hover:text-foreground" />
              </a>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/konsultacja"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-ink px-8 text-sm tracking-wide text-alabaster transition hover:bg-ink/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne"
            >
              Umów konsultację <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/lekarze"
              className="inline-flex h-12 items-center justify-center rounded-md border border-border px-8 text-sm tracking-wide text-foreground transition hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne"
            >
              Wróć do zespołu
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
