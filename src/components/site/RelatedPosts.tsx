import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getRelatedPosts } from "@/lib/blog-posts";
import { SectionHeading } from "@/components/site/SectionHeading";
import { cn } from "@/lib/utils";

type Props = {
  currentSlug: string;
  limit?: number;
  className?: string;
};

type ScrollState = {
  atStart: boolean;
  atEnd: boolean;
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
        <div id="related-posts-heading">
          <SectionHeading eyebrow="Polecane artykuły" title="Czytaj dalej" />
        </div>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
          Powiązane tematy z bloga kliniki — wybierz kolejny krok w swojej edukacji o
          bezpiecznych zabiegach laserowych i medycynie estetycznej.
        </p>

        <ul
          className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 -mx-4 [scrollbar-width:thin] md:mx-0 md:grid md:snap-none md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0"
          role="list"
        >
          {posts.map((post) => (
            <li
              key={post.slug}
              className="w-[85%] shrink-0 snap-start first:ml-0 last:mr-0 md:w-auto md:shrink md:snap-align-none"
            >
              <Link
                to={post.path}
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
                <div className="mt-5 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex min-w-0 items-center gap-3">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="size-3.5 shrink-0" />
                      <span className="truncate">{formatDate(post.publishedAt)}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="size-3.5 shrink-0" />
                      {post.readingTime}
                    </span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-champagne transition group-hover:translate-x-1" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground md:hidden">
          Przesuń, aby zobaczyć więcej →
        </p>
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
