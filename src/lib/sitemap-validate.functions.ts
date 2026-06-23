import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { SITEMAP_BASE_URL, buildSitemapEntries } from "@/lib/sitemap-entries";

async function assertAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden");
}

export interface SitemapValidationResult {
  fetchedFrom: string;
  fetchedAt: string;
  fetchOk: boolean;
  fetchError?: string;
  expectedCount: number;
  liveCount: number;
  duplicates: string[];
  missing: { path: string; reason: string }[]; // jest oczekiwane, brak w live sitemap
  extras: string[]; // jest w live, ale nie ma w expected
  urlChecks: { path: string; status: number | null; ok: boolean; error?: string }[];
}

async function probe(url: string): Promise<{ status: number | null; ok: boolean; error?: string }> {
  try {
    // HEAD często bywa blokowany przez SSR fallback, więc używamy GET z ograniczonym body.
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: { "User-Agent": "BMC-Sitemap-Validator/1.0" },
    });
    // Zużyj body, aby nie ciągnąć całej strony do pamięci po nagłówkach.
    await res.body?.cancel();
    return { status: res.status, ok: res.ok };
  } catch (e) {
    return { status: null, ok: false, error: (e as Error).message };
  }
}

export const validateSitemap = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input?: { baseUrl?: string; checkUrls?: boolean }) => input ?? {})
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);

    const baseUrl = (data.baseUrl?.replace(/\/$/, "") || SITEMAP_BASE_URL).trim();
    const checkUrls = data.checkUrls ?? false;
    const sitemapUrl = `${baseUrl}/sitemap.xml`;

    const expected = buildSitemapEntries();
    const expectedPaths = new Set(expected.map((e) => e.path));

    const result: SitemapValidationResult = {
      fetchedFrom: sitemapUrl,
      fetchedAt: new Date().toISOString(),
      fetchOk: false,
      expectedCount: expected.length,
      liveCount: 0,
      duplicates: [],
      missing: [],
      extras: [],
      urlChecks: [],
    };

    let xml = "";
    try {
      const res = await fetch(sitemapUrl, {
        headers: { "User-Agent": "BMC-Sitemap-Validator/1.0" },
      });
      if (!res.ok) {
        result.fetchError = `HTTP ${res.status}`;
        return result;
      }
      xml = await res.text();
      result.fetchOk = true;
    } catch (e) {
      result.fetchError = (e as Error).message;
      return result;
    }

    const locRegex = /<loc>\s*([^<\s]+)\s*<\/loc>/g;
    const liveUrls: string[] = [];
    let m: RegExpExecArray | null;
    while ((m = locRegex.exec(xml)) !== null) liveUrls.push(m[1]);
    result.liveCount = liveUrls.length;

    // Mapa URL -> path (względem baseUrl)
    const livePaths: string[] = [];
    for (const u of liveUrls) {
      try {
        const url = new URL(u);
        livePaths.push(url.pathname);
      } catch {
        livePaths.push(u);
      }
    }

    // Duplikaty
    const counts = new Map<string, number>();
    for (const p of livePaths) counts.set(p, (counts.get(p) ?? 0) + 1);
    result.duplicates = [...counts.entries()].filter(([, c]) => c > 1).map(([p]) => p);

    const liveSet = new Set(livePaths);

    // Brakujące (oczekiwane, ale nieobecne w live)
    for (const e of expected) {
      if (!liveSet.has(e.path)) {
        result.missing.push({ path: e.path, reason: "Oczekiwana w sitemap, brak w live" });
      }
    }
    // Nadmiarowe (w live, ale nieoczekiwane)
    for (const p of liveSet) {
      if (!expectedPaths.has(p)) result.extras.push(p);
    }

    if (checkUrls) {
      const sampled = [...liveSet];
      const concurrency = 6;
      const checks: typeof result.urlChecks = [];
      let i = 0;
      async function worker() {
        while (i < sampled.length) {
          const idx = i++;
          const path = sampled[idx];
          const r = await probe(`${baseUrl}${path}`);
          checks.push({ path, ...r });
        }
      }
      await Promise.all(Array.from({ length: concurrency }, worker));
      checks.sort((a, b) => a.path.localeCompare(b.path));
      result.urlChecks = checks;
    }

    return result;
  });
