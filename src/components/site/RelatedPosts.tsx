import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { getRelatedPosts } from "@/lib/blog-posts";
import { SectionHeading } from "@/components/site/SectionHeading";

type Props = {
  currentSlug: string;
  limit?: number;
  className?: string;
};

export function RelatedPosts({ currentSlug, limit = 3, className }: Props) {
  const posts = getRelatedPosts(currentSlug, limit);
  if (posts.length === 0) return null;

  return (
    <section
      aria-labelledby="related-posts-heading"
      className={`border-t border-border bg-secondary/30 py-16 md:py-24 ${className ?? ""}`}
    >
      <div className="container-luxury">
        <SectionHeading
          eyebrow="Polecane artykuły"
          title="Czytaj dalej"
          id="related-posts-heading"
        />
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
          Powiązane tematy z bloga kliniki — wybierz kolejny krok w swojej edukacji o
          bezpiecznych zabiegach laserowych i medycynie estetycznej.
        </p>

        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="group flex h-full flex-col rounded-lg border border-border bg-card p-6 transition hover:border-champagne hover:shadow-lg"
              >
                <div className="text-xs uppercase tracking-[0.3em] text-champagne">
                  {post.category}
                </div>
                <h3 className="mt-3 font-serif text-lg text-ink leading-snug group-hover:text-champagne">
                  {post.title}
                </h3>
                <p className="mt-3 flex-1 text-sm text-foreground/80 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="size-3.5" />
                      {formatDate(post.publishedAt)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="size-3.5" />
                      {post.readingTime}
                    </span>
                  </span>
                  <ArrowRight className="size-4 text-champagne transition group-hover:translate-x-1" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("pl-PL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
