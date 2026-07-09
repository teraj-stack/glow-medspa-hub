import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getTechnology, type Technology } from "@/data/technologies";
import { TechnologyDetail } from "@/components/site/TechnologyDetail";
import { withOgVersion } from "@/config/social-preview";
import ogCard from "@/assets/og/index.jpg";

export const Route = createFileRoute("/technologie/$slug")({
  loader: ({ params }): { tech: Technology } => {
    const tech = getTechnology(params.slug);
    if (!tech) throw notFound();
    return { tech };
  },
  head: ({ loaderData, params }) => {
    const serviceSchema = loaderData
      ? {
          "@context": "https://schema.org",
          "@type": "MedicalTherapy",
          name: loaderData.tech.name,
          description: loaderData.tech.shortDesc,
          url: `https://bmclinics.ai/technologie/${params.slug}`,
          provider: {
            "@type": "MedicalBusiness",
            name: "BMClinics.ai",
            url: "https://bmclinics.ai",
          },
          indication: loaderData.tech.indications,
        }
      : undefined;

    const faqSchema =
      loaderData && loaderData.tech.faq && loaderData.tech.faq.length > 0
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

    const ogImage = withOgVersion(`https://bmclinics.ai${ogCard}`);
    return {
      meta: loaderData
        ? [
            { title: `${loaderData.tech.name} — BMClinics.ai` },
            { name: "description", content: loaderData.tech.shortDesc },
            { property: "og:title", content: `${loaderData.tech.name} — BMClinics.ai` },
            { property: "og:description", content: loaderData.tech.shortDesc },
            { property: "og:url", content: `https://bmclinics.ai/technologie/${params.slug}` },
            { property: "og:image", content: ogImage },
            { name: "twitter:card", content: "summary_large_image" },
            { name: "twitter:title", content: `${loaderData.tech.name} — BMClinics.ai` },
            { name: "twitter:description", content: loaderData.tech.shortDesc },
            { name: "twitter:image", content: ogImage },
          ]
        : [
            { title: "Technologia — BMClinics.ai" },
            { name: "twitter:image", content: ogImage },
          ],
      links: [{ rel: "canonical", href: `https://bmclinics.ai/technologie/${params.slug}` }],
      scripts: scripts.length > 0 ? scripts : undefined,
    };
  },
  component: TechnologyDetailRoute,
  notFoundComponent: () => (
    <div className="container-luxury py-24 text-center">
      <h1 className="font-serif text-3xl">Technologia nie istnieje</h1>
      <Link to="/technologie" className="mt-6 inline-block text-sm underline">Wróć do katalogu</Link>
    </div>
  ),
});

function TechnologyDetailRoute() {
  const { tech } = Route.useLoaderData() as { tech: Technology };
  return <TechnologyDetail tech={tech} />;
}
