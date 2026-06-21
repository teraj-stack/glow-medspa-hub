import type { SVGProps } from "react";

/**
 * Minimalist face contour icon — single-line sketch of a profile
 * (forehead, closed eye, lips, jawline, ear, neck, shoulder).
 * Optimized vector replacement for a raster sketch.
 */
export default function FaceContourIcon({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Forehead + top of head */}
      <path d="M28 18 Q42 8 56 14 Q63 17 64 24" />
      {/* Closed eye */}
      <path d="M38 26 Q44 29 50 26" />
      {/* Nose / cheek line */}
      <path d="M34 40 Q33 46 36 50" />
      {/* Upper lip */}
      <path d="M30 54 Q36 50 42 54 Q46 56 50 54" />
      {/* Lower lip / mouth shadow */}
      <path d="M32 58 Q40 62 48 58" />
      {/* Jawline to chin */}
      <path d="M26 60 Q28 72 42 76 Q56 78 64 70" />
      {/* Ear */}
      <path d="M64 30 Q70 32 70 40 Q70 48 64 50" />
      {/* Neck */}
      <path d="M66 50 Q68 70 60 88" />
      {/* Shoulder */}
      <path d="M60 84 Q72 86 88 92" />
    </svg>
  );
}
