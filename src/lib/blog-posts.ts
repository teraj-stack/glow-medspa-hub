// Pojedyncze źródło prawdy dla wpisów blogowych — używane przez
// komponent RelatedPosts oraz potencjalnie inne miejsca (np. spis treści).
// Trzymaj w synchronizacji z plikami src/routes/blog.*.tsx oraz BLOG_POSTS
// w src/lib/sitemap-entries.ts.

export type BlogPostPath =
  | "/blog/slonce-skora-nowoczesne-technologie"
  | "/blog/laser-frakcyjny-rekonwalescencja"
  | "/blog/blizny-potradzikowe"
  | "/blog/powiklania-mezoterapia-iglowa"
  | "/blog/starzenie-skory-ptoza-tkanek"
  | "/blog/mechanizmy-starzenia-skory"
  | "/blog/ptoza-tkanek-twarzy"
  | "/blog/lifting-bez-skalpela";

export type BlogPostMeta = {
  slug: string;
  path: BlogPostPath;
  title: string;
  excerpt: string;
  category: string;
  readingTime: string;
  publishedAt: string; // ISO
};

export const BLOG_POSTS_META: BlogPostMeta[] = [
  {
    slug: "starzenie-skory-ptoza-tkanek",
    path: "/blog/starzenie-skory-ptoza-tkanek",
    title: "Jak starzeje się skóra i dlaczego dochodzi do ptozy tkanek",
    excerpt:
      "Anatomia ptozy, mechanizmy starzenia i sekwencja zabiegów, która działa — kompletny przewodnik dla pacjentki po 35.",
    category: "Przewodnik filarowy",
    readingTime: "12 min",
    publishedAt: "2026-06-27",
  },
  {
    slug: "mechanizmy-starzenia-skory",
    path: "/blog/mechanizmy-starzenia-skory",
    title: "Mechanizmy starzenia skóry — co dzieje się pod powierzchnią",
    excerpt:
      "Kolagen, elastyna, glikacja, stres oksydacyjny — biologia, którą można spowolnić, jeśli wiemy, na co patrzymy.",
    category: "Seria: starzenie 1/3",
    readingTime: "7 min",
    publishedAt: "2026-06-27",
  },
  {
    slug: "ptoza-tkanek-twarzy",
    path: "/blog/ptoza-tkanek-twarzy",
    title: "Ptoza tkanek twarzy — anatomia opadania",
    excerpt:
      "Trzy piętra, które opadają z wiekiem: kość, tkanka tłuszczowa, więzadła i SMAS — i co z tego wynika dla planowania zabiegów.",
    category: "Seria: starzenie 2/3",
    readingTime: "8 min",
    publishedAt: "2026-06-27",
  },
  {
    slug: "lifting-bez-skalpela",
    path: "/blog/lifting-bez-skalpela",
    title: "Lifting bez skalpela — co realnie odwraca ptozę",
    excerpt:
      "HIFU, radiofrekwencja mikroigłowa, stymulatory tkankowe, wolumetria — sekwencja dobierana do stopnia ptozy.",
    category: "Seria: starzenie 3/3",
    readingTime: "9 min",
    publishedAt: "2026-06-27",
  },
  {
    slug: "slonce-skora-nowoczesne-technologie",
    path: "/blog/slonce-skora-nowoczesne-technologie",
    title: "Słońce, skóra i nowoczesne technologie — czy każdy laser „boi się” lata?",
    excerpt:
      "Dlaczego część laserów odkładamy na chłodniejsze miesiące, a inne bezpiecznie pracują również latem.",
    category: "Edukacja pacjenta",
    readingTime: "6 min",
    publishedAt: "2026-06-23",
  },
  {
    slug: "laser-frakcyjny-rekonwalescencja",
    path: "/blog/laser-frakcyjny-rekonwalescencja",
    title: "Laser frakcyjny — dzień po dniu rekonwalescencji",
    excerpt:
      "Trzy lasery frakcyjne, trzy różne mechanizmy gojenia. Czego realnie spodziewać się dzień po dniu.",
    category: "Po zabiegu",
    readingTime: "8 min",
    publishedAt: "2026-05-12",
  },
  {
    slug: "blizny-potradzikowe",
    path: "/blog/blizny-potradzikowe",
    title: "Blizny potrądzikowe — kompletny przewodnik",
    excerpt:
      "Rodzaje blizn, łączone protokoły laserowo-radiofrekwencyjne i realne efekty z badań klinicznych.",
    category: "Wskazania",
    readingTime: "10 min",
    publishedAt: "2026-04-08",
  },
  {
    slug: "powiklania-mezoterapia-iglowa",
    path: "/blog/powiklania-mezoterapia-iglowa",
    title: "Powikłania po mezoterapii igłowej — jak ich unikać",
    excerpt:
      "Co jest normalną reakcją, a co sygnałem alarmowym. Przeciwwskazania i praktyczna prewencja.",
    category: "Bezpieczeństwo",
    readingTime: "7 min",
    publishedAt: "2026-02-20",
  },
];

export function getRelatedPosts(currentSlug: string, limit = 3): BlogPostMeta[] {
  return BLOG_POSTS_META.filter((p) => p.slug !== currentSlug).slice(0, limit);
}
