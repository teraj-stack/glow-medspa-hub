import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { fetchKeywordMetrics, fetchKeywordSerp, type KeywordMetric } from "@/lib/semrush.server";

async function requireAdminOrManager(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .in("role", ["admin", "moderator"]);
  if (!data?.length) throw new Error("Brak uprawnień");
}

export const researchKeywords = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    z.object({
      phrases: z.array(z.string().trim().min(1).max(120)).min(1).max(50),
      database: z.string().min(2).max(5).default("pl"),
      appendLocation: z.string().trim().max(40).optional(),
      label: z.string().trim().max(120).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    await requireAdminOrManager(context.userId);
    const suffix = data.appendLocation ? ` ${data.appendLocation.toLowerCase().trim()}` : "";
    const finalPhrases = data.phrases.map((p) => `${p.toLowerCase().trim()}${suffix}`);
    const metrics = await fetchKeywordMetrics(finalPhrases, data.database);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: saved, error } = await supabaseAdmin
      .from("seo_keyword_research_reports")
      .insert({
        created_by: context.userId,
        triggered_by: "manual",
        database: data.database,
        append_location: data.appendLocation || null,
        phrase_count: metrics.length,
        label: data.label ?? null,
        rows: metrics as unknown as any,
      })
      .select("id, created_at")
      .single();
    if (error) throw new Error(error.message);

    return {
      id: saved.id,
      createdAt: saved.created_at,
      database: data.database,
      appendLocation: data.appendLocation || null,
      label: data.label ?? null,
      rows: metrics,
    };
  });

export const researchKeywordSerp = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    z.object({
      phrase: z.string().trim().min(1).max(160),
      database: z.string().min(2).max(5).default("pl"),
    }),
  )
  .handler(async ({ data, context }) => {
    await requireAdminOrManager(context.userId);
    const serp = await fetchKeywordSerp(data.phrase, data.database, 10);
    return { phrase: data.phrase, database: data.database, results: serp };
  });

export const listKeywordResearchReports = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    z.object({
      from: z.string().datetime().optional(),
      to: z.string().datetime().optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    await requireAdminOrManager(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let q = supabaseAdmin
      .from("seo_keyword_research_reports")
      .select("id, created_at, triggered_by, database, append_location, phrase_count, label")
      .order("created_at", { ascending: false })
      .limit(200);
    if (data.from) q = q.gte("created_at", data.from);
    if (data.to) q = q.lte("created_at", data.to);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return { rows: rows ?? [] };
  });

export const getKeywordResearchReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    await requireAdminOrManager(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("seo_keyword_research_reports")
      .select("id, created_at, database, append_location, label, rows")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("Raport nie znaleziony");
    return {
      id: row.id,
      createdAt: row.created_at,
      database: row.database,
      appendLocation: row.append_location,
      label: row.label,
      rows: (row.rows ?? []) as unknown as KeywordMetric[],
    };
  });

