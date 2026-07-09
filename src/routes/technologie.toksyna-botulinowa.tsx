import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getTechnology, type Technology } from "@/data/technologies";
import { TechnologyDetail } from "@/components/site/TechnologyDetail";
import { withOgVersion } from "@/config/social-preview";
import ogCard from "@/assets/og/index.jpg";

const SLUG = "toksyna-botulinowa";
const PAGE_URL = `https://bmclinics.ai/technologie/${SLUG}`;

const TITLE =
  "Toksyna botulinowa Warszawa — neuromodulacja mimiczna (Wilanów) | BMClinics.ai";

const DESCRIPTION =
  "Toksyna botulinowa w Warszawie (Wilanów, klinika ginekologii): precyzyjna neuromodulacja mięśni mimicznych, wygładzenie zmarszczek dynamicznych, korekta asymetrii, bruksizm i hiperhydroza. Cena od 700 zł, konsultacja 200 zł. Naturalny efekt bez maski.";

const OG_TITLE =
  "Toksyna botulinowa Warszawa — neuromodulacja mimiczna | BMClinics.ai";

const OG_DESCRIPTION =
  "Neuromodulacja mimiczna toksyną botulinową typu A — zmarszczki dynamiczne, bruksizm, hiperhydroza. Warszawa (Wilanów, klinika ginekologii). Konsultacja od 200 zł.";

export const Route = createFileRoute("/technologie/toksyna-botulinowa")({
  loader: (): { tech: Technology } => {
    const tech = getTechnology(SLUG);
    if (!tech) throw notFound();
    return { tech };
  },
  head: ({ loaderData }) => {
    const ogImage = withOgVersion(`https://bmclinics.ai${ogCard}`);

    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "MedicalTherapy",
      name: "Toksyna botulinowa — neuromodulacja mimiczna",
      alternateName: [
        "Toksyna botulinowa typu A",
        "Neuromodulacja mimiczna",
        "Botoks (medyczna neuromodulacja)",
      ],
      description: OG_DESCRIPTION,
      url: PAGE_URL,
      medicineSystem: "https://schema.org/WesternConventional",
      relevantSpecialty: {
        "@type": "MedicalSpecialty",
        name: "Aesthetic Medicine",
      },
      provider: {
        "@type": "MedicalBusiness",
        name: "BMClinics.ai",
        url: "https://bmclinics.ai",
        address: {
          "@type": "PostalAddress",
          streetAddress: "ul. Branickiego 10 (Klinika Ginekologii)",
          addressLocality: "Warszawa",
          postalCode: "02-972",
          addressRegion: "mazowieckie",
          addressCountry: "PL",
        },
      },
      indication: loaderData?.tech.indications ?? [],
      offers: {
        "@type": "Offer",
        priceCurrency: "PLN",
        price: 700,
        url: PAGE_URL,
        availability: "https://schema.org/InStock",
      },
    };

    const faqSchema = loaderData && loaderData.tech.faq.length > 0
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

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Strona główna", item: "https://bmclinics.ai/" },
        { "@type": "ListItem", position: 2, name: "Technologie", item: "https://bmclinics.ai/technologie" },
        { "@type": "ListItem", position: 3, name: "Toksyna botulinowa", item: PAGE_URL },
      ],
    };

    const scripts: Array<{ type: string; children: string }> = [
      { type: "application/ld+json", children: JSON.stringify(serviceSchema) },
      { type: "application/ld+json", children: JSON.stringify(breadcrumbSchema) },
    ];
    if (faqSchema) scripts.push({ type: "application/ld+json", children: JSON.stringify(faqSchema) });

    return {
      meta: [
        { title: TITLE },
        { name: "description", content: DESCRIPTION },
        { name: "keywords", content: "toksyna botulinowa warszawa, botoks warszawa, neuromodulacja mimiczna, zmarszczki dynamiczne, bruksizm, hiperhydroza, medycyna estetyczna wilanów" },
        { property: "og:title", content: OG_TITLE },
        { property: "og:description", content: OG_DESCRIPTION },
        { property: "og:url", content: PAGE_URL },
        { property: "og:type", content: "article" },
        { property: "og:locale", content: "pl_PL" },
        { property: "og:site_name", content: "BMClinics.ai" },
        { property: "og:image", content: ogImage },
        { property: "og:image:alt", content: "Toksyna botulinowa — neuromodulacja mimiczna w BMClinics.ai (Warszawa, Wilanów)" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: OG_TITLE },
        { name: "twitter:description", content: OG_DESCRIPTION },
        { name: "twitter:image", content: withOgVersion(`https://bmclinics.ai${ogCard}`) },
        { name: "geo.region", content: "PL-MZ" },
        { name: "geo.placename", content: "Warszawa" },
        { name: "geo.position", content: "52.15515;21.09006" },
        { name: "ICBM", content: "52.15515, 21.09006" },
      ],
      links: [{ rel: "canonical", href: PAGE_URL }],
      scripts,
    };
  },
  component: ToksynaBotulinowaRoute,
  notFoundComponent: () => (
    <div className="container-luxury py-24 text-center">
      <h1 className="font-serif text-3xl">Technologia nie istnieje</h1>
      <Link to="/technologie" className="mt-6 inline-block text-sm underline">Wróć do katalogu</Link>
    </div>
  ),
});

function ToksynaBotulinowaRoute() {
  const { tech } = Route.useLoaderData() as { tech: Technology };
  return <TechnologyDetail tech={tech} />;
}
