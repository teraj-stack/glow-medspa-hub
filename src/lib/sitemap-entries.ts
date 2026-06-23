import { TECHNOLOGIES } from "@/data/technologies";

export const SITEMAP_BASE_URL = "https://bmclinics.ai";

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
];

// Statyczne strony marketingowe / prawne / utility
export const STATIC_ENTRIES: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/potrzeby", changefreq: "monthly", priority: "0.8" },
  { path: "/rozwiazania", changefreq: "monthly", priority: "0.8" },
  { path: "/technologie", changefreq: "monthly", priority: "0.9" },
  { path: "/cennik", changefreq: "monthly", priority: "0.8" },
  { path: "/konsultacja", changefreq: "monthly", priority: "0.8" },
  { path: "/bezpieczenstwo-zabiegow-laserowych", changefreq: "monthly", priority: "0.8" },
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
