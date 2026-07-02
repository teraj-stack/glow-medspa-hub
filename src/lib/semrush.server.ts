// Server-only Semrush REST connector.
// Docs: https://developer.semrush.com/api/v3/analytics/basic-docs/
// All calls use the `type=` endpoints and return semicolon-separated CSV.

const SEMRUSH_ENDPOINT = "https://api.semrush.com/";

function apiKey(): string {
  const key = process.env.SEMRUSH_API_KEY;
  if (!key) throw new Error("SEMRUSH_API_KEY not configured");
  return key;
}

async function callSemrush(params: Record<string, string>): Promise<string[][]> {
  const url = new URL(SEMRUSH_ENDPOINT);
  url.searchParams.set("key", apiKey());
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString(), { method: "GET" });
  const text = (await res.text()).trim();
  if (!res.ok) throw new Error(`Semrush HTTP ${res.status}: ${text.slice(0, 200)}`);
  if (text.startsWith("ERROR")) {
    // 50 :: NOTHING FOUND is a valid empty response — return no rows.
    if (/NOTHING FOUND/i.test(text)) return [];
    throw new Error(`Semrush error: ${text}`);
  }
  const lines = text.split(/\r?\n/).filter(Boolean);
  return lines.map((l) => l.split(";"));
}

function num(v: string | undefined): number | null {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export interface DomainOverview {
  rank: number | null;
  organicKeywords: number | null;
  organicTraffic: number | null;
  organicCost: number | null;
}

export async function fetchDomainOverview(domain: string, database = "pl"): Promise<DomainOverview> {
  const rows = await callSemrush({
    type: "domain_ranks",
    domain,
    database,
    export_columns: "Rk,Or,Ot,Oc",
  });
  if (rows.length < 2) {
    return { rank: null, organicKeywords: null, organicTraffic: null, organicCost: null };
  }
  const [, data] = rows;
  return {
    rank: num(data[0]),
    organicKeywords: num(data[1]),
    organicTraffic: num(data[2]),
    organicCost: num(data[3]),
  };
}

export interface OrganicKeyword {
  phrase: string;
  position: number | null;
  previousPosition: number | null;
  searchVolume: number | null;
  cpc: number | null;
  url: string;
  trafficPercent: number | null;
}

export async function fetchDomainOrganic(
  domain: string,
  limit = 25,
  database = "pl",
): Promise<OrganicKeyword[]> {
  const rows = await callSemrush({
    type: "domain_organic",
    domain,
    database,
    display_limit: String(limit),
    export_columns: "Ph,Po,Pp,Nq,Cp,Ur,Tr",
  });
  return rows.slice(1).map((r) => ({
    phrase: r[0] ?? "",
    position: num(r[1]),
    previousPosition: num(r[2]),
    searchVolume: num(r[3]),
    cpc: num(r[4]),
    url: r[5] ?? "",
    trafficPercent: num(r[6]),
  }));
}

export interface Competitor {
  domain: string;
  competitionLevel: number | null;
  commonKeywords: number | null;
  competitorKeywords: number | null;
  competitorTraffic: number | null;
}

export async function fetchCompetitors(
  domain: string,
  limit = 3,
  database = "pl",
): Promise<Competitor[]> {
  const rows = await callSemrush({
    type: "domain_organic_organic",
    domain,
    database,
    display_limit: String(limit),
    export_columns: "Dn,Cr,Np,Or,Ot",
  });
  return rows.slice(1).map((r) => ({
    domain: r[0] ?? "",
    competitionLevel: num(r[1]),
    commonKeywords: num(r[2]),
    competitorKeywords: num(r[3]),
    competitorTraffic: num(r[4]),
  }));
}

export interface KeywordMetric {
  phrase: string;
  volume: number | null;
  cpc: number | null;
  competition: number | null; // 0-1 paid competition
  resultsCount: number | null;
  difficulty: number | null; // 0-100 KD
}

// Batch metrics via phrase_these (Ph,Nq,Cp,Co,Nr) + phrase_kdi (Ph,Kd) merged by phrase.
export async function fetchKeywordMetrics(
  phrases: string[],
  database = "pl",
): Promise<KeywordMetric[]> {
  const cleaned = Array.from(new Set(phrases.map((p) => p.trim().toLowerCase()).filter(Boolean)));
  if (!cleaned.length) return [];
  // Semrush limits phrase_these to ~100 phrases per call.
  const chunks: string[][] = [];
  for (let i = 0; i < cleaned.length; i += 90) chunks.push(cleaned.slice(i, i + 90));

  const byPhrase = new Map<string, KeywordMetric>();
  for (const p of cleaned) {
    byPhrase.set(p, { phrase: p, volume: null, cpc: null, competition: null, resultsCount: null, difficulty: null });
  }

  for (const chunk of chunks) {
    const phraseParam = chunk.join(";");
    const [metricsRows, kdiRows] = await Promise.all([
      callSemrush({
        type: "phrase_these",
        phrase: phraseParam,
        database,
        export_columns: "Ph,Nq,Cp,Co,Nr",
      }).catch(() => [] as string[][]),
      callSemrush({
        type: "phrase_kdi",
        phrase: phraseParam,
        database,
        export_columns: "Ph,Kd",
      }).catch(() => [] as string[][]),
    ]);
    for (const r of metricsRows.slice(1)) {
      const key = (r[0] ?? "").toLowerCase();
      const cur = byPhrase.get(key);
      if (!cur) continue;
      cur.volume = num(r[1]);
      cur.cpc = num(r[2]);
      cur.competition = num(r[3]);
      cur.resultsCount = num(r[4]);
    }
    for (const r of kdiRows.slice(1)) {
      const key = (r[0] ?? "").toLowerCase();
      const cur = byPhrase.get(key);
      if (!cur) continue;
      cur.difficulty = num(r[1]);
    }
  }
  return cleaned.map((p) => byPhrase.get(p)!);
}

export interface SerpEntry {
  position: number | null;
  domain: string;
  url: string;
}

export async function fetchKeywordSerp(
  phrase: string,
  database = "pl",
  limit = 10,
): Promise<SerpEntry[]> {
  const rows = await callSemrush({
    type: "phrase_organic",
    phrase: phrase.trim().toLowerCase(),
    database,
    display_limit: String(limit),
    export_columns: "Dn,Ur,Po",
  });
  return rows.slice(1).map((r) => ({
    domain: r[0] ?? "",
    url: r[1] ?? "",
    position: num(r[2]),
  }));
}