export const deleteKeywordResearchReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    await requireAdminOrManager(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("seo_keyword_research_reports")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export type ContentCluster = {
  cluster: string;
  intent: "informacyjny" | "komercyjny" | "lokalny" | "porównawczy";
  pillarTitle: string;
  pillarSlug: string;
  pillarMetaTitle: string;
  pillarMetaDescription: string;
  pillarOutline: string[];
  targetService: string;
  supportingArticles: {
    title: string;
    slug: string;
    primaryKeyword: string;
    supportingKeywords: string[];
    angle: string;
    estimatedVolume: number | null;
    estimatedKd: number | null;
    metaTitle: string;
    metaDescription: string;
    outline: string[];
  }[];
  internalLinking: string;
  cta: string;
};

const CLINIC_SERVICES = [
  "diagnostyka skóry (analiza kamerowa)",
  "laser pikosekundowy (przebarwienia, melasma, blizny)",
  "laser tulowy 1927 nm (melasma, przebarwienia powierzchowne)",
  "laser frakcyjny CO2 (rewitalizacja, blizny potrądzikowe)",
  "mezoterapia igłowa i bezigłowa",
  "biostymulatory kolagenu",
  "lifting bez skalpela (HIFU / RF mikroigłowe)",
  "toksyna botulinowa i wolumetria kwasem hialuronowym",
  "planowanie leczenia AI (MySkinCode)",
];

export const generateContentClusters = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ reportId: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    await requireAdminOrManager(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("seo_keyword_research_reports")
      .select("id, database, append_location, label, rows")
      .eq("id", data.reportId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("Raport nie znaleziony");

    const metrics = (row.rows ?? []) as unknown as KeywordMetric[];
    const compact = metrics
      .map((m) => ({
        phrase: m.phrase,
        volume: m.volume,
        kd: m.difficulty,
        cpc: m.cpc,
      }))
      .sort((a, b) => (b.volume ?? 0) - (a.volume ?? 0))
      .slice(0, 80);

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Brak LOVABLE_API_KEY");

    const system = `Jesteś strategiem SEO dla warszawskiej kliniki medycyny estetycznej. Grupujesz frazy w klastry contentowe (pillar + wspierające). Reguły:
- NIE używaj nazw handlowych urządzeń (np. PicoKing, PicoSure, Fraxel). Używaj tylko ogólnych nazw technologii (laser pikosekundowy, laser tulowy 1927 nm, laser frakcyjny CO2).
- Klinika: BMClinics, Warszawa, ul. Branickiego 10 (klinika ginekologii). NIE wspominaj Siedlec, chyba że fraza wprost tego dotyczy.
- Tytuły artykułów: konkretne, do 60 znaków, bez clickbaitu, po polsku.
- Preferuj klastry pod realne usługi kliniki (podane niżej).
- Grupuj frazy synonimiczne i pochodne w JEDEN artykuł zamiast osobnych.
- Pomiń frazy o wolumenie <20/mies., chyba że dobrze pasują do klastra jako uzupełnienie.
- Dla KAŻDEGO artykułu (pillar i wspierające) wygeneruj brief:
  - metaTitle: <=60 znaków, zawiera frazę główną, po polsku, bez clickbaitu.
  - metaDescription: 140–158 znaków, naturalna zachęta z CTA (np. "Umów konsultację w BMClinics"), zawiera frazę główną.
  - outline: 5–9 nagłówków sekcji artykułu jako TABLICA STRINGÓW; każdy element zaczyna się od "## " (H2) lub "### " (H3, podsekcja poprzedzającego H2). Uwzględnij sekcje: wprowadzenie/definicja, wskazania, przebieg zabiegu, efekty, przeciwwskazania, cena/konsultacja, FAQ.
- Zwróć TYLKO JSON zgodny ze schematem.`;

    const user = `Usługi kliniki:\n${CLINIC_SERVICES.map((s) => `- ${s}`).join("\n")}\n\nBaza Semrush: ${row.database}${row.append_location ? ` (+ ${row.append_location})` : ""}\nRaport: ${row.label ?? row.id}\n\nFrazy (top ${compact.length} po wolumenie):\n${JSON.stringify(compact, null, 2)}\n\nZbuduj 3–6 klastrów tematycznych. Każdy klaster: 1 pillar + 3–6 artykułów wspierających. Dla każdego artykułu wygeneruj metaTitle, metaDescription oraz outline (## / ###).`;

    const schema = {
      name: "content_clusters",
      description: "Klastry tematyczne artykułów blogowych.",
      parameters: {
        type: "object",
        properties: {
          clusters: {
            type: "array",
            items: {
              type: "object",
              properties: {
                cluster: { type: "string" },
                intent: { type: "string", enum: ["informacyjny", "komercyjny", "lokalny", "porównawczy"] },
                pillarTitle: { type: "string" },
                pillarSlug: { type: "string" },
                targetService: { type: "string" },
                supportingArticles: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      slug: { type: "string" },
                      primaryKeyword: { type: "string" },
                      supportingKeywords: { type: "array", items: { type: "string" } },
                      angle: { type: "string" },
                      estimatedVolume: { type: ["number", "null"] },
                      estimatedKd: { type: ["number", "null"] },
                    },
                    required: ["title", "slug", "primaryKeyword", "supportingKeywords", "angle"],
                  },
                },
                internalLinking: { type: "string" },
                cta: { type: "string" },
              },
              required: ["cluster", "intent", "pillarTitle", "pillarSlug", "targetService", "supportingArticles", "internalLinking", "cta"],
            },
          },
        },
        required: ["clusters"],
      },
    };

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        tools: [{ type: "function", function: schema }],
        tool_choice: { type: "function", function: { name: "content_clusters" } },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      if (res.status === 429) throw new Error("Limit AI wyczerpany — spróbuj za chwilę.");
      if (res.status === 402) throw new Error("Skończyły się credity AI w workspace.");
      throw new Error(`AI Gateway ${res.status}: ${body.slice(0, 200)}`);
    }

    const json = await res.json();
    const call = json.choices?.[0]?.message?.tool_calls?.[0];
    if (!call) throw new Error("AI nie zwróciło poprawnej odpowiedzi (brak tool_call).");
    const parsed = JSON.parse(call.function.arguments) as { clusters: ContentCluster[] };
    return { reportId: row.id, database: row.database, clusters: parsed.clusters ?? [] };
  });

