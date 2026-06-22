import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { BookingForm } from "@/components/site/BookingForm";
import { getTechnology, type Technology } from "@/data/technologies";
import { formatCena } from "@/lib/format";
import {
  ArrowLeft,
  Check,
  Sparkles,
  ShieldCheck,
  Clock,
  Droplet,
  Sun,
  Target,
  Calendar,
  HeartPulse,
} from "lucide-react";
import heroAsset from "@/assets/tulowy-hero.jpg.asset.json";
import mechanizmAsset from "@/assets/tulowy-mechanizm.png.asset.json";
import rezultatAsset from "@/assets/tulowy-rezultat.jpg.asset.json";

const TECH_SLUG = "laser-tulowy";
const PAGE_URL = "https://bmclinics.ai/technologie/laser-tulowy";

export const Route = createFileRoute("/technologie/laser-tulowy")({
  loader: (): { tech: Technology } => {
    const tech = getTechnology(TECH_SLUG);
    if (!tech) throw new Error("Laser tulowy — brak wpisu w bazie");
    return { tech };
  },
  head: () => {
    const title =
      "Laser tulowo-erbowy (Thulium/Erbium Glass) 1927 nm + 1550 nm — melasma, przebarwienia, rewitalizacja | Beauty & Mind Clinic Siedlce";
    const description =
      "Laser tulowo-erbowy, czyli hybryda lasera tulowego 1927 nm i lasera erbowego (szkło erbowe, Erbium Glass) 1550 nm — złoty standard w leczeniu melasmy, przebarwień posłonecznych i fotostarzenia. Standard premium klinik warszawskich w Siedlcach.";

    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "MedicalTherapy",
      name: "Laser tulowo-erbowy (Thulium/Erbium Glass) 1927 nm + 1550 nm — rewitalizacja i depigmentacja",
      description,
      url: PAGE_URL,
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
      indication: [
        "melasma",
        "przebarwienia posłoneczne",
        "fotostarzenie",
        "drobne zmarszczki",
        "nierówna tekstura skóry",
        "rozszerzone pory",
      ],
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Czym różni się laser tulowo-erbowy 1927 nm od lasera frakcyjnego CO₂?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Laser tulowo-erbowy (hybryda Thulium/Erbium Glass) jest nieablacyjny — nie narusza warstwy rogowej naskórka. Działa do 0,3 mm wgłąb, idealnie celując w warstwę, w której powstają przebarwienia. CO₂ jest ablacyjny, działa głębiej, daje silniejszą przebudowę kolagenu, ale wiąże się z tygodniową rekonwalescencją i większym ryzykiem powikłań pigmentacyjnych.",
          },
        },
        {
          "@type": "Question",
          name: "Czy zabieg jest bezpieczny dla osób z melasmą?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Tak — laser tulowy 1927 nm jest obecnie najbezpieczniejszą opcją laserową dla melasmy. Działa dokładnie w okolicy uszkodzonej błony podstawnej (~0,3 mm), nie pobudzając tyrozynazy w głębszych warstwach. W przeciwieństwie do laserów ablacyjnych nie wywołuje typowo pozapalnej hiperpigmentacji (PIH).",
          },
        },
        {
          "@type": "Question",
          name: "Ile sesji jest potrzebnych?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Dla rewitalizacji: 1–2 sesje rocznie. Dla melasmy i opornych przebarwień: seria 3–4 sesji co 4–6 tygodni, a następnie 1 sesja podtrzymująca co 6 miesięcy.",
          },
        },
        {
          "@type": "Question",
          name: "Jak wygląda rekonwalescencja?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Dzień 0–1: rumień i uczucie pieczenia, łagodny obrzęk. Dni 2–3: skóra przypomina „papier ścierny”, pojawiają się mikrobrązowe punkty (efekt MEND). Dni 4–7: punkty samoistnie odpadają, odsłaniając rozjaśnioną, gładką skórę. Pełna rekonwalescencja — 7 dni.",
          },
        },
        {
          "@type": "Question",
          name: "Czy mogę wykonać zabieg latem?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Najlepszy sezon to jesień–wiosna. Latem zabieg jest możliwy pod warunkiem bezwzględnej fotoprotekcji SPF 50+ (reaplikacja co 2 godziny) i unikania bezpośredniego słońca przez minimum 4 tygodnie. Przy aktywnej opaleniźnie odraczamy termin.",
          },
        },
        {
          "@type": "Question",
          name: "Czy laser tulowy nadaje się dla ciemnych fototypów (IV–VI)?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Tak — 1927 nm ma najwyższą absorpcję w wodzie i najniższą w melaninie ze wszystkich laserów tej klasy. To czyni go najbezpieczniejszą długością fali dla skóry typu IV–VI, gdzie inne lasery często powodują przebarwienia pozapalne.",
          },
        },
        {
          "@type": "Question",
          name: "Ile kosztuje zabieg w Siedlcach?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Pojedyncza sesja twarzy: 1750 zł. Pakiet 3 sesji twarzy: 4600 zł (ok. 15% taniej). Combo twarz + szyja + dekolt: 4000 zł. To cennik klinik warszawskich — bez konieczności dojazdu do Warszawy.",
          },
        },
      ],
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Strona główna", item: "https://bmclinics.ai/" },
        { "@type": "ListItem", position: 2, name: "Technologie", item: "https://bmclinics.ai/technologie" },
        { "@type": "ListItem", position: 3, name: "Laser tulowo-erbowy (Thulium/Erbium Glass) 1927/1550 nm", item: PAGE_URL },
      ],
    };

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: PAGE_URL },
        { property: "og:type", content: "article" },
        { property: "og:image", content: heroAsset.url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: heroAsset.url },
      ],
      links: [{ rel: "canonical", href: PAGE_URL }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(serviceSchema) },
        { type: "application/ld+json", children: JSON.stringify(faqSchema) },
        { type: "application/ld+json", children: JSON.stringify(breadcrumbSchema) },
      ],
    };
  },
  component: LaserTulowyPage,
});

function LaserTulowyPage() {
  const { tech } = Route.useLoaderData() as { tech: Technology };
  return <article className="bg-background"><h1>{tech.name}</h1></article>;
}
