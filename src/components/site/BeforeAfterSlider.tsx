import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  caption?: string;
  label?: string;
};

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  caption,
  label,
}: Props) {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const setFromClientX = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    setPos((x / rect.width) * 100);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const move = (e: PointerEvent) => setFromClientX(e.clientX);
    const up = () => setDragging(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [dragging, setFromClientX]);

  return (
    <figure className="overflow-hidden rounded-lg border border-border bg-card shadow-soft">
      <div
        ref={ref}
        className="relative aspect-[4/3] w-full select-none overflow-hidden bg-ink touch-none"
        onPointerDown={(e) => {
          (e.target as Element).setPointerCapture?.(e.pointerId);
          setDragging(true);
          setFromClientX(e.clientX);
        }}
      >
        <img
          src={afterSrc}
          alt={afterAlt}
          loading="lazy"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <img
            src={beforeSrc}
            alt={beforeAlt}
            loading="lazy"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <div className="pointer-events-none absolute left-3 top-3 rounded bg-ink/70 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-background">
          Przed
        </div>
        <div className="pointer-events-none absolute right-3 top-3 rounded bg-champagne/90 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-ink">
          Po
        </div>

        <div
          className="pointer-events-none absolute inset-y-0"
          style={{ left: `calc(${pos}% - 1px)` }}
        >
          <div className="h-full w-0.5 bg-background/90 shadow-[0_0_0_1px_rgba(0,0,0,0.15)]" />
          <div className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background text-ink shadow-md ring-1 ring-ink/10">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18-6-6 6-6" />
              <path d="m15 6 6 6-6 6" />
            </svg>
          </div>
        </div>

        <input
          aria-label="Suwak porównania przed i po zabiegu"
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      {(caption || label) && (
        <figcaption className="border-t border-border bg-card px-5 py-4">
          {label && (
            <div className="text-[11px] uppercase tracking-[0.25em] text-champagne">{label}</div>
          )}
          {caption && <p className="mt-1 text-sm leading-relaxed text-foreground/75">{caption}</p>}
        </figcaption>
      )}
    </figure>
  );
}