const ClusterArticleSchema = z.object({
  title: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  primaryKeyword: z.string().trim().default(""),
  supportingKeywords: z.array(z.string().trim()).default([]),
  angle: z.string().trim().default(""),
  estimatedVolume: z.number().nullable().optional(),
  estimatedKd: z.number().nullable().optional(),
});

const ClusterSchema = z.object({
  cluster: z.string().trim().min(1),
  intent: z.string().trim().min(1),
  pillarTitle: z.string().trim().min(1),
  pillarSlug: z.string().trim().min(1),
  targetService: z.string().trim().default(""),
  supportingArticles: z.array(ClusterArticleSchema).default([]),
  internalLinking: z.string().trim().default(""),
  cta: z.string().trim().default(""),
});

export const saveClustersAsDrafts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    z.object({
      reportId: z.string().uuid().optional(),
      clusters: z.array(ClusterSchema).min(1).max(50),
    }),
  )
  .handler(async ({ data, context }) => {
    await requireAdminOrManager(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const now = new Date().toISOString();
    const rows: Array<{ user_id: string; draft_key: string; data: any }> = [];

    for (const c of data.clusters) {
      const clusterMeta = {
        cluster: c.cluster,
        intent: c.intent,
        targetService: c.targetService,
        internalLinking: c.internalLinking,
        cta: c.cta,
        reportId: data.reportId ?? null,
        savedAt: now,
      };

      rows.push({
        user_id: context.userId,
        draft_key: `article:${c.pillarSlug}`,
        data: {
          type: "pillar",
          status: "draft",
          title: c.pillarTitle,
          slug: c.pillarSlug,
          primaryKeyword: "",
          supportingKeywords: [],
          angle: "",
          estimatedVolume: null,
          estimatedKd: null,
          body: "",
          cluster: clusterMeta,
        },
      });

      for (const a of c.supportingArticles) {
        rows.push({
          user_id: context.userId,
          draft_key: `article:${a.slug}`,
          data: {
            type: "support",
            status: "draft",
            title: a.title,
            slug: a.slug,
            primaryKeyword: a.primaryKeyword,
            supportingKeywords: a.supportingKeywords,
            angle: a.angle,
            estimatedVolume: a.estimatedVolume ?? null,
            estimatedKd: a.estimatedKd ?? null,
            body: "",
            cluster: clusterMeta,
          },
        });
      }
    }

    const { error } = await supabaseAdmin
      .from("creator_drafts")
      .upsert(rows, { onConflict: "user_id,draft_key" });
    if (error) throw new Error(error.message);

    return { saved: rows.length, savedAt: now };
  });
