import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

import type { TemplateEntry } from "./registry";

interface SeoKeyword {
  phrase: string;
  position?: number | null;
  previous_position?: number | null;
  search_volume?: number | null;
  url?: string | null;
}

interface SeoCompetitor {
  competitor_domain: string;
  competitor_keywords?: number | null;
  common_keywords?: number | null;
}

export interface SeoDailyReportProps {
  domain?: string;
  capturedAt?: string;
  organicKeywords?: number | null;
  organicTraffic?: number | null;
  organicCost?: number | null;
  keywords?: SeoKeyword[];
  competitors?: SeoCompetitor[];
  gapKeywordsCount?: number;
  reportUrl?: string;
  error?: string | null;
}

const main = { backgroundColor: "#ffffff", fontFamily: "Inter, Arial, sans-serif" };
const container = { padding: "40px 32px", maxWidth: "620px", margin: "0 auto" };
const heading = {
  fontSize: "24px",
  fontWeight: 600,
  color: "#0a0a0a",
  margin: "0 0 8px",
  fontFamily: '"Cormorant Garamond", "Times New Roman", serif',
};
const subHeading = {
  fontSize: "13px",
  color: "#999",
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  margin: "0 0 24px",
};
const sectionTitle = {
  fontSize: "13px",
  fontWeight: 600,
  color: "#0a0a0a",
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  margin: "24px 0 12px",
};
const kpi = {
  display: "inline-block",
  width: "33%",
  padding: "8px 0",
  verticalAlign: "top" as const,
};
const kpiValue = { fontSize: "22px", fontWeight: 600, color: "#0a0a0a", margin: 0 };
const kpiLabel = { fontSize: "11px", color: "#888", textTransform: "uppercase" as const, letterSpacing: "0.06em", margin: "4px 0 0" };
const row = { fontSize: "13px", color: "#444", lineHeight: "1.55", margin: "0 0 6px" };
const link = { color: "#bda38f", textDecoration: "underline" };
const footer = { fontSize: "11px", color: "#999", margin: "24px 0 0", lineHeight: 1.5 };
const errorBox = { fontSize: "13px", color: "#8a2f2f", background: "#fdecec", padding: "10px 12px", borderRadius: "4px", margin: "8px 0 16px" };

function trend(pos?: number | null, prev?: number | null): string {
  if (pos == null) return "—";
  if (prev == null) return `#${pos}`;
  const diff = prev - pos;
  if (!diff) return `#${pos}`;
  return `#${pos} (${diff > 0 ? "↑" : "↓"}${Math.abs(diff)})`;
}

export const SeoDailyReport = ({
  domain = "bmclinics.ai",
  capturedAt,
  organicKeywords,
  organicTraffic,
  organicCost,
  keywords = [],
  competitors = [],
  gapKeywordsCount = 0,
  reportUrl = "https://bmclinics.ai/admin/seo/raporty",
  error = null,
}: SeoDailyReportProps) => {
  const dateLabel = capturedAt
    ? new Date(capturedAt).toLocaleDateString("pl-PL", { day: "2-digit", month: "long", year: "numeric" })
    : "";
  return (
    <Html lang="pl" dir="ltr">
      <Head />
      <Preview>Migawka SEO {domain} — {dateLabel}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={subHeading}>Raport SEO · {dateLabel}</Text>
          <Heading style={heading}>Migawka widoczności {domain}</Heading>

          {error ? <Text style={errorBox}>Uwaga: {error}</Text> : null}

          <Section>
            <div style={kpi}>
              <Text style={kpiValue}>{organicKeywords ?? "—"}</Text>
              <Text style={kpiLabel}>Frazy w TOP 100</Text>
            </div>
            <div style={kpi}>
              <Text style={kpiValue}>{organicTraffic ?? "—"}</Text>
              <Text style={kpiLabel}>Prognozowany ruch / mc</Text>
            </div>
            <div style={kpi}>
              <Text style={kpiValue}>{organicCost != null ? `$${organicCost}` : "—"}</Text>
              <Text style={kpiLabel}>Wartość ruchu</Text>
            </div>
          </Section>

          <Hr />

          <Text style={sectionTitle}>Top frazy</Text>
          {keywords.length === 0 ? (
            <Text style={row}>Brak rankujących fraz w bazie na dziś.</Text>
          ) : (
            keywords.slice(0, 10).map((k) => (
              <Text key={k.phrase} style={row}>
                <strong>{trend(k.position, k.previous_position)}</strong> — {k.phrase}
                {k.search_volume ? ` · ${k.search_volume}/mc` : ""}
              </Text>
            ))
          )}

          <Text style={sectionTitle}>Konkurencja</Text>
          {competitors.length === 0 ? (
            <Text style={row}>Brak danych o konkurencji.</Text>
          ) : (
            competitors.map((c) => (
              <Text key={c.competitor_domain} style={row}>
                {c.competitor_domain}
                {c.competitor_keywords ? ` · ${c.competitor_keywords} fraz` : ""}
                {c.common_keywords ? ` · wspólnych ${c.common_keywords}` : ""}
              </Text>
            ))
          )}

          <Text style={sectionTitle}>Luki słów kluczowych</Text>
          <Text style={row}>
            Zidentyfikowano <strong>{gapKeywordsCount}</strong> fraz konkurencji, na które
            {" "}{domain} jeszcze nie ranguje.
          </Text>

          <Hr />

          <Text style={row}>
            <Link href={reportUrl} style={link}>Zobacz pełny raport w panelu →</Link>
          </Text>

          <Text style={footer}>
            Wiadomość wysłana automatycznie przez cron SEO BMClinics.ai. Ustawienia i historię
            migawek znajdziesz w panelu administracyjnym.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export const template = {
  component: SeoDailyReport,
  subject: (d: Record<string, any>) =>
    `Raport SEO ${d.domain ?? "bmclinics.ai"} — ${
      d.capturedAt
        ? new Date(d.capturedAt).toLocaleDateString("pl-PL")
        : new Date().toLocaleDateString("pl-PL")
    }`,
  displayName: "Dzienny raport SEO",
  previewData: {
    domain: "bmclinics.ai",
    capturedAt: new Date().toISOString(),
    organicKeywords: 12,
    organicTraffic: 42,
    organicCost: 3.5,
    keywords: [
      { phrase: "medycyna estetyczna warszawa", position: 18, previous_position: 22, search_volume: 1400 },
      { phrase: "diagnostyka skóry warszawa", position: 34, previous_position: null, search_volume: 260 },
    ],
    competitors: [
      { competitor_domain: "estclinic.pl", competitor_keywords: 512, common_keywords: 9 },
    ],
    gapKeywordsCount: 21,
  },
} satisfies TemplateEntry;
