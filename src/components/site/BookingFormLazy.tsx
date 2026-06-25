import { lazy, Suspense, useEffect, useRef, useState } from "react";

const BookingFormImpl = lazy(() =>
  import("./BookingForm").then((m) => ({ default: m.BookingForm })),
);

/**
 * Below-the-fold lazy wrapper for BookingForm.
 * Defers loading the form chunk until it scrolls near the viewport,
 * reducing initial JS on /technologie/* pages and improving LCP.
 */
export function BookingFormLazy(props: { defaultTechnology?: string }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (visible || !ref.current) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [visible]);

  return (
    <div ref={ref} className="min-h-[420px]">
      {visible ? (
        <Suspense fallback={<div className="h-[420px] animate-pulse rounded-lg bg-secondary/40" />}>
          <BookingFormImpl {...props} />
        </Suspense>
      ) : (
        <div className="h-[420px] rounded-lg bg-secondary/40" aria-hidden="true" />
      )}
    </div>
  );
}
