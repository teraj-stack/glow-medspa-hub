import { CSSProperties } from "react";
import watermarkUrl from "@/assets/bujok-watermark.webp";
import { cfImage } from "@/lib/cf-image";

type Size = "sm" | "md" | "lg";

const SIZE_CLASS: Record<Size, string> = {
  sm: "w-10 sm:w-12 md:w-14",
  md: "w-14 sm:w-16 md:w-20",
  lg: "w-20 sm:w-24 md:w-28",
};

type WatermarkProps = {
  size?: Size;
  /** Subtle drop-shadow for legibility on busy backgrounds */
  withShadow?: boolean;
  /** Override opacity (default 0.85) */
  opacity?: number;
  className?: string;
};

/**
 * Brand watermark overlay — absolutely positioned in the top-right corner
 * of the nearest `relative` parent. Use inside a wrapper that already
 * positions media (image / video / animation).
 *
 * Image content is decorative for screen readers (the visible brand label
 * lives in the header), so `alt=""` and `aria-hidden`.
 */
export function Watermark({
  size = "md",
  withShadow = true,
  opacity = 0.85,
  className = "",
}: WatermarkProps) {
  const style: CSSProperties = {
    opacity,
    filter: withShadow ? "drop-shadow(0 1px 4px rgba(0,0,0,0.45))" : undefined,
  };
  return (
    <img
      src={watermarkUrl}
      alt=""
      aria-hidden="true"
      draggable={false}
      loading="lazy"
      decoding="async"
      style={style}
      className={`pointer-events-none absolute right-2 top-2 z-10 select-none sm:right-3 sm:top-3 md:right-4 md:top-4 ${SIZE_CLASS[size]} ${className}`}
    />
  );
}

type MediaFrameProps = {
  children: React.ReactNode;
  size?: Size;
  className?: string;
  /** Pass-through wrapper className. Default has rounded + overflow hidden. */
};

/**
 * Convenience wrapper: relative positioning + watermark in top-right.
 * Use when the media element doesn't already have its own positioned parent.
 */
export function WatermarkedMedia({ children, size = "md", className = "" }: MediaFrameProps) {
  return (
    <div className={`relative ${className}`}>
      {children}
      <Watermark size={size} />
    </div>
  );
}
