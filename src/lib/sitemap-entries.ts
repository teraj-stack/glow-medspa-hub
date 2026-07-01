import { TECHNOLOGIES } from "@/data/technologies";

export const SITEMAP_BASE_URL = "https://bmclinics.ai";

// Hostnames allowed as `baseUrl` for sitemap validation (prevents SSRF —
// no internal metadata endpoints, no arbitrary outbound fetches).
export const SITEMAP_ALLOWED_HOSTS = new Set<string>([
  "bmclinics.ai",
  "www.bmclinics.ai",
  "bmclinics.dev",
  "www.bmclinics.dev",
  "bmclinics.org",
  "www.bmclinics.org",
  "glow-medspa-hub.lovable.app",
]);

/**
 * Returns a normalized base URL when the host is on the allowlist, otherwise null.
 * Only http(s) is allowed; no userinfo, no IP literals.
 */
export function assertAllowedBaseUrl(raw: string): string | null {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") return null;
  if (u.username || u.password) return null;
  if (!SITEMAP_ALLOWED_HOSTS.has(u.hostname.toLowerCase())) return null;
  return `${u.protocol}//${u.host}`;
}

export interface SitemapEntry {
  path: string;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: string;
}

// Wpisy blogowe — utrzymuj listę w synchronizacji z plikami src/routes/blog.*.tsx
export const BLOG_POSTS: { slug: string; priority?: string }[] = [
  { slug: "powiklania-mezoterapia-iglowa", priority: "0.7" },
  { slug: "blizny-potradzikowe", priority: "0.7" },
  { slug: "laser-frakcyjny-rekonwalescencja", priority: "0.8" },
  { slug: "slonce-skora-nowoczesne-technologie", priority: "0.8" },
  { slug: "starzenie-skory-ptoza-tkanek", priority: "0.9" },
  { slug: "mechanizmy-starzenia-skory", priority: "0.7" },
  { slug: "ptoza-tkanek-twarzy", priority: "0.7" },
  { slug: "lifting-bez-skalpela", priority: "0.8" },
  { slug: "jak-przygotowac-skore-do-diagnostyki", priority: "0.75" },
  { slug: "analiza-skory-twarzy-krok-po-kroku", priority: "0.8" },
  { slug: "najczestsze-wyniki-analizy-skory", priority: "0.8" },
  { slug: "co-dalej-po-badaniu-skory", priority: "0.75" },
  { slug: "diagnostyka-skory-a-plan-leczenia", priority: "0.8" },
  { slug: "jak-czesto-powtarzac-analize-skory", priority: "0.7" },
];

// Statyczne strony marketingowe / prawne / utility
export const STATIC_ENTRIES: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/renasculpt", changefreq: "monthly", priority: "0.85" },
  { path: "/potrzeby", changefreq: "monthly", priority: "0.8" },
  { path: "/rozwiazania", changefreq: "monthly", priority: "0.8" },
  { path: "/technologie", changefreq: "monthly", priority: "0.9" },
  { path: "/cennik", changefreq: "monthly", priority: "0.8" },
  { path: "/lekarze", changefreq: "monthly", priority: "0.8" },
  { path: "/lekarze/halina-gabara", changefreq: "monthly", priority: "0.8" },
  { path: "/lekarze/jan-bujok", changefreq: "monthly", priority: "0.8" },
  { path: "/konsultacja", changefreq: "monthly", priority: "0.8" },
  { path: "/bezpieczenstwo-zabiegow-laserowych", changefreq: "monthly", priority: "0.8" },
  { path: "/diagnostyka-skory-warszawa", changefreq: "monthly", priority: "0.85" },
  { path: "/wskazania", changefreq: "monthly", priority: "0.85" },
  { path: "/wskazania/przebarwienia-warszawa", changefreq: "monthly", priority: "0.85" },
  { path: "/technologie/laser-frakcyjny-co2-warszawa", changefreq: "monthly", priority: "0.9" },
  { path: "/konsultacja-dziekujemy", changefreq: "yearly", priority: "0.3" },
  { path: "/auth", changefreq: "yearly", priority: "0.3" },
  { path: "/unsubscribe", changefreq: "yearly", priority: "0.3" },
  { path: "/email/unsubscribe", changefreq: "yearly", priority: "0.3" },
  { path: "/polityka-prywatnosci", changefreq: "yearly", priority: "0.3" },
  { path: "/regulamin", changefreq: "yearly", priority: "0.3" },
];

// Pełna lista oczekiwanych wpisów — pojedyncze źródło prawdy.
export function buildSitemapEntries(): SitemapEntry[] {
  const technologyEntries: SitemapEntry[] = TECHNOLOGIES.map((t) => ({
    path: `/technologie/${t.slug}`,
    changefreq: "monthly",
    priority: "0.85",
  }));

  const blogEntries: SitemapEntry[] = BLOG_POSTS.map((p) => ({
    path: `/blog/${p.slug}`,
    changefreq: "monthly",
    priority: p.priority ?? "0.7",
  }));

  // Dedup po path (na wypadek duplikatu w STATIC_ENTRIES)
  const seen = new Set<string>();
  const all = [...STATIC_ENTRIES, ...technologyEntries, ...blogEntries].filter((e) => {
    if (seen.has(e.path)) return false;
    seen.add(e.path);
    return true;
  });

  return all;
}
